import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '@/core/auth/auth.service';
import { Unauthorized } from '@/common/exceptions/auth';
import { Reflector } from '@nestjs/core';
import { FullAccessPayload } from '@/core/auth/dto/jwt.dto';
import { ALLOW_RESTRICTED_METADATA } from '@/core/auth/decorators/allow-restricted.decorator';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, private readonly authService: AuthService) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const { req } = GqlExecutionContext.create(ctx).getContext();
        const rawToken: string = req.get('Authorization');
        if (!rawToken) {
            throw new Unauthorized();
        }

        const [, parsed] = rawToken.split(' ');
        const payload: FullAccessPayload = await this.authService.useAccessToken(parsed);
        req.payload = payload;

        if (payload.restricted) {
            const allowed = this.reflector.get<boolean | undefined>(
                ALLOW_RESTRICTED_METADATA,
                ctx.getHandler()
            );
            if (!allowed) return false;
        }

        return true;
    }
}
