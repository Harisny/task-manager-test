import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';
import { AppModule } from './../src/app.module';
import { User } from '../src/common/entities/user.entity';

type LoginResponseBody = {
  data?: { accessToken?: string };
};

type MeResponseBody = {
  data?: { email?: string };
};

const getAccessToken = (body: unknown): string | undefined => {
  const typedBody = body as LoginResponseBody;
  return typedBody.data?.accessToken;
};

// test e2e untuk fitur autentikasi dan validasi token
describe('Auth token (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  const testUser = {
    name: 'Test User',
    email: `test-${randomUUID()}@example.com`,
    password: 'secret123',
  };

  beforeAll(async () => {
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = 'test-secret';
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
    await dataSource.getRepository(User).delete({ email: testUser.email });
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.getRepository(User).delete({ email: testUser.email });
    }
    await app.close();
  });

  it('register, login, dan validate token', async () => {
    const server = app.getHttpServer();

    await request(server).post('/api/auth/register').send(testUser).expect(201);

    const loginResponse = await request(server)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    const accessToken = getAccessToken(loginResponse.body);
    expect(accessToken).toBeDefined();

    await request(server)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        const responseBody = res.body as MeResponseBody;
        expect(responseBody.data?.email).toBe(testUser.email);
      });
  });
});
