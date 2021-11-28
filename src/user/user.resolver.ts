import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from '@/user/user.model';

@Resolver((of) => User)
export class UserResolver {
    @Query((returns) => User)
    user() {
        return {
            id: 'user-id',
            username: 'username'
        };
    }
}
