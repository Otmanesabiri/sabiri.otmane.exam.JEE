import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>person_add</mat-icon>
            Add New Client
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Client form component - Coming soon!</p>
          <button mat-raised-button routerLink="/clients">
            <mat-icon>arrow_back</mat-icon>
            Back to Clients
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
  `]
})
export class ClientFormComponent {}
