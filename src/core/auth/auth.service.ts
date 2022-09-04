import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { PrismaService } from '@/core/database/prisma.service';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';
import { PrismaError } from '@/core/database/prisma-error.enum';
import { offendingFields } from '@/common/utils/prisma';
import { RedisService } from '@/core/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import {
    AccessPayload,
    FullAccessPayload,
    FullRefreshPayload,
    RefreshPayload,
    TokenFingerprintPair,
    TokenType
} from '@/core/auth/dto/jwt.dto';
import { generateFingerprint, sha256 } from '@/common/utils/crypto';
import * as AuthExceptions from '@/common/exceptions/auth';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { MailService } from '@/common/services/mail/mail.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export type UserNoPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        private readonly config: ConfigService
    ) {}

    async register(registrationData: CreateUserDto): Promise<UserNoPassword> {
        const hashedPassword = await hash(
            registrationData.password,
            this.config.get<number>('auth.saltRounds')
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
            await this.sendConfirmationEmail(createdUser);
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

    async useLocal(userOrEmail: string, password: string): Promise<UserNoPassword> {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: userOrEmail }, { username: userOrEmail }]
            }
        });

        if (!user) {
            throw new AuthExceptions.UserNotFound();
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw new AuthExceptions.InvalidCredentials();
        }

        if (!user.active) {
            throw new AuthExceptions.UserDisabled();
        }

        delete user.password;
        return user;
    }

    async sendConfirmationEmail(user: UserNoPassword): Promise<void> {
        const token = await this.jwtService.signAsync(
            { email: user.email },
            {
                subject: user.id,
                expiresIn: '1d'
            }
        );
        const url = `${token}`;
        await this.mailService.sendTemplate('emailConfirm', user.email, {
            appName: this.config.get<string>('app.name'),
            username: user.username,
            email: user.email,
            url
        });
    }

    async verifyUserEmailByToken(token: string): Promise<UserNoPassword> {
        const { subject, email } = await this.jwtService.verifyAsync(token).catch((e) => {
            if (e instanceof TokenExpiredError) {
                throw new AuthExceptions.TokenExpired();
            } else if (e instanceof JsonWebTokenError) {
                throw new AuthExceptions.TokenInvalid();
            }
            throw e;
        });
        return this.verifyUserEmail(subject, email);
    }

    async verifyUserEmail(id: string, email: string): Promise<UserNoPassword> {
        return this.prisma.user
            .update({
                data: {
                    emailVerified: true
                },
                where: {
                    id,
                    email
                }
            })
            .catch((e) => {
                if (
                    e instanceof PrismaClientKnownRequestError &&
                    e.code === PrismaError.RelatedRecordNotFound
                ) {
                    throw new AuthExceptions.UserNotFound();
                }
                throw e;
            });
    }

    async grantAccessToken(user: UserNoPassword, restricted?: boolean): Promise<string> {
        return await this.jwtService.signAsync(
            <AccessPayload>{
                t: TokenType.ACCESS,
                username: user.username,
                restricted
            },
            {
                subject: user.id,
                expiresIn: `${this.config.get<string>('auth.jwt.time.access')}s`
            }
        );
    }

    async grantRefreshToken(user: UserNoPassword): Promise<TokenFingerprintPair> {
        const fingerprint = generateFingerprint();
        const expirySeconds = parseInt(this.config.get<string>('auth.jwt.time.refresh'));

        const payload: RefreshPayload = {
            t: TokenType.REFRESH,
            fingerprint: sha256(fingerprint),
            username: user.username
        };
        const token = await this.jwtService.signAsync(payload, {
            subject: user.id,
            expiresIn: `${expirySeconds}s`
        });

        await this.redis.set(`jwt:${sha256(token)}:usages`, 0, 'ex', expirySeconds * 2);
        return { fingerprint, token };
    }

    async useAccessToken(token: string): Promise<FullAccessPayload> {
        const payload: FullAccessPayload = await this.jwtService
            .verifyAsync<FullAccessPayload>(token)
            .catch((e) => {
                if (e instanceof TokenExpiredError) {
                    throw new AuthExceptions.TokenExpired();
                } else if (e instanceof JsonWebTokenError) {
                    throw new AuthExceptions.TokenInvalid();
                }
                throw e;
            });

        if (payload.t !== TokenType.ACCESS) {
            throw new AuthExceptions.TokenInvalid();
        }

        return payload;
    }

    async useRefreshToken(token: string, fingerprint: string): Promise<UserNoPassword> {
        const payload: FullRefreshPayload = await this.jwtService.verifyAsync(token).catch((e) => {
            if (e instanceof TokenExpiredError) {
                throw new AuthExceptions.TokenExpired();
            } else if (e instanceof JsonWebTokenError) {
                throw new AuthExceptions.TokenInvalid();
            }
            throw e;
        });

        if (payload.t !== TokenType.REFRESH) {
            throw new AuthExceptions.TokenInvalid();
        }

        if (sha256(fingerprint) !== payload.fingerprint) {
            throw new AuthExceptions.FingerprintMismatch();
        }

        if (parseInt(await this.redis.get(`jwt:${token}:usages`)) >= 1) {
            // TODO: add security follow up to better address replay/side-jacking
            throw new AuthExceptions.TokenUsed();
        }

        await this.redis.incr(`jwt:${token}:usages`);

        const user = await this.prisma.user.findFirst({
            where: { id: payload.subject, active: true }
        });

        if (!user) {
            throw new AuthExceptions.UserNotFound();
        }

        delete user.password;
        return user;
    }
}
