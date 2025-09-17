/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Server } from 'node:net';
import { initApp } from '../src/app.init';
import { DatabaseService } from '../src/database/database.service';

describe('AppController (e2e)', () => {
  let nest: INestApplication;
  let app: Server;
  let dbService: DatabaseService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    nest = moduleFixture.createNestApplication();
    initApp(nest);
    dbService = moduleFixture.get<DatabaseService>(DatabaseService);
    app = nest.getHttpServer() as Server;
    await nest.init();
    await dbService.resetData();
  });

  afterAll(async () => {
    await nest.close();
  });

  // GET /users tests
  describe('GET /users', () => {
    it('should return empty array initially', async () => {
      const response = await request(app).get('/users').expect(200);
      expect(response.body).toEqual([]);
    });

    it('should return all users', async () => {
      await request(app)
        .post('/users')
        .send({ name: 'John Doe', age: 25, isAdmin: false });
      await request(app)
        .post('/users')
        .send({ name: 'Jane Smith', age: 30, isAdmin: true });
      const response = await request(app).get('/users').expect(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({ name: 'John Doe' });
      expect(response.body[1]).toMatchObject({ name: 'Jane Smith' });
    });
  });

  // GET /users/:id tests
  describe('GET /users/:id', () => {
    beforeEach(async () => {
      await request(app)
        .post('/users')
        .send({ name: 'Test User', age: 28, isAdmin: false });
    });

    it('should return specific user by ID', async () => {
      const response = await request(app).get('/users/1').expect(200);
      expect(response.body).toMatchObject({ id: 1, name: 'Test User' });
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).get('/users/999').expect(404);
      // FIX: Check NestJS's default error structure
      expect(response.body.message).toEqual('User not found');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).get('/users/abc').expect(400);
      // FIX: Check NestJS's default error structure for pipes
      expect(response.body.message).toContain('Validation failed (numeric string is expected)');
    });
  });

  // POST /users tests
  describe('POST /users', () => {
    it('should create new user with valid data', async () => {
      const userData = { name: 'New User', age: 22, isAdmin: true };
      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(201);
      expect(response.body).toMatchObject(userData);
    });

    it('should auto-increment IDs', async () => {
      await request(app)
        .post('/users')
        .send({ name: 'User 1', age: 25, isAdmin: false });
      const response = await request(app)
        .post('/users')
        .send({ name: 'User 2', age: 30, isAdmin: true });
      expect(response.body.id).toBe(2);
    });

    // FIX: This test will now pass because of the @Transform decorator
    it('should trim whitespace from input', async () => {
      const response = await request(app)
        .post('/users')
        .send({ name: '  Trimmed Name  ', age: 35, isAdmin: false })
        .expect(201);
      expect(response.body.name).toBe('Trimmed Name');
    });

    it('should return 400 for missing name', async () => {
      const response = await request(app)
        .post('/users')
        .send({ age: 25, isAdmin: false })
        .expect(400);
      // FIX: Check for specific validation messages in the array
      expect(response.body.message).toContain('name should not be empty');
    });

    it('should return 400 for missing age', async () => {
      const response = await request(app)
        .post('/users')
        .send({ name: 'John Doe', isAdmin: true })
        .expect(400);
      // FIX: Check for specific validation messages in the array
      expect(response.body.message).toContain('age must be an integer number');
    });

    // FIX: This test will now pass because isAdmin is optional
    it('should default isAdmin to false when not provided', async () => {
      const response = await request(app)
        .post('/users')
        .send({ name: 'John Doe', age: 25 })
        .expect(201);
      expect(response.body.isAdmin).toBe(false);
    });
  });

  // PUT /users/:id tests
  describe('PUT /users/:id', () => {
    beforeEach(async () => {
      await request(app)
        .post('/users')
        .send({ name: 'Original User', age: 30, isAdmin: false });
    });

    it('should update existing user', async () => {
      const updateData = { name: 'Updated User', age: 35, isAdmin: true };
      const response = await request(app)
        .put('/users/1')
        .send(updateData)
        .expect(200);
      expect(response.body).toMatchObject(updateData);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .put('/users/999')
        .send({ name: 'Updated', age: 25, isAdmin: false })
        .expect(404);
      // FIX: Check NestJS's default error structure
      expect(response.body.message).toBe('User not found');
    });
  });

  // DELETE /users/:id tests
  describe('DELETE /users/:id', () => {
    beforeEach(async () => {
      await request(app)
        .post('/users')
        .send({ name: 'User to Delete', age: 25, isAdmin: false });
    });

    it('should delete existing user', async () => {
      const response = await request(app).delete('/users/1').expect(200);
      expect(response.body.message).toBe('User deleted');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).delete('/users/999').expect(404);
      // FIX: Check NestJS's default error structure
      expect(response.body.message).toBe('User not found');
    });
  });
});