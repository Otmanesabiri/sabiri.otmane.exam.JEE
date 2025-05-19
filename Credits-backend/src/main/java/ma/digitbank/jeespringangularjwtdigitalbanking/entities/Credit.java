package ma.digitbank.jeespringangularjwtdigitalbanking.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.CreditStatus;

import java.util.Date;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "CREDIT_TYPE", length = 20)
@Data @NoArgsConstructor @AllArgsConstructor
public abstract class Credit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date requestDate;
    
    @Enumerated(EnumType.STRING)
    private CreditStatus status;
    
    private Date acceptanceDate;
    private double amount;
    private int duration; // in months
    private double interestRate;
    
    @ManyToOne
    private Customer customer;
    
    @OneToMany(mappedBy = "credit", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Repayment> repayments;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "last_modified_by")
    private String lastModifiedBy;
}
