import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CreditService } from '../../services/credit.service';
import {
  Credit,
  CreditStatus,
  PersonalCredit,
  MortgageCredit,
  ProfessionalCredit,
  Repayment,
  RepaymentType
} from '../../models/credit.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-credit-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './credit-details.component.html',
  styleUrls: ['./credit-details.component.css']
})
export class CreditDetailsComponent implements OnInit {
  creditId: number = 0;
  credit: Credit | null = null;
  repayments: Repayment[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  addingRepayment: boolean = false;
  newRepayment: Repayment = {
    id: 0,
    repaymentDate: new Date(),
    amount: 0,
    type: RepaymentType.MONTHLY_PAYMENT,
    creditId: 0,
    creditType: ''
  };
  repaymentSuccess: boolean = false;
  
  // Amortization schedule
  amortizationSchedule: any[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private creditService: CreditService,
    private router: Router,
    private modalService: NgbModal
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.creditId = +params['id'];
      this.loadCreditDetails();
    });
  }
  
  loadCreditDetails(): void {
    this.isLoading = true;
    this.creditService.getCredit(this.creditId).subscribe({
      next: (data) => {
        this.credit = data;
        this.loadRepayments();
        this.generateAmortizationSchedule();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading credit details';
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  
  loadRepayments(): void {
    if (!this.creditId) return;
    
    this.creditService.getCreditRepayments(this.creditId).subscribe({
      next: (data) => {
        this.repayments = data;
      },
      error: (err) => {
        console.error('Error loading repayments', err);
      }
    });
  }

  // Generate amortization schedule
  generateAmortizationSchedule(): void {
    if (!this.credit) return;
    
    const principal = this.credit.amount;
    const rate = this.credit.interestRate / 12; // Monthly rate
    const months = this.credit.duration;
    
    // PMT formula: PMT = P * (r * (1+r)^n) / ((1+r)^n - 1)
    const monthlyPayment = principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
    
    let balance = principal;
    const schedule = [];
    
    for (let month = 1; month <= months; month++) {
      const interestPayment = balance * rate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      
      schedule.push({
        month,
        paymentDate: this.addMonths(this.credit.acceptanceDate || this.credit.requestDate, month),
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance > 0 ? balance : 0
      });
    }
    
    this.amortizationSchedule = schedule;
  }
  
  addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }
  
  startAddRepayment(): void {
    this.addingRepayment = true;
    this.newRepayment = {
      id: 0,
      repaymentDate: new Date(),
      amount: this.getMonthlyPaymentAmount(),
      type: RepaymentType.MONTHLY_PAYMENT,
      creditId: this.creditId,
      creditType: this.credit?.type || ''
    };
  }
  
  cancelAddRepayment(): void {
    this.addingRepayment = false;
  }
  
  getMonthlyPaymentAmount(): number {
    if (!this.credit) return 0;
    
    const principal = this.credit.amount;
    const rate = this.credit.interestRate / 12; // Monthly rate
    const months = this.credit.duration;
    
    // PMT formula: PMT = P * (r * (1+r)^n) / ((1+r)^n - 1)
    return principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
  }
  
  submitRepayment(): void {
    if (!this.credit) return;
    
    this.isLoading = true;
    this.creditService.addRepayment(this.creditId, this.newRepayment).subscribe({
      next: (data) => {
        this.repayments.push(data);
        this.isLoading = false;
        this.addingRepayment = false;
        this.repaymentSuccess = true;
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.repaymentSuccess = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Error adding repayment', err);
        this.isLoading = false;
      }
    });
  }
  
  // Helpers for display
  getStatusBadgeClass(status: CreditStatus): string {
    switch (status) {
      case CreditStatus.PENDING:
        return 'bg-warning text-dark';
      case CreditStatus.APPROVED:
        return 'bg-success';
      case CreditStatus.REJECTED:
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getCreditTypeLabel(): string {
    if (!this.credit) return '';
    
    switch (this.credit.type) {
      case 'PERSONAL':
        return 'Personal Credit';
      case 'MORTGAGE':
        return 'Mortgage Credit';
      case 'PROFESSIONAL':
        return 'Professional Credit';
      default:
        return this.credit.type;
    }
  }
  
  getTotalPaidAmount(): number {
    return this.repayments.reduce((sum, repayment) => sum + repayment.amount, 0);
  }
  
  getRemainingAmount(): number {
    if (!this.credit) return 0;
    return this.credit.amount - this.getTotalPaidAmount();
  }
  
  getCompletionPercentage(): number {
    if (!this.credit) return 0;
    return (this.getTotalPaidAmount() / this.credit.amount) * 100;
  }

  openAmortizationTable(content: any): void {
    this.modalService.open(content, { size: 'xl', scrollable: true });
  }
  
  isPersonalCredit(credit: Credit | null): credit is PersonalCredit {
    return !!credit && credit.type === 'PERSONAL';
  }
  isMortgageCredit(credit: Credit | null): credit is MortgageCredit {
    return !!credit && credit.type === 'MORTGAGE';
  }
  isProfessionalCredit(credit: Credit | null): credit is ProfessionalCredit {
    return !!credit && credit.type === 'PROFESSIONAL';
  }
}
