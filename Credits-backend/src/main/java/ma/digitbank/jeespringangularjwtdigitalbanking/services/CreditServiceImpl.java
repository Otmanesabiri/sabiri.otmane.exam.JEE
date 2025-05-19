package ma.digitbank.jeespringangularjwtdigitalbanking.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.digitbank.jeespringangularjwtdigitalbanking.dtos.*;
import ma.digitbank.jeespringangularjwtdigitalbanking.entities.*;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.CreditStatus;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.RepaymentType;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.CreditNotFoundException;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.CustomerNotFoundException;
import ma.digitbank.jeespringangularjwtdigitalbanking.mappers.BankAccountMapperImpl;
import ma.digitbank.jeespringangularjwtdigitalbanking.mappers.CreditMapperImpl;
import ma.digitbank.jeespringangularjwtdigitalbanking.repositories.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class CreditServiceImpl implements CreditService {

    private final CreditRepository creditRepository;
    private final PersonalCreditRepository personalCreditRepository;
    private final MortgageCreditRepository mortgageCreditRepository;
    private final ProfessionalCreditRepository professionalCreditRepository;
    private final RepaymentRepository repaymentRepository;
    private final CustomerRepository customerRepository;
    private final CreditMapperImpl creditMapper;
    private final BankAccountMapperImpl bankAccountMapper;


    @Override
    public List<CreditDTO> getCustomerCredits(Long customerId) {
        // Security check: In a real app, ensure the authenticated user is the customerId or has admin/employee role.
        // For simplicity, this check is omitted here but crucial in production.
        List<Credit> credits = creditRepository.findByCustomerId(customerId);
        return credits.stream().map(credit -> {
            if (credit instanceof PersonalCredit) {
                return creditMapper.fromPersonalCredit((PersonalCredit) credit);
            } else if (credit instanceof MortgageCredit) {
                return creditMapper.fromMortgageCredit((MortgageCredit) credit);
            } else if (credit instanceof ProfessionalCredit) {
                return creditMapper.fromProfessionalCredit((ProfessionalCredit) credit);
            }
            return null; // Or throw an exception for unknown type
        }).collect(Collectors.toList());
    }

    @Override
    public List<CreditDTO> getCustomerCreditsByStatus(Long customerId, CreditStatus status) {
        // Security check: Ensure authenticated user is customerId or admin/employee.
        List<Credit> credits = creditRepository.findByCustomerIdAndStatus(customerId, status);
        return credits.stream().map(credit -> {
            if (credit instanceof PersonalCredit) {
                return creditMapper.fromPersonalCredit((PersonalCredit) credit);
            } else if (credit instanceof MortgageCredit) {
                return creditMapper.fromMortgageCredit((MortgageCredit) credit);
            } else if (credit instanceof ProfessionalCredit) {
                return creditMapper.fromProfessionalCredit((ProfessionalCredit) credit);
            }
            return null;
        }).collect(Collectors.toList());
    }

    @Override
    public PersonalCreditDTO savePersonalCredit(PersonalCreditDTO personalCreditDTO) throws CustomerNotFoundException {
        log.info("Saving new Personal Credit");
        Customer customer = customerRepository.findById(personalCreditDTO.getCustomerDTO().getId())
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));
        PersonalCredit personalCredit = creditMapper.fromPersonalCreditDTO(personalCreditDTO);
        personalCredit.setCustomer(customer);
        personalCredit.setRequestDate(new Date());
        personalCredit.setStatus(CreditStatus.PENDING); // Default status
        PersonalCredit savedPersonalCredit = personalCreditRepository.save(personalCredit);
        return creditMapper.fromPersonalCredit(savedPersonalCredit);
    }

    @Override
    public PersonalCreditDTO updatePersonalCredit(PersonalCreditDTO personalCreditDTO) throws CreditNotFoundException {
        log.info("Updating Personal Credit with id: {}", personalCreditDTO.getId());
        PersonalCredit existingCredit = personalCreditRepository.findById(personalCreditDTO.getId())
                .orElseThrow(() -> new CreditNotFoundException("Personal Credit not found with id: " + personalCreditDTO.getId()));

        // Update only allowed fields, e.g., amount, duration, reason, interestRate
        // Status changes should go through changeCreditStatus
        if (personalCreditDTO.getAmount() > 0) {
            existingCredit.setAmount(personalCreditDTO.getAmount());
        }
        if (personalCreditDTO.getDuration() > 0) {
            existingCredit.setDuration(personalCreditDTO.getDuration());
        }
        if (personalCreditDTO.getInterestRate() > 0) {
            existingCredit.setInterestRate(personalCreditDTO.getInterestRate());
        }
        if (personalCreditDTO.getReason() != null && !personalCreditDTO.getReason().isEmpty()) {
            existingCredit.setReason(personalCreditDTO.getReason());
        }
        // Customer cannot be changed for an existing credit in this basic implementation

        PersonalCredit updatedCredit = personalCreditRepository.save(existingCredit);
        return creditMapper.fromPersonalCredit(updatedCredit);
    }

    @Override
    public List<PersonalCreditDTO> listPersonalCredits() {
        return personalCreditRepository.findAll().stream()
                .map(creditMapper::fromPersonalCredit)
                .collect(Collectors.toList());
    }

    @Override
    public List<PersonalCreditDTO> findPersonalCreditsByReason(String reason) {
        return personalCreditRepository.findByReason(reason).stream()
                .map(creditMapper::fromPersonalCredit)
                .collect(Collectors.toList());
    }

    @Override
    public MortgageCreditDTO saveMortgageCredit(MortgageCreditDTO mortgageCreditDTO) throws CustomerNotFoundException {
        log.info("Saving new Mortgage Credit");
        Customer customer = customerRepository.findById(mortgageCreditDTO.getCustomerDTO().getId())
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));
        MortgageCredit mortgageCredit = creditMapper.fromMortgageCreditDTO(mortgageCreditDTO);
        mortgageCredit.setCustomer(customer);
        mortgageCredit.setRequestDate(new Date());
        mortgageCredit.setStatus(CreditStatus.PENDING);
        MortgageCredit savedMortgageCredit = mortgageCreditRepository.save(mortgageCredit);
        return creditMapper.fromMortgageCredit(savedMortgageCredit);
    }

    @Override
    public MortgageCreditDTO updateMortgageCredit(MortgageCreditDTO mortgageCreditDTO) throws CreditNotFoundException {
        log.info("Updating Mortgage Credit with id: {}", mortgageCreditDTO.getId());
        MortgageCredit existingCredit = mortgageCreditRepository.findById(mortgageCreditDTO.getId())
                .orElseThrow(() -> new CreditNotFoundException("Mortgage Credit not found with id: " + mortgageCreditDTO.getId()));

        if (mortgageCreditDTO.getAmount() > 0) {
            existingCredit.setAmount(mortgageCreditDTO.getAmount());
        }
        if (mortgageCreditDTO.getDuration() > 0) {
            existingCredit.setDuration(mortgageCreditDTO.getDuration());
        }
        if (mortgageCreditDTO.getInterestRate() > 0) {
            existingCredit.setInterestRate(mortgageCreditDTO.getInterestRate());
        }
        if (mortgageCreditDTO.getPropertyType() != null) {
            existingCredit.setPropertyType(mortgageCreditDTO.getPropertyType());
        }

        MortgageCredit updatedCredit = mortgageCreditRepository.save(existingCredit);
        return creditMapper.fromMortgageCredit(updatedCredit);
    }

    @Override
    public List<MortgageCreditDTO> listMortgageCredits() {
        return mortgageCreditRepository.findAll().stream()
                .map(creditMapper::fromMortgageCredit)
                .collect(Collectors.toList());
    }

    @Override
    public ProfessionalCreditDTO saveProfessionalCredit(ProfessionalCreditDTO professionalCreditDTO) throws CustomerNotFoundException {
        log.info("Saving new Professional Credit");
        Customer customer = customerRepository.findById(professionalCreditDTO.getCustomerDTO().getId())
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));
        ProfessionalCredit professionalCredit = creditMapper.fromProfessionalCreditDTO(professionalCreditDTO);
        professionalCredit.setCustomer(customer);
        professionalCredit.setRequestDate(new Date());
        professionalCredit.setStatus(CreditStatus.PENDING);
        ProfessionalCredit savedProfessionalCredit = professionalCreditRepository.save(professionalCredit);
        return creditMapper.fromProfessionalCredit(savedProfessionalCredit);
    }

    @Override
    public ProfessionalCreditDTO updateProfessionalCredit(ProfessionalCreditDTO professionalCreditDTO) throws CreditNotFoundException {
        log.info("Updating Professional Credit with id: {}", professionalCreditDTO.getId());
        ProfessionalCredit existingCredit = professionalCreditRepository.findById(professionalCreditDTO.getId())
                .orElseThrow(() -> new CreditNotFoundException("Professional Credit not found with id: " + professionalCreditDTO.getId()));

        if (professionalCreditDTO.getAmount() > 0) {
            existingCredit.setAmount(professionalCreditDTO.getAmount());
        }
        if (professionalCreditDTO.getDuration() > 0) {
            existingCredit.setDuration(professionalCreditDTO.getDuration());
        }
        if (professionalCreditDTO.getInterestRate() > 0) {
            existingCredit.setInterestRate(professionalCreditDTO.getInterestRate());
        }
        if (professionalCreditDTO.getReason() != null && !professionalCreditDTO.getReason().isEmpty()) {
            existingCredit.setReason(professionalCreditDTO.getReason());
        }
        if (professionalCreditDTO.getCompanyName() != null && !professionalCreditDTO.getCompanyName().isEmpty()) {
            existingCredit.setCompanyName(professionalCreditDTO.getCompanyName());
        }

        ProfessionalCredit updatedCredit = professionalCreditRepository.save(existingCredit);
        return creditMapper.fromProfessionalCredit(updatedCredit);
    }

    @Override
    public List<ProfessionalCreditDTO> listProfessionalCredits() {
        return professionalCreditRepository.findAll().stream()
                .map(creditMapper::fromProfessionalCredit)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProfessionalCreditDTO> findProfessionalCreditsByCompanyName(String companyName) {
        return professionalCreditRepository.findByCompanyNameContains(companyName).stream()
                .map(creditMapper::fromProfessionalCredit)
                .collect(Collectors.toList());
    }

    @Override
    public CreditDTO getCredit(Long creditId) throws CreditNotFoundException {
        Credit credit = creditRepository.findById(creditId)
                .orElseThrow(() -> new CreditNotFoundException("Credit not found with id: " + creditId));
        
        // Security check: Ensure client can only access their own credits.
        // This requires getting the authenticated user's customer ID.
        // Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // String currentPrincipalName = authentication.getName();
        // AppUser appUser = appUserRepository.findByUsername(currentPrincipalName);
        // Assuming a link between AppUser and Customer or a way to derive customerId from AppUser
        // Long authenticatedCustomerId = getCustomerIdForUser(appUser); 
        // if (authentication.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_EMPLOYE") || a.getAuthority().equals("ROLE_ADMIN")) && 
        //     !credit.getCustomer().getId().equals(authenticatedCustomerId)) {
        //     throw new AccessDeniedException("You are not authorized to view this credit.");
        // }

        if (credit instanceof PersonalCredit) {
            return creditMapper.fromPersonalCredit((PersonalCredit) credit);
        } else if (credit instanceof MortgageCredit) {
            return creditMapper.fromMortgageCredit((MortgageCredit) credit);
        } else if (credit instanceof ProfessionalCredit) {
            return creditMapper.fromProfessionalCredit((ProfessionalCredit) credit);
        }
        throw new CreditNotFoundException("Unknown credit type for id: " + creditId);
    }

    @Override
    public void deleteCredit(Long creditId) throws CreditNotFoundException {
        log.info("Deleting credit with id: {}", creditId);
        Credit credit = creditRepository.findById(creditId)
                .orElseThrow(() -> new CreditNotFoundException("Credit not found with id: " + creditId));
        // Add business logic here, e.g., cannot delete if repayments exist or status is approved.
        // For simplicity, direct deletion is implemented.
        creditRepository.delete(credit);
    }

    @Override
    public void changeCreditStatus(Long creditId, CreditStatus status) throws CreditNotFoundException {
        log.info("Changing status of credit {} to {}", creditId, status);
        Credit credit = creditRepository.findById(creditId)
                .orElseThrow(() -> new CreditNotFoundException("Credit not found with id: " + creditId));
        credit.setStatus(status);
        if (status == CreditStatus.APPROVED) {
            credit.setAcceptanceDate(new Date());
        } else {
            credit.setAcceptanceDate(null); // Reset if not approved or pending
        }
        creditRepository.save(credit);
    }

    @Override
    public List<CreditDTO> listCreditsByStatus(CreditStatus status) {
        return creditRepository.findByStatus(status).stream().map(credit -> {
            if (credit instanceof PersonalCredit) {
                return creditMapper.fromPersonalCredit((PersonalCredit) credit);
            } else if (credit instanceof MortgageCredit) {
                return creditMapper.fromMortgageCredit((MortgageCredit) credit);
            } else if (credit instanceof ProfessionalCredit) {
                return creditMapper.fromProfessionalCredit((ProfessionalCredit) credit);
            }
            return null;
        }).collect(Collectors.toList());
    }

    @Override
    public RepaymentDTO addRepayment(RepaymentDTO repaymentDTO) throws CreditNotFoundException {
        log.info("Adding repayment for credit id: {}", repaymentDTO.getCreditId());
        Credit credit = creditRepository.findById(repaymentDTO.getCreditId())
                .orElseThrow(() -> new CreditNotFoundException("Credit not found with id: " + repaymentDTO.getCreditId()));

        // Basic validation: cannot add repayment if credit is not approved
        if (credit.getStatus() != CreditStatus.APPROVED) {
            throw new IllegalStateException("Cannot add repayment to a credit that is not approved. Current status: " + credit.getStatus());
        }

        Repayment repayment = creditMapper.fromRepaymentDTO(repaymentDTO, credit);
        repayment.setRepaymentDate(new Date()); // Or use date from DTO if provided and validated

        // Business logic for repayment amount, e.g., check against remaining balance
        // For simplicity, this is omitted here.

        Repayment savedRepayment = repaymentRepository.save(repayment);
        return creditMapper.fromRepayment(savedRepayment);
    }

    @Override
    public List<RepaymentDTO> getCreditRepayments(Long creditId) {
        return repaymentRepository.findByCreditId(creditId).stream()
                .map(creditMapper::fromRepayment)
                .collect(Collectors.toList());
    }

    @Override
    public CreditHistoryDTO getCreditHistory(Long creditId, int page, int size) throws CreditNotFoundException {
        Credit credit = creditRepository.findById(creditId)
                .orElseThrow(() -> new CreditNotFoundException("Credit not found with id: " + creditId));

        // Security check: Similar to getCredit, ensure client can only access their own credit history.
        // Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // if (authentication.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_EMPLOYE") || a.getAuthority().equals("ROLE_ADMIN")) && 
        //     !credit.getCustomer().getId().equals(getAuthenticatedCustomerId())) { // Replace with actual method
        //     throw new AccessDeniedException("You are not authorized to view this credit history.");
        // }

        Page<Repayment> repaymentsPage = repaymentRepository.findByCreditIdOrderByRepaymentDateDesc(creditId, PageRequest.of(page, size));
        List<RepaymentDTO> repaymentDTOS = repaymentsPage.getContent().stream()
                .map(creditMapper::fromRepayment)
                .collect(Collectors.toList());

        CreditHistoryDTO creditHistoryDTO = new CreditHistoryDTO();
        creditHistoryDTO.setCreditId(creditId);
        creditHistoryDTO.setTotalAmount(credit.getAmount());

        double paidAmount = repaymentsPage.getContent().stream().mapToDouble(Repayment::getAmount).sum();
        // If you want the sum of ALL repayments, not just the current page:
        // double paidAmount = repaymentRepository.findByCreditId(creditId).stream().mapToDouble(Repayment::getAmount).sum();

        creditHistoryDTO.setPaidAmount(paidAmount);
        creditHistoryDTO.setRemainingAmount(credit.getAmount() - paidAmount);
        creditHistoryDTO.setCurrentPage(repaymentsPage.getNumber());
        creditHistoryDTO.setTotalPages(repaymentsPage.getTotalPages());
        creditHistoryDTO.setPageSize(repaymentsPage.getSize());
        creditHistoryDTO.setRepaymentDTOS(repaymentDTOS);

        return creditHistoryDTO;
    }
}
