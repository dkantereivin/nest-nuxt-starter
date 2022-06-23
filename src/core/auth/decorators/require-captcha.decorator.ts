import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
    RECAPTCHA_ACTION_METADATA,
    RECAPTCHA_THRESHOLD_METADATA,
    RecaptchaGuard
} from '@/core/auth/guards/recaptcha.guard';

export function RequireCaptcha(threshold?: number, action?: string | string[]) {
    if (threshold && action) {
        return applyDecorators(
            SetMetadata(RECAPTCHA_THRESHOLD_METADATA, threshold),
            SetMetadata(RECAPTCHA_ACTION_METADATA, action),
            UseGuards(RecaptchaGuard)
        );
    } else if (threshold) {
        return applyDecorators(
            SetMetadata(RECAPTCHA_THRESHOLD_METADATA, threshold),
            UseGuards(RecaptchaGuard)
        );
    } else if (action) {
        return applyDecorators(
            SetMetadata(RECAPTCHA_ACTION_METADATA, action),
            UseGuards(RecaptchaGuard)
        );
    } else {
        return applyDecorators(UseGuards(RecaptchaGuard));
    }
}
