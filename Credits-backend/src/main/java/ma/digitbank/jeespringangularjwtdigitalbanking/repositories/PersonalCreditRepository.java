package ma.digitbank.jeespringangularjwtdigitalbanking.repositories;

import ma.digitbank.jeespringangularjwtdigitalbanking.entities.PersonalCredit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PersonalCreditRepository extends JpaRepository<PersonalCredit, Long> {
    List<PersonalCredit> findByCustomerId(Long customerId);
    List<PersonalCredit> findByReason(String reason);
}
