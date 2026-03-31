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
    const cookieToken = req.cookies?.[SESSION_COOKIE_NAME];
    const authHeader = req.headers.authorization;
    const bearerToken = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : '';
    const candidateTokens = [cookieToken, bearerToken].filter((token) => Boolean(token && typeof token === 'string'));
    for (const token of candidateTokens) {
        try {
            const decoded = jwt.verify(token, getSessionSecret());
            if (decoded.user) {
                return decoded.user;
            }
        }
        catch {
            // Try the next credential source.
        }
    }
    return null;
}
//# sourceMappingURL=session.js.map