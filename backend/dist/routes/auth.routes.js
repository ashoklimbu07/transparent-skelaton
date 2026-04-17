import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { readSessionUser, SESSION_COOKIE_NAME, signSession } from '../services/auth/session.js';
import { UserModel } from '../models/user.model.js';
const router = Router();
const GOOGLE_STATE_COOKIE_NAME = 'google_oauth_state';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const GOOGLE_STATE_MAX_AGE_MS = 10 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 8;
function readString(value) {
    return typeof value === 'string' ? value.trim() : '';
}
function parseSignupPayload(body) {
    const input = (body || {});
    const firstName = readString(input.firstName);
    const lastName = readString(input.lastName);
    const composedName = [firstName, lastName].filter(Boolean).join(' ').trim();
    return {
        name: readString(input.name) || composedName,
        email: readString(input.email).toLowerCase(),
        password: readString(input.password),
    };
}
function getFrontendUrl() {
    const raw = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
    try {
        const parsed = new URL(raw);
        // Vercel default domains usually do not serve valid certs on `www`.
        if (parsed.hostname.endsWith('.vercel.app') && parsed.hostname.startsWith('www.')) {
            parsed.hostname = parsed.hostname.replace(/^www\./, '');
            return parsed.toString().replace(/\/+$/, '');
        }
    }
    catch {
        return raw;
    }
    return raw;
}
function getRequestOrigin(req) {
    const forwardedProtoHeader = req.headers['x-forwarded-proto'];
    const forwardedProto = Array.isArray(forwardedProtoHeader)
        ? forwardedProtoHeader[0]
        : (forwardedProtoHeader || '').split(',')[0];
    const protocol = (forwardedProto || req.protocol || 'http').trim();
    const forwardedHostHeader = req.headers['x-forwarded-host'];
    const forwardedHost = Array.isArray(forwardedHostHeader)
        ? forwardedHostHeader[0]
        : (forwardedHostHeader || '').split(',')[0];
    const host = (forwardedHost || req.get('host') || '').trim();
    if (!host) {
        return '';
    }
    return `${protocol}://${host}`.replace(/\/+$/, '');
}
function getBackendPublicUrl(req) {
    return (process.env.BACKEND_PUBLIC_URL
        || process.env.BACKEND_URL
        || getRequestOrigin(req)
        || `http://localhost:${process.env.PORT || 3000}`).replace(/\/+$/, '');
}
function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured.');
    }
    return { clientId, clientSecret };
}
function getGoogleRedirectUri(req) {
    return process.env.GOOGLE_REDIRECT_URI || `${getBackendPublicUrl(req)}/api/auth/google/callback`;
}
function getCookieOptions(req) {
    const backendPublicUrl = getBackendPublicUrl(req);
    const frontendUrl = getFrontendUrl();
    const isProduction = process.env.NODE_ENV === 'production';
    const useSecureCookie = isProduction || backendPublicUrl.startsWith('https://');
    let isCrossSite = false;
    try {
        isCrossSite = new URL(frontendUrl).origin !== new URL(backendPublicUrl).origin;
    }
    catch {
        isCrossSite = isProduction;
    }
    // Cross-site frontend/backend calls require SameSite=None + Secure.
    const sameSitePolicy = isCrossSite && useSecureCookie ? 'none' : 'lax';
    return {
        httpOnly: true,
        secure: useSecureCookie,
        sameSite: sameSitePolicy,
        path: '/',
    };
}
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = parseSignupPayload(req.body);
        if (!name || !email || !password) {
            res.status(400).json({ error: 'name, email and password are required' });
            return;
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            res.status(400).json({ error: `password must be at least ${MIN_PASSWORD_LENGTH} characters` });
            return;
        }
        const existingUser = await UserModel.findOne({ email }).lean();
        if (existingUser) {
            res.status(409).json({ error: 'Email already registered' });
            return;
        }
        const passwordHash = await bcrypt.hash(password, 12);
        const createdUser = await UserModel.create({
            name,
            email,
            passwordHash,
            provider: 'local',
            lastLoginAt: new Date(),
        });
        const sessionUser = {
            id: createdUser._id.toString(),
            email: createdUser.email,
            name: createdUser.name,
            ...(createdUser.picture ? { picture: createdUser.picture } : {}),
        };
        const sessionToken = signSession(sessionUser);
        res.cookie(SESSION_COOKIE_NAME, sessionToken, {
            ...getCookieOptions(req),
            maxAge: SESSION_MAX_AGE_MS,
        });
        res.status(201).json({
            message: 'Signup successful',
            token: sessionToken,
            user: sessionUser,
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Failed to sign up' });
    }
});
router.get('/google/start', (req, res) => {
    try {
        const { clientId } = getGoogleCredentials();
        const redirectUri = getGoogleRedirectUri(req);
        const state = crypto.randomBytes(24).toString('hex');
        res.cookie(GOOGLE_STATE_COOKIE_NAME, state, {
            ...getCookieOptions(req),
            maxAge: GOOGLE_STATE_MAX_AGE_MS,
        });
        const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        googleAuthUrl.searchParams.set('client_id', clientId);
        googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
        googleAuthUrl.searchParams.set('response_type', 'code');
        googleAuthUrl.searchParams.set('scope', 'openid email profile');
        googleAuthUrl.searchParams.set('access_type', 'offline');
        googleAuthUrl.searchParams.set('prompt', 'consent');
        googleAuthUrl.searchParams.set('state', state);
        res.redirect(googleAuthUrl.toString());
    }
    catch (error) {
        res.status(500).json({
            error: 'Google auth is not configured',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.get('/google/callback', async (req, res) => {
    const frontendUrl = getFrontendUrl();
    const oauthStateFromCookie = req.cookies?.[GOOGLE_STATE_COOKIE_NAME];
    const stateFromGoogle = typeof req.query.state === 'string' ? req.query.state : '';
    const authCode = typeof req.query.code === 'string' ? req.query.code : '';
    if (!authCode || !oauthStateFromCookie || oauthStateFromCookie !== stateFromGoogle) {
        res.clearCookie(GOOGLE_STATE_COOKIE_NAME, getCookieOptions(req));
        res.redirect(`${frontendUrl}/login?error=google_state_mismatch`);
        return;
    }
    try {
        const { clientId, clientSecret } = getGoogleCredentials();
        const redirectUri = getGoogleRedirectUri(req);
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code: authCode,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });
        if (!tokenResponse.ok) {
            throw new Error(`Token exchange failed with status ${tokenResponse.status}`);
        }
        const tokenData = (await tokenResponse.json());
        if (!tokenData.access_token) {
            throw new Error('Google access token is missing.');
        }
        const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });
        if (!profileResponse.ok) {
            throw new Error(`Google profile fetch failed with status ${profileResponse.status}`);
        }
        const profile = (await profileResponse.json());
        if (!profile.sub || !profile.email) {
            throw new Error('Google profile is missing required identifiers.');
        }
        const sessionUser = {
            id: profile.sub,
            email: profile.email,
            name: profile.name || profile.email,
            ...(profile.picture ? { picture: profile.picture } : {}),
        };
        const sessionToken = signSession(sessionUser);
        res.cookie(SESSION_COOKIE_NAME, sessionToken, {
            ...getCookieOptions(req),
            maxAge: SESSION_MAX_AGE_MS,
        });
        res.clearCookie(GOOGLE_STATE_COOKIE_NAME, getCookieOptions(req));
        // Keep cookie auth for compatible browsers and also pass a bearer token for strict third-party-cookie browsers.
        res.redirect(`${frontendUrl}/auth/google/success#token=${encodeURIComponent(sessionToken)}`);
    }
    catch (error) {
        res.clearCookie(GOOGLE_STATE_COOKIE_NAME, getCookieOptions(req));
        res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
    }
});
router.get('/me', (req, res) => {
    const user = readSessionUser(req);
    if (!user) {
        res.status(401).json({ authenticated: false });
        return;
    }
    res.json({ authenticated: true, user });
});
router.post('/logout', (req, res) => {
    res.clearCookie(SESSION_COOKIE_NAME, getCookieOptions(req));
    res.status(204).send();
});
export { router as authRoutes };
//# sourceMappingURL=auth.routes.js.map