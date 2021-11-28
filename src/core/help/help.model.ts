import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Help {
    @Field()
    name: string;

    @Field()
    message: string;
}
