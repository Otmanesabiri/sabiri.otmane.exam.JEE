package com.yourname.yourfirstname.service.impl;

import com.yourname.yourfirstname.dto.RemboursementDTO;
import com.yourname.yourfirstname.entity.Credit;
import com.yourname.yourfirstname.entity.Remboursement;
import com.yourname.yourfirstname.mapper.RemboursementMapper;
import com.yourname.yourfirstname.repository.CreditRepository;
import com.yourname.yourfirstname.repository.RemboursementRepository;
import com.yourname.yourfirstname.service.RemboursementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RemboursementServiceImpl implements RemboursementService {

    @Autowired
    private RemboursementRepository remboursementRepository;

    @Autowired
    private CreditRepository creditRepository;

    @Autowired
    private RemboursementMapper remboursementMapper;

    @Override
    public RemboursementDTO saveRemboursement(RemboursementDTO remboursementDTO) {
        Credit credit = creditRepository.findById(remboursementDTO.getCreditId())
                .orElseThrow(() -> new RuntimeException("Credit not found"));

        Remboursement remboursement = remboursementMapper.remboursementDTOToRemboursement(remboursementDTO);
        remboursement.setCredit(credit);

        Remboursement savedRemboursement = remboursementRepository.save(remboursement);
        return remboursementMapper.remboursementToRemboursementDTO(savedRemboursement);
    }

    @Override
    public Optional<RemboursementDTO> getRemboursementById(Long id) {
        return remboursementRepository.findById(id)
                .map(remboursementMapper::remboursementToRemboursementDTO);
    }

    @Override
    public List<RemboursementDTO> getAllRemboursements() {
        List<Remboursement> remboursements = remboursementRepository.findAll();
        return remboursementMapper.remboursementsToRemboursementDTOs(remboursements);
    }

    @Override
    public List<RemboursementDTO> getRemboursementsByCreditId(Long creditId) {
        List<Remboursement> remboursements = remboursementRepository.findByCreditId(creditId);
        return remboursementMapper.remboursementsToRemboursementDTOs(remboursements);
    }

    @Override
    public RemboursementDTO updateRemboursement(Long id, RemboursementDTO remboursementDTO) {
        if (!remboursementRepository.existsById(id)) {
            throw new RuntimeException("Remboursement not found with id: " + id);
        }
        
        Credit credit = creditRepository.findById(remboursementDTO.getCreditId())
                .orElseThrow(() -> new RuntimeException("Credit not found"));

        remboursementDTO.setId(id);
        Remboursement remboursement = remboursementMapper.remboursementDTOToRemboursement(remboursementDTO);
        remboursement.setCredit(credit);
        
        Remboursement updatedRemboursement = remboursementRepository.save(remboursement);
        return remboursementMapper.remboursementToRemboursementDTO(updatedRemboursement);
    }

    @Override
    public void deleteRemboursement(Long id) {
        if (!remboursementRepository.existsById(id)) {
            throw new RuntimeException("Remboursement not found with id: " + id);
        }
        remboursementRepository.deleteById(id);
    }
}
