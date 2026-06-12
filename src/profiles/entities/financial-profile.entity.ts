import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { numericTransformer } from '../../database/numeric.transformer';
import { SpendingPlan } from './spending-plan.entity';

@Entity({ name: 'financial_profiles' })
export class FinancialProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({
    name: 'gross_salary',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  grossSalary: number;

  @Column({
    name: 'bank_net',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  bankNet: number;

  @OneToMany(() => SpendingPlan, (plan) => plan.profile, {
    cascade: true,
  })
  spendingPlans: SpendingPlan[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
