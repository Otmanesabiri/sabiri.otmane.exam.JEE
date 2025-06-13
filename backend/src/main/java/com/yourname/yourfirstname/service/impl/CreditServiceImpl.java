package com.yourname.yourfirstname.service.impl;

import com.yourname.yourfirstname.dto.CreditDTO;
import com.yourname.yourfirstname.dto.CreditPersonnelDTO;
import com.yourname.yourfirstname.entity.*;
import com.yourname.yourfirstname.mapper.CreditMapper;
import com.yourname.yourfirstname.repository.ClientRepository;
import com.yourname.yourfirstname.repository.CreditRepository;
import com.yourname.yourfirstname.service.CreditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CreditServiceImpl implements CreditService {
    
    @Autowired
    private CreditRepository creditRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private CreditMapper creditMapper;
    
    @Override
    public CreditDTO saveCredit(CreditDTO creditDTO) {
        Client client = clientRepository.findById(creditDTO.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        Credit credit = creditMapper.creditDTOToCredit(creditDTO);
        credit.setClient(client);
        credit.setStatut(StatutCredit.EN_COURS);
        credit.setDateDemande(LocalDate.now());
        
        Credit savedCredit = creditRepository.save(credit);
        return creditMapper.creditToCreditDTO(savedCredit);
    }
    
    @Override
    public CreditPersonnelDTO saveCreditPersonnel(CreditPersonnelDTO creditPersonnelDTO) {
        Client client = clientRepository.findById(creditPersonnelDTO.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        CreditPersonnel credit = new CreditPersonnel();
        credit.setClient(client);
        credit.setMontant(creditPersonnelDTO.getMontant());
        credit.setDureeRemboursement(creditPersonnelDTO.getDureeRemboursement());
        credit.setTauxInteret(creditPersonnelDTO.getTauxInteret());
        credit.setMotif(creditPersonnelDTO.getMotif());
        credit.setStatut(StatutCredit.EN_COURS);
        credit.setDateDemande(LocalDate.now());
        
        CreditPersonnel savedCredit = (CreditPersonnel) creditRepository.save(credit);
        
        CreditPersonnelDTO result = new CreditPersonnelDTO();
        result.setId(savedCredit.getId());
        result.setDateDemande(savedCredit.getDateDemande());
        result.setStatut(savedCredit.getStatut());
        result.setMontant(savedCredit.getMontant());
        result.setDureeRemboursement(savedCredit.getDureeRemboursement());
        result.setTauxInteret(savedCredit.getTauxInteret());
        result.setClientId(savedCredit.getClient().getId());
        result.setMotif(savedCredit.getMotif());
        
        return result;
    }
    
    @Override
    public Optional<CreditDTO> getCreditById(Long id) {
        return creditRepository.findById(id)
                .map(creditMapper::creditToCreditDTO);
    }
    
    @Override
    public List<CreditDTO> getAllCredits() {
        List<Credit> credits = creditRepository.findAll();
        return creditMapper.creditsToCreditDTOs(credits);
    }
    
    @Override
    public List<CreditDTO> getCreditsByClientId(Long clientId) {
        List<Credit> credits = creditRepository.findByClientId(clientId);
        return creditMapper.creditsToCreditDTOs(credits);
    }
    
    @Override
    public List<CreditDTO> getCreditsByStatut(StatutCredit statut) {
        List<Credit> credits = creditRepository.findByStatut(statut);
        return creditMapper.creditsToCreditDTOs(credits);
    }
    
    @Override
    public CreditDTO updateCreditStatut(Long id, StatutCredit statut) {
        Credit credit = creditRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Credit not found"));
        
        credit.setStatut(statut);
        if (statut == StatutCredit.ACCEPTE) {
            credit.setDateAcceptation(LocalDate.now());
        }
        
        Credit updatedCredit = creditRepository.save(credit);
        return creditMapper.creditToCreditDTO(updatedCredit);
    }
    
    @Override
    public void deleteCredit(Long id) {
        if (!creditRepository.existsById(id)) {
            throw new RuntimeException("Credit not found with id: " + id);
        }
        creditRepository.deleteById(id);
    }
    
    @Override
    public CreditDTO accepterCredit(Long id) {
        return updateCreditStatut(id, StatutCredit.ACCEPTE);
    }
    
    @Override
    public CreditDTO rejeterCredit(Long id) {
        return updateCreditStatut(id, StatutCredit.REJETE);
    }
}
