package com.yourname.yourfirstname.dto;

import com.yourname.yourfirstname.entity.StatutCredit;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public class CreditDTO {
    private Long id;
    
    @NotNull(message = "La date de demande est obligatoire")
    private LocalDate dateDemande;
    
    @NotNull(message = "Le statut est obligatoire")
    private StatutCredit statut;
    
    private LocalDate dateAcceptation;
    
    @NotNull(message = "Le montant est obligatoire")
    @Positive(message = "Le montant doit être positif")
    private Double montant;
    
    @NotNull(message = "La durée de remboursement est obligatoire")
    @Positive(message = "La durée doit être positive")
    private Integer dureeRemboursement;
    
    @NotNull(message = "Le taux d'intérêt est obligatoire")
    @Positive(message = "Le taux d'intérêt doit être positif")
    private Double tauxInteret;
    
    @NotNull(message = "Le client est obligatoire")
    private Long clientId;
    
    private String typeCredit; // PERSONNEL, IMMOBILIER, PROFESSIONNEL
    
    // Constructors
    public CreditDTO() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public LocalDate getDateDemande() { return dateDemande; }
    public void setDateDemande(LocalDate dateDemande) { this.dateDemande = dateDemande; }
    
    public StatutCredit getStatut() { return statut; }
    public void setStatut(StatutCredit statut) { this.statut = statut; }
    
    public LocalDate getDateAcceptation() { return dateAcceptation; }
    public void setDateAcceptation(LocalDate dateAcceptation) { this.dateAcceptation = dateAcceptation; }
    
    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }
    
    public Integer getDureeRemboursement() { return dureeRemboursement; }
    public void setDureeRemboursement(Integer dureeRemboursement) { this.dureeRemboursement = dureeRemboursement; }
    
    public Double getTauxInteret() { return tauxInteret; }
    public void setTauxInteret(Double tauxInteret) { this.tauxInteret = tauxInteret; }
    
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    
    public String getTypeCredit() { return typeCredit; }
    public void setTypeCredit(String typeCredit) { this.typeCredit = typeCredit; }
}
