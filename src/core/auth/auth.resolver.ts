import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '@/core/auth/auth.service';
import { hardCookie } from '@/common/utils/cookies';
import { JwtTokenPair } from '@/core/auth/dto/jwt.dto';
import * as AuthExceptions from '@/common/exceptions/auth';
import { Cookies } from '@/common/decorators/cookies.decorator';
import { User } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '@/core/auth/guards/jwt.guard';
import { AllowRestricted } from '@/core/auth/decorators/allow-restricted.decorator';
import { FullUser } from '@/core/auth/decorators/full-user.decorator';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => JwtTokenPair)
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
    // todo: implement rate-limit (based on keys) in redis, as a decorator (by userid)
    @Mutation(() => String)
    @UseGuards(JwtGuard)
    @AllowRestricted()
    async resendEmailConfirmation(
        @Args({ name: 'email', type: () => String }) email: string,
        @FullUser() user: User
    ): Promise<string> {
        await this.authService.sendConfirmationEmail(user);
        return email;
    }
}
