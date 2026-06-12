import { Injectable } from '@nestjs/common';
import { CalculatePlanDto } from './dto/calculate-plan.dto';

export interface ProjectionPoint {
  year: number;
  value: number;
}

export interface SpendingPlanResult {
  grossSalary: number;
  bankNet: number;
  bankNetWasEstimated: boolean;
  fixedCostsPercentage: number;
  guiltFreePercentage: number;
  fixedCosts: number;
  savingsGoals: number;
  activeInvestments: number;
  guiltFreeSpending: number;
  wealthProjection: ProjectionPoint[];
}

@Injectable()
export class CalculationsService {
  private readonly bankNetRate = 0.68;
  private readonly savingsRate = 0.1;
  private readonly investmentRate = 0.1;
  private readonly annualReturnRate = 0.07;

  estimateBankNet(grossSalary: number): number {
    return this.round(grossSalary * this.bankNetRate);
  }

  calculateFixedCosts(bankNet: number, percentage = 55): number {
    return this.round(bankNet * (percentage / 100));
  }

  calculateSavingsGoals(bankNet: number): number {
    return this.round(bankNet * this.savingsRate);
  }

  calculateActiveInvestments(bankNet: number): number {
    return this.round(bankNet * this.investmentRate);
  }

  calculateGuiltFreeSpending(bankNet: number, percentage = 27.5): number {
    return this.round(bankNet * (percentage / 100));
  }

  calculateWealthProjection(
    annualInvestment: number,
    years = 15,
  ): ProjectionPoint[] {
    return Array.from({ length: years }, (_, index) => {
      const year = index + 1;
      return {
        year,
        value: this.round(
          annualInvestment * Math.pow(1 + this.annualReturnRate, year),
        ),
      };
    });
  }

  calculatePlan(input: CalculatePlanDto): SpendingPlanResult {
    const bankNetWasEstimated = input.bankNet === undefined;
    const bankNet = input.bankNet ?? this.estimateBankNet(input.grossSalary);
    const fixedCostsPercentage = input.fixedCostsPercentage ?? 55;
    const guiltFreePercentage = input.guiltFreePercentage ?? 27.5;
    const activeInvestments = this.calculateActiveInvestments(bankNet);

    return {
      grossSalary: this.round(input.grossSalary),
      bankNet: this.round(bankNet),
      bankNetWasEstimated,
      fixedCostsPercentage,
      guiltFreePercentage,
      fixedCosts: this.calculateFixedCosts(bankNet, fixedCostsPercentage),
      savingsGoals: this.calculateSavingsGoals(bankNet),
      activeInvestments,
      guiltFreeSpending: this.calculateGuiltFreeSpending(
        bankNet,
        guiltFreePercentage,
      ),
      wealthProjection: this.calculateWealthProjection(activeInvestments),
    };
  }

  private round(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
