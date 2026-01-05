import dotenv from 'dotenv';
dotenv.config();
export const config = {
    port: Number(process.env.PORT || 3001),
    auth0: {
        domain: process.env.AUTH0_DOMAIN || '',
        audience: process.env.AUTH0_AUDIENCE || '',
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME || 'reusefull',
        port: Number(process.env.DB_PORT || 3306),
    },
    actionSecret: process.env.ACTION_SHARED_SECRET || '', // optional shared secret for /users
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    // Optional contact email for Nominatim user-agent etiquette
    geocodeContactEmail: process.env.GEOCODE_CONTACT_EMAIL || '',
};
//# sourceMappingURL=config.js.map