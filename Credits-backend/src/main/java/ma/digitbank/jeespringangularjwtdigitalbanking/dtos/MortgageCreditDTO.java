package ma.digitbank.jeespringangularjwtdigitalbanking.dtos;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.PropertyType;

@Data
@EqualsAndHashCode(callSuper = true)
public class MortgageCreditDTO extends CreditDTO {
    private PropertyType propertyType;
}
