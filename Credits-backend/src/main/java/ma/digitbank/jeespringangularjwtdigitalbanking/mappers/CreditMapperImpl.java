package ma.digitbank.jeespringangularjwtdigitalbanking.mappers;

import ma.digitbank.jeespringangularjwtdigitalbanking.dtos.*;
import ma.digitbank.jeespringangularjwtdigitalbanking.entities.*;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class CreditMapperImpl {
    
    private final BankAccountMapperImpl bankAccountMapper;
    
    public CreditMapperImpl(BankAccountMapperImpl bankAccountMapper) {
        this.bankAccountMapper = bankAccountMapper;
    }
    
    public PersonalCreditDTO fromPersonalCredit(PersonalCredit personalCredit) {
        PersonalCreditDTO personalCreditDTO = new PersonalCreditDTO();
        BeanUtils.copyProperties(personalCredit, personalCreditDTO);
        personalCreditDTO.setType("PersonalCredit");
        personalCreditDTO.setCustomerDTO(bankAccountMapper.fromCustomer(personalCredit.getCustomer()));
        return personalCreditDTO;
    }
    
    public PersonalCredit fromPersonalCreditDTO(PersonalCreditDTO personalCreditDTO) {
        PersonalCredit personalCredit = new PersonalCredit();
        BeanUtils.copyProperties(personalCreditDTO, personalCredit);
        personalCredit.setCustomer(bankAccountMapper.fromCustomerDTO(personalCreditDTO.getCustomerDTO()));
        return personalCredit;
    }
    
    public MortgageCreditDTO fromMortgageCredit(MortgageCredit mortgageCredit) {
        MortgageCreditDTO mortgageCreditDTO = new MortgageCreditDTO();
        BeanUtils.copyProperties(mortgageCredit, mortgageCreditDTO);
        mortgageCreditDTO.setType("MortgageCredit");
        mortgageCreditDTO.setCustomerDTO(bankAccountMapper.fromCustomer(mortgageCredit.getCustomer()));
        return mortgageCreditDTO;
    }
    
    public MortgageCredit fromMortgageCreditDTO(MortgageCreditDTO mortgageCreditDTO) {
        MortgageCredit mortgageCredit = new MortgageCredit();
        BeanUtils.copyProperties(mortgageCreditDTO, mortgageCredit);
        mortgageCredit.setCustomer(bankAccountMapper.fromCustomerDTO(mortgageCreditDTO.getCustomerDTO()));
        return mortgageCredit;
    }
    
    public ProfessionalCreditDTO fromProfessionalCredit(ProfessionalCredit professionalCredit) {
        ProfessionalCreditDTO professionalCreditDTO = new ProfessionalCreditDTO();
        BeanUtils.copyProperties(professionalCredit, professionalCreditDTO);
        professionalCreditDTO.setType("ProfessionalCredit");
        professionalCreditDTO.setCustomerDTO(bankAccountMapper.fromCustomer(professionalCredit.getCustomer()));
        return professionalCreditDTO;
    }
    
    public ProfessionalCredit fromProfessionalCreditDTO(ProfessionalCreditDTO professionalCreditDTO) {
        ProfessionalCredit professionalCredit = new ProfessionalCredit();
        BeanUtils.copyProperties(professionalCreditDTO, professionalCredit);
        professionalCredit.setCustomer(bankAccountMapper.fromCustomerDTO(professionalCreditDTO.getCustomerDTO()));
        return professionalCredit;
    }
    
    public RepaymentDTO fromRepayment(Repayment repayment) {
        RepaymentDTO repaymentDTO = new RepaymentDTO();
        BeanUtils.copyProperties(repayment, repaymentDTO);
        repaymentDTO.setCreditId(repayment.getCredit().getId());
        repaymentDTO.setCreditType(repayment.getCredit().getClass().getSimpleName());
        return repaymentDTO;
    }
    
    public Repayment fromRepaymentDTO(RepaymentDTO repaymentDTO, Credit credit) {
        Repayment repayment = new Repayment();
        BeanUtils.copyProperties(repaymentDTO, repayment);
        repayment.setCredit(credit);
        return repayment;
    }
}
