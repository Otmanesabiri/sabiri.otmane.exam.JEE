package com.yourname.yourfirstname.controller;

import com.yourname.yourfirstname.dto.RemboursementDTO;
import com.yourname.yourfirstname.service.RemboursementService;
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
@RequestMapping("/api/remboursements")
@Tag(name = "Remboursement", description = "API de gestion des remboursements")
@CrossOrigin(origins = "*")
public class RemboursementController {

    @Autowired
    private RemboursementService remboursementService;

    @PostMapping
    @Operation(summary = "Créer un nouveau remboursement")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYE') or hasRole('CLIENT')")
    public ResponseEntity<RemboursementDTO> createRemboursement(@Valid @RequestBody RemboursementDTO remboursementDTO) {
        RemboursementDTO savedRemboursement = remboursementService.saveRemboursement(remboursementDTO);
        return new ResponseEntity<>(savedRemboursement, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un remboursement par son ID")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYE') or hasRole('CLIENT')")
    public ResponseEntity<RemboursementDTO> getRemboursementById(@PathVariable Long id) {
        return remboursementService.getRemboursementById(id)
                .map(remboursement -> ResponseEntity.ok(remboursement))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @Operation(summary = "Récupérer tous les remboursements")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYE')")
    public ResponseEntity<List<RemboursementDTO>> getAllRemboursements() {
        List<RemboursementDTO> remboursements = remboursementService.getAllRemboursements();
        return ResponseEntity.ok(remboursements);
    }

    @GetMapping("/credit/{creditId}")
    @Operation(summary = "Récupérer les remboursements d'un crédit")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYE') or hasRole('CLIENT')")
    public ResponseEntity<List<RemboursementDTO>> getRemboursementsByCredit(@PathVariable Long creditId) {
        List<RemboursementDTO> remboursements = remboursementService.getRemboursementsByCreditId(creditId);
        return ResponseEntity.ok(remboursements);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un remboursement")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYE')")
    public ResponseEntity<RemboursementDTO> updateRemboursement(@PathVariable Long id, @Valid @RequestBody RemboursementDTO remboursementDTO) {
        try {
            RemboursementDTO updatedRemboursement = remboursementService.updateRemboursement(id, remboursementDTO);
            return ResponseEntity.ok(updatedRemboursement);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un remboursement")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRemboursement(@PathVariable Long id) {
        try {
            remboursementService.deleteRemboursement(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
