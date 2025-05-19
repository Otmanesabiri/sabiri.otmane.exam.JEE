import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { CreditService } from '../../services/credit.service';
import { Credit, CreditStatus } from '../../models/credit.model';

@Component({
  selector: 'app-credit-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgChartsModule],
  templateUrl: './credit-dashboard.component.html',
  styleUrls: ['./credit-dashboard.component.css']
})
export class CreditDashboardComponent implements OnInit {
  // Credit Type Chart
  public creditTypesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true
      }
    }
  };
  public creditTypesChartLabels: string[] = ['Personal', 'Mortgage', 'Professional'];
  public creditTypesChartType: ChartType = 'bar';
  public creditTypesChartData: ChartData<'bar'> = {
    labels: this.creditTypesChartLabels,
    datasets: [
      { 
        data: [0, 0, 0], 
        label: 'Number of Credits', 
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'] 
      }
    ]
  };

  // Credit Status Chart
  public creditStatusChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right'
      }
    }
  };
  public creditStatusChartType: ChartType = 'pie';
  public creditStatusChartData: ChartData<'pie'> = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#FFCE56', '#4BC0C0', '#FF6384']
    }]
  };
  
  // Credit Amount Chart
  public creditAmountChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true
      }
    }
  };
  public creditAmountChartLabels: string[] = ['Personal', 'Mortgage', 'Professional'];
  public creditAmountChartType: ChartType = 'bar';
  public creditAmountChartData: ChartData<'bar'> = {
    labels: this.creditAmountChartLabels,
    datasets: [
      { 
        data: [0, 0, 0], 
        label: 'Total Amount ($)', 
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'] 
      }
    ]
  };

  // Summary metrics
  totalCredits: number = 0;
  pendingCredits: number = 0;
  approvedCredits: number = 0;
  rejectedCredits: number = 0;
  
  totalCreditAmount: number = 0;
  avgCreditAmount: number = 0;
  
  acceptanceRate: number = 0;
  
  // Loading state
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private creditService: CreditService) {}

  ngOnInit(): void {
    this.loadCreditData();
  }

  loadCreditData(): void {
    // Combine all credit types to analyze
    const personal$ = this.creditService.listPersonalCredits();
    const mortgage$ = this.creditService.listMortgageCredits();
    const professional$ = this.creditService.listProfessionalCredits();
    
    Promise.all([
      personal$.toPromise(),
      mortgage$.toPromise(),
      professional$.toPromise()
    ]).then(([personal, mortgage, professional]) => {
      const allCredits: Credit[] = [
        ...(personal || []),
        ...(mortgage || []),
        ...(professional || [])
      ];
      
      this.analyzeCredits(allCredits);
      this.isLoading = false;
    }).catch(error => {
      console.error('Error loading credits for dashboard', error);
      this.errorMessage = 'Failed to load credit data';
      this.isLoading = false;
    });
  }

  analyzeCredits(credits: Credit[]): void {
    // Initialize counters
    this.totalCredits = credits.length;
    
    let personalCount = 0;
    let mortgageCount = 0;
    let professionalCount = 0;
    
    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;
    
    let personalAmount = 0;
    let mortgageAmount = 0;
    let professionalAmount = 0;
    
    // Analyze all credits
    credits.forEach(credit => {
      // Count by type
      if (credit.type === 'PERSONAL') {
        personalCount++;
        personalAmount += credit.amount;
      } else if (credit.type === 'MORTGAGE') {
        mortgageCount++;
        mortgageAmount += credit.amount;
      } else if (credit.type === 'PROFESSIONAL') {
        professionalCount++;
        professionalAmount += credit.amount;
      }
      
      // Count by status
      if (credit.status === CreditStatus.PENDING) {
        pendingCount++;
      } else if (credit.status === CreditStatus.APPROVED) {
        approvedCount++;
      } else if (credit.status === CreditStatus.REJECTED) {
        rejectedCount++;
      }
    });
    
    // Update summary metrics
    this.pendingCredits = pendingCount;
    this.approvedCredits = approvedCount;
    this.rejectedCredits = rejectedCount;
    
    this.totalCreditAmount = personalAmount + mortgageAmount + professionalAmount;
    this.avgCreditAmount = this.totalCredits > 0 ? this.totalCreditAmount / this.totalCredits : 0;
    
    // Calculate acceptance rate (approved / (approved + rejected))
    const decidedCredits = approvedCount + rejectedCount;
    this.acceptanceRate = decidedCredits > 0 ? (approvedCount / decidedCredits) * 100 : 0;
    
    // Update chart data
    this.creditTypesChartData.datasets[0].data = [personalCount, mortgageCount, professionalCount];
    this.creditStatusChartData.datasets[0].data = [pendingCount, approvedCount, rejectedCount];
    this.creditAmountChartData.datasets[0].data = [personalAmount, mortgageAmount, professionalAmount];
    
    // Force chart update
    this.creditTypesChartData = {...this.creditTypesChartData};
    this.creditStatusChartData = {...this.creditStatusChartData};
    this.creditAmountChartData = {...this.creditAmountChartData};
  }
}
