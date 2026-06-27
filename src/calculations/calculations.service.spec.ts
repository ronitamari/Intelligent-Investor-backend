import { CalculationsService } from './calculations.service';

describe('CalculationsService', () => {
  const service = new CalculationsService();

  it('keeps the entered gross salary as the starting point', () => {
    expect(service.calculatePlan({ grossSalary: 10000 }).grossSalary).toBe(
      10000,
    );
  });

  it('estimates bank net as 68% of gross salary', () => {
    expect(service.estimateBankNet(10000)).toBe(6800);
  });

  it('calculates fixed costs at the default 55%', () => {
    expect(service.calculateFixedCosts(8000)).toBe(4400);
  });

  it('calculates fixed costs with a custom percentage in the allowed range', () => {
    expect(service.calculateFixedCosts(8000, 60)).toBe(4800);
  });

  it('calculates savings goals at 10%', () => {
    expect(service.calculateSavingsGoals(8000)).toBe(800);
  });

  it('calculates active investments at 10%', () => {
    expect(service.calculateActiveInvestments(8000)).toBe(800);
  });

  it('calculates guilt-free spending at the default 27.5%', () => {
    expect(service.calculateGuiltFreeSpending(8000)).toBe(2200);
  });

  it('calculates guilt-free spending with a custom percentage in the allowed range', () => {
    expect(service.calculateGuiltFreeSpending(8000, 35)).toBe(2800);
  });

  it('calculates 15 annual projection values at 7% return', () => {
    const projection = service.calculateWealthProjection(1000);

    expect(projection).toHaveLength(15);
    expect(projection[0]).toEqual({ year: 1, value: 1070 });
    expect(projection[14].value).toBe(2759.03);
  });

  it('calculates a complete plan from entered bank net', () => {
    expect(
      service.calculatePlan({
        grossSalary: 10000,
        bankNet: 8000,
        fixedCostsPercentage: 50,
        guiltFreePercentage: 20,
      }),
    ).toMatchObject({
      grossSalary: 10000,
      bankNet: 8000,
      bankNetWasEstimated: false,
      fixedCostsPercentage: 50,
      guiltFreePercentage: 20,
      fixedCosts: 4000,
      savingsGoals: 800,
      activeInvestments: 800,
      guiltFreeSpending: 1600,
    });
  });

  it('calculates a complete plan with estimated bank net when bank net is omitted', () => {
    const result = service.calculatePlan({ grossSalary: 10000 });

    expect(result).toMatchObject({
      grossSalary: 10000,
      bankNet: 6800,
      bankNetWasEstimated: true,
      fixedCosts: 3740,
      savingsGoals: 680,
      activeInvestments: 680,
      guiltFreeSpending: 1870,
    });
    expect(result.wealthProjection).toHaveLength(15);
  });
});
