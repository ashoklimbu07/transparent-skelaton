import { Schema, type InferSchemaType, type HydratedDocument } from 'mongoose';
declare const usersSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    name: string;
    email: string;
    provider: "local" | "google";
    passwordHash?: string | null;
    googleId?: string | null;
    picture?: string | null;
    lastLoginAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    name: string;
    email: string;
    provider: "local" | "google";
    passwordHash?: string | null;
    googleId?: string | null;
    picture?: string | null;
    lastLoginAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps" | "versionKey"> & {
    timestamps: true;
    versionKey: false;
}> & Omit<{
    name: string;
    email: string;
    provider: "local" | "google";
    passwordHash?: string | null;
    googleId?: string | null;
    picture?: string | null;
    lastLoginAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
}, "id"> & {
    id: string;
}, unknown, {
    name: string;
    email: string;
    provider: "local" | "google";
    passwordHash?: string | null;
    googleId?: string | null;
    picture?: string | null;
    lastLoginAt?: NativeDate | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type User = InferSchemaType<typeof usersSchema>;
export type UserDocument = HydratedDocument<User>;
export declare const UserModel: import("mongoose").Model<{
    name: string;
    email: string;
    provider: "local" | "google";
    passwordHash?: string | null;
    googleId?: string | null;
    picture?: string | null;
    lastLoginAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    name: string;
    email: string;
    provider: "local" | "google";
    passwordHash?: string | null;
    googleId?: string | null;
    picture?: string | null;
    lastLoginAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {}, import("mongoose").DefaultSchemaOptions> & {
    name: string;
    email: string;
    provider: "local" | "google";
    passwordHash?: string | null;
    googleId?: string | null;
    picture?: string | null;
    lastLoginAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, {
    name: string;
    email: string;
    provider: "local" | "google";
    passwordHash?: string | null;
    googleId?: string | null;
    picture?: string | null;
    lastLoginAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps>;
export {};
//# sourceMappingURL=user.model.d.ts.map