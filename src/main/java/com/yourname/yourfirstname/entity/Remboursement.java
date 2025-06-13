package com.yourname.yourfirstname.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "remboursements")
public class Remboursement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private LocalDate date;
    
    @Column(nullable = false)
    private Double montant;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeRemboursement type;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "credit_id", nullable = false)
    private Credit credit;
    
    // Constructors
    public Remboursement() {}
    
    public Remboursement(LocalDate date, Double montant, TypeRemboursement type, Credit credit) {
        this.date = date;
        this.montant = montant;
        this.type = type;
        this.credit = credit;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }
    
    public TypeRemboursement getType() { return type; }
    public void setType(TypeRemboursement type) { this.type = type; }
    
    public Credit getCredit() { return credit; }
    public void setCredit(Credit credit) { this.credit = credit; }
    
    public enum TypeRemboursement {
        MENSUALITE,
        REMBOURSEMENT_ANTICIPE
    }
}
