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

  it('calculates savings goals at 10%', () => {
    expect(service.calculateSavingsGoals(8000)).toBe(800);
  });

  it('calculates active investments at 10%', () => {
    expect(service.calculateActiveInvestments(8000)).toBe(800);
  });

  it('calculates guilt-free spending at the default 27.5%', () => {
    expect(service.calculateGuiltFreeSpending(8000)).toBe(2200);
  });

  it('calculates 15 annual projection values at 7% return', () => {
    const projection = service.calculateWealthProjection(1000);

    expect(projection).toHaveLength(15);
    expect(projection[0]).toEqual({ year: 1, value: 1070 });
    expect(projection[14].value).toBe(2759.03);
  });
});
