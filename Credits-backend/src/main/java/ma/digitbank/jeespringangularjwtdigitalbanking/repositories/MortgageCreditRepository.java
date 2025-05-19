package ma.digitbank.jeespringangularjwtdigitalbanking.repositories;

import ma.digitbank.jeespringangularjwtdigitalbanking.entities.MortgageCredit;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.PropertyType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MortgageCreditRepository extends JpaRepository<MortgageCredit, Long> {
    List<MortgageCredit> findByCustomerId(Long customerId);
    List<MortgageCredit> findByPropertyType(PropertyType propertyType);
}
