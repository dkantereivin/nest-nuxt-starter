import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
    env: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === 'production',
    port: parseInt(process.env.PORT, 10),
    listen: process.env.LISTEN_TO
}));
