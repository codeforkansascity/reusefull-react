import mysql from 'mysql2/promise';
import { config } from './config.js';
let pool = null;
export function getPool() {
    if (!pool) {
        pool = mysql.createPool({
            host: config.db.host,
            user: config.db.user,
            password: config.db.password,
            database: config.db.name,
            port: config.db.port,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            supportBigNumbers: true,
        });
    }
    return pool;
}
export async function pingDb() {
    const conn = await getPool().getConnection();
    try {
        await conn.ping();
    }
    finally {
        conn.release();
    }
}
//# sourceMappingURL=db.js.map