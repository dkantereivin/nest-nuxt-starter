import {
    StandardException,
    StandardExceptionReason
} from '@/common/exceptions/standard-exception.mixin';
import { HttpStatus } from '@nestjs/common';

export const Unauthorized = StandardException(
    {
        reason: StandardExceptionReason.UNAUTHORIZED,
        message: `Unauthorized`
    },
    HttpStatus.UNAUTHORIZED
);

export const UserNotFound = StandardException(
    {
        reason: StandardExceptionReason.USER_NOT_FOUND,
        message: `User with the provided username or email was not found.`
    },
    HttpStatus.NOT_FOUND
);

export const UserUnverified = StandardException(
    {
        reason: StandardExceptionReason.USER_UNVERIFIED,
        message: `User has not yet verified their email address.`
    },
    HttpStatus.UNAUTHORIZED
);

export const UserDisabled = StandardException(
    {
        reason: StandardExceptionReason.USER_DISABLED,
        message: `This user has been marked inactive. This can be corrected by an administrator.`
    },
    HttpStatus.FORBIDDEN
);

export const InvalidCredentials = StandardException(
    {
        reason: StandardExceptionReason.INVALID_CREDENTIALS,
        message: `Invalid credentials provided.`
    },
    HttpStatus.UNAUTHORIZED
);

export const TokenExpired = StandardException(
    {
        reason: StandardExceptionReason.TOKEN_EXPIRED,
        message: `The provided token has expired.`
    },
    HttpStatus.UNAUTHORIZED
);

export const TokenInvalid = StandardException(
    {
        reason: StandardExceptionReason.TOKEN_INVALID,
        message: `The provided token is invalid.`
    },
    HttpStatus.UNAUTHORIZED
);

export const TokenUsed = StandardException(
    {
        reason: StandardExceptionReason.TOKEN_USED,
        message: `The provided token has already been used. Please use a new token.`
    },
    HttpStatus.UNAUTHORIZED
);

export const FingerprintMismatch = StandardException(
    {
        reason: StandardExceptionReason.FINGERPRINT_MISMATCH,
        message: `The provided token fingerprint is invalid.`
    },
    HttpStatus.UNAUTHORIZED
);

export const RecaptchaFailed = StandardException(
    {
        reason: StandardExceptionReason.RECAPTCHA_FAILED,
        message: `The provided recaptcha response is invalid or none was provided.`
    },
    HttpStatus.UNAUTHORIZED
);
