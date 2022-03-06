import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthResolver } from '@/core/auth/auth.resolver';
import { AuthService } from '@/core/auth/auth.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('auth.jwt.secret')
            })
        })
    ],
    providers: [AuthResolver, AuthService]
})
export class AuthModule {}
