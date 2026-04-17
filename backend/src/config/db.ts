import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
    const mongoUri = process.env.MONGODB_URI?.trim();

    if (!mongoUri) {
        throw new Error('MONGODB_URI is missing in environment variables.');
    }

    await mongoose.connect(mongoUri);
}
