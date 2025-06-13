package com.yourname.yourfirstname.service.impl;

import com.yourname.yourfirstname.dto.ClientDTO;
import com.yourname.yourfirstname.entity.Client;
import com.yourname.yourfirstname.mapper.ClientMapper;
import com.yourname.yourfirstname.repository.ClientRepository;
import com.yourname.yourfirstname.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ClientServiceImpl implements ClientService {
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private ClientMapper clientMapper;
    
    @Override
    public ClientDTO saveClient(ClientDTO clientDTO) {
        Client client = clientMapper.clientDTOToClient(clientDTO);
        Client savedClient = clientRepository.save(client);
        return clientMapper.clientToClientDTO(savedClient);
    }
    
    @Override
    public Optional<ClientDTO> getClientById(Long id) {
        return clientRepository.findById(id)
                .map(clientMapper::clientToClientDTO);
    }
    
    @Override
    public List<ClientDTO> getAllClients() {
        List<Client> clients = clientRepository.findAll();
        return clientMapper.clientsToClientDTOs(clients);
    }
    
    @Override
    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        if (!clientRepository.existsById(id)) {
            throw new RuntimeException("Client not found with id: " + id);
        }
        clientDTO.setId(id);
        Client client = clientMapper.clientDTOToClient(clientDTO);
        Client updatedClient = clientRepository.save(client);
        return clientMapper.clientToClientDTO(updatedClient);
    }
    
    @Override
    public void deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new RuntimeException("Client not found with id: " + id);
        }
        clientRepository.deleteById(id);
    }
    
    @Override
    public Optional<ClientDTO> getClientByEmail(String email) {
        return clientRepository.findByEmail(email)
                .map(clientMapper::clientToClientDTO);
    }
    
    @Override
    public List<ClientDTO> searchClientsByName(String nom) {
        List<Client> clients = clientRepository.findByNomContaining(nom);
        return clientMapper.clientsToClientDTOs(clients);
    }
}
