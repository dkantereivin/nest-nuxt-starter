import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { parseCookies } from '@/common/utils/cookies';

export const Cookies = createParamDecorator(
    (_: never, context: ExecutionContext): Record<string, string> => {
        const { req } = GqlExecutionContext.create(context).getContext();
        return parseCookies(req.headers.cookie);
    }
);

export const Cookie = createParamDecorator(
    (name: string, context: ExecutionContext): string => {
        const { req } = GqlExecutionContext.create(context).getContext();
        return parseCookies(req.headers.cookie)[name];
    }
);
