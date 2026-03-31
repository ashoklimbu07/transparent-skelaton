import type { Request } from 'express';
export type SessionUser = {
    id: string;
    email: string;
    name: string;
    picture?: string;
};
export declare const SESSION_COOKIE_NAME = "broll_session";
export declare function getSessionSecret(): string;
export declare function signSession(user: SessionUser): string;
export declare function readSessionUser(req: Request): SessionUser | null;
//# sourceMappingURL=session.d.ts.map