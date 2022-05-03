import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Subject = createParamDecorator((_: never, ctx: ExecutionContext): string => {
    const { req } = GqlExecutionContext.create(ctx).getContext();
    return req.payload.sub;
});
