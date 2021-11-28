import { Module } from '@nestjs/common';
import { UserResolver } from '@/user/user.resolver';

@Module({
    providers: [UserResolver]
})
export class UserModule {}
