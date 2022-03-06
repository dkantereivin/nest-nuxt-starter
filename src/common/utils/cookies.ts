import { CookieOptions } from 'express';
import dayjs from 'dayjs';

export function serializeCookie(
    name: string,
    value: string | Record<string, unknown>,
    {
        path = '/',
        expires = dayjs().add(12, 'hours').toDate(),
        sameSite = 'strict',
        httpOnly = false,
        secure = true // todo: use dotenv to set this to false in development
    }: CookieOptions
): string {
    const args = [
        `${name}=${typeof value === 'string' ? value : JSON.stringify(value)}`,
        `Path=${path}`,
        `Expires=${expires.toUTCString()}`,
        `SameSite=${sameSite}`
    ];
    if (httpOnly) {
        args.push('HttpOnly');
    }
    if (secure) {
        args.push('Secure');
    }
    return args.join('; ');
}
