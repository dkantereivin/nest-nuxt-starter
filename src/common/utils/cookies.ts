import { CookieOptions, Response } from 'express';
import dayjs from 'dayjs';

export function serializeCookie(
    name: string,
    value: string | Record<string, unknown>,
    {
        path = '/',
        expires = dayjs().add(12, 'hours').toDate(),
        sameSite = 'strict',
        httpOnly = false,
        secure = true
    }: Omit<CookieOptions, 'maxAge' | 'domain' | 'encode' | 'signed'>
): string {
    value = typeof value === 'string' ? value : JSON.stringify(value);
    const args = [
        `${name}=${encodeURIComponent(value)}`,
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

export function parseCookies(raw?: string): Record<string, string> {
    if (!raw) return {};
    const cookies = raw.split('; ');
    const result = {};
    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        result[key] = decodeURIComponent(value);
    }
    return result;
}

export function hardCookie(
    res: Response,
    name: string,
    value: string,
    options?: Partial<CookieOptions>
): void {
    res.cookie(name, value, {
        path: '/',
        httpOnly: true,
        secure: true,
        expires: dayjs().add(12, 'hours').toDate(),
        ...options
    });
}
