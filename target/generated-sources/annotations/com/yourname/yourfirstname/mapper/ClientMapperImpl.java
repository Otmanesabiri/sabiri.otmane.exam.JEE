package com.yourname.yourfirstname.mapper;

import com.yourname.yourfirstname.dto.ClientDTO;
import com.yourname.yourfirstname.entity.Client;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-13T11:24:56+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class ClientMapperImpl implements ClientMapper {

    @Override
    public ClientDTO clientToClientDTO(Client client) {
        if ( client == null ) {
            return null;
        }

        ClientDTO clientDTO = new ClientDTO();

        clientDTO.setId( client.getId() );
        clientDTO.setNom( client.getNom() );
        clientDTO.setEmail( client.getEmail() );

        return clientDTO;
    }

    @Override
    public Client clientDTOToClient(ClientDTO clientDTO) {
        if ( clientDTO == null ) {
            return null;
        }

        Client client = new Client();

        client.setId( clientDTO.getId() );
        client.setNom( clientDTO.getNom() );
        client.setEmail( clientDTO.getEmail() );

        return client;
    }

    @Override
    public List<ClientDTO> clientsToClientDTOs(List<Client> clients) {
        if ( clients == null ) {
            return null;
        }

        List<ClientDTO> list = new ArrayList<ClientDTO>( clients.size() );
        for ( Client client : clients ) {
            list.add( clientToClientDTO( client ) );
        }

        return list;
    }
}
