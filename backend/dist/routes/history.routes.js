import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { GenerationHistoryModel } from '../models/generationHistory.model.js';
import { readSessionUser } from '../services/auth/session.js';
const router = Router();
const DEFAULT_HISTORY_LIMIT = 100;
router.get('/', async (req, res) => {
    try {
        const sessionUser = readSessionUser(req);
        if (!sessionUser) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const limitRaw = Number(req.query.limit);
        const limit = Number.isFinite(limitRaw)
            ? Math.max(1, Math.min(500, Math.trunc(limitRaw)))
            : DEFAULT_HISTORY_LIMIT;
        const userFilter = isValidObjectId(sessionUser.id)
            ? { userId: sessionUser.id }
            : { userEmail: sessionUser.email.toLowerCase() };
        const rows = await GenerationHistoryModel.find(userFilter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        res.json({
            items: rows.map((row) => ({
                historyId: row.historyId,
                sourceTool: row.sourceTool,
                userEmail: row.userEmail,
                userName: row.userName || '',
                input: row.input || {},
                output: row.output || {},
                combinedOutput: row.combinedOutput || '',
                outputFormats: Array.isArray(row.outputFormats) ? row.outputFormats : [],
                files: Array.isArray(row.files) ? row.files : [],
                metadata: row.metadata || {},
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
            })),
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('History fetch error:', message);
        res.status(500).json({ error: 'Failed to fetch history', details: message });
    }
});
router.delete('/:historyId', async (req, res) => {
    try {
        const sessionUser = readSessionUser(req);
        if (!sessionUser) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const historyId = String(req.params.historyId || '').trim();
        if (!historyId) {
            res.status(400).json({ error: 'historyId is required' });
            return;
        }
        const userFilter = isValidObjectId(sessionUser.id)
            ? { userId: sessionUser.id }
            : { userEmail: sessionUser.email.toLowerCase() };
        const result = await GenerationHistoryModel.deleteOne({
            ...userFilter,
            historyId,
        });
        if (result.deletedCount === 0) {
            res.status(404).json({ error: 'History item not found' });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('History delete error:', message);
        res.status(500).json({ error: 'Failed to delete history item', details: message });
    }
});
export { router as historyRoutes };
//# sourceMappingURL=history.routes.js.map