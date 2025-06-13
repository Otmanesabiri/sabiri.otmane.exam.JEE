package com.yourname.yourfirstname.repository;

import com.yourname.yourfirstname.entity.Credit;
import com.yourname.yourfirstname.entity.StatutCredit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CreditRepository extends JpaRepository<Credit, Long> {
    List<Credit> findByClientId(Long clientId);
    List<Credit> findByStatut(StatutCredit statut);
    
    @Query("SELECT c FROM Credit c WHERE c.client.id = ?1 AND c.statut = ?2")
    List<Credit> findByClientIdAndStatut(Long clientId, StatutCredit statut);
}
