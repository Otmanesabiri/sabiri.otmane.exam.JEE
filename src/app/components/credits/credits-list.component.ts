import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { CreditService, Credit, StatutCredit } from '../../services/credit.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-credits-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    RouterLink
  ],
  template: `
    <div class="credits-container">
      <div class="header">
        <h1>Credits Management</h1>
        <button mat-raised-button color="primary" routerLink="/credits/new" *ngIf="!isEmployee">
          <mat-icon>add</mat-icon>
          New Credit Application
        </button>
      </div>

      <mat-card *ngIf="!loading; else loadingTemplate">
        <mat-card-header>
          <mat-card-title>Credit Applications</mat-card-title>
          <mat-card-subtitle>Manage and track credit applications</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="table-container" *ngIf="credits.length > 0; else noCredits">
            <table mat-table [dataSource]="credits" class="credits-table">
              
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let credit">#{{ credit.id }}</td>
              </ng-container>

              <!-- Type Column -->
              <ng-container matColumnDef="type">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let credit">
                  <mat-chip class="type-chip">{{ credit.typeCredit }}</mat-chip>
                </td>
              </ng-container>

              <!-- Amount Column -->
              <ng-container matColumnDef="montant">
                <th mat-header-cell *matHeaderCellDef>Amount</th>
                <td mat-cell *matCellDef="let credit">€{{ credit.montant | number:'1.2-2' }}</td>
              </ng-container>

              <!-- Duration Column -->
              <ng-container matColumnDef="duree">
                <th mat-header-cell *matHeaderCellDef>Duration</th>
                <td mat-cell *matCellDef="let credit">{{ credit.dureeRemboursement }} months</td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="statut">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let credit">
                  <mat-chip class="status-chip" [ngClass]="'status-' + credit.statut.toLowerCase()">
                    {{ getStatusLabel(credit.statut) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Date Column -->
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Application Date</th>
                <td mat-cell *matCellDef="let credit">{{ credit.dateDemande | date:'short' }}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let credit">
                  <button mat-icon-button [matMenuTriggerFor]="actionMenu" [matMenuTriggerData]="{credit: credit}">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  class="table-row" 
                  [routerLink]="['/credits', row.id]"></tr>
            </table>
          </div>

          <ng-template #noCredits>
            <div class="no-data">
              <mat-icon>credit_card_off</mat-icon>
              <h3>No credit applications found</h3>
              <p>Start by creating your first credit application</p>
              <button mat-raised-button color="primary" routerLink="/credits/new" *ngIf="!isEmployee">
                <mat-icon>add</mat-icon>
                Create Credit Application
              </button>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>

      <!-- Action Menu Template -->
      <mat-menu #actionMenu="matMenu">
        <ng-template matMenuContent let-credit="credit">
          <button mat-menu-item [routerLink]="['/credits', credit.id]">
            <mat-icon>visibility</mat-icon>
            View Details
          </button>
          <div *ngIf="isAdmin || isEmployee">
            <mat-divider></mat-divider>
            <button mat-menu-item 
                    (click)="acceptCredit(credit)" 
                    *ngIf="credit.statut === 'EN_COURS'"
                    class="accept-action">
              <mat-icon>check_circle</mat-icon>
              Accept
            </button>
            <button mat-menu-item 
                    (click)="rejectCredit(credit)" 
                    *ngIf="credit.statut === 'EN_COURS'"
                    class="reject-action">
              <mat-icon>cancel</mat-icon>
              Reject
            </button>
          </div>
        </ng-template>
      </mat-menu>

      <ng-template #loadingTemplate>
        <div class="loading-spinner">
          <mat-spinner></mat-spinner>
          <p>Loading credits...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .credits-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .table-container {
      overflow-x: auto;
    }

    .credits-table {
      width: 100%;
    }

    .table-row {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .table-row:hover {
      background-color: #f5f5f5;
    }

    .type-chip {
      background-color: #e3f2fd;
      color: #1976d2;
      font-weight: 500;
    }

    .status-chip {
      font-weight: 500;
      min-width: 80px;
      text-align: center;
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

    .no-data {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .no-data h3 {
      margin: 16px 0 8px 0;
      color: #333;
    }

    .no-data p {
      margin-bottom: 20px;
    }

    .accept-action {
      color: #4caf50;
    }

    .reject-action {
      color: #f44336;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .header button {
        width: 100%;
      }
    }
  `]
})
export class CreditsListComponent implements OnInit {
  credits: Credit[] = [];
  loading = true;
  displayedColumns: string[] = ['id', 'type', 'montant', 'duree', 'statut', 'date', 'actions'];

  constructor(
    private creditService: CreditService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCredits();
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

  acceptCredit(credit: Credit) {
    if (credit.id) {
      this.creditService.accepterCredit(credit.id).subscribe({
        next: (updatedCredit) => {
          const index = this.credits.findIndex(c => c.id === credit.id);
          if (index !== -1) {
            this.credits[index] = updatedCredit;
          }
          this.snackBar.open('Credit accepted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error accepting credit:', error);
          this.snackBar.open('Error accepting credit', 'Close', { duration: 3000 });
        }
      });
    }
  }

  rejectCredit(credit: Credit) {
    if (credit.id) {
      this.creditService.rejeterCredit(credit.id).subscribe({
        next: (updatedCredit) => {
          const index = this.credits.findIndex(c => c.id === credit.id);
          if (index !== -1) {
            this.credits[index] = updatedCredit;
          }
          this.snackBar.open('Credit rejected successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error rejecting credit:', error);
          this.snackBar.open('Error rejecting credit', 'Close', { duration: 3000 });
        }
      });
    }
  }

  private loadCredits() {
    this.loading = true;
    this.creditService.getAllCredits().subscribe({
      next: (credits) => {
        this.credits = credits;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading credits:', error);
        this.loading = false;
        this.snackBar.open('Error loading credits', 'Close', { duration: 3000 });
      }
    });
  }
}
