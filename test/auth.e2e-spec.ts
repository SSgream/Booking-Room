import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth & Booking E2E (PRO)', () => {
  let app: INestApplication;

  let token: string;
  let roomId: number;
  let testEmail: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  /*
  =====================================
  HELPER FUNCTION
  =====================================
  */

  const registerUser = async () => {
    testEmail = `test${Date.now()}@mail.com`;

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'E2E User',
        email: testEmail,
        password: '123456',
      });

    expect(res.status).toBe(201);
  };

  const loginUser = async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testEmail,
        password: '123456',
      });

    expect(res.status).toBe(201);
    expect(res.body.access_token).toBeDefined();

    token = res.body.access_token;
  };

  const createRoom = async () => {
    const res = await request(app.getHttpServer())
      .post('/rooms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Meeting Room PRO',
        capacity: 10,
        location: 'Lantai 5',
      });

    expect(res.status).toBe(201);

    roomId = res.body.id;
  };

  /*
  =====================================
  TEST FLOW
  =====================================
  */

  it('Register User', async () => {
    await registerUser();
  });

  it('Login User', async () => {
    await loginUser();
  });

  it('Create Room', async () => {
    await createRoom();
  });

  it('Booking Room With Token', async () => {
    const res = await request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomId: roomId,
        startTime: '2026-02-14T10:00:00.000Z',
        endTime: '2026-02-14T11:00:00.000Z',
      });

    expect(res.status).toBe(201);
  });

  it('Booking Without Token Must Fail', async () => {
    const res = await request(app.getHttpServer())
      .post('/bookings')
      .send({
        roomId: roomId,
        startTime: '2026-02-14T12:00:00.000Z',
        endTime: '2026-02-14T13:00:00.000Z',
      });

    expect(res.status).toBe(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
