import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export enum StatutCredit {
  EN_COURS = 'EN_COURS',
  ACCEPTE = 'ACCEPTE',
  REJETE = 'REJETE'
}

export interface Credit {
  id?: number;
  dateDemande: string;
  statut: StatutCredit;
  dateAcceptation?: string;
  montant: number;
  dureeRemboursement: number;
  tauxInteret: number;
  clientId: number;
  typeCredit: string;
}

export interface CreditPersonnel extends Credit {
  motif: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private apiUrl = 'http://localhost:8084/api/credits';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllCredits(): Observable<Credit[]> {
    return this.http.get<Credit[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getCreditById(id: number): Observable<Credit> {
    return this.http.get<Credit>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getCreditsByClient(clientId: number): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.apiUrl}/client/${clientId}`, { headers: this.getHeaders() });
  }

  createCredit(credit: Credit): Observable<Credit> {
    return this.http.post<Credit>(this.apiUrl, credit, { headers: this.getHeaders() });
  }

  createCreditPersonnel(credit: CreditPersonnel): Observable<CreditPersonnel> {
    return this.http.post<CreditPersonnel>(`${this.apiUrl}/personnel`, credit, { headers: this.getHeaders() });
  }

  accepterCredit(id: number): Observable<Credit> {
    return this.http.put<Credit>(`${this.apiUrl}/${id}/accepter`, {}, { headers: this.getHeaders() });
  }

  rejeterCredit(id: number): Observable<Credit> {
    return this.http.put<Credit>(`${this.apiUrl}/${id}/rejeter`, {}, { headers: this.getHeaders() });
  }

  deleteCredit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
