import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { BankAccount } from '../../models/account.model';
import { CreditService } from '../../services/credit.service'; // Added
import { Credit, Repayment } from '../../models/credit.model'; // Added
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent implements OnInit {
  customerId: number = 0;
  customer: Customer | null = null;
  accounts: BankAccount[] = [];
  credits: Credit[] = []; // Added
  selectedCreditForRepayments: Credit | null = null; // Added
  repayments: Repayment[] = []; // Added
  isLoading: boolean = true;
  errorMessage: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private creditService: CreditService, // Added
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.customerId = +params['id'];
      this.loadCustomerDetails();
      this.loadCustomerAccounts();
      this.loadCustomerCredits(); // Added
    });
  }
  
  loadCustomerDetails(): void {
    this.isLoading = true;
    this.customerService.getCustomer(this.customerId).subscribe({
      next: (data) => {
        this.customer = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading customer details';
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  
  loadCustomerAccounts(): void {
    this.customerService.getCustomerAccounts(this.customerId).subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (err) => {
        this.errorMessage = 'Error loading customer accounts'; // Set error message
        console.error('Error loading customer accounts', err);
      }
    });
  }

  loadCustomerCredits(): void { // Added method
    this.creditService.getCustomerCredits(this.customerId).subscribe({
      next: (data) => {
        this.credits = data;
      },
      error: (err) => {
        this.errorMessage = 'Error loading customer credits';
        console.error('Error loading customer credits', err);
      }
    });
  }

  loadRepayments(creditId: number): void { // Added method
    this.selectedCreditForRepayments = this.credits.find(c => c.id === creditId) || null;
    if (this.selectedCreditForRepayments) {
      this.creditService.getCreditRepayments(creditId).subscribe({
        next: (data) => {
          this.repayments = data;
        },
        error: (err) => {
          this.errorMessage = `Error loading repayments for credit ${creditId}`;
          console.error('Error loading repayments', err);
        }
      });
    }
  }

  getCreditTypeLabel(type: string): string { // Added method
    if (type === 'PersonalCredit') return 'Personal Credit';
    if (type === 'MortgageCredit') return 'Mortgage Credit';
    if (type === 'ProfessionalCredit') return 'Professional Credit';
    return type;
  }

  getCreditStatusClass(status: string): string { // Added method
    switch (status) {
      case 'PENDING': return 'bg-warning text-dark';
      case 'APPROVED': return 'bg-success';
      case 'REJECTED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getAccountTypeLabel(type: string): string {
    return type === 'CurrentAccount' ? 'Current Account' : 'Saving Account';
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'CREATED': return 'bg-info';
      case 'ACTIVATED': return 'bg-success';
      case 'SUSPENDED': return 'bg-warning';
      case 'BLOCKED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}
