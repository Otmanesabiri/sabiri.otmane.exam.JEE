package com.yourname.yourfirstname.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "credits")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type_credit", discriminatorType = DiscriminatorType.STRING)
public abstract class Credit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "date_demande", nullable = false)
    private LocalDate dateDemande;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutCredit statut;
    
    @Column(name = "date_acceptation")
    private LocalDate dateAcceptation;
    
    @Column(nullable = false)
    private Double montant;
    
    @Column(name = "duree_remboursement", nullable = false)
    private Integer dureeRemboursement;
    
    @Column(name = "taux_interet", nullable = false)
    private Double tauxInteret;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
    
    @OneToMany(mappedBy = "credit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Remboursement> remboursements;
    
    // Constructors
    public Credit() {}
    
    public Credit(LocalDate dateDemande, StatutCredit statut, Double montant, 
                  Integer dureeRemboursement, Double tauxInteret, Client client) {
        this.dateDemande = dateDemande;
        this.statut = statut;
        this.montant = montant;
        this.dureeRemboursement = dureeRemboursement;
        this.tauxInteret = tauxInteret;
        this.client = client;
    }
    
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
    
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    
    public List<Remboursement> getRemboursements() { return remboursements; }
    public void setRemboursements(List<Remboursement> remboursements) { this.remboursements = remboursements; }
}
