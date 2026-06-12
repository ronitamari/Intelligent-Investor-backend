import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalculationsModule } from '../calculations/calculations.module';
import { FinancialProfile } from './entities/financial-profile.entity';
import { SpendingPlan } from './entities/spending-plan.entity';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FinancialProfile, SpendingPlan]),
    CalculationsModule,
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
