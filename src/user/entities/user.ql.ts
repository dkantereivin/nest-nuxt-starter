import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserQL {
    @Field(() => ID)
    id: string;

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
