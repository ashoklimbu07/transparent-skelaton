import { Schema, model } from 'mongoose';
const usersSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 80,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    passwordHash: {
        type: String,
        required: false,
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
        required: true,
    },
    googleId: {
        type: String,
        required: false,
        index: true,
    },
    picture: {
        type: String,
        required: false,
    },
    lastLoginAt: {
        type: Date,
        required: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});
usersSchema.index({ createdAt: -1 });
usersSchema.index({ provider: 1, email: 1 });
export const UserModel = model('Users', usersSchema);
//# sourceMappingURL=user.model.js.map