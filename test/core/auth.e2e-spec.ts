import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/core/app.module';
import { isJWT } from 'class-validator';

describe('Auth (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('MUT login()', () => {
        const sendRequest = (usernameOrEmail: string, password: string) => {
            return request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: `mutation {login(usernameOrEmail: "${usernameOrEmail}", password: "${password}")}`
                })
                .expect(200);
        };

        it('should return a token for valid USERNAME + password', () => {
            return sendRequest('example', 'example').expect((res) => {
                expect(isJWT(res.body.data.login)).toBeTruthy();
            });
        });

        it('should return a token for valid EMAIL + password', () => {
            return sendRequest('example@example.com', 'example').expect((res) => {
                expect(isJWT(res.body.data.login)).toBeTruthy();
            });
        });

        it('should fail for incorrect password', () => {
            return sendRequest('example', 'WRONG_PASSWORD').expect({
                errors: ['Invalid credentials provided.'],
                data: null
            });
        });

        it('should fail for inactive user', () => {
            return sendRequest('inactive', 'inactive').expect({
                errors: [
                    'This user has been marked inactive. This can be corrected by an administrator.'
                ],
                data: null
            });
        });
    });
});
