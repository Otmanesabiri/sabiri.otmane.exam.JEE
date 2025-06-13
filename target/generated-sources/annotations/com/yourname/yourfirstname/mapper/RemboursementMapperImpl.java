package com.yourname.yourfirstname.mapper;

import com.yourname.yourfirstname.dto.RemboursementDTO;
import com.yourname.yourfirstname.entity.Credit;
import com.yourname.yourfirstname.entity.Remboursement;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-13T11:24:57+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class RemboursementMapperImpl implements RemboursementMapper {

    @Override
    public RemboursementDTO remboursementToRemboursementDTO(Remboursement remboursement) {
        if ( remboursement == null ) {
            return null;
        }

        RemboursementDTO remboursementDTO = new RemboursementDTO();

        remboursementDTO.setCreditId( remboursementCreditId( remboursement ) );
        remboursementDTO.setId( remboursement.getId() );
        remboursementDTO.setDate( remboursement.getDate() );
        remboursementDTO.setMontant( remboursement.getMontant() );
        remboursementDTO.setType( remboursement.getType() );

        return remboursementDTO;
    }

    @Override
    public Remboursement remboursementDTOToRemboursement(RemboursementDTO remboursementDTO) {
        if ( remboursementDTO == null ) {
            return null;
        }

        Remboursement remboursement = new Remboursement();

        remboursement.setId( remboursementDTO.getId() );
        remboursement.setDate( remboursementDTO.getDate() );
        remboursement.setMontant( remboursementDTO.getMontant() );
        remboursement.setType( remboursementDTO.getType() );

        return remboursement;
    }

    @Override
    public List<RemboursementDTO> remboursementsToRemboursementDTOs(List<Remboursement> remboursements) {
        if ( remboursements == null ) {
            return null;
        }

        List<RemboursementDTO> list = new ArrayList<RemboursementDTO>( remboursements.size() );
        for ( Remboursement remboursement : remboursements ) {
            list.add( remboursementToRemboursementDTO( remboursement ) );
        }

        return list;
    }

    private Long remboursementCreditId(Remboursement remboursement) {
        if ( remboursement == null ) {
            return null;
        }
        Credit credit = remboursement.getCredit();
        if ( credit == null ) {
            return null;
        }
        Long id = credit.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
