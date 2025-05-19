package ma.digitbank.jeespringangularjwtdigitalbanking.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.digitbank.jeespringangularjwtdigitalbanking.dtos.*;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.CreditStatus;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.CreditNotFoundException;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.CustomerNotFoundException;
import ma.digitbank.jeespringangularjwtdigitalbanking.services.CreditService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credits")
@AllArgsConstructor
@Slf4j
@CrossOrigin("*")
@Tag(name = "Credit Management", description = "APIs for managing credits and repayments")
public class CreditController {

    private final CreditService creditService;

    // --- Customer specific credit endpoints ---
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_EMPLOYE', 'ROLE_ADMIN')")
    @Operation(summary = "Get all credits for a specific customer")
    public ResponseEntity<List<CreditDTO>> getCustomerCredits(@PathVariable Long customerId) {
        log.info("Fetching credits for customer ID: {}", customerId);
        List<CreditDTO> credits = creditService.getCustomerCredits(customerId);
        return ResponseEntity.ok(credits);
    }

    @GetMapping("/customer/{customerId}/status/{status}")
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_EMPLOYE', 'ROLE_ADMIN')")
    @Operation(summary = "Get credits for a customer by status")
    public ResponseEntity<List<CreditDTO>> getCustomerCreditsByStatus(
            @PathVariable Long customerId,
            @PathVariable CreditStatus status) {
        log.info("Fetching credits for customer ID: {} with status: {}", customerId, status);
        List<CreditDTO> credits = creditService.getCustomerCreditsByStatus(customerId, status);
        return ResponseEntity.ok(credits);
    }

    // --- Personal Credit Endpoints ---
    @PostMapping("/personal")
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_EMPLOYE')") // Client can request, Employee can create on behalf
    @Operation(summary = "Request or save a new personal credit")
    public ResponseEntity<PersonalCreditDTO> savePersonalCredit(@RequestBody PersonalCreditDTO personalCreditDTO) {
        try {
            log.info("Request to save personal credit for customer ID: {}", personalCreditDTO.getCustomerDTO().getId());
            PersonalCreditDTO savedCredit = creditService.savePersonalCredit(personalCreditDTO);
            return new ResponseEntity<>(savedCredit, HttpStatus.CREATED);
        } catch (CustomerNotFoundException e) {
            log.error("Error saving personal credit: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Or a custom error DTO
        }
    }

    @PutMapping("/personal/{creditId}")
    @PreAuthorize("hasRole('ROLE_EMPLOYE')") // Only employee/admin can update details other than status
    @Operation(summary = "Update an existing personal credit")
    public ResponseEntity<PersonalCreditDTO> updatePersonalCredit(@PathVariable Long creditId, @RequestBody PersonalCreditDTO personalCreditDTO) {
        try {
            personalCreditDTO.setId(creditId); // Ensure ID from path is used
            log.info("Request to update personal credit ID: {}", creditId);
            PersonalCreditDTO updatedCredit = creditService.updatePersonalCredit(personalCreditDTO);
            return ResponseEntity.ok(updatedCredit);
        } catch (CreditNotFoundException e) {
            log.error("Error updating personal credit: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/personal")
    @PreAuthorize("hasAnyRole('ROLE_EMPLOYE', 'ROLE_ADMIN')")
    @Operation(summary = "List all personal credits")
    public ResponseEntity<List<PersonalCreditDTO>> listPersonalCredits() {
        log.info("Request to list all personal credits");
        List<PersonalCreditDTO> credits = creditService.listPersonalCredits();
        return ResponseEntity.ok(credits);
    }

    @GetMapping("/personal/reason/{reason}")
    @PreAuthorize("hasAnyRole('ROLE_EMPLOYE', 'ROLE_ADMIN')")
    @Operation(summary = "Find personal credits by reason")
    public ResponseEntity<List<PersonalCreditDTO>> findPersonalCreditsByReason(@PathVariable String reason) {
        log.info("Request to find personal credits by reason: {}", reason);
        List<PersonalCreditDTO> credits = creditService.findPersonalCreditsByReason(reason);
        return ResponseEntity.ok(credits);
    }

    // --- Mortgage Credit Endpoints ---
    @PostMapping("/mortgage")
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_EMPLOYE')")
    @Operation(summary = "Request or save a new mortgage credit")
    public ResponseEntity<MortgageCreditDTO> saveMortgageCredit(@RequestBody MortgageCreditDTO mortgageCreditDTO) {
        try {
            log.info("Request to save mortgage credit for customer ID: {}", mortgageCreditDTO.getCustomerDTO().getId());
            MortgageCreditDTO savedCredit = creditService.saveMortgageCredit(mortgageCreditDTO);
            return new ResponseEntity<>(savedCredit, HttpStatus.CREATED);
        } catch (CustomerNotFoundException e) {
            log.error("Error saving mortgage credit: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/mortgage/{creditId}")
    @PreAuthorize("hasRole('ROLE_EMPLOYE')")
    @Operation(summary = "Update an existing mortgage credit")
    public ResponseEntity<MortgageCreditDTO> updateMortgageCredit(@PathVariable Long creditId, @RequestBody MortgageCreditDTO mortgageCreditDTO) {
        try {
            mortgageCreditDTO.setId(creditId);
            log.info("Request to update mortgage credit ID: {}", creditId);
            MortgageCreditDTO updatedCredit = creditService.updateMortgageCredit(mortgageCreditDTO);
            return ResponseEntity.ok(updatedCredit);
        } catch (CreditNotFoundException e) {
            log.error("Error updating mortgage credit: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/mortgage")
    @PreAuthorize("hasAnyRole('ROLE_EMPLOYE', 'ROLE_ADMIN')")
    @Operation(summary = "List all mortgage credits")
    public ResponseEntity<List<MortgageCreditDTO>> listMortgageCredits() {
        log.info("Request to list all mortgage credits");
        List<MortgageCreditDTO> credits = creditService.listMortgageCredits();
        return ResponseEntity.ok(credits);
    }

    // --- Professional Credit Endpoints ---
    @PostMapping("/professional")
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_EMPLOYE')")
    @Operation(summary = "Request or save a new professional credit")
    public ResponseEntity<ProfessionalCreditDTO> saveProfessionalCredit(@RequestBody ProfessionalCreditDTO professionalCreditDTO) {
        try {
            log.info("Request to save professional credit for customer ID: {}", professionalCreditDTO.getCustomerDTO().getId());
            ProfessionalCreditDTO savedCredit = creditService.saveProfessionalCredit(professionalCreditDTO);
            return new ResponseEntity<>(savedCredit, HttpStatus.CREATED);
        } catch (CustomerNotFoundException e) {
            log.error("Error saving professional credit: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/professional/{creditId}")
    @PreAuthorize("hasRole('ROLE_EMPLOYE')")
    @Operation(summary = "Update an existing professional credit")
    public ResponseEntity<ProfessionalCreditDTO> updateProfessionalCredit(@PathVariable Long creditId, @RequestBody ProfessionalCreditDTO professionalCreditDTO) {
        try {
            professionalCreditDTO.setId(creditId);
            log.info("Request to update professional credit ID: {}", creditId);
            ProfessionalCreditDTO updatedCredit = creditService.updateProfessionalCredit(professionalCreditDTO);
            return ResponseEntity.ok(updatedCredit);
        } catch (CreditNotFoundException e) {
            log.error("Error updating professional credit: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/professional")
    @PreAuthorize("hasAnyRole('ROLE_EMPLOYE', 'ROLE_ADMIN')")
    @Operation(summary = "List all professional credits")
    public ResponseEntity<List<ProfessionalCreditDTO>> listProfessionalCredits() {
        log.info("Request to list all professional credits");
        List<ProfessionalCreditDTO> credits = creditService.listProfessionalCredits();
        return ResponseEntity.ok(credits);
    }

    @GetMapping("/professional/company/{companyName}")
    @PreAuthorize("hasAnyRole('ROLE_EMPLOYE', 'ROLE_ADMIN')")
    @Operation(summary = "Find professional credits by company name")
    public ResponseEntity<List<ProfessionalCreditDTO>> findProfessionalCreditsByCompanyName(@PathVariable String companyName) {
        log.info("Request to find professional credits by company name: {}", companyName);
        List<ProfessionalCreditDTO> credits = creditService.findProfessionalCreditsByCompanyName(companyName);
        return ResponseEntity.ok(credits);
    }

    // --- General Credit Operations ---
    @GetMapping("/{creditId}")
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_EMPLOYE', 'ROLE_ADMIN')") // Client can view their own, Employee/Admin can view any
    @Operation(summary = "Get a specific credit by ID")
    public ResponseEntity<CreditDTO> getCredit(@PathVariable Long creditId) {
        // Add logic here to ensure client can only access their own credits if not employee/admin
        try {
            log.info("Request to get credit ID: {}", creditId);
            CreditDTO credit = creditService.getCredit(creditId);
            return ResponseEntity.ok(credit);
        } catch (CreditNotFoundException e) {
            log.error("Error fetching credit: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{creditId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')") // Only admin can delete
    @Operation(summary = "Delete a credit by ID")
    public ResponseEntity<Void> deleteCredit(@PathVariable Long creditId) {
        try {
            log.info("Request to delete credit ID: {}", creditId);
            creditService.deleteCredit(creditId);
            return ResponseEntity.noContent().build();
        } catch (CreditNotFoundException e) {
            log.error("Error deleting credit: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PatchMapping("/{creditId}/status")
    @PreAuthorize("hasAnyRole('ROLE_EMPLOYE', 'ROLE_ADMIN')") // Employee or Admin can change status
    @Operation(summary = "Change the status of a credit")
    public ResponseEntity<Void> changeCreditStatus(@PathVariable Long creditId, @RequestParam CreditStatus status) {
        try {
            log.info("Request to change status of credit ID: {} to {}", creditId, status);
            creditService.changeCreditStatus(creditId, status);
            return ResponseEntity.ok().build();
        } catch (CreditNotFoundException e) {
            log.error("Error changing credit status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ROLE_EMPLOYE', 'ROLE_ADMIN')")
    @Operation(summary = "List all credits by status")
    public ResponseEntity<List<CreditDTO>> listCreditsByStatus(@PathVariable CreditStatus status) {
        log.info("Request to list credits by status: {}", status);
        List<CreditDTO> credits = creditService.listCreditsByStatus(status);
        return ResponseEntity.ok(credits);
    }

    // --- Repayment Operations ---
    @PostMapping("/{creditId}/repayments")
    @PreAuthorize("hasAnyRole('ROLE_EMPLOYE', 'ROLE_ADMIN')") // Typically employee/admin records a repayment
    @Operation(summary = "Add a repayment to a credit")
    public ResponseEntity<RepaymentDTO> addRepayment(@PathVariable Long creditId, @RequestBody RepaymentDTO repaymentDTO) {
        try {
            repaymentDTO.setCreditId(creditId); // Ensure repayment is for the credit in path
            log.info("Request to add repayment for credit ID: {}", creditId);
            RepaymentDTO savedRepayment = creditService.addRepayment(repaymentDTO);
            return new ResponseEntity<>(savedRepayment, HttpStatus.CREATED);
        } catch (CreditNotFoundException e) {
            log.error("Error adding repayment: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (IllegalStateException e) {
            log.error("Error adding repayment: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // e.g. credit not approved
        }
    }

    @GetMapping("/{creditId}/repayments")
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_EMPLOYE', 'ROLE_ADMIN')")
    @Operation(summary = "Get all repayments for a specific credit")
    public ResponseEntity<List<RepaymentDTO>> getCreditRepayments(@PathVariable Long creditId) {
        // Add logic here to ensure client can only access their own credit repayments
        log.info("Request to get repayments for credit ID: {}", creditId);
        List<RepaymentDTO> repayments = creditService.getCreditRepayments(creditId);
        return ResponseEntity.ok(repayments);
    }

    @GetMapping("/{creditId}/history")
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_EMPLOYE', 'ROLE_ADMIN')")
    @Operation(summary = "Get the repayment history for a credit with pagination")
    public ResponseEntity<CreditHistoryDTO> getCreditHistory(
            @PathVariable Long creditId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        // Add logic here to ensure client can only access their own credit history
        try {
            log.info("Request for credit history for ID: {}, page: {}, size: {}", creditId, page, size);
            CreditHistoryDTO history = creditService.getCreditHistory(creditId, page, size);
            return ResponseEntity.ok(history);
        } catch (CreditNotFoundException e) {
            log.error("Error fetching credit history: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
