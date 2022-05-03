import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { FullAccessPayload } from '@/core/auth/dto/jwt.dto';

export const Payload = createParamDecorator(
    (_: never, ctx: ExecutionContext): FullAccessPayload => {
        const { req } = GqlExecutionContext.create(ctx).getContext();
        return req.payload;
    }
);

export const PayloadField = createParamDecorator(
    (path: string, ctx: ExecutionContext): FullAccessPayload[keyof FullAccessPayload] => {
        const { req } = GqlExecutionContext.create(ctx).getContext();

        let cursor;
        for (const field of path.split('.')) {
            cursor = req.payload[field];
            if (!cursor) return undefined;
        }

        return cursor;
    }
);
