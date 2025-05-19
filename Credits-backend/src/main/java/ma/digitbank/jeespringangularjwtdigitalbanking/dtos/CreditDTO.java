package ma.digitbank.jeespringangularjwtdigitalbanking.dtos;

import lombok.Data;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.CreditStatus;

import java.util.Date;

@Data
public abstract class CreditDTO {
    private Long id;
    private Date requestDate;
    private CreditStatus status;
    private Date acceptanceDate;
    private double amount;
    private int duration; // in months
    private double interestRate;
    private CustomerDTO customerDTO;
    private String type;
}
