import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/core/database/prisma.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import faker from '@faker-js/faker';

describe('AuthService', () => {
    let provider: AuthService;
    let prisma: DeepMocked<PrismaService>;
    const config = new Map();
    config.set('auth.saltRounds', 10);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService]
        })
            .useMocker((token) => {
                switch (token) {
                    case ConfigService:
                        return new Map([['auth.saltRounds', 10]]);
                    case PrismaService:
                        return createMock<PrismaService>({
                            user: {
                                create: jest.fn().mockImplementation((v) => v)
                            }
                        });
                    default:
                        return null;
                }
            })
            .compile();

        provider = module.get<AuthService>(AuthService);
        prisma = module.get(PrismaService);
    });

    test('register should correctly create a user in the database', async () => {
        const dto = {
            email: faker.internet.email(),
            username: faker.internet.userName(),
            password: faker.internet.password()
        };

        await provider.register(dto);

        expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
                active: false,
                email: dto.email,
                username: dto.username,
                password: expect.stringContaining('$2b$10$')
            }
        });
    });

    test('register should return a user with no password', async () => {
        const user = await provider.register({
            email: faker.internet.email(),
            username: faker.internet.userName(),
            password: faker.internet.password()
        });
        expect((<any>user).password).toBeUndefined();
    });
});
