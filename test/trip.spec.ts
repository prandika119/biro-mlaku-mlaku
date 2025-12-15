/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
describe('TripController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testService = app.get(TestService);
    logger = app.get(WINSTON_MODULE_PROVIDER);
  });

  afterEach(async () => {
    await testService.deleteTrip();
    await testService.deleteUser();
  });

  describe('POST /api/trips', () => {
    beforeEach(async () => {
      await testService.createUserAdmin();
    });

    it('should reject if not logged in', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/trips')
        .send({
          name: 'Bali Adventure',
          description: 'Explore the beauty of Bali',
          location: 'Bali',
          start_date: '2025-12-25T10:00:00Z',
          end_date: '2025-12-27T18:00:00Z',
        });
      logger.info('Response:', response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject if not admin', async () => {
      await testService.createUser();

      const response = await request(app.getHttpServer())
        .post('/api/trips')
        .set('Authorization', 'test')
        .send({
          name: 'Bali Adventure',
          description: 'Explore the beauty of Bali',
          location: 'Bali',
          start_date: '2025-12-25T10:00:00Z',
          end_date: '2025-12-27T18:00:00Z',
        });

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject if request invalid (missing name)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/trips')
        .set('Authorization', 'admin')
        .send({
          description: 'Explore the beauty of Bali',
          location: 'Bali',
          start_date: '2025-12-25T10:00:00Z',
          end_date: '2025-12-27T18:00:00Z',
        });
      logger.info('Response missing name:', response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject if start_date is invalid format', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/trips')
        .set('Authorization', 'admin')
        .send({
          name: 'Bali Adventure',
          description: 'Explore the beauty of Bali',
          location: 'Bali',
          start_date: 'invalid-date',
          end_date: '2025-12-27T18:00:00Z',
        });
      logger.info('Response invalid start_date:', response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject if end_date is before start_date', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/trips')
        .set('Authorization', 'admin')
        .send({
          name: 'Bali Adventure',
          description: 'Explore the beauty of Bali',
          location: 'Bali',
          start_date: '2025-12-27T10:00:00Z',
          end_date: '2025-12-25T18:00:00Z',
        });
      logger.info('Response end_date before start_date:', response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to create trip if admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/trips')
        .set('Authorization', 'admin')
        .send({
          name: 'Bali Adventure',
          description: 'Explore the beauty of Bali',
          location: 'Bali',
          start_date: '2025-12-25T10:00:00Z',
          end_date: '2025-12-27T18:00:00Z',
        });
      logger.info('Response iniii:', response);
      expect(response.status).toBe(201);
    });
  });

  describe('GET /api/trips/:tripId', () => {
    beforeEach(async () => {
      await testService.createUserAdmin();
      await testService.createTrip();
    });

    it('should reject if not logged in', async () => {
      const trip = await testService.createTrip();

      const response = await request(app.getHttpServer()).get(
        `/api/trips/${trip.id}`,
      );

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject if trip not found', async () => {
      await testService.createUser();

      const response = await request(app.getHttpServer())
        .get('/api/trips/99999')
        .set('Authorization', 'test');

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get trip if logged in', async () => {
      await testService.createUser();
      const trip = await testService.createTrip();

      const response = await request(app.getHttpServer())
        .get(`/api/trips/${trip.id}`)
        .set('Authorization', 'test');

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(trip.id);
      expect(response.body.data.name).toBe('Test Trip');
      expect(response.body.data.description).toBe('Test trip description');
      expect(response.body.data.location).toBe('Bali');
      expect(response.body.data.start_date).toBeDefined();
      expect(response.body.data.end_date).toBeDefined();
    });
  });

  describe('PATCH /api/trips/:tripId', () => {
    beforeEach(async () => {
      await testService.createUserAdmin();
      await testService.createTrip();
    });

    it('should reject if not logged in', async () => {
      const trip = await testService.createTrip();

      const response = await request(app.getHttpServer())
        .patch(`/api/trips/${trip.id}`)
        .send({
          name: 'Updated Trip',
        });

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject if not admin', async () => {
      await testService.createUser();
      const trip = await testService.createTrip();

      const response = await request(app.getHttpServer())
        .patch(`/api/trips/${trip.id}`)
        .set('Authorization', 'test')
        .send({
          name: 'Updated Trip',
        });

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject if trip not found', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/trips/99999')
        .set('Authorization', 'admin')
        .send({
          name: 'Updated Trip',
        });

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject if end_date is before start_date', async () => {
      const trip = await testService.createTrip();

      const response = await request(app.getHttpServer())
        .patch(`/api/trips/${trip.id}`)
        .set('Authorization', 'admin')
        .send({
          start_date: '2025-12-27T10:00:00Z',
          end_date: '2025-12-25T18:00:00Z',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update trip if admin', async () => {
      const trip = await testService.createTrip();

      const response = await request(app.getHttpServer())
        .patch(`/api/trips/${trip.id}`)
        .set('Authorization', 'admin')
        .send({
          name: 'Updated Bali Trip',
          description: 'Updated description',
          location: 'Ubud, Bali',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(trip.id);
      expect(response.body.data.name).toBe('Updated Bali Trip');
      expect(response.body.data.description).toBe('Updated description');
      expect(response.body.data.location).toBe('Ubud, Bali');

      // Verify database updated
      const updatedTrip = await testService.getTrip(trip.id);
      expect(updatedTrip?.name).toBe('Updated Bali Trip');
    });

    it('should be able to update only dates', async () => {
      const trip = await testService.createTrip();

      const response = await request(app.getHttpServer())
        .patch(`/api/trips/${trip.id}`)
        .set('Authorization', 'admin')
        .send({
          start_date: '2026-01-01T08:00:00Z',
          end_date: '2026-01-05T20:00:00Z',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.start_date).toBe('2026-01-01T08:00:00.000Z');
      expect(response.body.data.end_date).toBe('2026-01-05T20:00:00.000Z');
      expect(response.body.data.name).toBe('Test Trip'); // Name unchanged
    });
  });

  describe('DELETE /api/trips/:tripId', () => {
    beforeEach(async () => {
      await testService.createUserAdmin();
      await testService.createTrip();
    });

    it('should reject if not logged in', async () => {
      const trip = await testService.createTrip();

      const response = await request(app.getHttpServer()).delete(
        `/api/trips/${trip.id}`,
      );

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject if not admin', async () => {
      await testService.createUser();
      const trip = await testService.createTrip();

      const response = await request(app.getHttpServer())
        .delete(`/api/trips/${trip.id}`)
        .set('Authorization', 'test');

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject if trip not found', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/trips/99999')
        .set('Authorization', 'admin');

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to delete trip if admin', async () => {
      const trip = await testService.createTrip();

      const response = await request(app.getHttpServer())
        .delete(`/api/trips/${trip.id}`)
        .set('Authorization', 'admin');

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);

      // Verify database deleted
      const deletedTrip = await testService.getTrip(trip.id);
      expect(deletedTrip).toBeNull();
    });
  });

  describe('GET /api/trips', () => {
    beforeEach(async () => {
      await testService.createUserAdmin();
    });

    it('should reject if not logged in', async () => {
      const response = await request(app.getHttpServer()).get('/api/trips');

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should return empty array when no trips', async () => {
      await testService.createUser();

      const response = await request(app.getHttpServer())
        .get('/api/trips')
        .set('Authorization', 'test');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it('should return all trips if logged in', async () => {
      await testService.createUser();
      await testService.createTrip();

      const response = await request(app.getHttpServer())
        .get('/api/trips')
        .set('Authorization', 'test');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('Test Trip');
    });
  });

  //   describe('POST /api/trips', () => {
  //     beforeEach(async () => {
  //       await testService.createUserAdmin();
  //     });

  //     it('should reject if not logged in', async () => {
  //       const trip = await testService.createTrip();
  //       const response = await request(app.getHttpServer())
  //         .post(`/api/trips/${trip.id}/participants`)
  //         .set('Authorization', 'admin')
  //         .send({
  //           userId: 1,
  //         });
  //       logger.info('Response:', response.body);

  //       expect(response.status).toBe(201);
  //       expect(response.body.errors).toBeDefined();
  //     });

  //     it('should reject if not admin', async () => {
  //       await testService.createUser();

  //       const response = await request(app.getHttpServer())
  //         .post('/api/trips')
  //         .set('Authorization', 'test')
  //         .send({
  //           name: 'Bali Adventure',
  //           description: 'Explore the beauty of Bali',
  //           location: 'Bali',
  //           start_date: '2025-12-25T10:00:00Z',
  //           end_date: '2025-12-27T18:00:00Z',
  //         });

  //       expect(response.status).toBe(403);
  //       expect(response.body.errors).toBeDefined();
  //     });

  //     it('should reject if request invalid (missing name)', async () => {
  //       const response = await request(app.getHttpServer())
  //         .post('/api/trips')
  //         .set('Authorization', 'admin')
  //         .send({
  //           description: 'Explore the beauty of Bali',
  //           location: 'Bali',
  //           start_date: '2025-12-25T10:00:00Z',
  //           end_date: '2025-12-27T18:00:00Z',
  //         });
  //       logger.info('Response missing name:', response.body);

  //       expect(response.status).toBe(400);
  //       expect(response.body.errors).toBeDefined();
  //     });

  //     it('should reject if start_date is invalid format', async () => {
  //       const response = await request(app.getHttpServer())
  //         .post('/api/trips')
  //         .set('Authorization', 'admin')
  //         .send({
  //           name: 'Bali Adventure',
  //           description: 'Explore the beauty of Bali',
  //           location: 'Bali',
  //           start_date: 'invalid-date',
  //           end_date: '2025-12-27T18:00:00Z',
  //         });
  //       logger.info('Response invalid start_date:', response.body);
  //       expect(response.status).toBe(400);
  //       expect(response.body.errors).toBeDefined();
  //     });

  //     it('should reject if end_date is before start_date', async () => {
  //       const response = await request(app.getHttpServer())
  //         .post('/api/trips')
  //         .set('Authorization', 'admin')
  //         .send({
  //           name: 'Bali Adventure',
  //           description: 'Explore the beauty of Bali',
  //           location: 'Bali',
  //           start_date: '2025-12-27T10:00:00Z',
  //           end_date: '2025-12-25T18:00:00Z',
  //         });
  //       logger.info('Response end_date before start_date:', response.body);
  //       expect(response.status).toBe(400);
  //       expect(response.body.errors).toBeDefined();
  //     });

  //     it('should be able to create trip if admin', async () => {
  //       const response = await request(app.getHttpServer())
  //         .post('/api/trips')
  //         .set('Authorization', 'admin')
  //         .send({
  //           name: 'Bali Adventure',
  //           description: 'Explore the beauty of Bali',
  //           location: 'Bali',
  //           start_date: '2025-12-25T10:00:00Z',
  //           end_date: '2025-12-27T18:00:00Z',
  //         });
  //       logger.info('Response iniii:', response);
  //       expect(response.status).toBe(201);
  //     });
  //   });
});
