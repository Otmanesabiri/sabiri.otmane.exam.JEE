package com.yourname.yourfirstname.config;

import com.yourname.yourfirstname.entity.*;
import com.yourname.yourfirstname.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Set;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CreditRepository creditRepository;

    @Autowired
    private RemboursementRepository remboursementRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Créer des utilisateurs de test si la base est vide
        if (userRepository.count() == 0) {
            createUsers();
            createClients();
            createCredits();
            createRemboursements();
        }
    }

    private void createUsers() {
        // Admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@example.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRoles(Set.of(User.Role.ROLE_ADMIN));
        admin.setEnabled(true);
        userRepository.save(admin);

        // Employee user
        User employee = new User();
        employee.setUsername("employe");
        employee.setEmail("employe@example.com");
        employee.setPassword(passwordEncoder.encode("employe123"));
        employee.setRoles(Set.of(User.Role.ROLE_EMPLOYE));
        employee.setEnabled(true);
        userRepository.save(employee);

        // Client user
        User client = new User();
        client.setUsername("client");
        client.setEmail("client@example.com");
        client.setPassword(passwordEncoder.encode("client123"));
        client.setRoles(Set.of(User.Role.ROLE_CLIENT));
        client.setEnabled(true);
        userRepository.save(client);

        System.out.println("✅ Utilisateurs de test créés:");
        System.out.println("👨‍💼 Admin: username=admin, password=admin123");
        System.out.println("👷‍♂️ Employé: username=employe, password=employe123");
        System.out.println("👤 Client: username=client, password=client123");
    }

    private void createClients() {
        Client client1 = new Client("Jean Dupont", "jean.dupont@email.com");
        Client client2 = new Client("Marie Martin", "marie.martin@email.com");
        Client client3 = new Client("Pierre Durand", "pierre.durand@email.com");
        
        clientRepository.save(client1);
        clientRepository.save(client2);
        clientRepository.save(client3);
        
        System.out.println("✅ Clients de test créés");
    }

    private void createCredits() {
        var clients = clientRepository.findAll();
        if (clients.size() >= 3) {
            // Crédit Personnel
            CreditPersonnel creditPersonnel = new CreditPersonnel();
            creditPersonnel.setClient(clients.get(0));
            creditPersonnel.setMontant(15000.0);
            creditPersonnel.setDureeRemboursement(36);
            creditPersonnel.setTauxInteret(4.5);
            creditPersonnel.setMotif("Achat de voiture");
            creditPersonnel.setStatut(StatutCredit.EN_COURS);
            creditPersonnel.setDateDemande(LocalDate.now().minusDays(5));
            creditRepository.save(creditPersonnel);

            // Crédit Immobilier
            CreditImmobilier creditImmobilier = new CreditImmobilier();
            creditImmobilier.setClient(clients.get(1));
            creditImmobilier.setMontant(250000.0);
            creditImmobilier.setDureeRemboursement(240);
            creditImmobilier.setTauxInteret(2.8);
            creditImmobilier.setTypeBien(CreditImmobilier.TypeBien.APPARTEMENT);
            creditImmobilier.setStatut(StatutCredit.ACCEPTE);
            creditImmobilier.setDateDemande(LocalDate.now().minusDays(10));
            creditImmobilier.setDateAcceptation(LocalDate.now().minusDays(3));
            creditRepository.save(creditImmobilier);

            // Crédit Professionnel
            CreditProfessionnel creditProfessionnel = new CreditProfessionnel();
            creditProfessionnel.setClient(clients.get(2));
            creditProfessionnel.setMontant(50000.0);
            creditProfessionnel.setDureeRemboursement(60);
            creditProfessionnel.setTauxInteret(3.2);
            creditProfessionnel.setMotif("Équipement informatique");
            creditProfessionnel.setRaisonSociale("TechCorp SARL");
            creditProfessionnel.setStatut(StatutCredit.EN_COURS);
            creditProfessionnel.setDateDemande(LocalDate.now().minusDays(7));
            creditRepository.save(creditProfessionnel);

            System.out.println("✅ Crédits de test créés");
        }
    }

    private void createRemboursements() {
        var credits = creditRepository.findAll();
        if (!credits.isEmpty()) {
            // Remboursements pour le crédit accepté
            Credit creditAccepte = credits.stream()
                    .filter(c -> c.getStatut() == StatutCredit.ACCEPTE)
                    .findFirst()
                    .orElse(null);

            if (creditAccepte != null) {
                // Première mensualité
                Remboursement remb1 = new Remboursement();
                remb1.setCredit(creditAccepte);
                remb1.setDate(LocalDate.now().minusDays(30));
                remb1.setMontant(1200.0);
                remb1.setType(Remboursement.TypeRemboursement.MENSUALITE);
                remboursementRepository.save(remb1);

                // Deuxième mensualité
                Remboursement remb2 = new Remboursement();
                remb2.setCredit(creditAccepte);
                remb2.setDate(LocalDate.now());
                remb2.setMontant(1200.0);
                remb2.setType(Remboursement.TypeRemboursement.MENSUALITE);
                remboursementRepository.save(remb2);

                System.out.println("✅ Remboursements de test créés");
            }
        }
    }
}
