package com.yourname.yourfirstname.repository;

import com.yourname.yourfirstname.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);
    
    @Query("SELECT c FROM Client c WHERE c.nom LIKE %?1%")
    List<Client> findByNomContaining(String nom);
}
