package com.yourname.yourfirstname.mapper;

import com.yourname.yourfirstname.dto.CreditDTO;
import com.yourname.yourfirstname.entity.Credit;
import com.yourname.yourfirstname.entity.CreditPersonnel;
import com.yourname.yourfirstname.entity.CreditImmobilier;
import com.yourname.yourfirstname.entity.CreditProfessionnel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CreditMapper {
    CreditMapper INSTANCE = Mappers.getMapper(CreditMapper.class);
    
    @Mapping(source = "client.id", target = "clientId")
    @Mapping(target = "typeCredit", expression = "java(getTypeCredit(credit))")
    CreditDTO creditToCreditDTO(Credit credit);
    
    List<CreditDTO> creditsToCreditDTOs(List<Credit> credits);
    
    // Factory method to create the appropriate Credit subclass based on typeCredit
    default Credit creditDTOToCredit(CreditDTO creditDTO) {
        if (creditDTO == null) {
            return null;
        }
        
        String typeCredit = creditDTO.getTypeCredit();
        if (typeCredit == null) {
            throw new IllegalArgumentException("Type de crédit ne peut pas être null");
        }
        
        Credit credit;
        switch (typeCredit) {
            case "PERSONNEL":
                credit = new CreditPersonnel();
                break;
            case "IMMOBILIER":
                credit = new CreditImmobilier();
                break;
            case "PROFESSIONNEL":
                credit = new CreditProfessionnel();
                break;
            default:
                throw new IllegalArgumentException("Type de crédit non supporté: " + typeCredit);
        }
        
        // Map common fields
        credit.setId(creditDTO.getId());
        credit.setDateDemande(creditDTO.getDateDemande());
        credit.setStatut(creditDTO.getStatut());
        credit.setDateAcceptation(creditDTO.getDateAcceptation());
        credit.setMontant(creditDTO.getMontant());
        credit.setDureeRemboursement(creditDTO.getDureeRemboursement());
        credit.setTauxInteret(creditDTO.getTauxInteret());
        
        return credit;
    }
    
    // Helper method to determine the credit type
    default String getTypeCredit(Credit credit) {
        if (credit instanceof CreditPersonnel) {
            return "PERSONNEL";
        } else if (credit instanceof CreditImmobilier) {
            return "IMMOBILIER";
        } else if (credit instanceof CreditProfessionnel) {
            return "PROFESSIONNEL";
        }
        return null;
    }
}
