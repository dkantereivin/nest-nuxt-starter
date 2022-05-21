import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { UserQL } from './entities/user.ql';
import { PrismaService } from '@/core/database/prisma.service';
import { Selected } from '@/common/decorators/selected.decorator';

@Resolver(() => UserQL)
export class UserResolver {
    constructor(private readonly prisma: PrismaService) {}

    // @Mutation(() => User)
    // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    //     return this.userService.create(createUserInput);
    // }

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
