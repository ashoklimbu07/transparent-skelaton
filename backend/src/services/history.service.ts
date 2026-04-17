import type { Request } from 'express';
import { isValidObjectId } from 'mongoose';
import { GenerationHistoryModel } from '../models/generationHistory.model.js';
import { UserModel } from '../models/user.model.js';
import { readSessionUser } from './auth/session.js';

type HistoryFileInput = {
    name?: string;
    mimeType?: string;
    url?: string;
    content?: string;
};

type PersistGenerationHistoryInput = {
    req: Request;
    sourceTool: string;
    input?: unknown;
    output?: unknown;
    combinedOutput?: string;
    outputFormats?: string[];
    files?: HistoryFileInput[];
    metadata?: unknown;
};

export async function persistGenerationHistory({
    req,
    sourceTool,
    input,
    output,
    combinedOutput = '',
    outputFormats = [],
    files = [],
    metadata = {},
}: PersistGenerationHistoryInput): Promise<void> {
    const sessionUser = readSessionUser(req);
    if (!sessionUser) {
        return;
    }

    const userQuery = isValidObjectId(sessionUser.id)
        ? { _id: sessionUser.id }
        : { email: sessionUser.email.toLowerCase() };
    const user = await UserModel.findOne(userQuery).select('_id email name').lean();
    if (!user) {
        return;
    }

    await GenerationHistoryModel.create({
        userId: user._id,
        userEmail: user.email,
        userName: user.name,
        sourceTool,
        input: input ?? {},
        output: output ?? {},
        combinedOutput,
        outputFormats,
        files,
        metadata: metadata ?? {},
    });
}
