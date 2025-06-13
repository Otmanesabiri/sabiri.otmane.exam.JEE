package com.yourname.yourfirstname.dto;

import com.yourname.yourfirstname.entity.Remboursement.TypeRemboursement;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public class RemboursementDTO {
    private Long id;
    
    @NotNull(message = "La date est obligatoire")
    private LocalDate date;
    
    @NotNull(message = "Le montant est obligatoire")
    @Positive(message = "Le montant doit être positif")
    private Double montant;
    
    @NotNull(message = "Le type est obligatoire")
    private TypeRemboursement type;
    
    @NotNull(message = "Le crédit est obligatoire")
    private Long creditId;
    
    // Constructors
    public RemboursementDTO() {}
    
    public RemboursementDTO(Long id, LocalDate date, Double montant, TypeRemboursement type, Long creditId) {
        this.id = id;
        this.date = date;
        this.montant = montant;
        this.type = type;
        this.creditId = creditId;
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
    
    public Long getCreditId() { return creditId; }
    public void setCreditId(Long creditId) { this.creditId = creditId; }
}
