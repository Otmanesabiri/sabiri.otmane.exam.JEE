package com.yourname.yourfirstname.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@DiscriminatorValue("IMMOBILIER")
public class CreditImmobilier extends Credit {
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type_bien", nullable = true)
    private TypeBien typeBien;
    
    // Constructors
    public CreditImmobilier() {}
    
    public CreditImmobilier(LocalDate dateDemande, StatutCredit statut, Double montant,
                           Integer dureeRemboursement, Double tauxInteret, Client client, TypeBien typeBien) {
        super(dateDemande, statut, montant, dureeRemboursement, tauxInteret, client);
        this.typeBien = typeBien;
    }
    
    // Getters and Setters
    public TypeBien getTypeBien() { return typeBien; }
    public void setTypeBien(TypeBien typeBien) { this.typeBien = typeBien; }
    
    public enum TypeBien {
        APPARTEMENT,
        MAISON,
        LOCAL_COMMERCIAL
    }
}
