import { HttpException, HttpStatus } from '@nestjs/common';

export enum StandardExceptionReason {
    UNAUTHORIZED = 'Unauthorized',
    FORBIDDEN = 'Forbidden',
    USER_NOT_FOUND = 'UserNotFound',
    USER_UNVERIFIED = 'UserUnverified',
    USER_DISABLED = 'UserDisabled',
    INVALID_CREDENTIALS = 'InvalidCredentials',
    TOKEN_EXPIRED = 'TokenExpired',
    TOKEN_INVALID = 'TokenInvalid',
    TOKEN_USED = 'TokenUsed',
    FINGERPRINT_MISMATCH = 'FingerprintMismatch'
}

export interface StandardExceptionBody {
    reason: StandardExceptionReason;
    message: string;
}

export function StandardException(
    body: StandardExceptionBody,
    status: HttpStatus
): new () => HttpException {
    return class extends HttpException {
        constructor() {
            super(body, status);
        }
    };
}
