import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CalculationsService } from '../calculations/calculations.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FinancialProfile } from './entities/financial-profile.entity';
import { SpendingPlan } from './entities/spending-plan.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(FinancialProfile)
    private readonly profilesRepository: Repository<FinancialProfile>,
    private readonly dataSource: DataSource,
    private readonly calculationsService: CalculationsService,
  ) {}

  async create(input: CreateProfileDto): Promise<FinancialProfile> {
    return this.dataSource.transaction(async (manager) => {
      const result = this.calculationsService.calculatePlan(input);
      const profile = manager.create(FinancialProfile, {
        name: input.name,
        grossSalary: result.grossSalary,
        bankNet: result.bankNet,
      });
      const savedProfile = await manager.save(profile);
      const plan = manager.create(SpendingPlan, {
        profileId: savedProfile.id,
        fixedCostsPercentage: result.fixedCostsPercentage,
        guiltFreePercentage: result.guiltFreePercentage,
        fixedCosts: result.fixedCosts,
        savingsGoals: result.savingsGoals,
        activeInvestments: result.activeInvestments,
        guiltFreeSpending: result.guiltFreeSpending,
        wealthProjection: result.wealthProjection,
      });
      savedProfile.spendingPlans = [await manager.save(plan)];
      return savedProfile;
    });
  }

  findAll(): Promise<FinancialProfile[]> {
    return this.profilesRepository.find({
      relations: { spendingPlans: true },
      order: { updatedAt: 'DESC', spendingPlans: { createdAt: 'DESC' } },
    });
  }

  async findOne(id: string): Promise<FinancialProfile> {
    const profile = await this.profilesRepository.findOne({
      where: { id },
      relations: { spendingPlans: true },
      order: { spendingPlans: { createdAt: 'DESC' } },
    });

    if (!profile) {
      throw new NotFoundException(`Financial profile ${id} was not found`);
    }

    return profile;
  }

  async update(id: string, input: UpdateProfileDto): Promise<FinancialProfile> {
    const existing = await this.findOne(id);
    return this.createReplacement(existing, input);
  }

  async remove(id: string): Promise<void> {
    const result = await this.profilesRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Financial profile ${id} was not found`);
    }
  }

  private async createReplacement(
    existing: FinancialProfile,
    input: UpdateProfileDto,
  ): Promise<FinancialProfile> {
    return this.dataSource.transaction(async (manager) => {
      const calculationInput = {
        grossSalary: input.grossSalary ?? Number(existing.grossSalary),
        bankNet: input.bankNet ?? Number(existing.bankNet),
        fixedCostsPercentage: input.fixedCostsPercentage,
        guiltFreePercentage: input.guiltFreePercentage,
      };
      const result = this.calculationsService.calculatePlan(calculationInput);

      existing.name = input.name ?? existing.name;
      existing.grossSalary = result.grossSalary;
      existing.bankNet = result.bankNet;
      const savedProfile = await manager.save(existing);
      const plan = manager.create(SpendingPlan, {
        profileId: existing.id,
        fixedCostsPercentage: result.fixedCostsPercentage,
        guiltFreePercentage: result.guiltFreePercentage,
        fixedCosts: result.fixedCosts,
        savingsGoals: result.savingsGoals,
        activeInvestments: result.activeInvestments,
        guiltFreeSpending: result.guiltFreeSpending,
        wealthProjection: result.wealthProjection,
      });
      savedProfile.spendingPlans = [await manager.save(plan)];
      return savedProfile;
    });
  }
}
