import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '@/core/auth/auth.service';
import { hardCookie } from '@/common/utils/cookies';
import { JwtTokenPair } from '@/core/auth/dto/jwt.dto';
import { Cookies } from '@/common/decorators/cookies.decorator';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => String)
    async login(
        @Args({ name: 'usernameOrEmail', type: () => String })
        usernameOrEmail: string,
        @Args({ name: 'password', type: () => String }) password: string,
        @Context() { res }: any
    ): Promise<string> {
        const user = await this.authService.useLocal(usernameOrEmail, password);

        const { fingerprint, token } = await this.authService.grantRefreshToken(
            user
        );

        hardCookie(res, 'fingerprint', fingerprint);
        return token;
    }

    @Mutation(() => JwtTokenPair)
    async refreshTokens(
        @Args({ name: 'refreshToken', type: () => String })
        refreshToken: string,
        @Context() { res }: any,
        @Cookies() cookies: Record<string, string>
    ): Promise<JwtTokenPair> {
        const user = await this.authService.useRefreshToken(
            refreshToken,
            cookies.fingerprint
        );

        const { fingerprint, token } = await this.authService.grantRefreshToken(
            user
        );
        hardCookie(res, 'fingerprint', fingerprint);
        return {
            access: await this.authService.grantAccessToken(user),
            refresh: token
        };
    }
}
