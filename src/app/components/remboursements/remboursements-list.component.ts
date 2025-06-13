import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-remboursements-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <div class="remboursements-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>payment</mat-icon>
            Remboursements
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Remboursements list component - Coming soon!</p>
          <button mat-raised-button routerLink="/dashboard">
            <mat-icon>dashboard</mat-icon>
            Back to Dashboard
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .remboursements-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class RemboursementsListComponent {}
