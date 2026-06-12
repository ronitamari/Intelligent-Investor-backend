import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CalculatePlanDto } from '../../calculations/dto/calculate-plan.dto';

export class CreateProfileDto extends CalculatePlanDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
