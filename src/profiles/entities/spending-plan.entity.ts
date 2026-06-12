import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectionPoint } from '../../calculations/calculations.service';
import { numericTransformer } from '../../database/numeric.transformer';
import { FinancialProfile } from './financial-profile.entity';

@Entity({ name: 'spending_plans' })
export class SpendingPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'profile_id', type: 'uuid' })
  profileId: string;

  @ManyToOne(() => FinancialProfile, (profile) => profile.spendingPlans, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: FinancialProfile;

  @Column({
    name: 'fixed_costs_percentage',
    type: 'numeric',
    precision: 5,
    scale: 2,
    transformer: numericTransformer,
  })
  fixedCostsPercentage: number;

  @Column({
    name: 'guilt_free_percentage',
    type: 'numeric',
    precision: 5,
    scale: 2,
    transformer: numericTransformer,
  })
  guiltFreePercentage: number;

  @Column({
    name: 'fixed_costs',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  fixedCosts: number;

  @Column({
    name: 'savings_goals',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  savingsGoals: number;

  @Column({
    name: 'active_investments',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  activeInvestments: number;

  @Column({
    name: 'guilt_free_spending',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  guiltFreeSpending: number;

  @Column({ name: 'wealth_projection', type: 'jsonb' })
  wealthProjection: ProjectionPoint[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
