import jwt, {} from 'jsonwebtoken';
export const SESSION_COOKIE_NAME = 'broll_session';
export function getSessionSecret() {
    const secret = process.env.AUTH_SESSION_SECRET;
    if (secret) {
        return secret;
    }
    if (process.env.NODE_ENV === 'production') {
        throw new Error('AUTH_SESSION_SECRET is required in production.');
    }
    return 'dev-only-insecure-session-secret';
}
export function signSession(user) {
    return jwt.sign({ user }, getSessionSecret(), { expiresIn: '7d' });
}
export function readSessionUser(req) {
    const token = req.cookies?.[SESSION_COOKIE_NAME];
    if (!token || typeof token !== 'string') {
        return null;
    }
    try {
        const decoded = jwt.verify(token, getSessionSecret());
        return decoded.user || null;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=session.js.map