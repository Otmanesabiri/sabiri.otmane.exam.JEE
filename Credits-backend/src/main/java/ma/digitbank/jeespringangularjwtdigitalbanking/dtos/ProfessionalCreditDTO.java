package ma.digitbank.jeespringangularjwtdigitalbanking.dtos;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ProfessionalCreditDTO extends CreditDTO {
    private String reason;
    private String companyName;
}
