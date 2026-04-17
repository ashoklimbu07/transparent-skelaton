import crypto from 'crypto';
import { Schema, model } from 'mongoose';
const historyFileSchema = new Schema({
    name: {
        type: String,
        required: false,
        trim: true,
        maxlength: 255,
    },
    mimeType: {
        type: String,
        required: false,
        trim: true,
        maxlength: 120,
    },
    url: {
        type: String,
        required: false,
        trim: true,
    },
    content: {
        type: String,
        required: false,
    },
}, {
    _id: false,
});
const generationHistorySchema = new Schema({
    historyId: {
        type: String,
        required: true,
        unique: true,
        default: () => crypto.randomUUID(),
        index: true,
        trim: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
        index: true,
    },
    userEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    userName: {
        type: String,
        required: false,
        trim: true,
        maxlength: 120,
    },
    sourceTool: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    input: {
        type: Schema.Types.Mixed,
        required: false,
        default: {},
    },
    output: {
        type: Schema.Types.Mixed,
        required: false,
        default: {},
    },
    combinedOutput: {
        type: String,
        required: false,
        default: '',
    },
    outputFormats: {
        type: [String],
        required: true,
        default: [],
    },
    files: {
        type: [historyFileSchema],
        required: true,
        default: [],
    },
    metadata: {
        type: Schema.Types.Mixed,
        required: false,
        default: {},
    },
}, {
    timestamps: true,
    versionKey: false,
});
generationHistorySchema.index({ userId: 1, createdAt: -1 });
generationHistorySchema.index({ userEmail: 1, createdAt: -1 });
generationHistorySchema.index({ sourceTool: 1, createdAt: -1 });
export const GenerationHistoryModel = model('GenerationHistory', generationHistorySchema);
//# sourceMappingURL=generationHistory.model.js.map