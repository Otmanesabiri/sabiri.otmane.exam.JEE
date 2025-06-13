package com.yourname.yourfirstname.service;

import com.yourname.yourfirstname.dto.RemboursementDTO;
import java.util.List;
import java.util.Optional;

public interface RemboursementService {
    RemboursementDTO saveRemboursement(RemboursementDTO remboursementDTO);
    Optional<RemboursementDTO> getRemboursementById(Long id);
    List<RemboursementDTO> getAllRemboursements();
    List<RemboursementDTO> getRemboursementsByCreditId(Long creditId);
    RemboursementDTO updateRemboursement(Long id, RemboursementDTO remboursementDTO);
    void deleteRemboursement(Long id);
}
