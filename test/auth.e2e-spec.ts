import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth & Booking E2E', () => {
  let app: INestApplication;
  let token: string;
  let roomId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // ================= REGISTER =================
  it('Register user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@mail.com`,
        password: '123456',
      });

    expect(res.status).toBe(201);
  });

  // ================= LOGIN =================
  it('Login user dan dapat token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'tester@mail.com',
        password: '123456',
      })
      .expect(201);

    expect(res.body.access_token).toBeDefined();

    token = res.body.access_token;
  });

  // ================= CREATE ROOM =================
  it('Create room', async () => {
    const res = await request(app.getHttpServer())
      .post('/rooms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Meeting Room B',
        capacity: 10,
        location: 'Lantai 1',
      })
      .expect(201);

    roomId = res.body.id;
  });

  // ================= BOOK ROOM =================
  it('Booking room pakai token', async () => {
    await request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomId: roomId,
        startTime: '2026-02-14T10:00:00.000Z',
        endTime: '2026-02-14T11:00:00.000Z',
      })
      .expect(201);
  });

  // ================= WITHOUT TOKEN =================
  it('Booking tanpa token harus gagal', async () => {
    await request(app.getHttpServer())
      .post('/bookings')
      .send({
        roomId: roomId,
        startTime: '2026-02-14T12:00:00.000Z',
        endTime: '2026-02-14T13:00:00.000Z',
      })
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
