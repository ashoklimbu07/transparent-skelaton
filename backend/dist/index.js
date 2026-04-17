import dotenv from 'dotenv';
// Load environment variables FIRST before any other imports
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { brollRoutes } from './routes/broll.routes.js';
import { manualStoryRoutes } from './routes/manualStory.routes.js';
import { videoSceneAnalyzerRoutes } from './routes/videoSceneAnalyzer.routes.js';
import { renderHealthStatusPage } from './components/healthStatusPage.js';
import { authRoutes } from './routes/auth.routes.js';
import { requireAuth } from './middleware/requireAuth.js';
import { connectDB } from './config/db.js';
import { historyRoutes } from './routes/history.routes.js';
function normalizeOrigin(origin) {
    return origin.trim().replace(/\/+$/, '').toLowerCase();
}
function withVercelWwwVariants(origin) {
    const normalized = normalizeOrigin(origin);
    if (!normalized) {
        return [];
    }
    try {
        const parsed = new URL(normalized);
        if (!parsed.hostname.endsWith('.vercel.app')) {
            return [normalized];
        }
        const withoutWwwHost = parsed.hostname.replace(/^www\./, '');
        const withWwwHost = withoutWwwHost.startsWith('www.') ? withoutWwwHost : `www.${withoutWwwHost}`;
        const withoutWww = `${parsed.protocol}//${withoutWwwHost}`;
        const withWww = `${parsed.protocol}//${withWwwHost}`;
        return Array.from(new Set([normalizeOrigin(withoutWww), normalizeOrigin(withWww)]));
    }
    catch {
        return [normalized];
    }
}
function getAllowedOrigins() {
    const fromEnvRaw = [process.env.CORS_ORIGIN || '', process.env.FRONTEND_URL || '']
        .join(',')
        .split(',')
        .map((origin) => normalizeOrigin(origin))
        .filter(Boolean);
    const fromEnv = fromEnvRaw.flatMap((origin) => withVercelWwwVariants(origin));
    const devOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'].map(normalizeOrigin);
    return Array.from(new Set([...fromEnv, ...devOrigins]));
}
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
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = getAllowedOrigins();
app.set('trust proxy', 1);
app.disable('x-powered-by');
// Configure CORS to allow requests from your frontend
app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server requests (no browser origin header)
        if (!origin) {
            callback(null, true);
            return;
        }
        if (allowedOrigins.includes(normalizeOrigin(origin))) {
            callback(null, true);
            return;
        }
        callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// Video scene analyzer sends base64 video payloads that can exceed 1MB.
app.use(express.json({ limit: '25mb' }));
app.use(cookieParser());
// Log all incoming requests for debugging
app.use((req, res, next) => {
    if (!isProduction) {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    }
    next();
});
// Routes
app.use('/api/broll', requireAuth, brollRoutes);
app.use('/api/manual-story', requireAuth, manualStoryRoutes);
app.use('/api/video-scene-analyzer', requireAuth, videoSceneAnalyzerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/history', requireAuth, historyRoutes);
app.get('/api/health', (req, res) => {
    const brollKeys = getBrollApiKeys();
    const healthPayload = {
        status: 'OK',
        port,
        geminiKeyBroll: brollKeys.length > 0,
        geminiKeyBrollCount: brollKeys.length,
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        environment: process.env.NODE_ENV || 'development',
    };
    const acceptsHtml = (req.headers.accept || '').toLowerCase().includes('text/html');
    const forceJson = String(req.query.format || '').toLowerCase() === 'json';
    // Keep API behavior for clients, but show a minimal UI in browser visits.
    if (!forceJson && acceptsHtml) {
        res.type('html').send(renderHealthStatusPage({
            status: healthPayload.status,
            geminiKeyBrollConfigured: healthPayload.geminiKeyBroll,
            geminiKeyBrollCount: healthPayload.geminiKeyBrollCount,
        }));
        return;
    }
    res.json(healthPayload);
});
app.get('/', (req, res) => {
    res.send('Backend API is running...');
});
// Improved error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});
async function startServer() {
    try {
        await connectDB();
        console.log('✅ MongoDB connected');
    }
    catch (error) {
        console.error('❌ MongoDB connection failed:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
    app.listen(port, () => {
        const brollKeys = getBrollApiKeys();
        const analyzerKey = process.env.ANALYZER_GEMINI_KEY?.trim() || '';
        const manualStoryKey = process.env.GEMINI_API_KEY_MANUALSTORY?.trim() || '';
        const videoSceneAnalyzerKey = process.env.GEMINI_API_KEY_VIDEO_SCENE_ANALYZER?.trim() || '';
        console.log('------------------------------------------------');
        console.log(`🚀 BACKEND SERVER RUNNING`);
        console.log(`📡 URL: http://localhost:${port}`);
        console.log(`🔑 GEMINI API KEY (B-Roll): ${brollKeys.length > 0 ? `✅ CONFIGURED (${brollKeys.length} keys)` : '❌ MISSING'}`);
        console.log(`📝 MANUAL STORY KEY: ${manualStoryKey ? `✅ CONFIGURED (...${manualStoryKey.slice(-4)})` : '❌ MISSING (GEMINI_API_KEY_MANUALSTORY)'}`);
        console.log(`🧠 ANALYZER KEY: ${analyzerKey ? `✅ CONFIGURED (...${analyzerKey.slice(-4)})` : '❌ MISSING (ANALYZER_GEMINI_KEY)'}`);
        console.log(`🎞️ VIDEO SCENE ANALYZER KEY: ${videoSceneAnalyzerKey
            ? `✅ CONFIGURED (...${videoSceneAnalyzerKey.slice(-4)})`
            : '❌ MISSING (GEMINI_API_KEY_VIDEO_SCENE_ANALYZER)'}`);
        // Warning if any key is missing
        if (brollKeys.length === 0) {
            console.log('⚠️  WARNING: Some API keys are missing!');
            console.log('   - No GEMINI_API_KEY_BROLL1..N keys found in .env');
        }
        if (!analyzerKey) {
            console.log('⚠️  WARNING: ANALYZER_GEMINI_KEY is missing.');
        }
        if (!manualStoryKey) {
            console.log('⚠️  WARNING: GEMINI_API_KEY_MANUALSTORY is missing.');
        }
        if (!videoSceneAnalyzerKey) {
            console.log('⚠️  WARNING: GEMINI_API_KEY_VIDEO_SCENE_ANALYZER is missing.');
        }
        console.log(`🏥 HEALTH CHECK: http://localhost:${port}/api/health`);
        console.log('------------------------------------------------');
    });
}
void startServer();
//# sourceMappingURL=index.js.map