import { registerAs } from '@nestjs/config';

export const mailConfig = registerAs('mail', () => ({
    apiKey: process.env.SENDGRID_API_KEY,
    from: process.env.EMAIL_FROM
}));
