import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { Request } from 'express';

export type SessionUser = {
    id: string;
    email: string;
    name: string;
    picture?: string;
};

type SessionTokenPayload = JwtPayload & {
    user: SessionUser;
};

export const SESSION_COOKIE_NAME = 'broll_session';

export function getSessionSecret(): string {
    const secret = process.env.AUTH_SESSION_SECRET;
    if (secret) {
        return secret;
    }

    if (process.env.NODE_ENV === 'production') {
        throw new Error('AUTH_SESSION_SECRET is required in production.');
    }

    return 'dev-only-insecure-session-secret';
}

export function signSession(user: SessionUser): string {
    return jwt.sign({ user }, getSessionSecret(), { expiresIn: '7d' });
}

export function readSessionUser(req: Request): SessionUser | null {
    const cookieToken = req.cookies?.[SESSION_COOKIE_NAME];
    const authHeader = req.headers.authorization;
    const bearerToken = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : '';
    const candidateTokens = [cookieToken, bearerToken].filter((token): token is string => Boolean(token && typeof token === 'string'));

    for (const token of candidateTokens) {
        try {
            const decoded = jwt.verify(token, getSessionSecret()) as SessionTokenPayload;
            if (decoded.user) {
                return decoded.user;
            }
        } catch {
            // Try the next credential source.
        }
    }

    return null;
}
