package ma.digitbank.jeespringangularjwtdigitalbanking.repositories;

import ma.digitbank.jeespringangularjwtdigitalbanking.entities.ProfessionalCredit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfessionalCreditRepository extends JpaRepository<ProfessionalCredit, Long> {
    List<ProfessionalCredit> findByCustomerId(Long customerId);
    List<ProfessionalCredit> findByCompanyNameContains(String companyName);
}
