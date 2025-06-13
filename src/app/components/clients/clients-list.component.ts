import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { ClientService, Client } from '../../services/client.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    RouterLink
  ],
  template: `
    <div class="clients-container">
      <div class="header">
        <h1>Clients Management</h1>
        <button mat-raised-button color="primary" routerLink="/clients/new">
          <mat-icon>person_add</mat-icon>
          Add New Client
        </button>
      </div>

      <mat-card *ngIf="!loading; else loadingTemplate">
        <mat-card-header>
          <mat-card-title>Client Directory</mat-card-title>
          <mat-card-subtitle>Manage client information and view their credit history</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="table-container" *ngIf="clients.length > 0; else noClients">
            <table mat-table [dataSource]="clients" class="clients-table">
              
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let client">#{{ client.id }}</td>
              </ng-container>

              <!-- Name Column -->
              <ng-container matColumnDef="nom">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let client">{{ client.nom }}</td>
              </ng-container>

              <!-- Email Column -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let client">{{ client.email }}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let client">
                  <button mat-icon-button [matMenuTriggerFor]="actionMenu" [matMenuTriggerData]="{client: client}">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  class="table-row" 
                  [routerLink]="['/clients', row.id]"></tr>
            </table>
          </div>

          <ng-template #noClients>
            <div class="no-data">
              <mat-icon>people_outline</mat-icon>
              <h3>No clients found</h3>
              <p>Start by adding your first client</p>
              <button mat-raised-button color="primary" routerLink="/clients/new">
                <mat-icon>person_add</mat-icon>
                Add New Client
              </button>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>

      <!-- Action Menu Template -->
      <mat-menu #actionMenu="matMenu">
        <ng-template matMenuContent let-client="client">
          <button mat-menu-item [routerLink]="['/clients', client.id]">
            <mat-icon>visibility</mat-icon>
            View Details
          </button>
          <button mat-menu-item [routerLink]="['/credits']" [queryParams]="{clientId: client.id}">
            <mat-icon>credit_card</mat-icon>
            View Credits
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="editClient(client)">
            <mat-icon>edit</mat-icon>
            Edit
          </button>
          <button mat-menu-item (click)="deleteClient(client)" class="delete-action">
            <mat-icon>delete</mat-icon>
            Delete
          </button>
        </ng-template>
      </mat-menu>

      <ng-template #loadingTemplate>
        <div class="loading-spinner">
          <mat-spinner></mat-spinner>
          <p>Loading clients...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .clients-container {
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

    .clients-table {
      width: 100%;
    }

    .table-row {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .table-row:hover {
      background-color: #f5f5f5;
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

    .delete-action {
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
export class ClientsListComponent implements OnInit {
  clients: Client[] = [];
  loading = true;
  displayedColumns: string[] = ['id', 'nom', 'email', 'actions'];

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  editClient(client: Client) {
    // Navigate to edit form - you can implement this later
    console.log('Edit client:', client);
    this.snackBar.open('Edit functionality coming soon', 'Close', { duration: 2000 });
  }

  deleteClient(client: Client) {
    if (client.id && confirm(`Are you sure you want to delete client ${client.nom}?`)) {
      this.clientService.deleteClient(client.id).subscribe({
        next: () => {
          this.clients = this.clients.filter(c => c.id !== client.id);
          this.snackBar.open('Client deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting client:', error);
          this.snackBar.open('Error deleting client', 'Close', { duration: 3000 });
        }
      });
    }
  }

  private loadClients() {
    this.loading = true;
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.loading = false;
        this.snackBar.open('Error loading clients', 'Close', { duration: 3000 });
      }
    });
  }
}
