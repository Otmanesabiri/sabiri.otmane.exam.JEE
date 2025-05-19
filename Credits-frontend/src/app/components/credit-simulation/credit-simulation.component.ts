import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyType } from '../../models/credit.model';

@Component({
  selector: 'app-credit-simulation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credit-simulation.component.html',
  styleUrls: ['./credit-simulation.component.css']
})
export class CreditSimulationComponent implements OnInit {
  // Simulation parameters
  creditType: string = 'personal';
  amount: number = 10000;
  duration: number = 12;
  interestRate: number = 0.05;
  propertyType: PropertyType = PropertyType.APARTMENT;
  
  // Results
  monthlyPayment: number = 0;
  totalPayment: number = 0;
  totalInterest: number = 0;
  
  // Amortization schedule
  schedule: any[] = [];
  showFullSchedule: boolean = false;
  
  // Interest rate ranges by credit type
  interestRates: { [key: string]: { min: number, max: number } } = {
    personal: { min: 0.05, max: 0.12 },
    mortgage: { min: 0.03, max: 0.06 },
    professional: { min: 0.04, max: 0.09 }
  };
  
  // Duration ranges by credit type
  durations: { [key: string]: { min: number, max: number } } = {
    personal: { min: 3, max: 60 },
    mortgage: { min: 36, max: 360 },
    professional: { min: 12, max: 120 }
  };
  
  // Property types for mortgage
  propertyTypes = Object.values(PropertyType);

  constructor() {}

  ngOnInit(): void {
    this.calculateLoan();
  }
  
  onCreditTypeChange(): void {
    // Adjust interest rate and duration based on credit type
    switch (this.creditType) {
      case 'personal':
        this.interestRate = 0.05;
        if (this.duration > 60) this.duration = 60;
        break;
      case 'mortgage':
        this.interestRate = 0.035;
        if (this.duration < 36) this.duration = 36;
        break;
      case 'professional':
        this.interestRate = 0.04;
        if (this.duration > 120) this.duration = 120;
        break;
    }
    
    this.calculateLoan();
  }
  
  calculateLoan(): void {
    // Monthly interest rate
    const monthlyRate = this.interestRate / 12;
    
    // Monthly payment using the PMT formula
    // P * (r * (1+r)^n) / ((1+r)^n - 1)
    this.monthlyPayment = this.amount * monthlyRate * Math.pow(1 + monthlyRate, this.duration) / 
      (Math.pow(1 + monthlyRate, this.duration) - 1);
    
    // Total payment over the life of the loan
    this.totalPayment = this.monthlyPayment * this.duration;
    
    // Total interest
    this.totalInterest = this.totalPayment - this.amount;
    
    // Generate amortization schedule
    this.generateAmortizationSchedule();
  }
  
  generateAmortizationSchedule(): void {
    const monthlyRate = this.interestRate / 12;
    let balance = this.amount;
    const schedule = [];
    
    for (let month = 1; month <= this.duration; month++) {
      // Calculate interest for this month
      const interestPayment = balance * monthlyRate;
      
      // Calculate principal for this month
      const principalPayment = this.monthlyPayment - interestPayment;
      
      // Update remaining balance
      balance -= principalPayment;
      
      // Add to schedule
      schedule.push({
        month,
        paymentDate: this.addMonths(new Date(), month),
        payment: this.monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance > 0 ? balance : 0
      });
    }
    
    this.schedule = schedule;
  }
  
  addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }
  
  toggleSchedule(): void {
    this.showFullSchedule = !this.showFullSchedule;
  }
  
  // Helper for displaying formatted percentages
  formatPercent(value: number): string {
    return (value * 100).toFixed(2) + '%';
  }
  
  // Helper for getting duration range text
  getDurationRangeText(): string {
    const range = this.durations[this.creditType as keyof typeof this.durations];
    return `${range.min} - ${range.max} months`;
  }
  
  // Helper for getting interest range text
  getInterestRangeText(): string {
    const range = this.interestRates[this.creditType as keyof typeof this.interestRates];
    return `${this.formatPercent(range.min)} - ${this.formatPercent(range.max)}`;
  }
}
