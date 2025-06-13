package com.yourname.yourfirstname.controller;

import com.yourname.yourfirstname.dto.CreditDTO;
import com.yourname.yourfirstname.dto.CreditPersonnelDTO;
import com.yourname.yourfirstname.service.CreditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/credits")
@Tag(name = "Credit", description = "API de gestion des crédits")
@CrossOrigin(origins = "*")
public class CreditController {
    
    @Autowired
    private CreditService creditService;
    
    @PostMapping
    @Operation(summary = "Créer une nouvelle demande de crédit")
    @PreAuthorize("hasRole('CLIENT') or hasRole('EMPLOYE') or hasRole('ADMIN')")
    public ResponseEntity<CreditDTO> createCredit(@Valid @RequestBody CreditDTO creditDTO) {
        CreditDTO savedCredit = creditService.saveCredit(creditDTO);
        return new ResponseEntity<>(savedCredit, HttpStatus.CREATED);
    }
    
    @PostMapping("/personnel")
    @Operation(summary = "Créer une demande de crédit personnel")
    @PreAuthorize("hasRole('CLIENT') or hasRole('EMPLOYE') or hasRole('ADMIN')")
    public ResponseEntity<CreditPersonnelDTO> createCreditPersonnel(@Valid @RequestBody CreditPersonnelDTO creditPersonnelDTO) {
        CreditPersonnelDTO savedCredit = creditService.saveCreditPersonnel(creditPersonnelDTO);
        return new ResponseEntity<>(savedCredit, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un crédit par son ID")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYE') or (hasRole('CLIENT') and @creditService.isOwner(authentication.name, #id))")
    public ResponseEntity<CreditDTO> getCreditById(@PathVariable Long id) {
        return creditService.getCreditById(id)
                .map(credit -> ResponseEntity.ok(credit))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    @Operation(summary = "Récupérer tous les crédits")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYE')")
    public ResponseEntity<List<CreditDTO>> getAllCredits() {
        List<CreditDTO> credits = creditService.getAllCredits();
        return ResponseEntity.ok(credits);
    }
    
    @GetMapping("/client/{clientId}")
    @Operation(summary = "Récupérer les crédits d'un client")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYE') or (hasRole('CLIENT') and @clientService.isOwner(authentication.name, #clientId))")
    public ResponseEntity<List<CreditDTO>> getCreditsByClient(@PathVariable Long clientId) {
        List<CreditDTO> credits = creditService.getCreditsByClientId(clientId);
        return ResponseEntity.ok(credits);
    }
    
    @PutMapping("/{id}/accepter")
    @Operation(summary = "Accepter un crédit")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYE')")
    public ResponseEntity<CreditDTO> accepterCredit(@PathVariable Long id) {
        try {
            CreditDTO credit = creditService.accepterCredit(id);
            return ResponseEntity.ok(credit);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/rejeter")
    @Operation(summary = "Rejeter un crédit")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYE')")
    public ResponseEntity<CreditDTO> rejeterCredit(@PathVariable Long id) {
        try {
            CreditDTO credit = creditService.rejeterCredit(id);
            return ResponseEntity.ok(credit);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
