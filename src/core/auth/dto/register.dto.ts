import { Prisma } from '@prisma/client';

export class RegisterDto implements Prisma.UserCreateInput {
    readonly username: string;
    readonly email: string;
    readonly password: string;
}
