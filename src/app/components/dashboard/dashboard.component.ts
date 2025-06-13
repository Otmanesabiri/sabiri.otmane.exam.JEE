import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CreditService, Credit } from '../../services/credit.service';
import { ClientService, Client } from '../../services/client.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <p class="welcome-message">Welcome back, {{ currentUser?.username }}!</p>

      <div class="stats-grid" *ngIf="!loading; else loadingTemplate">
        <!-- Credit Statistics -->
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="credit-icon">credit_card</mat-icon>
            <mat-card-title>Credits</mat-card-title>
            <mat-card-subtitle>Total credits in system</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ credits.length }}</div>
            <div class="stat-breakdown">
              <div class="stat-item">
                <span class="status-chip status-en-cours">En Cours: {{ getCreditsCountByStatus('EN_COURS') }}</span>
              </div>
              <div class="stat-item">
                <span class="status-chip status-accepte">Accepté: {{ getCreditsCountByStatus('ACCEPTE') }}</span>
              </div>
              <div class="stat-item">
                <span class="status-chip status-rejete">Rejeté: {{ getCreditsCountByStatus('REJETE') }}</span>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/credits">
              <mat-icon>visibility</mat-icon>
              View All Credits
            </button>
          </mat-card-actions>
        </mat-card>

        <!-- Client Statistics (Admin/Employee only) -->
        <mat-card class="stat-card" *ngIf="isAdmin || isEmployee">
          <mat-card-header>
            <mat-icon mat-card-avatar class="client-icon">people</mat-icon>
            <mat-card-title>Clients</mat-card-title>
            <mat-card-subtitle>Registered clients</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ clients.length }}</div>
            <div class="stat-description">Total clients in the system</div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/clients">
              <mat-icon>visibility</mat-icon>
              View All Clients
            </button>
          </mat-card-actions>
        </mat-card>

        <!-- Recent Credits -->
        <mat-card class="recent-credits-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>history</mat-icon>
            <mat-card-title>Recent Credit Applications</mat-card-title>
            <mat-card-subtitle>Latest credit requests</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="recent-list" *ngIf="recentCredits.length > 0; else noRecentCredits">
              <div class="recent-item" *ngFor="let credit of recentCredits">
                <div class="recent-item-info">
                  <div class="recent-item-title">{{ credit.typeCredit }} - €{{ credit.montant | number }}</div>
                  <div class="recent-item-date">{{ credit.dateDemande | date:'short' }}</div>
                </div>
                <span class="status-chip" [ngClass]="'status-' + credit.statut.toLowerCase()">
                  {{ credit.statut }}
                </span>
              </div>
            </div>
            <ng-template #noRecentCredits>
              <p class="no-data">No recent credit applications</p>
            </ng-template>
          </mat-card-content>
        </mat-card>

        <!-- Quick Actions -->
        <mat-card class="quick-actions-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>add_circle</mat-icon>
            <mat-card-title>Quick Actions</mat-card-title>
            <mat-card-subtitle>Common tasks</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="action-buttons">
              <button mat-raised-button color="primary" routerLink="/credits/new" *ngIf="!isEmployee">
                <mat-icon>add</mat-icon>
                New Credit Application
              </button>
              <button mat-raised-button color="accent" routerLink="/clients/new" *ngIf="isAdmin || isEmployee">
                <mat-icon>person_add</mat-icon>
                Add New Client
              </button>
              <button mat-raised-button routerLink="/remboursements">
                <mat-icon>payment</mat-icon>
                View Payments
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading-spinner">
          <mat-spinner></mat-spinner>
          <p>Loading dashboard...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: #333;
      margin-bottom: 8px;
    }

    .welcome-message {
      color: #666;
      margin-bottom: 30px;
      font-size: 16px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .stat-card {
      transition: transform 0.2s ease-in-out;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.12);
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: #3f51b5;
      text-align: center;
      margin: 16px 0;
    }

    .stat-description {
      text-align: center;
      color: #666;
      font-size: 14px;
    }

    .stat-breakdown {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 16px;
    }

    .stat-item {
      display: flex;
      justify-content: center;
    }

    .credit-icon {
      background-color: #3f51b5;
      color: white;
    }

    .client-icon {
      background-color: #4caf50;
      color: white;
    }

    .recent-credits-card,
    .quick-actions-card {
      grid-column: span 2;
    }

    .recent-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .recent-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }

    .recent-item:last-child {
      border-bottom: none;
    }

    .recent-item-info {
      flex: 1;
    }

    .recent-item-title {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .recent-item-date {
      font-size: 12px;
      color: #666;
    }

    .action-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .action-buttons button {
      flex: 1;
      min-width: 200px;
    }

    .no-data {
      text-align: center;
      color: #666;
      font-style: italic;
      margin: 20px 0;
    }

    @media (max-width: 768px) {
      .recent-credits-card,
      .quick-actions-card {
        grid-column: span 1;
      }

      .action-buttons {
        flex-direction: column;
      }

      .action-buttons button {
        min-width: unset;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = true;
  credits: Credit[] = [];
  clients: Client[] = [];
  recentCredits: Credit[] = [];

  constructor(
    private authService: AuthService,
    private creditService: CreditService,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get isAdmin(): boolean {
    return this.authService.hasRole('ROLE_ADMIN');
  }

  get isEmployee(): boolean {
    return this.authService.hasRole('ROLE_EMPLOYE');
  }

  getCreditsCountByStatus(status: string): number {
    return this.credits.filter(credit => credit.statut === status).length;
  }

  private loadDashboardData() {
    this.loading = true;

    // Load credits
    this.creditService.getAllCredits().subscribe({
      next: (credits) => {
        this.credits = credits;
        this.recentCredits = credits
          .sort((a, b) => new Date(b.dateDemande).getTime() - new Date(a.dateDemande).getTime())
          .slice(0, 5);
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading credits:', error);
        this.checkLoadingComplete();
      }
    });

    // Load clients (only for admin/employee)
    if (this.isAdmin || this.isEmployee) {
      this.clientService.getAllClients().subscribe({
        next: (clients) => {
          this.clients = clients;
          this.checkLoadingComplete();
        },
        error: (error) => {
          console.error('Error loading clients:', error);
          this.checkLoadingComplete();
        }
      });
    } else {
      this.checkLoadingComplete();
    }
  }

  private checkLoadingComplete() {
    // Simple loading check - in a real app you might want more sophisticated loading management
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
}
