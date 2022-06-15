import { Prisma } from '@prisma/client';
import { Field, InputType } from '@nestjs/graphql';
import { IsAlphanumeric, IsEmail, Length, MinLength } from 'class-validator';

@InputType()
export class CreateUserDto implements Prisma.UserCreateInput {
    @Length(3, 32)
    @IsAlphanumeric()
    @Field()
    readonly username: string;

    @IsEmail()
    @Field()
    readonly email: string;

    @MinLength(6)
    @Field()
    readonly password: string;
}
