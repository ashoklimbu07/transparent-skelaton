import dotenv from 'dotenv';
// Load environment variables FIRST before any other imports
dotenv.config();
import express from 'express';
import cors from 'cors';
import { brollRoutes } from './routes/broll.routes.js';
function getBrollApiKeys() {
    const keys = [];
    for (let i = 1; i <= 10; i++) {
        const key = process.env[`GEMINI_API_KEY_BROLL${i}`];
        if (key)
            keys.push(key);
    }
    if (process.env.GEMINI_API_KEY_BROLL) {
        keys.push(process.env.GEMINI_API_KEY_BROLL);
    }
    return Array.from(new Set(keys));
}
const app = express();
const port = process.env.PORT || 3000;
// Configure CORS to allow requests from your frontend
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
// Log all incoming requests for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// Routes
app.use('/api/broll', brollRoutes);
app.get('/api/health', (req, res) => {
    const brollKeys = getBrollApiKeys();
    res.json({
        status: 'OK',
        port,
        geminiKeyBroll: brollKeys.length > 0,
        geminiKeyBrollCount: brollKeys.length,
        timestamp: new Date().toISOString()
    });
});
app.get('/', (req, res) => {
    res.send('Backend API is running...');
});
// Improved error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});
app.listen(port, () => {
    const brollKeys = getBrollApiKeys();
    console.log('------------------------------------------------');
    console.log(`🚀 BACKEND SERVER RUNNING`);
    console.log(`📡 URL: http://localhost:${port}`);
    console.log(`🔑 GEMINI API KEY (B-Roll): ${brollKeys.length > 0 ? `✅ CONFIGURED (${brollKeys.length} keys)` : '❌ MISSING'}`);
    // Warning if any key is missing
    if (brollKeys.length === 0) {
        console.log('⚠️  WARNING: Some API keys are missing!');
        console.log('   - No GEMINI_API_KEY_BROLL1..N keys found in .env');
    }
    console.log(`🏥 HEALTH CHECK: http://localhost:${port}/api/health`);
    console.log('------------------------------------------------');
});
//# sourceMappingURL=index.js.map