import { isValidObjectId } from 'mongoose';
import { GenerationHistoryModel } from '../models/generationHistory.model.js';
import { UserModel } from '../models/user.model.js';
import { readSessionUser } from './auth/session.js';
export async function persistGenerationHistory({ req, sourceTool, input, output, combinedOutput = '', outputFormats = [], files = [], metadata = {}, }) {
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
//# sourceMappingURL=history.service.js.map