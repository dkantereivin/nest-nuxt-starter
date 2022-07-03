import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
export class UserQL {
    @Field(() => ID)
    id: string;

    @Field()
    active: boolean;

    @Field()
    email: string;

    @Field()
    username: string;

    @Field()
    emailVerified: boolean;

    @Field(() => GraphQLISODateTime)
    createdAt: Date;

    @Field(() => GraphQLISODateTime)
    updatedAt: Date;
}
