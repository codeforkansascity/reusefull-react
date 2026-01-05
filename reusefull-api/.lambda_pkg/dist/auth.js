import { auth } from 'express-oauth2-jwt-bearer';
import { config } from './config.js';
export const requireAuth = auth({
    audience: config.auth0.audience,
    issuerBaseURL: `https://${config.auth0.domain}/`,
});
//# sourceMappingURL=auth.js.map