import { Schema, type InferSchemaType, type HydratedDocument } from 'mongoose';
declare const generationHistorySchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    historyId: string;
    userId: import("mongoose").Types.ObjectId;
    userEmail: string;
    sourceTool: string;
    outputFormats: string[];
    files: import("mongoose").Types.DocumentArray<{
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }, {}, {}> & {
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }>;
    userName?: string | null;
    input?: any;
    output?: any;
    combinedOutput?: string | null;
    metadata?: any;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    historyId: string;
    userId: import("mongoose").Types.ObjectId;
    userEmail: string;
    sourceTool: string;
    outputFormats: string[];
    files: import("mongoose").Types.DocumentArray<{
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }, {}, {}> & {
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }>;
    userName?: string | null;
    input?: any;
    output?: any;
    combinedOutput?: string | null;
    metadata?: any;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps" | "versionKey"> & {
    timestamps: true;
    versionKey: false;
}> & Omit<{
    historyId: string;
    userId: import("mongoose").Types.ObjectId;
    userEmail: string;
    sourceTool: string;
    outputFormats: string[];
    files: import("mongoose").Types.DocumentArray<{
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }, {}, {}> & {
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }>;
    userName?: string | null;
    input?: any;
    output?: any;
    combinedOutput?: string | null;
    metadata?: any;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
}, "id"> & {
    id: string;
}, unknown, {
    historyId: string;
    userId: import("mongoose").Types.ObjectId;
    userEmail: string;
    sourceTool: string;
    outputFormats: string[];
    files: import("mongoose").Types.DocumentArray<{
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }, {}, {}> & {
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }>;
    userName?: string | null;
    input?: any;
    output?: any;
    combinedOutput?: string | null;
    metadata?: any;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type GenerationHistory = InferSchemaType<typeof generationHistorySchema>;
export type GenerationHistoryDocument = HydratedDocument<GenerationHistory>;
export declare const GenerationHistoryModel: import("mongoose").Model<{
    historyId: string;
    userId: import("mongoose").Types.ObjectId;
    userEmail: string;
    sourceTool: string;
    outputFormats: string[];
    files: import("mongoose").Types.DocumentArray<{
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }, {}, {}> & {
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }>;
    userName?: string | null;
    input?: any;
    output?: any;
    combinedOutput?: string | null;
    metadata?: any;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    historyId: string;
    userId: import("mongoose").Types.ObjectId;
    userEmail: string;
    sourceTool: string;
    outputFormats: string[];
    files: import("mongoose").Types.DocumentArray<{
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }, {}, {}> & {
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }>;
    userName?: string | null;
    input?: any;
    output?: any;
    combinedOutput?: string | null;
    metadata?: any;
} & import("mongoose").DefaultTimestampProps, {}, import("mongoose").DefaultSchemaOptions> & {
    historyId: string;
    userId: import("mongoose").Types.ObjectId;
    userEmail: string;
    sourceTool: string;
    outputFormats: string[];
    files: import("mongoose").Types.DocumentArray<{
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }, {}, {}> & {
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }>;
    userName?: string | null;
    input?: any;
    output?: any;
    combinedOutput?: string | null;
    metadata?: any;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, {
    historyId: string;
    userId: import("mongoose").Types.ObjectId;
    userEmail: string;
    sourceTool: string;
    outputFormats: string[];
    files: import("mongoose").Types.DocumentArray<{
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }, {}, {}> & {
        name?: string | null;
        mimeType?: string | null;
        url?: string | null;
        content?: string | null;
    }>;
    userName?: string | null;
    input?: any;
    output?: any;
    combinedOutput?: string | null;
    metadata?: any;
} & import("mongoose").DefaultTimestampProps>;
export {};
//# sourceMappingURL=generationHistory.model.d.ts.map