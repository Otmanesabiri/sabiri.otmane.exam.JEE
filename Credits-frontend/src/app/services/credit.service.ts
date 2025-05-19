import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credit, PersonalCredit, MortgageCredit, ProfessionalCredit, Repayment, CreditHistory, CreditStatus } from '../models/credit.model';
import { StorageService } from './storage.service';

const API_URL = 'http://localhost:8085/api/credits'; // Adjust if your backend URL is different

@Injectable({
  providedIn: 'root'
})
export class CreditService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  // --- Customer specific credit calls ---
  getCustomerCredits(customerId: number): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${API_URL}/customer/${customerId}`, { headers: this.getAuthHeaders() });
  }

  getCustomerCreditsByStatus(customerId: number, status: CreditStatus): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${API_URL}/customer/${customerId}/status/${status}`, { headers: this.getAuthHeaders() });
  }

  // --- Personal Credit Calls ---
  savePersonalCredit(credit: PersonalCredit): Observable<PersonalCredit> {
    return this.http.post<PersonalCredit>(`${API_URL}/personal`, credit, { headers: this.getAuthHeaders() });
  }

  updatePersonalCredit(creditId: number, credit: PersonalCredit): Observable<PersonalCredit> {
    return this.http.put<PersonalCredit>(`${API_URL}/personal/${creditId}`, credit, { headers: this.getAuthHeaders() });
  }

  listPersonalCredits(): Observable<PersonalCredit[]> {
    return this.http.get<PersonalCredit[]>(`${API_URL}/personal`, { headers: this.getAuthHeaders() });
  }

  findPersonalCreditsByReason(reason: string): Observable<PersonalCredit[]> {
    return this.http.get<PersonalCredit[]>(`${API_URL}/personal/reason/${reason}`, { headers: this.getAuthHeaders() });
  }

  // --- Mortgage Credit Calls ---
  saveMortgageCredit(credit: MortgageCredit): Observable<MortgageCredit> {
    return this.http.post<MortgageCredit>(`${API_URL}/mortgage`, credit, { headers: this.getAuthHeaders() });
  }

  updateMortgageCredit(creditId: number, credit: MortgageCredit): Observable<MortgageCredit> {
    return this.http.put<MortgageCredit>(`${API_URL}/mortgage/${creditId}`, credit, { headers: this.getAuthHeaders() });
  }

  listMortgageCredits(): Observable<MortgageCredit[]> {
    return this.http.get<MortgageCredit[]>(`${API_URL}/mortgage`, { headers: this.getAuthHeaders() });
  }

  // --- Professional Credit Calls ---
  saveProfessionalCredit(credit: ProfessionalCredit): Observable<ProfessionalCredit> {
    return this.http.post<ProfessionalCredit>(`${API_URL}/professional`, credit, { headers: this.getAuthHeaders() });
  }

  updateProfessionalCredit(creditId: number, credit: ProfessionalCredit): Observable<ProfessionalCredit> {
    return this.http.put<ProfessionalCredit>(`${API_URL}/professional/${creditId}`, credit, { headers: this.getAuthHeaders() });
  }

  listProfessionalCredits(): Observable<ProfessionalCredit[]> {
    return this.http.get<ProfessionalCredit[]>(`${API_URL}/professional`, { headers: this.getAuthHeaders() });
  }

  findProfessionalCreditsByCompanyName(companyName: string): Observable<ProfessionalCredit[]> {
    return this.http.get<ProfessionalCredit[]>(`${API_URL}/professional/company/${companyName}`, { headers: this.getAuthHeaders() });
  }

  // --- General Credit Operations ---
  getCredit(creditId: number): Observable<Credit> {
    return this.http.get<Credit>(`${API_URL}/${creditId}`, { headers: this.getAuthHeaders() });
  }

  deleteCredit(creditId: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${creditId}`, { headers: this.getAuthHeaders() });
  }

  changeCreditStatus(creditId: number, status: CreditStatus): Observable<void> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<void>(`${API_URL}/${creditId}/status`, {}, { headers: this.getAuthHeaders(), params });
  }

  listCreditsByStatus(status: CreditStatus): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${API_URL}/status/${status}`, { headers: this.getAuthHeaders() });
  }

  // --- Repayment Operations ---
  addRepayment(creditId: number, repayment: Repayment): Observable<Repayment> {
    return this.http.post<Repayment>(`${API_URL}/${creditId}/repayments`, repayment, { headers: this.getAuthHeaders() });
  }

  getCreditRepayments(creditId: number): Observable<Repayment[]> {
    return this.http.get<Repayment[]>(`${API_URL}/${creditId}/repayments`, { headers: this.getAuthHeaders() });
  }

  getCreditHistory(creditId: number, page: number, size: number): Observable<CreditHistory> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<CreditHistory>(`${API_URL}/${creditId}/history`, { headers: this.getAuthHeaders(), params });
  }
}
