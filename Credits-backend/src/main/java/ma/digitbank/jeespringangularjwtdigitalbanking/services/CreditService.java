package ma.digitbank.jeespringangularjwtdigitalbanking.services;

import ma.digitbank.jeespringangularjwtdigitalbanking.dtos.*;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.CreditStatus;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.CreditNotFoundException;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.CustomerNotFoundException;

import java.util.List;

public interface CreditService {
    // Customer related operations
    List<CreditDTO> getCustomerCredits(Long customerId);
    List<CreditDTO> getCustomerCreditsByStatus(Long customerId, CreditStatus status);
    
    // Personal Credit operations
    PersonalCreditDTO savePersonalCredit(PersonalCreditDTO personalCreditDTO) throws CustomerNotFoundException;
    PersonalCreditDTO updatePersonalCredit(PersonalCreditDTO personalCreditDTO) throws CreditNotFoundException;
    List<PersonalCreditDTO> listPersonalCredits();
    List<PersonalCreditDTO> findPersonalCreditsByReason(String reason);
    
    // Mortgage Credit operations
    MortgageCreditDTO saveMortgageCredit(MortgageCreditDTO mortgageCreditDTO) throws CustomerNotFoundException;
    MortgageCreditDTO updateMortgageCredit(MortgageCreditDTO mortgageCreditDTO) throws CreditNotFoundException;
    List<MortgageCreditDTO> listMortgageCredits();
    
    // Professional Credit operations
    ProfessionalCreditDTO saveProfessionalCredit(ProfessionalCreditDTO professionalCreditDTO) throws CustomerNotFoundException;
    ProfessionalCreditDTO updateProfessionalCredit(ProfessionalCreditDTO professionalCreditDTO) throws CreditNotFoundException;
    List<ProfessionalCreditDTO> listProfessionalCredits();
    List<ProfessionalCreditDTO> findProfessionalCreditsByCompanyName(String companyName);
    
    // General Credit operations
    CreditDTO getCredit(Long creditId) throws CreditNotFoundException;
    void deleteCredit(Long creditId) throws CreditNotFoundException;
    void changeCreditStatus(Long creditId, CreditStatus status) throws CreditNotFoundException;
    List<CreditDTO> listCreditsByStatus(CreditStatus status);
    
    // Repayment operations
    RepaymentDTO addRepayment(RepaymentDTO repaymentDTO) throws CreditNotFoundException;
    List<RepaymentDTO> getCreditRepayments(Long creditId);
    CreditHistoryDTO getCreditHistory(Long creditId, int page, int size) throws CreditNotFoundException;
}
