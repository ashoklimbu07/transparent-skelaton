import { readSessionUser } from '../services/auth/session.js';
export function requireAuth(req, res, next) {
    const user = readSessionUser(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    next();
}
//# sourceMappingURL=requireAuth.js.map