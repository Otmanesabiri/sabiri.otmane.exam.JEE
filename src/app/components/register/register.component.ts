import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
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
    MatSelectModule,
    RouterLink
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>person_add</mat-icon>
            Register
          </mat-card-title>
          <mat-card-subtitle>Create your account</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field>
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" required>
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
                Username is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('username')?.hasError('minlength')">
                Username must be at least 3 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" required>
              <mat-icon matSuffix>lock</mat-icon>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Role</mat-label>
              <mat-select formControlName="role">
                <mat-option value="client">Client</mat-option>
                <mat-option value="employe">Employee</mat-option>
                <mat-option value="admin">Administrator</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <div class="success-message" *ngIf="successMessage">
              {{ successMessage }}
            </div>

            <button 
              mat-raised-button 
              color="primary" 
              type="submit" 
              class="full-width"
              [disabled]="loading || !registerForm.valid">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Register</span>
            </button>
            
            <!-- Debug button for testing -->
            <button 
              mat-stroked-button 
              color="accent" 
              type="button" 
              class="full-width debug-btn"
              (click)="debugForm()"
              style="margin-top: 8px;">
              Debug Form
            </button>
          </form>
        </mat-card-content>
        
        <mat-card-actions>
          <p>Already have an account? <a routerLink="/login">Login here</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .register-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
      margin-top: 16px;
    }

    .error-message {
      color: #f44336;
      font-size: 14px;
      margin-bottom: 16px;
      text-align: center;
    }

    .success-message {
      color: #4caf50;
      font-size: 14px;
      margin-bottom: 16px;
      text-align: center;
    }

    mat-card-actions p {
      margin: 0;
      text-align: center;
      color: #666;
    }

    mat-card-actions a {
      color: #3f51b5;
      text-decoration: none;
    }

    mat-card-actions a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['client']
    });
  }

  onSubmit() {
    console.log('🚀 Form submission attempted');
    console.log('📋 Form valid:', this.registerForm.valid);
    console.log('📝 Form values:', this.registerForm.value);
    console.log('❌ Form errors:', this.getFormValidationErrors(this.registerForm));
    
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.registerForm.value;
      const registerData = {
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
        role: [formValue.role] // Convert to array as expected by backend
      };
      
      console.log('📤 Sending registration data:', registerData);

      this.authService.register(registerData).subscribe({
        next: (response) => {
          console.log('✅ Registration successful:', response);
          this.loading = false;
          this.successMessage = 'Registration successful! You can now login.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('❌ Registration error details:', error);
          this.loading = false;
          
          // Better error handling
          if (error.status === 0) {
            this.errorMessage = 'Cannot connect to server. Please check if the backend is running.';
          } else if (error.status === 400) {
            this.errorMessage = error.error?.message || 'Invalid data provided.';
          } else if (error.status === 409) {
            this.errorMessage = 'Username or email already exists.';
          } else {
            this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          }
        }
      });
    } else {
      // Highlight form validation errors
      this.markFormGroupTouched(this.registerForm);
      console.log('❌ Form validation failed. Errors:', this.getFormValidationErrors(this.registerForm));
    }
  }

  // Debug method to test form functionality
  debugForm() {
    console.log('🔍 DEBUG: Form Debug Info');
    console.log('Form valid:', this.registerForm.valid);
    console.log('Form status:', this.registerForm.status);
    console.log('Form values:', this.registerForm.value);
    console.log('Form errors:', this.getFormValidationErrors(this.registerForm));
    
    // Test each field
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      console.log(`${key}:`, {
        value: control?.value,
        valid: control?.valid,
        errors: control?.errors,
        touched: control?.touched
      });
    });
    
    // Try to submit anyway for testing
    console.log('🧪 Testing onSubmit()...');
    this.onSubmit();
  }
  
  // Helper method to mark all controls as touched to trigger validation display
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  // Helper method to get all validation errors for debugging
  getFormValidationErrors(formGroup: FormGroup) {
    const errors: any = {};
    
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    
    return errors;
  }
}
