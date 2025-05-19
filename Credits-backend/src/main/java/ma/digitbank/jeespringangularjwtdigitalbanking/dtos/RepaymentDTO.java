package ma.digitbank.jeespringangularjwtdigitalbanking.dtos;

import lombok.Data;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.RepaymentType;

import java.util.Date;

@Data
public class RepaymentDTO {
    private Long id;
    private Date repaymentDate;
    private double amount;
    private RepaymentType type;
    private Long creditId;
    private String creditType;
}
