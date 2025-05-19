import { Customer } from "./customer.model";

export enum CreditStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export enum PropertyType {
    APARTMENT = 'APARTMENT',
    HOUSE = 'HOUSE',
    COMMERCIAL_PREMISES = 'COMMERCIAL_PREMISES'
}

export enum RepaymentType {
    MONTHLY_PAYMENT = 'MONTHLY_PAYMENT',
    EARLY_REPAYMENT = 'EARLY_REPAYMENT'
}

export interface Credit {
    id: number;
    requestDate: Date;
    status: CreditStatus;
    acceptanceDate?: Date;
    amount: number;
    duration: number; // in months
    interestRate: number;
    customerDTO: Customer; // Assuming CustomerDTO is mapped to Customer model on frontend
    type: string; // To distinguish between PersonalCredit, MortgageCredit, ProfessionalCredit
}

export interface PersonalCredit extends Credit {
    reason: string;
}

export interface MortgageCredit extends Credit {
    propertyType: PropertyType;
}

export interface ProfessionalCredit extends Credit {
    reason: string;
    companyName: string;
}

export interface Repayment {
    id: number;
    repaymentDate: Date;
    amount: number;
    type: RepaymentType;
    creditId: number;
    creditType: string; // To know which type of credit it belongs to, matches backend DTO
}

export interface CreditHistory {
    creditId: number;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    repaymentDTOS: Repayment[];
}
