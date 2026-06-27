import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { CalculationsController } from '../src/calculations/calculations.controller';
import { CalculationsService } from '../src/calculations/calculations.service';
import { HealthController } from '../src/health/health.controller';
import { HealthService } from '../src/health/health.service';
import { ProfilesController } from '../src/profiles/profiles.controller';
import { ProfilesService } from '../src/profiles/profiles.service';

describe('Intelligent Investor API (e2e)', () => {
  let app: INestApplication;
  const profileId = '11111111-1111-4111-8111-111111111111';
  const profile = {
    id: profileId,
    name: 'Ada',
    grossSalary: 10000,
    bankNet: 8000,
    spendingPlans: [],
  };
  const profilesService = {
    create: jest.fn().mockResolvedValue(profile),
    findAll: jest.fn().mockResolvedValue([profile]),
    findOne: jest.fn().mockResolvedValue(profile),
    update: jest.fn().mockResolvedValue({ ...profile, name: 'Ada Lovelace' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };
  const healthService = {
    check: jest.fn().mockResolvedValue({
      status: 'ok',
      database: 'connected',
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [
        CalculationsController,
        ProfilesController,
        HealthController,
      ],
      providers: [
        CalculationsService,
        { provide: ProfilesService, useValue: profilesService },
        { provide: HealthService, useValue: healthService },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /calculations calculates all buckets and projection', async () => {
    const response = await request(app.getHttpServer())
      .post('/calculations')
      .send({ grossSalary: 10000, bankNet: 8000 })
      .expect(201);

    expect(response.body.fixedCosts).toBe(4400);
    expect(response.body.savingsGoals).toBe(800);
    expect(response.body.activeInvestments).toBe(800);
    expect(response.body.guiltFreeSpending).toBe(2200);
    expect(response.body.wealthProjection).toHaveLength(15);
  });

  it('POST /calculations rejects invalid calculation input', () =>
    request(app.getHttpServer())
      .post('/calculations')
      .send({ grossSalary: -1, bankNet: 8000 })
      .expect(400));

  it('POST /profiles saves a profile', async () => {
    await request(app.getHttpServer())
      .post('/profiles')
      .send({ name: 'Ada', grossSalary: 10000, bankNet: 8000 })
      .expect(201)
      .expect(profile);

    expect(profilesService.create).toHaveBeenCalledWith({
      name: 'Ada',
      grossSalary: 10000,
      bankNet: 8000,
    });
  });

  it('POST /profiles rejects invalid profile input', () =>
    request(app.getHttpServer())
      .post('/profiles')
      .send({ name: '', grossSalary: 10000, bankNet: 8000 })
      .expect(400));

  it('GET /profiles lists saved profiles', async () => {
    await request(app.getHttpServer())
      .get('/profiles')
      .expect(200)
      .expect([profile]);

    expect(profilesService.findAll).toHaveBeenCalledTimes(1);
  });

  it('GET /profiles/:id reloads one profile', async () => {
    await request(app.getHttpServer())
      .get(`/profiles/${profileId}`)
      .expect(200)
      .expect(profile);

    expect(profilesService.findOne).toHaveBeenCalledWith(profileId);
  });

  it('GET /profiles/:id rejects invalid profile ids', () =>
    request(app.getHttpServer()).get('/profiles/not-a-uuid').expect(400));

  it('PATCH /profiles/:id updates a profile', async () => {
    await request(app.getHttpServer())
      .patch(`/profiles/${profileId}`)
      .send({ name: 'Ada Lovelace' })
      .expect(200)
      .expect({ ...profile, name: 'Ada Lovelace' });

    expect(profilesService.update).toHaveBeenCalledWith(profileId, {
      name: 'Ada Lovelace',
    });
  });

  it('PATCH /profiles/:id rejects invalid profile ids', () =>
    request(app.getHttpServer())
      .patch('/profiles/not-a-uuid')
      .send({ name: 'Ada Lovelace' })
      .expect(400));

  it('DELETE /profiles/:id removes a profile', async () => {
    await request(app.getHttpServer())
      .delete(`/profiles/${profileId}`)
      .expect(204);

    expect(profilesService.remove).toHaveBeenCalledWith(profileId);
  });

  it('DELETE /profiles/:id rejects invalid profile ids', () =>
    request(app.getHttpServer()).delete('/profiles/not-a-uuid').expect(400));

  it('GET /health reports service and database readiness', async () => {
    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok', database: 'connected' });

    expect(healthService.check).toHaveBeenCalledTimes(1);
  });
});
