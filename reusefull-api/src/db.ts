import mysql from 'mysql2/promise'
import { config } from './config.js'

let pool: mysql.Pool | null = null

export function getPool(): mysql.Pool {
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
    })
  }
  return pool
}

export async function pingDb(): Promise<void> {
  const conn = await getPool().getConnection()
  try {
    await conn.ping()
  } finally {
    conn.release()
  }
}

let charityActivityTableEnsured = false

// Lazily creates the charity_activity table on first use (idempotent), so no
// separate migration step is needed. Runs at most once per warm container.
export async function ensureCharityActivityTable(): Promise<void> {
  if (charityActivityTableEnsured) return
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS charity_activity (
      id INT AUTO_INCREMENT PRIMARY KEY,
      charity_id INT NOT NULL,
      charity_name VARCHAR(255) NOT NULL,
      event_type VARCHAR(32) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_charity_activity_created_at (created_at),
      INDEX idx_charity_activity_charity_id (charity_id)
    )
  `)
  charityActivityTableEnsured = true
}



