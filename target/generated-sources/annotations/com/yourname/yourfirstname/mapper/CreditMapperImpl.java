package com.yourname.yourfirstname.mapper;

import com.yourname.yourfirstname.dto.CreditDTO;
import com.yourname.yourfirstname.entity.Client;
import com.yourname.yourfirstname.entity.Credit;
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
public class CreditMapperImpl implements CreditMapper {

    @Override
    public CreditDTO creditToCreditDTO(Credit credit) {
        if ( credit == null ) {
            return null;
        }

        CreditDTO creditDTO = new CreditDTO();

        creditDTO.setClientId( creditClientId( credit ) );
        creditDTO.setId( credit.getId() );
        creditDTO.setDateDemande( credit.getDateDemande() );
        creditDTO.setStatut( credit.getStatut() );
        creditDTO.setDateAcceptation( credit.getDateAcceptation() );
        creditDTO.setMontant( credit.getMontant() );
        creditDTO.setDureeRemboursement( credit.getDureeRemboursement() );
        creditDTO.setTauxInteret( credit.getTauxInteret() );

        creditDTO.setTypeCredit( getTypeCredit(credit) );

        return creditDTO;
    }

    @Override
    public List<CreditDTO> creditsToCreditDTOs(List<Credit> credits) {
        if ( credits == null ) {
            return null;
        }

        List<CreditDTO> list = new ArrayList<CreditDTO>( credits.size() );
        for ( Credit credit : credits ) {
            list.add( creditToCreditDTO( credit ) );
        }

        return list;
    }

    private Long creditClientId(Credit credit) {
        if ( credit == null ) {
            return null;
        }
        Client client = credit.getClient();
        if ( client == null ) {
            return null;
        }
        Long id = client.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
