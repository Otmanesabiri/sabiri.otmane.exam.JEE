import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { CreditService, CreditPersonnel } from '../../services/credit.service';
import { ClientService, Client } from '../../services/client.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-credit-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatStepperModule
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>add_circle</mat-icon>
            New Credit Application
          </mat-card-title>
          <mat-card-subtitle>Fill out the form to apply for a new credit</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <mat-stepper [linear]="true" #stepper>
            <!-- Step 1: Basic Information -->
            <mat-step [stepControl]="basicInfoForm" label="Basic Information">
              <form [formGroup]="basicInfoForm">
                <div class="form-row">
                  <mat-form-field>
                    <mat-label>Credit Type</mat-label>
                    <mat-select formControlName="typeCredit" required>
                      <mat-option value="PERSONNEL">Personal Credit</mat-option>
                      <mat-option value="IMMOBILIER">Real Estate Credit</mat-option>
                      <mat-option value="PROFESSIONNEL">Professional Credit</mat-option>
                    </mat-select>
                    <mat-error *ngIf="basicInfoForm.get('typeCredit')?.hasError('required')">
                      Credit type is required
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field *ngIf="isAdmin || isEmployee">
                    <mat-label>Client</mat-label>
                    <mat-select formControlName="clientId" required>
                      <mat-option *ngFor="let client of clients" [value]="client.id">
                        {{ client.nom }} ({{ client.email }})
                      </mat-option>
                    </mat-select>
                    <mat-error *ngIf="basicInfoForm.get('clientId')?.hasError('required')">
                      Client selection is required
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field>
                    <mat-label>Amount (€)</mat-label>
                    <input matInput type="number" formControlName="montant" required min="1000" max="1000000">
                    <mat-error *ngIf="basicInfoForm.get('montant')?.hasError('required')">
                      Amount is required
                    </mat-error>
                    <mat-error *ngIf="basicInfoForm.get('montant')?.hasError('min')">
                      Minimum amount is €1,000
                    </mat-error>
                    <mat-error *ngIf="basicInfoForm.get('montant')?.hasError('max')">
                      Maximum amount is €1,000,000
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field>
                    <mat-label>Duration (months)</mat-label>
                    <mat-select formControlName="dureeRemboursement" required>
                      <mat-option value="12">12 months</mat-option>
                      <mat-option value="24">24 months</mat-option>
                      <mat-option value="36">36 months</mat-option>
                      <mat-option value="48">48 months</mat-option>
                      <mat-option value="60">60 months</mat-option>
                      <mat-option value="84">84 months (7 years)</mat-option>
                      <mat-option value="120">120 months (10 years)</mat-option>
                      <mat-option value="180">180 months (15 years)</mat-option>
                      <mat-option value="240">240 months (20 years)</mat-option>
                      <mat-option value="300">300 months (25 years)</mat-option>
                    </mat-select>
                    <mat-error *ngIf="basicInfoForm.get('dureeRemboursement')?.hasError('required')">
                      Duration is required
                    </mat-error>
                  </mat-form-field>
                </div>

                <mat-form-field>
                  <mat-label>Interest Rate (%)</mat-label>
                  <input matInput type="number" formControlName="tauxInteret" required min="0.1" max="25" step="0.1">
                  <mat-error *ngIf="basicInfoForm.get('tauxInteret')?.hasError('required')">
                    Interest rate is required
                  </mat-error>
                  <mat-error *ngIf="basicInfoForm.get('tauxInteret')?.hasError('min')">
                    Minimum interest rate is 0.1%
                  </mat-error>
                  <mat-error *ngIf="basicInfoForm.get('tauxInteret')?.hasError('max')">
                    Maximum interest rate is 25%
                  </mat-error>
                </mat-form-field>

                <div class="step-actions">
                  <button mat-raised-button color="primary" matStepperNext [disabled]="!basicInfoForm.valid">
                    Next
                  </button>
                </div>
              </form>
            </mat-step>

            <!-- Step 2: Specific Information -->
            <mat-step [stepControl]="specificInfoForm" label="Specific Information">
              <form [formGroup]="specificInfoForm">
                <!-- Personal Credit Fields -->
                <div *ngIf="selectedCreditType === 'PERSONNEL'">
                  <mat-form-field>
                    <mat-label>Purpose/Reason</mat-label>
                    <textarea matInput formControlName="motif" rows="3" required
                              placeholder="Please describe the purpose of this personal credit"></textarea>
                    <mat-error *ngIf="specificInfoForm.get('motif')?.hasError('required')">
                      Purpose is required for personal credit
                    </mat-error>
                  </mat-form-field>
                </div>

                <!-- Real Estate Credit Fields -->
                <div *ngIf="selectedCreditType === 'IMMOBILIER'">
                  <mat-form-field>
                    <mat-label>Property Type</mat-label>
                    <mat-select formControlName="typeBien" required>
                      <mat-option value="APPARTEMENT">Apartment</mat-option>
                      <mat-option value="MAISON">House</mat-option>
                      <mat-option value="LOCAL_COMMERCIAL">Commercial Property</mat-option>
                    </mat-select>
                    <mat-error *ngIf="specificInfoForm.get('typeBien')?.hasError('required')">
                      Property type is required
                    </mat-error>
                  </mat-form-field>
                </div>

                <!-- Professional Credit Fields -->
                <div *ngIf="selectedCreditType === 'PROFESSIONNEL'">
                  <mat-form-field>
                    <mat-label>Business Name</mat-label>
                    <input matInput formControlName="raisonSociale" required>
                    <mat-error *ngIf="specificInfoForm.get('raisonSociale')?.hasError('required')">
                      Business name is required
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field>
                    <mat-label>Purpose/Reason</mat-label>
                    <textarea matInput formControlName="motif" rows="3" required
                              placeholder="Please describe the purpose of this professional credit"></textarea>
                    <mat-error *ngIf="specificInfoForm.get('motif')?.hasError('required')">
                      Purpose is required for professional credit
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="step-actions">
                  <button mat-button matStepperPrevious>Back</button>
                  <button mat-raised-button color="primary" matStepperNext [disabled]="!specificInfoForm.valid">
                    Next
                  </button>
                </div>
              </form>
            </mat-step>

            <!-- Step 3: Review and Submit -->
            <mat-step label="Review & Submit">
              <div class="review-section">
                <h3>Review Your Application</h3>
                
                <div class="review-item">
                  <strong>Credit Type:</strong> {{ selectedCreditType }}
                </div>
                
                <div class="review-item">
                  <strong>Amount:</strong> €{{ basicInfoForm.get('montant')?.value | number:'1.2-2' }}
                </div>
                
                <div class="review-item">
                  <strong>Duration:</strong> {{ basicInfoForm.get('dureeRemboursement')?.value }} months
                </div>
                
                <div class="review-item">
                  <strong>Interest Rate:</strong> {{ basicInfoForm.get('tauxInteret')?.value }}%
                </div>

                <div class="monthly-payment" *ngIf="monthlyPayment > 0">
                  <mat-icon>info</mat-icon>
                  <strong>Estimated Monthly Payment: €{{ monthlyPayment | number:'1.2-2' }}</strong>
                </div>

                <div class="error-message" *ngIf="submitError">
                  {{ submitError }}
                </div>

                <div class="step-actions">
                  <button mat-button matStepperPrevious>Back</button>
                  <button mat-raised-button color="primary" (click)="submitApplication()" [disabled]="loading">
                    <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
                    <span *ngIf="!loading">Submit Application</span>
                  </button>
                </div>
              </div>
            </mat-step>
          </mat-stepper>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .step-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }

    .review-section {
      padding: 20px 0;
    }

    .review-item {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .monthly-payment {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 20px 0;
      padding: 16px;
      background-color: #e3f2fd;
      border-radius: 4px;
      color: #1976d2;
    }

    .error-message {
      color: #f44336;
      margin: 16px 0;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .step-actions {
        flex-direction: column;
      }
    }
  `]
})
export class CreditFormComponent implements OnInit {
  basicInfoForm: FormGroup;
  specificInfoForm: FormGroup;
  clients: Client[] = [];
  loading = false;
  submitError = '';
  monthlyPayment = 0;

  constructor(
    private fb: FormBuilder,
    private creditService: CreditService,
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router
  ) {
    this.basicInfoForm = this.fb.group({
      typeCredit: ['', Validators.required],
      clientId: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(1000), Validators.max(1000000)]],
      dureeRemboursement: ['', Validators.required],
      tauxInteret: ['', [Validators.required, Validators.min(0.1), Validators.max(25)]]
    });

    this.specificInfoForm = this.fb.group({
      motif: [''],
      typeBien: [''],
      raisonSociale: ['']
    });

    // Set current user as client if not admin/employee
    if (!this.isAdmin && !this.isEmployee) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.basicInfoForm.patchValue({ clientId: currentUser.id });
      }
    }
  }

  ngOnInit() {
    if (this.isAdmin || this.isEmployee) {
      this.loadClients();
    }

    // Watch for changes to calculate monthly payment
    this.basicInfoForm.valueChanges.subscribe(() => {
      this.calculateMonthlyPayment();
      this.updateSpecificFormValidation();
    });
  }

  get isAdmin(): boolean {
    return this.authService.hasRole('ROLE_ADMIN');
  }

  get isEmployee(): boolean {
    return this.authService.hasRole('ROLE_EMPLOYE');
  }

  get selectedCreditType(): string {
    return this.basicInfoForm.get('typeCredit')?.value || '';
  }

  private loadClients() {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
      }
    });
  }

  private updateSpecificFormValidation() {
    const creditType = this.selectedCreditType;
    
    // Reset all validators
    this.specificInfoForm.get('motif')?.clearValidators();
    this.specificInfoForm.get('typeBien')?.clearValidators();
    this.specificInfoForm.get('raisonSociale')?.clearValidators();

    // Add validators based on credit type
    if (creditType === 'PERSONNEL') {
      this.specificInfoForm.get('motif')?.setValidators([Validators.required]);
    } else if (creditType === 'IMMOBILIER') {
      this.specificInfoForm.get('typeBien')?.setValidators([Validators.required]);
    } else if (creditType === 'PROFESSIONNEL') {
      this.specificInfoForm.get('motif')?.setValidators([Validators.required]);
      this.specificInfoForm.get('raisonSociale')?.setValidators([Validators.required]);
    }

    // Update form validation
    this.specificInfoForm.updateValueAndValidity();
  }

  private calculateMonthlyPayment() {
    const montant = this.basicInfoForm.get('montant')?.value;
    const duree = this.basicInfoForm.get('dureeRemboursement')?.value;
    const taux = this.basicInfoForm.get('tauxInteret')?.value;

    if (montant && duree && taux) {
      const monthlyRate = (taux / 100) / 12;
      const numPayments = parseInt(duree);
      
      if (monthlyRate > 0) {
        this.monthlyPayment = montant * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                              (Math.pow(1 + monthlyRate, numPayments) - 1);
      } else {
        this.monthlyPayment = montant / numPayments;
      }
    } else {
      this.monthlyPayment = 0;
    }
  }

  submitApplication() {
    if (this.basicInfoForm.valid && this.specificInfoForm.valid) {
      this.loading = true;
      this.submitError = '';

      const creditData = {
        ...this.basicInfoForm.value,
        ...this.specificInfoForm.value
      };

      // Use specific service method for personal credit
      if (creditData.typeCredit === 'PERSONNEL') {
        this.creditService.createCreditPersonnel(creditData as CreditPersonnel).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/credits']);
          },
          error: (error) => {
            this.loading = false;
            this.submitError = 'Error submitting application. Please try again.';
            console.error('Error submitting credit application:', error);
          }
        });
      } else {
        this.creditService.createCredit(creditData).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/credits']);
          },
          error: (error) => {
            this.loading = false;
            this.submitError = 'Error submitting application. Please try again.';
            console.error('Error submitting credit application:', error);
          }
        });
      }
    }
  }
}
