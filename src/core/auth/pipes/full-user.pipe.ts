import { Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service';
import { UserNoPassword } from '@/core/auth/auth.service';

@Injectable()
export class FullUserPipe implements PipeTransform<string, Promise<UserNoPassword>> {
    constructor(private readonly prisma: PrismaService) {}

    async transform(id: string): Promise<UserNoPassword> {
        const user = await this.prisma.user.findFirst({
            where: { id }
        });
        delete user.password;
        return user;
    }
}
