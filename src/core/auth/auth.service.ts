import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '@/core/database/prisma.service';
import { hash, compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';
import { PrismaError } from '@/core/database/prisma-error.enum';
import { offendingFields } from '@/common/utils/prisma';

type UserNoPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService
    ) {}

    async register(registrationData: RegisterDto): Promise<UserNoPassword> {
        // todo: validate password strength
        const hashedPassword = await hash(
            registrationData.password,
            this.config.get<string>('auth.saltRounds')
        );

        try {
            const createdUser = await this.prisma.user.create({
                data: {
                    ...registrationData,
                    active: false,
                    password: hashedPassword
                }
            });
            delete createdUser.password;
            return createdUser;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === PrismaError.UniqueConstraintViolation) {
                    throw new HttpException(
                        {
                            reason: 'UniqueConstraintViolation',
                            message: `User with the provided ${offendingFields(
                                (error.meta as any).target
                            )} already exists.`
                        },
                        HttpStatus.CONFLICT
                    );
                }
            }
            throw error;
        }
    }

    async validateLocal(
        userOrEmail: string,
        password: string
    ): Promise<UserNoPassword> {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: userOrEmail }, { username: userOrEmail }]
            }
        });

        if (!user) {
            throw new HttpException(
                {
                    reason: 'UserNotFound',
                    message: `User with the provided username or email was not found.`
                },
                HttpStatus.NOT_FOUND
            );
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw new HttpException(
                {
                    reason: 'InvalidCredentials',
                    message: `Invalid credentials provided.`
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        if (!user.active) {
            throw new HttpException(
                {
                    reason: 'UserDisabled',
                    message: `This user has been marked inactive. This can be corrected by an administrator.`
                },
                HttpStatus.FORBIDDEN
            );
        }

        delete user.password;
        return user;
    }
}
