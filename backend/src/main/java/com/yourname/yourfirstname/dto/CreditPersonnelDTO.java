package com.yourname.yourfirstname.dto;

import jakarta.validation.constraints.NotBlank;

public class CreditPersonnelDTO extends CreditDTO {
    @NotBlank(message = "Le motif est obligatoire")
    private String motif;
    
    // Constructors
    public CreditPersonnelDTO() {
        super();
        setTypeCredit("PERSONNEL");
    }
    
    // Getters and Setters
    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
}
