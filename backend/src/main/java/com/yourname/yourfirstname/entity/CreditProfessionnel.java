package com.yourname.yourfirstname.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@DiscriminatorValue("PROFESSIONNEL")
public class CreditProfessionnel extends Credit {
    
    @Column(nullable = true)
    private String motif;
    
    @Column(name = "raison_sociale", nullable = true)
    private String raisonSociale;
    
    // Constructors
    public CreditProfessionnel() {}
    
    public CreditProfessionnel(LocalDate dateDemande, StatutCredit statut, Double montant,
                              Integer dureeRemboursement, Double tauxInteret, Client client,
                              String motif, String raisonSociale) {
        super(dateDemande, statut, montant, dureeRemboursement, tauxInteret, client);
        this.motif = motif;
        this.raisonSociale = raisonSociale;
    }
    
    // Getters and Setters
    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
    
    public String getRaisonSociale() { return raisonSociale; }
    public void setRaisonSociale(String raisonSociale) { this.raisonSociale = raisonSociale; }
}
