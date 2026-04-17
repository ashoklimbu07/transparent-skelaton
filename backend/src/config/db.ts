import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
    const mongoUri = process.env.MONGODB_URI?.trim();
    const mongoDbName = process.env.MONGODB_DB_NAME?.trim() || 'b-rollai';

    if (!mongoUri) {
        throw new Error('MONGODB_URI is missing in environment variables.');
    }

    await mongoose.connect(mongoUri, { dbName: mongoDbName });
}
