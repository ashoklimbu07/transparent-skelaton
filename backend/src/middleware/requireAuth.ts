import type { Request, Response, NextFunction } from 'express';
import { readSessionUser } from '../services/auth/session.js';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const user = readSessionUser(req);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    next();
}
