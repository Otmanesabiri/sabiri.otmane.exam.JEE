package ma.digitbank.jeespringangularjwtdigitalbanking.repositories;

import ma.digitbank.jeespringangularjwtdigitalbanking.entities.Repayment;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.RepaymentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepaymentRepository extends JpaRepository<Repayment, Long> {
    List<Repayment> findByCreditId(Long creditId);
    List<Repayment> findByCreditIdAndType(Long creditId, RepaymentType type);
    Page<Repayment> findByCreditIdOrderByRepaymentDateDesc(Long creditId, Pageable pageable);
}
