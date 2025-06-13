package com.yourname.yourfirstname.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@DiscriminatorValue("PERSONNEL")
public class CreditPersonnel extends Credit {
    
    @Column(nullable = true)
    private String motif;
    
    // Constructors
    public CreditPersonnel() {}
    
    public CreditPersonnel(LocalDate dateDemande, StatutCredit statut, Double montant,
                          Integer dureeRemboursement, Double tauxInteret, Client client, String motif) {
        super(dateDemande, statut, montant, dureeRemboursement, tauxInteret, client);
        this.motif = motif;
    }
    
    // Getters and Setters
    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
}
