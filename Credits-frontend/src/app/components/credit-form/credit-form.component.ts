import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CreditService } from '../../services/credit.service';
import { CustomerService } from '../../services/customer.service';
import { Credit, CreditStatus, PersonalCredit, MortgageCredit, ProfessionalCredit, PropertyType } from '../../models/credit.model';
import { Customer } from '../../models/customer.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-credit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './credit-form.component.html',
  styleUrls: ['./credit-form.component.css']
})
export class CreditFormComponent implements OnInit {
  creditForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitted = false;
  creditType: string = 'personal'; // Default type
  customerId: number | null = null;
  customers: Customer[] = [];
  propertyTypes = Object.values(PropertyType);
  
  constructor(
    private formBuilder: FormBuilder,
    private creditService: CreditService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['customerId']) {
        this.customerId = +params['customerId'];
      }
      
      if (params['type']) {
        this.creditType = params['type'].toLowerCase();
      }
      
      this.initForm();
      this.loadCustomers();
    });
  }
  
  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        
        // If customerId is provided, select that customer
        if (this.customerId) {
          this.creditForm.get('customerDTO')?.patchValue({ id: this.customerId });
        }
      },
      error: (err) => {
        console.error('Error loading customers', err);
        this.errorMessage = 'Could not load customers. Please try again later.';
      }
    });
  }

  initForm(): void {
    // Common fields for all credit types
    const commonFields = {
      customerDTO: [this.customerId ? { id: this.customerId } : '', Validators.required],
      amount: ['', [Validators.required, Validators.min(1000)]],
      duration: ['', [Validators.required, Validators.min(6), Validators.max(360)]],
      interestRate: [0.05, [Validators.required, Validators.min(0.01), Validators.max(0.2)]],
    };
    
    // Additional fields based on credit type
    switch(this.creditType) {
      case 'personal':
        this.creditForm = this.formBuilder.group({
          ...commonFields,
          reason: ['', [Validators.required, Validators.minLength(3)]]
        });
        break;
        
      case 'mortgage':
        this.creditForm = this.formBuilder.group({
          ...commonFields,
          propertyType: [PropertyType.APARTMENT, Validators.required]
        });
        break;
        
      case 'professional':
        this.creditForm = this.formBuilder.group({
          ...commonFields,
          reason: ['', [Validators.required, Validators.minLength(3)]],
          companyName: ['', [Validators.required, Validators.minLength(2)]]
        });
        break;
        
      default:
        // Default to personal credit
        this.creditForm = this.formBuilder.group({
          ...commonFields,
          reason: ['', [Validators.required, Validators.minLength(3)]]
        });
    }
  }

  onCreditTypeChange(event: any): void {
    this.creditType = event.target.value;
    this.initForm();
  }

  onSubmit(): void {
    this.isSubmitted = true;
    
    if (this.creditForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    
    // Prepare the credit object based on type
    const formValue = this.creditForm.value;
    const credit: any = {
      ...formValue,
      requestDate: new Date(),
      status: CreditStatus.PENDING,
    };
    
    // Call the appropriate service method based on credit type
    let saveOperation: Observable<Credit | PersonalCredit | MortgageCredit | ProfessionalCredit>;
    
    switch(this.creditType) {
      case 'personal':
        saveOperation = this.creditService.savePersonalCredit(credit as PersonalCredit);
        break;
      case 'mortgage':
        saveOperation = this.creditService.saveMortgageCredit(credit as MortgageCredit);
        break;
      case 'professional':
        saveOperation = this.creditService.saveProfessionalCredit(credit as ProfessionalCredit);
        break;
      default:
        saveOperation = this.creditService.savePersonalCredit(credit as PersonalCredit);
    }
    
    saveOperation.subscribe({
      next: (result: any) => {
        this.isLoading = false;
        this.successMessage = 'Credit application submitted successfully!';
        setTimeout(() => {
          if (this.customerId) {
            this.router.navigate(['/customers', this.customerId]);
          } else {
            this.router.navigate(['/credits']);
          }
        }, 1500);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to submit credit application. Please try again.';
        console.error('Error submitting credit application', err);
      }
    });
  }

  // Helper method to get better form control error messages
  getErrorMessage(controlName: string): string {
    const control = this.creditForm.get(controlName);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }
    
    if (control.errors['required']) {
      return 'This field is required';
    }
    
    if (control.errors['min']) {
      return `Value must be at least ${control.errors['min'].min}`;
    }
    
    if (control.errors['max']) {
      return `Value must be at most ${control.errors['max'].max}`;
    }
    
    if (control.errors['minlength']) {
      return `Must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    
    return 'Invalid value';
  }
}
