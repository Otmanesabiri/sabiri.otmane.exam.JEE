package ma.digitbank.jeespringangularjwtdigitalbanking.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.RepaymentType;

import java.util.Date;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Repayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date repaymentDate;
    private double amount;
    
    @Enumerated(EnumType.STRING)
    private RepaymentType type;
    
    @ManyToOne
    private Credit credit;
    
    @Column(name = "created_by")
    private String createdBy;
}
