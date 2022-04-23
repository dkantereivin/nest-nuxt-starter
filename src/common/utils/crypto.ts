import { createHmac, randomBytes } from 'crypto';

export const sha256 = (data: string): string =>
    createHmac('sha256', 'secret').update(data).digest('hex');

export const randomString = (length: number): string =>
    randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);

export const generateFingerprint = () => randomString(40);
