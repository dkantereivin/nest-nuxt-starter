import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/core/app.module';

describe('Help (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('ping -> pong', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({ query: '{help(name: "ping"){message}}' })
            .expect(200)
            .expect({ data: { help: { message: 'pong' } } });
    });
});
