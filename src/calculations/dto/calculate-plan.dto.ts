import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CalculatePlanDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  grossSalary: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  bankNet?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(60)
  fixedCostsPercentage?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(35)
  guiltFreePercentage?: number;
}
