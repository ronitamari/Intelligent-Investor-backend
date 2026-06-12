import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalculationsModule } from './calculations/calculations.module';
import { FinancialProfile } from './profiles/entities/financial-profile.entity';
import { SpendingPlan } from './profiles/entities/spending-plan.entity';
import { HealthModule } from './health/health.module';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'investor'),
        password: config.get<string>('DB_PASSWORD', 'investor_password'),
        database: config.get<string>('DB_NAME', 'intelligent_investor'),
        entities: [FinancialProfile, SpendingPlan],
        synchronize: config.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
        ssl:
          config.get<string>('DB_SSL', 'false') === 'true'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    CalculationsModule,
    ProfilesModule,
    HealthModule,
  ],
})
export class AppModule {}
