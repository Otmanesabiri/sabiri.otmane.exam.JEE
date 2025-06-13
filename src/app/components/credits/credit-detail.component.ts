import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { CreditService, Credit, StatutCredit } from '../../services/credit.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-credit-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="detail-container" *ngIf="!loading; else loadingTemplate">
      <div class="header">
        <button mat-icon-button (click)="goBack()" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Credit Application #{{ credit?.id }}</h1>
        <div class="actions" *ngIf="isAdmin || isEmployee">
          <button mat-raised-button color="primary" 
                  (click)="acceptCredit()" 
                  *ngIf="credit?.statut === 'EN_COURS'"
                  [disabled]="actionLoading">
            <mat-icon>check_circle</mat-icon>
            Accept
          </button>
          <button mat-raised-button color="warn" 
                  (click)="rejectCredit()" 
                  *ngIf="credit?.statut === 'EN_COURS'"
                  [disabled]="actionLoading">
            <mat-icon>cancel</mat-icon>
            Reject
          </button>
        </div>
      </div>

      <div class="content" *ngIf="credit">
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>Credit Information</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-grid">
              <div class="info-item">
                <strong>Type:</strong>
                <mat-chip class="type-chip">{{ credit.typeCredit }}</mat-chip>
              </div>
              
              <div class="info-item">
                <strong>Status:</strong>
                <mat-chip class="status-chip" [ngClass]="'status-' + credit.statut.toLowerCase()">
                  {{ getStatusLabel(credit.statut) }}
                </mat-chip>
              </div>
              
              <div class="info-item">
                <strong>Amount:</strong>
                <span class="amount">€{{ credit.montant | number:'1.2-2' }}</span>
              </div>
              
              <div class="info-item">
                <strong>Duration:</strong>
                <span>{{ credit.dureeRemboursement }} months</span>
              </div>
              
              <div class="info-item">
                <strong>Interest Rate:</strong>
                <span>{{ credit.tauxInteret }}%</span>
              </div>
              
              <div class="info-item">
                <strong>Monthly Payment:</strong>
                <span class="amount">€{{ monthlyPayment | number:'1.2-2' }}</span>
              </div>
              
              <div class="info-item">
                <strong>Application Date:</strong>
                <span>{{ credit.dateDemande | date:'fullDate' }}</span>
              </div>
              
              <div class="info-item" *ngIf="credit.dateAcceptation">
                <strong>Acceptance Date:</strong>
                <span>{{ credit.dateAcceptation | date:'fullDate' }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-header>
            <mat-card-title>Credit Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-item">
              <span>Total Amount to Repay:</span>
              <strong class="amount">€{{ totalAmount | number:'1.2-2' }}</strong>
            </div>
            <div class="summary-item">
              <span>Total Interest:</span>
              <strong class="interest">€{{ totalInterest | number:'1.2-2' }}</strong>
            </div>
            <mat-divider></mat-divider>
            <div class="summary-item highlight">
              <span>Monthly Payment:</span>
              <strong class="amount">€{{ monthlyPayment | number:'1.2-2' }}</strong>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <ng-template #loadingTemplate>
      <div class="loading-spinner">
        <mat-spinner></mat-spinner>
        <p>Loading credit details...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .detail-container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }

    .header h1 {
      flex: 1;
      margin: 0;
      color: #333;
    }

    .back-button {
      margin-right: 8px;
    }

    .actions {
      display: flex;
      gap: 12px;
    }

    .content {
      display: grid;
      gap: 20px;
    }

    .info-card {
      width: 100%;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item strong {
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }

    .amount {
      font-size: 18px;
      font-weight: 600;
      color: #1976d2;
    }

    .interest {
      font-size: 16px;
      font-weight: 600;
      color: #f57c00;
    }

    .type-chip {
      background-color: #e3f2fd;
      color: #1976d2;
      font-weight: 500;
      width: fit-content;
    }

    .status-chip {
      font-weight: 500;
      width: fit-content;
    }

    .status-en_cours {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .status-accepte {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .status-rejete {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .summary-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .summary-card .mat-mdc-card-title {
      color: white;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
    }

    .summary-item.highlight {
      font-size: 18px;
      padding-top: 16px;
    }

    .summary-item .amount {
      color: white;
    }

    .summary-item .interest {
      color: #ffeb3b;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: stretch;
      }

      .actions {
        order: -1;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CreditDetailComponent implements OnInit {
  credit: Credit | null = null;
  loading = true;
  actionLoading = false;
  monthlyPayment = 0;
  totalAmount = 0;
  totalInterest = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private creditService: CreditService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCreditDetail(+id);
    }
  }

  get isAdmin(): boolean {
    return this.authService.hasRole('ROLE_ADMIN');
  }

  get isEmployee(): boolean {
    return this.authService.hasRole('ROLE_EMPLOYE');
  }

  getStatusLabel(status: StatutCredit): string {
    switch (status) {
      case StatutCredit.EN_COURS:
        return 'Pending';
      case StatutCredit.ACCEPTE:
        return 'Accepted';
      case StatutCredit.REJETE:
        return 'Rejected';
      default:
        return status;
    }
  }

  goBack() {
    this.router.navigate(['/credits']);
  }

  acceptCredit() {
    if (this.credit?.id) {
      this.actionLoading = true;
      this.creditService.accepterCredit(this.credit.id).subscribe({
        next: (updatedCredit) => {
          this.credit = updatedCredit;
          this.actionLoading = false;
        },
        error: (error) => {
          console.error('Error accepting credit:', error);
          this.actionLoading = false;
        }
      });
    }
  }

  rejectCredit() {
    if (this.credit?.id) {
      this.actionLoading = true;
      this.creditService.rejeterCredit(this.credit.id).subscribe({
        next: (updatedCredit) => {
          this.credit = updatedCredit;
          this.actionLoading = false;
        },
        error: (error) => {
          console.error('Error rejecting credit:', error);
          this.actionLoading = false;
        }
      });
    }
  }

  private loadCreditDetail(id: number) {
    this.creditService.getCreditById(id).subscribe({
      next: (credit) => {
        this.credit = credit;
        this.calculatePayments();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading credit detail:', error);
        this.loading = false;
        this.router.navigate(['/credits']);
      }
    });
  }

  private calculatePayments() {
    if (this.credit) {
      const montant = this.credit.montant;
      const duree = this.credit.dureeRemboursement;
      const taux = this.credit.tauxInteret;

      const monthlyRate = (taux / 100) / 12;
      const numPayments = duree;
      
      if (monthlyRate > 0) {
        this.monthlyPayment = montant * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                              (Math.pow(1 + monthlyRate, numPayments) - 1);
      } else {
        this.monthlyPayment = montant / numPayments;
      }

      this.totalAmount = this.monthlyPayment * numPayments;
      this.totalInterest = this.totalAmount - montant;
    }
  }
}
