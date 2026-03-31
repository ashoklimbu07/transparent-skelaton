import dotenv from 'dotenv';
// Load environment variables FIRST before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { brollRoutes } from './routes/broll.routes.js';
import { renderHealthStatusPage } from './components/healthStatusPage.js';
import { authRoutes } from './routes/auth.routes.js';
import { requireAuth } from './middleware/requireAuth.js';

function normalizeOrigin(origin: string): string {
    return origin.trim().replace(/\/+$/, '').toLowerCase();
}

function getAllowedOrigins(): string[] {
    const fromEnv = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '')
        .split(',')
        .map((origin) => normalizeOrigin(origin))
        .filter(Boolean);

    const devOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'].map(normalizeOrigin);

    return Array.from(new Set([...fromEnv, ...devOrigins]));
}

function getBrollApiKeys(): string[] {
    const keys: string[] = [];
    for (let i = 1; i <= 10; i++) {
        const key = (process.env as Record<string, string | undefined>)[`GEMINI_API_KEY_BROLL${i}`];
        if (key) keys.push(key);
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
app.use(
    cors({
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
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }),
);

app.use(express.json({ limit: '1mb' }));
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
app.use('/api/auth', authRoutes);

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
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
