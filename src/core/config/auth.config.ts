import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
    saltRounds: parseInt(process.env.SALT_ROUNDS) || 10,
    recaptcha: {
        secret: process.env.RECAPTCHA_SECRET,
        siteKey: process.env.RECAPTCHA_SITE_KEY
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        time: {
            access: process.env.JWT_ACCESS_TIME,
            refresh: process.env.JWT_REFRESH_TIME
        }
    }
}));
