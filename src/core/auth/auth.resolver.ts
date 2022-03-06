import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '@/core/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@/core/auth/dto/jwt.dto';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService
    ) {}

    @Mutation(() => String)
    async login(
        @Args({ name: 'usernameOrEmail', type: () => String })
        usernameOrEmail: string,
        @Args({ name: 'password', type: () => String }) password: string
    ) {
        const user = await this.authService.validateLocal(
            usernameOrEmail,
            password
        );

        return await this.jwtService.signAsync(
            <JwtPayload>{
                username: user.username
            },
            {
                subject: user.id,
                expiresIn: this.config.get<string>('auth.jwt.time.refresh')
            }
        );
    }

    getAccessToken() {
        return 'access_token';
    }

    refresh() {
        // login or refresh token
        return 'refresh_token';
    }
}
