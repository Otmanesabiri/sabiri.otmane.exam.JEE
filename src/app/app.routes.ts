import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreditsListComponent } from './components/credits/credits-list.component';
import { CreditFormComponent } from './components/credits/credit-form.component';
import { CreditDetailComponent } from './components/credits/credit-detail.component';
import { ClientsListComponent } from './components/clients/clients-list.component';
import { ClientFormComponent } from './components/clients/client-form.component';
import { ClientDetailComponent } from './components/clients/client-detail.component';
import { RemboursementsListComponent } from './components/remboursements/remboursements-list.component';
import { AuthGuard, RoleGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'credits', 
    component: CreditsListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'credits/new', 
    component: CreditFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'credits/:id', 
    component: CreditDetailComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'clients', 
    component: ClientsListComponent,
    canActivate: [AuthGuard, RoleGuard]
  },
  { 
    path: 'clients/new', 
    component: ClientFormComponent,
    canActivate: [AuthGuard, RoleGuard]
  },
  { 
    path: 'clients/:id', 
    component: ClientDetailComponent,
    canActivate: [AuthGuard, RoleGuard]
  },
  { 
    path: 'remboursements', 
    component: RemboursementsListComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];
