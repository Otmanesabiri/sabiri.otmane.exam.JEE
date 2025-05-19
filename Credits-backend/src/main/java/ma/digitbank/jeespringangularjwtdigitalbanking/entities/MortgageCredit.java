package ma.digitbank.jeespringangularjwtdigitalbanking.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.PropertyType;

@Entity
@DiscriminatorValue("MORTGAGE")
@Data @NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MortgageCredit extends Credit {
    @Enumerated(EnumType.STRING)
    private PropertyType propertyType; // Apartment, House, Commercial
}
