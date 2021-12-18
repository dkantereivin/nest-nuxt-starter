import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { PrismaService } from '@/core/database/prisma.service';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly prisma: PrismaService) {}

    // @Mutation(() => User)
    // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    //     return this.userService.create(createUserInput);
    // }

    @Query(() => User, { name: 'user' })
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.prisma.user.findUnique({
            where: { id }
        });
    }

    @Query(() => [User], { name: 'users' })
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
