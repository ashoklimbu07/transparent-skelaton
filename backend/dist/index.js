import dotenv from 'dotenv';
// Load environment variables FIRST before any other imports
dotenv.config();
import express from 'express';
import cors from 'cors';
import { formatRoutes } from './routes/format.routes.js';
import { brollRoutes } from './routes/broll.routes.js';
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
app.use('/api/format', formatRoutes);
app.use('/api/broll', brollRoutes);
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        port,
        geminiKeyFormat: !!process.env.GEMINI_API_KEY_FORMAT,
        geminiKeyBroll: !!process.env.GEMINI_API_KEY_BROLL,
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
    console.log('------------------------------------------------');
    console.log(`🚀 BACKEND SERVER RUNNING`);
    console.log(`📡 URL: http://localhost:${port}`);
    console.log(`🔑 GEMINI API KEY (Format): ${process.env.GEMINI_API_KEY_FORMAT ? '✅ CONFIGURED' : '❌ MISSING'}`);
    console.log(`🔑 GEMINI API KEY (B-Roll): ${process.env.GEMINI_API_KEY_BROLL ? '✅ CONFIGURED' : '❌ MISSING'}`);
    // Warning if any key is missing
    if (!process.env.GEMINI_API_KEY_FORMAT || !process.env.GEMINI_API_KEY_BROLL) {
        console.log('⚠️  WARNING: Some API keys are missing!');
        if (!process.env.GEMINI_API_KEY_FORMAT) {
            console.log('   - GEMINI_API_KEY_FORMAT not found in .env');
        }
        if (!process.env.GEMINI_API_KEY_BROLL) {
            console.log('   - GEMINI_API_KEY_BROLL not found in .env');
        }
    }
    console.log(`🏥 HEALTH CHECK: http://localhost:${port}/api/health`);
    console.log('------------------------------------------------');
});
//# sourceMappingURL=index.js.map