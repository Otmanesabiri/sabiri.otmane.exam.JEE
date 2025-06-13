package com.yourname.yourfirstname.service;

import com.yourname.yourfirstname.dto.CreditDTO;
import com.yourname.yourfirstname.dto.CreditPersonnelDTO;
import com.yourname.yourfirstname.entity.StatutCredit;
import java.util.List;
import java.util.Optional;

public interface CreditService {
    CreditDTO saveCredit(CreditDTO creditDTO);
    CreditPersonnelDTO saveCreditPersonnel(CreditPersonnelDTO creditPersonnelDTO);
    Optional<CreditDTO> getCreditById(Long id);
    List<CreditDTO> getAllCredits();
    List<CreditDTO> getCreditsByClientId(Long clientId);
    List<CreditDTO> getCreditsByStatut(StatutCredit statut);
    CreditDTO updateCreditStatut(Long id, StatutCredit statut);
    void deleteCredit(Long id);
    CreditDTO accepterCredit(Long id);
    CreditDTO rejeterCredit(Long id);
}
