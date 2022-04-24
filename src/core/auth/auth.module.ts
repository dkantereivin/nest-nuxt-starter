import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthResolver } from '@/core/auth/auth.resolver';
import { AuthService } from '@/core/auth/auth.service';
import { MailModule } from '@/common/services/mail/mail.module';

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
    providers: [AuthResolver, AuthService]
})
export class AuthModule {}
