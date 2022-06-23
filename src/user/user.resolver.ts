import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserQL } from './entities/user.ql';
import { PrismaService } from '@/core/database/prisma.service';
import { Selected } from '@/common/decorators/selected.decorator';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { AuthService } from '@/core/auth/auth.service';
import PasswordValidator from 'password-validator';
import { HttpException, HttpStatus } from '@nestjs/common';
import { StandardExceptionBody } from '@/common/exceptions/standard-exception.mixin';
import { RequireCaptcha } from '@/core/auth/decorators/require-captcha.decorator';

// prettier-ignore
const passwordSpec = new PasswordValidator()
    .is().min(8).max(128)
    .has().lowercase()
    .has().uppercase()
    .has().digits()
    .has().symbols();

@Resolver(() => UserQL)
export class UserResolver {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authService: AuthService
    ) {}

    @RequireCaptcha(0.75)
    @Mutation(() => UserQL)
    createUser(@Args('createUserInput') createUserInput: CreateUserDto) {
        if (!passwordSpec.validate(createUserInput.password)) {
            throw new HttpException(
                <StandardExceptionBody>{
                    reason: 'PasswordValidationFailed',
                    message: `The provided password does not meet the security requirements.`,
                    metadata: passwordSpec.validate(createUserInput.password, { details: true })
                },
                HttpStatus.BAD_REQUEST
            );
        }
        return this.authService.register(createUserInput);
    }

    @Query(() => UserQL, { name: 'user' })
    findOne(
        @Args('id', { type: () => ID }) id: string,
        @Selected() fields: Record<string, boolean>
    ) {
        return this.prisma.user.findUnique({
            where: { id },
            select: fields
        });
    }

    @Query(() => [UserQL], { name: 'users' })
    findAll() {
        return this.prisma.user.findMany();
    }

    // @Mutation(() => User)
    // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    //     return this.userService.update(updateUserInput.id, updateUserInput);
    // }

    // @Mutation(() => User)
    // removeUser(@Args('id', { type: () => Int }) id: number) {
    //     return this.userService.remove(id);
    // }
}
