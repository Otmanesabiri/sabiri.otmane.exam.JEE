package com.yourname.yourfirstname.service;

import com.yourname.yourfirstname.dto.ClientDTO;
import java.util.List;
import java.util.Optional;

public interface ClientService {
    ClientDTO saveClient(ClientDTO clientDTO);
    Optional<ClientDTO> getClientById(Long id);
    List<ClientDTO> getAllClients();
    ClientDTO updateClient(Long id, ClientDTO clientDTO);
    void deleteClient(Long id);
    Optional<ClientDTO> getClientByEmail(String email);
    List<ClientDTO> searchClientsByName(String nom);
}
