import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '@/core/auth/auth.service';
import { hardCookie } from '@/common/utils/cookies';
import { JwtTokenPair } from '@/core/auth/dto/jwt.dto';
import * as AuthExceptions from '@/common/exceptions/auth';
import { Cookies } from '@/common/decorators/cookies.decorator';
import { User } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => String)
    async login(
        @Args({ name: 'usernameOrEmail', type: () => String })
        usernameOrEmail: string,
        @Args({ name: 'password', type: () => String }) password: string,
        @Context() { res }: any
    ): Promise<JwtTokenPair> {
        const user = await this.authService.useLocal(usernameOrEmail, password);

        const { fingerprint, token } = await this.authService.grantRefreshToken(user);

        hardCookie(res, 'fingerprint', fingerprint);

        return {
            access: await this.authService.grantAccessToken(user, true),
            refresh: token
        };
    }

    @Mutation(() => JwtTokenPair)
    async refreshTokens(
        @Args({ name: 'refreshToken', type: () => String })
        refreshToken: string,
        @Context() { res }: any,
        @Cookies() cookies: Record<string, string>
    ): Promise<JwtTokenPair> {
        const user = await this.authService.useRefreshToken(refreshToken, cookies.fingerprint);

        if (!user.emailVerified) {
            throw new AuthExceptions.UserUnverified();
        }

        const { fingerprint, token } = await this.authService.grantRefreshToken(user);
        hardCookie(res, 'fingerprint', fingerprint);
        return {
            access: await this.authService.grantAccessToken(user),
            refresh: token
        };
    }

    // todo: make mutation require sign in with matching email with restricted allowed
    @Mutation(() => Boolean)
    async resendEmailConfirmation(
        @Args({ name: 'email', type: () => String }) email: string
    ): Promise<boolean> {
        throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
        let user: User;
        await this.authService.sendConfirmationEmail(user);
    }
}
