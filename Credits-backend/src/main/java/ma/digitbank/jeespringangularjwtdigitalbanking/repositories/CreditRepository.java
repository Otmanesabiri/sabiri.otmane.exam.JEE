package ma.digitbank.jeespringangularjwtdigitalbanking.repositories;

import ma.digitbank.jeespringangularjwtdigitalbanking.entities.Credit;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.CreditStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CreditRepository extends JpaRepository<Credit, Long> {
    List<Credit> findByCustomerId(Long customerId);
    List<Credit> findByStatus(CreditStatus status);
    List<Credit> findByCustomerIdAndStatus(Long customerId, CreditStatus status);
}
