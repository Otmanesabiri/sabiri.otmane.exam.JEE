import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>login</mat-icon>
            Login
          </mat-card-title>
          <mat-card-subtitle>Sign in to your account</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field>
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" required>
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                Username is required
              </mat-error>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" required>
              <mat-icon matSuffix>lock</mat-icon>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="loginForm.invalid || loading" class="full-width">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Login</span>
            </button>
          </form>
        </mat-card-content>
        
        <mat-card-actions>
          <p>Don't have an account? <a routerLink="/register">Register here</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .login-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
      animation: floating 6s ease-in-out infinite;
    }

    @keyframes floating {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 32px;
      border-radius: 24px;
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.1),
        0 15px 12px rgba(0, 0, 0, 0.08),
        0 2px 4px rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.95);
      position: relative;
      z-index: 1;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .login-card:hover {
      transform: translateY(-5px);
      box-shadow: 
        0 25px 50px rgba(0, 0, 0, 0.15),
        0 20px 20px rgba(0, 0, 0, 0.1),
        0 5px 8px rgba(0, 0, 0, 0.08);
    }

    mat-card-header {
      margin-bottom: 32px;
      text-align: center;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 28px;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 8px;
    }

    mat-card-title mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #667eea;
    }

    mat-card-subtitle {
      color: #64748b;
      font-size: 16px;
      font-weight: 400;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 20px;
    }

    mat-form-field .mat-mdc-form-field-wrapper {
      border-radius: 12px;
    }

    mat-form-field input {
      font-size: 16px;
      padding: 12px 0;
    }

    mat-form-field mat-icon[matSuffix] {
      color: #94a3b8;
      transition: color 0.3s ease;
    }

    mat-form-field:focus-within mat-icon[matSuffix] {
      color: #667eea;
    }

    .full-width {
      width: 100%;
      height: 48px;
      margin-top: 24px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .full-width:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
    }

    .full-width:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .error-message {
      background: rgba(244, 67, 54, 0.1);
      color: #d32f2f;
      font-size: 14px;
      padding: 12px 16px;
      border-radius: 8px;
      border-left: 4px solid #f44336;
      margin-bottom: 20px;
      text-align: center;
      animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    mat-card-actions {
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
      margin-top: 20px;
    }

    mat-card-actions p {
      margin: 0;
      text-align: center;
      color: #64748b;
      font-size: 14px;
    }

    mat-card-actions a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    mat-card-actions a:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    /* Loading spinner customization */
    mat-spinner {
      margin-right: 8px;
    }

    /* Responsive design */
    @media (max-width: 480px) {
      .login-container {
        padding: 16px;
      }

      .login-card {
        padding: 24px;
        border-radius: 16px;
        max-width: 100%;
      }

      mat-card-title {
        font-size: 24px;
      }

      mat-card-title mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }

    /* Focus states for better accessibility */
    .full-width:focus {
      outline: 2px solid #667eea;
      outline-offset: 2px;
    }

    mat-form-field.mat-focused .mat-mdc-form-field-wrapper {
      border-color: #667eea;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Invalid username or password';
          console.error('Login error:', error);
        }
      });
    }
  }
}
