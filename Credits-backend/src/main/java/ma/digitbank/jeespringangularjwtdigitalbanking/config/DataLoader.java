package ma.digitbank.jeespringangularjwtdigitalbanking.config;

import lombok.RequiredArgsConstructor;
import ma.digitbank.jeespringangularjwtdigitalbanking.dtos.*;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.AccountStatus;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.OperationType;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.CreditStatus;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.PropertyType;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.RepaymentType;
import ma.digitbank.jeespringangularjwtdigitalbanking.services.BankAccountService;
import ma.digitbank.jeespringangularjwtdigitalbanking.services.CreditService;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.service.SecurityService;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.CustomerNotFoundException;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.CreditNotFoundException;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;
import java.util.UUID;
import java.util.stream.Stream;

@Configuration
@RequiredArgsConstructor
public class DataLoader {

    private final BankAccountService bankAccountService;
    private final CreditService creditService; // Added
    private final SecurityService securityService; // Added
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            System.out.println("Seeding database with sample data...");
            
            // Setup Roles
            securityService.saveNewRole("ROLE_CLIENT");
            securityService.saveNewRole("ROLE_EMPLOYE");
            securityService.saveNewRole("ROLE_ADMIN");

            // Setup Users
            securityService.saveNewUser("admin", "password123", "password123");
            securityService.addRoleToUser("admin", "ROLE_ADMIN");
            securityService.addRoleToUser("admin", "ROLE_EMPLOYE"); // Admin can also be an employee

            securityService.saveNewUser("employee1", "password123", "password123");
            securityService.addRoleToUser("employee1", "ROLE_EMPLOYE");

            // Create Customers and associate users
            CustomerDTO customer1 = bankAccountService.saveCustomer(createCustomerDTO("Otmane Sabiri", "otmane.sabiri@example.com", "0611223344"));
            securityService.saveNewUser("client_otmane", "password123", "password123");
            securityService.addRoleToUser("client_otmane", "ROLE_CLIENT");
            // In a real app, you'd link AppUser to Customer entity, here we assume client_otmane maps to customer1 by convention for testing

            CustomerDTO customer2 = bankAccountService.saveCustomer(createCustomerDTO("Salma Bennani", "salma.bennani@example.com", "0655443322"));
            securityService.saveNewUser("client_salma", "password123", "password123");
            securityService.addRoleToUser("client_salma", "ROLE_CLIENT");


            // Existing bank account loading logic (simplified)
            Stream.of(customer1, customer2).forEach(customer -> {
                try {
                    bankAccountService.saveCurrentBankAccount(Math.random() * 90000, 9000, customer.getId(), "MAD");
                    bankAccountService.saveSavingBankAccount(Math.random() * 120000, 5.5, customer.getId(), "MAD");
                } catch (CustomerNotFoundException e) {
                    e.printStackTrace();
                }
            });

            // Load Credits
            loadCredits(customer1, customer2);
            
            System.out.println("Database seeding complete!");
        };
    }

    private CustomerDTO createCustomerDTO(String name, String email, String phone) {
        CustomerDTO customerDTO = new CustomerDTO();
        customerDTO.setName(name);
        customerDTO.setEmail(email);
        customerDTO.setPhone(phone);
        return customerDTO;
    }

    private void loadCredits(CustomerDTO customer1, CustomerDTO customer2) throws CustomerNotFoundException, CreditNotFoundException {
        // Personal Credit for Customer 1
        PersonalCreditDTO personalCredit1 = new PersonalCreditDTO();
        personalCredit1.setCustomerDTO(customer1);
        personalCredit1.setAmount(15000);
        personalCredit1.setDuration(24); // months
        personalCredit1.setInterestRate(0.05); // 5%
        personalCredit1.setReason("Car Purchase");
        personalCredit1.setRequestDate(new Date());
        personalCredit1.setStatus(CreditStatus.PENDING);
        PersonalCreditDTO savedPersonalCredit1 = creditService.savePersonalCredit(personalCredit1);
        creditService.changeCreditStatus(savedPersonalCredit1.getId(), CreditStatus.APPROVED); // Approve it for repayments

        // Add repayments for PersonalCredit1
        RepaymentDTO repaymentP1_1 = new RepaymentDTO();
        repaymentP1_1.setCreditId(savedPersonalCredit1.getId());
        repaymentP1_1.setAmount(650);
        repaymentP1_1.setType(RepaymentType.MONTHLY_PAYMENT);
        repaymentP1_1.setRepaymentDate(new Date());
        creditService.addRepayment(repaymentP1_1);

        // Mortgage Credit for Customer 2
        MortgageCreditDTO mortgageCredit1 = new MortgageCreditDTO();
        mortgageCredit1.setCustomerDTO(customer2);
        mortgageCredit1.setAmount(800000);
        mortgageCredit1.setDuration(180); // 15 years
        mortgageCredit1.setInterestRate(0.035); // 3.5%
        mortgageCredit1.setPropertyType(PropertyType.APARTMENT);
        mortgageCredit1.setRequestDate(new Date());
        mortgageCredit1.setStatus(CreditStatus.PENDING);
        MortgageCreditDTO savedMortgageCredit1 = creditService.saveMortgageCredit(mortgageCredit1);
        // Leave this one as PENDING or REJECTED for variety
        creditService.changeCreditStatus(savedMortgageCredit1.getId(), CreditStatus.REJECTED);


        // Professional Credit for Customer 1 (assuming they might have a business)
        ProfessionalCreditDTO professionalCredit1 = new ProfessionalCreditDTO();
        professionalCredit1.setCustomerDTO(customer1);
        professionalCredit1.setAmount(250000);
        professionalCredit1.setDuration(60); // 5 years
        professionalCredit1.setInterestRate(0.04); // 4%
        professionalCredit1.setReason("Business Expansion");
        professionalCredit1.setCompanyName("Sabiri Consulting SARL");
        professionalCredit1.setRequestDate(new Date());
        professionalCredit1.setStatus(CreditStatus.PENDING);
        ProfessionalCreditDTO savedProfessionalCredit1 = creditService.saveProfessionalCredit(professionalCredit1);
        creditService.changeCreditStatus(savedProfessionalCredit1.getId(), CreditStatus.APPROVED);

        RepaymentDTO repaymentProf1_1 = new RepaymentDTO();
        repaymentProf1_1.setCreditId(savedProfessionalCredit1.getId());
        repaymentProf1_1.setAmount(4500);
        repaymentProf1_1.setType(RepaymentType.MONTHLY_PAYMENT);
        repaymentProf1_1.setRepaymentDate(new Date());
        creditService.addRepayment(repaymentProf1_1);

        System.out.println("******************************************************");
        System.out.println("* Credit and Repayment Data Loaded Successfully!     *");
        System.out.println("******************************************************");
    }
}
