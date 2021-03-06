import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthResolver } from '@/core/auth/auth.resolver';
import { AuthService } from '@/core/auth/auth.service';
import { MailModule } from '@/common/services/mail/mail.module';
import { JwtGuard } from '@/core/auth/guards/jwt.guard';
import { FullUserPipe } from '@/core/auth/pipes/full-user.pipe';

@Global()
@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                secret: config.get<string>('auth.jwt.secret')
            })
        }),
        MailModule
    ],
    providers: [AuthResolver, AuthService, JwtGuard, FullUserPipe],
    exports: [AuthService, JwtGuard, FullUserPipe]
})
export class AuthModule {}
