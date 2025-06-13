package com.yourname.yourfirstname.mapper;

import com.yourname.yourfirstname.dto.ClientDTO;
import com.yourname.yourfirstname.entity.Client;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ClientMapper {
    ClientMapper INSTANCE = Mappers.getMapper(ClientMapper.class);
    
    ClientDTO clientToClientDTO(Client client);
    
    @Mapping(target = "credits", ignore = true)
    Client clientDTOToClient(ClientDTO clientDTO);
    
    List<ClientDTO> clientsToClientDTOs(List<Client> clients);
}
