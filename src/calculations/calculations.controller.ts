import { Body, Controller, Post } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CalculatePlanDto } from './dto/calculate-plan.dto';

@Controller('calculations')
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Post()
  calculate(@Body() input: CalculatePlanDto) {
    return this.calculationsService.calculatePlan(input);
  }
}
