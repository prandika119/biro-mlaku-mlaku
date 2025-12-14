import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController', () => {
  let app: INestApplication<App>;
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

  describe('Post /api/users', () => {
    beforeEach(async () => {
      // Clear test user if exists
      await testService.deleteUser();
    });
    it('it should be rejected if not login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          email: 'not-an-email',
          name: 'a',
          password: '',
        });
      logger.info('Response from register request', { response });
      expect(response.status).toBe(401);
      // expect(errors?).toBeDefined();
      expect(response.body).toHaveProperty('errors');
    });
    it('it should be rejected if not admin', async () => {
      await testService.createUser(); // create normal user to get token
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          email: 'not-an-email',
          name: 'a',
          password: '',
        })
        .set('Authorization', 'test');
      logger.info('Response from register request', { response });
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('errors');
    });
    it('it should register new user', async () => {
      await testService.createUserAdmin(); // create admin user to get token
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          name: 'John Doe',
          email: 'test@example.com',
          phone: '1234567890',
          password: 'securepassword',
          confirmPassword: 'securepassword',
        })
        .set('Authorization', 'admin');
      console.log(response.body);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
    });

    it('it should rejected if email already exist', async () => {
      await testService.createUser();
      await testService.createUserAdmin();
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          name: 'John Doe',
          email: 'test@example.com',
          phone: '1234567890',
          password: 'securepassword',
          confirmPassword: 'securepassword',
        })
        .set('Authorization', 'admin');
      console.log(response.body);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });
  describe('Post /api/users/login', () => {
    beforeEach(async () => {
      // Clear test user if exists
      await testService.deleteUser();
      await testService.createUser();
    });
    it('it should be rejected if request invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: '',
        });
      logger.info('Response from register request');
      expect(response.status).toBe(400);
      // expect(response.body.errors?).toBeDefined();
      expect(response.body).toHaveProperty('errors');
    });
    it('it should be to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'test',
        });
      console.log(response.body);
      const data = response.body.data;
      expect(response.status).toBe(200);
      expect(data.username).toBe('test');
      expect(data.email).toBe('test@example.com');
      expect(data.token).toBeDefined();
      expect(response.body).toHaveProperty('data');
    });
  });
  describe('Get /api/users/profile', () => {
    beforeEach(async () => {
      // Clear test user if exists
      await testService.deleteUser();
      await testService.createUser();
    });
    it('it should be rejected if token invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/profile')
        .set('Authorization', 'invalid-token');
      logger.info('Response from register request');
      expect(response.status).toBe(401);
      // expect(response.body.errors?).toBeDefined();
      expect(response.body).toHaveProperty('errors');
    });
    it('it should be to login', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/profile')
        .set('Authorization', 'test');
      logger.info('Response from register request');
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
    });
  });

  describe('Get /api/users', () => {
    beforeEach(async () => {
      // Clear test user if exists
      await testService.deleteUser();
    });
    it('it should be rejected if not admin', async () => {
      const user1 = await testService.createUser();
      const response = await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', user1.token!);
      logger.info('Response from register request');
      expect(response.status).toBe(403);
      // expect(response.body.errors?).toBeDefined();
      expect(response.body).toHaveProperty('errors');
    });
    it('it should be to get all users if admin', async () => {
      const admin = await testService.createUserAdmin();
      const response = await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', admin.token!);
      logger.info('Response from register request', { response });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Patch /api/users/:id', () => {
    beforeEach(async () => {
      // Clear test user if exists
      await testService.deleteUser();
    });
    it('it should be rejected if not login', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/1')
        .send({
          email: 'not-an-email',
          name: 'a',
          password: '',
        });
      logger.info('Response from register request', { response });
      expect(response.status).toBe(401);
      // expect(errors?).toBeDefined();
      expect(response.body).toHaveProperty('errors');
    });
    it('it should be rejected if not admin', async () => {
      const user1 = await testService.createUser();
      const response = await request(app.getHttpServer())
        .patch(`/api/users/${user1.id}`)
        .send({
          email: 'not-an-email',
          name: 'a',
          password: '',
        })
        .set('Authorization', user1.token!);
      logger.info('Response from register request', { response });
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('errors');
    });
    it('it should update user if admin', async () => {
      const user1 = await testService.createUser();
      const admin = await testService.createUserAdmin();
      const response = await request(app.getHttpServer())
        .patch(`/api/users/${user1.id}`)
        .send({
          username: 'test-update',
          name: 'John Doe',
          email: 'test-update@example.com',
          phone: '1234567890',
        })
        .set('Authorization', admin.token!);
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.username).toBe('test-update');
      expect(response.body.data.email).toBe('test-update@example.com');
    });
  });

  describe('Delete /api/users/:id', () => {
    beforeEach(async () => {
      // Clear test user if exists
      await testService.deleteUser();
    });

    it('should be rejected if not login', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/users/1',
      );

      logger.info('Response from delete request without auth');
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.success).toBe(false);
    });

    it('should be rejected if not admin', async () => {
      const user1 = await testService.createUser();
      const response = await request(app.getHttpServer())
        .delete(`/api/users/${user1.id}`)
        .set('Authorization', user1.token!);

      logger.info('Response from delete request with non-admin token');
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.success).toBe(false);
    });

    it('should delete user if admin', async () => {
      const user1 = await testService.createUser();
      const admin = await testService.createUserAdmin();

      const response = await request(app.getHttpServer())
        .delete(`/api/users/${user1.id}`)
        .set('Authorization', admin.token!);
      logger.info('Response from delete request with admin token', {
        response,
      });
      console.log('Delete response:', response.body);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 404 if user not found', async () => {
      const admin = await testService.createUserAdmin();

      const response = await request(app.getHttpServer())
        .delete('/api/users/99999') // ID yang tidak ada
        .set('Authorization', admin.token!);

      console.log('Delete non-existent user response:', response.body);
      logger.info('Response from delete non-existent user request', {
        response,
      });
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('errors');
    });
  });
});
