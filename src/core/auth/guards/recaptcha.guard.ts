import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RecaptchaFailed } from '@/common/exceptions/auth';

// note: this guard

const RECAPTCHA_URL = 'https://www.google.com/recaptcha/api/siteverify';
export const RECAPTCHA_THRESHOLD_METADATA = 'RECAPTCHA_THRESHOLD';
export const RECAPTCHA_ACTION_METADATA = 'RECAPTCHA_ACTION';
const DEFAULT_THRESHOLD = 0.5;

@Injectable()
export class RecaptchaGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, private readonly config: ConfigService) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        if (!this.config.get<boolean>('app.isProduction')) {
            return true;
        }

        const executionContext = GqlExecutionContext.create(ctx);
        const { req } = executionContext.getContext();
        const secret = this.config.get<string>('auth.recaptcha.secret');

        const response = req.get('Recaptcha-Token');
        if (!response) {
            throw new RecaptchaFailed();
        }

        const threshold =
            this.reflector.get<number | undefined>(
                RECAPTCHA_THRESHOLD_METADATA,
                ctx.getHandler()
            ) ?? DEFAULT_THRESHOLD;
        const expectedAction = this.reflector.get<string | string[]>(
            RECAPTCHA_ACTION_METADATA,
            ctx.getHandler()
        ) ?? [executionContext.getInfo().fieldName];

        const params: RecaptchaVerifyRequest = {
            secret,
            response
        };

        const {
            data: { success, score, action }
        } = await axios.get<GoogleResponse>(RECAPTCHA_URL, { params });

        const expected = Array.isArray(expectedAction) ? expectedAction : [expectedAction];
        if (expectedAction !== undefined && !expected.includes(action)) {
            return false;
        }
        return success && score >= threshold;
    }
}

type RecaptchaVerifyRequest = {
    secret: string;
    response: string;
};

type GoogleResponse = {
    success: boolean;
    score: number;
    action: string;
    challenge_ts: string;
    hostname: string;
    'error-codes': string[];
};
