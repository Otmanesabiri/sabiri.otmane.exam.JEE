import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CreditService } from '../../services/credit.service';
import { Credit, CreditStatus } from '../../models/credit.model';

@Component({
  selector: 'app-credit-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './credit-list.component.html',
  styleUrls: ['./credit-list.component.css']
})
export class CreditListComponent implements OnInit {
  credits: Credit[] = [];
  filteredCredits: Credit[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  CreditStatus = CreditStatus; // Expose enum to template

  // Filters
  statusFilter: string = 'ALL';
  creditTypeFilter: string = 'ALL';
  searchQuery: string = '';

  constructor(private creditService: CreditService) {}

  ngOnInit(): void {
    this.loadAllCredits();
  }

  loadAllCredits(): void {
    this.isLoading = true;
    
    // We'll need to combine different credit types
    const personal$ = this.creditService.listPersonalCredits();
    const mortgage$ = this.creditService.listMortgageCredits();
    const professional$ = this.creditService.listProfessionalCredits();
    
    // Combine all requests
    Promise.all([
      personal$.toPromise(),
      mortgage$.toPromise(),
      professional$.toPromise()
    ]).then(([personal, mortgage, professional]) => {
      this.credits = [
        ...(personal || []),
        ...(mortgage || []),
        ...(professional || [])
      ];
      this.applyFilters();
      this.isLoading = false;
    }).catch(error => {
      this.isLoading = false;
      this.errorMessage = 'Failed to load credits. Please try again later.';
      console.error('Error loading credits', error);
    });
  }

  applyFilters(): void {
    let filtered = this.credits;
    
    // Apply status filter
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(credit => credit.status === this.statusFilter);
    }
    
    // Apply credit type filter
    if (this.creditTypeFilter !== 'ALL') {
      filtered = filtered.filter(credit => credit.type === this.creditTypeFilter);
    }
    
    // Apply search query (match against customer name, amount, etc)
    if (this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(credit => 
        credit.customerDTO.name.toLowerCase().includes(query) ||
        credit.amount.toString().includes(query) ||
        (credit.type.toLowerCase().includes(query))
      );
    }
    
    this.filteredCredits = filtered;
  }

  onStatusFilterChange(event: Event): void {
    this.statusFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onCreditTypeFilterChange(event: Event): void {
    this.creditTypeFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onSearchQueryChange(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  getStatusBadgeClass(status: CreditStatus): string {
    switch (status) {
      case CreditStatus.PENDING:
        return 'bg-warning text-dark';
      case CreditStatus.APPROVED:
        return 'bg-success';
      case CreditStatus.REJECTED:
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  changeCreditStatus(creditId: number, status: CreditStatus): void {
    this.isLoading = true;
    
    this.creditService.changeCreditStatus(creditId, status).subscribe({
      next: () => {
        // Update the credit in the local array
        const updatedCredit = this.credits.find(c => c.id === creditId);
        if (updatedCredit) {
          updatedCredit.status = status;
          updatedCredit.acceptanceDate = status === CreditStatus.APPROVED ? new Date() : undefined;
          this.applyFilters();
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error changing credit status', err);
      }
    });
  }
}
