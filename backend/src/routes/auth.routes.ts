import crypto from 'crypto';
import { Router, type Request, type Response } from 'express';
import { readSessionUser, SESSION_COOKIE_NAME, signSession } from '../services/auth/session.js';

const router = Router();

const GOOGLE_STATE_COOKIE_NAME = 'google_oauth_state';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const GOOGLE_STATE_MAX_AGE_MS = 10 * 60 * 1000;

function getFrontendUrl(): string {
    return (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
}

function getBackendPublicUrl(): string {
    return (process.env.BACKEND_PUBLIC_URL || process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`)
        .replace(/\/+$/, '');
}

function getGoogleCredentials(): { clientId: string; clientSecret: string } {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured.');
    }

    return { clientId, clientSecret };
}

function getGoogleRedirectUri(): string {
    return process.env.GOOGLE_REDIRECT_URI || `${getBackendPublicUrl()}/api/auth/google/callback`;
}

function getCookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax' as const,
        path: '/',
    };
}

router.get('/google/start', (req: Request, res: Response) => {
    try {
        const { clientId } = getGoogleCredentials();
        const redirectUri = getGoogleRedirectUri();
        const state = crypto.randomBytes(24).toString('hex');

        res.cookie(GOOGLE_STATE_COOKIE_NAME, state, {
            ...getCookieOptions(),
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
    } catch (error) {
        res.status(500).json({
            error: 'Google auth is not configured',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

router.get('/google/callback', async (req: Request, res: Response) => {
    const frontendUrl = getFrontendUrl();
    const oauthStateFromCookie = req.cookies?.[GOOGLE_STATE_COOKIE_NAME];
    const stateFromGoogle = typeof req.query.state === 'string' ? req.query.state : '';
    const authCode = typeof req.query.code === 'string' ? req.query.code : '';

    if (!authCode || !oauthStateFromCookie || oauthStateFromCookie !== stateFromGoogle) {
        res.clearCookie(GOOGLE_STATE_COOKIE_NAME, getCookieOptions());
        res.redirect(`${frontendUrl}/login?error=google_state_mismatch`);
        return;
    }

    try {
        const { clientId, clientSecret } = getGoogleCredentials();
        const redirectUri = getGoogleRedirectUri();

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

        const tokenData = (await tokenResponse.json()) as { access_token?: string };
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

        const profile = (await profileResponse.json()) as {
            sub?: string;
            email?: string;
            name?: string;
            picture?: string;
        };

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
            ...getCookieOptions(),
            maxAge: SESSION_MAX_AGE_MS,
        });
        res.clearCookie(GOOGLE_STATE_COOKIE_NAME, getCookieOptions());
        res.redirect(`${frontendUrl}/auth/google/success`);
    } catch (error) {
        res.clearCookie(GOOGLE_STATE_COOKIE_NAME, getCookieOptions());
        res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
    }
});

router.get('/me', (req: Request, res: Response) => {
    const user = readSessionUser(req);
    if (!user) {
        res.status(401).json({ authenticated: false });
        return;
    }

    res.json({ authenticated: true, user });
});

router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie(SESSION_COOKIE_NAME, getCookieOptions());
    res.status(204).send();
});

export { router as authRoutes };
