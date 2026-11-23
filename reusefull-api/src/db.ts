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

// Optional contact/social columns added to charity after the original schema.
export const EXTRA_CHARITY_COLUMNS = [
  'donation_contact_name',
  'donation_contact_email',
  'link_x',
  'link_facebook',
  'link_instagram',
  'link_youtube',
  'link_linkedin',
] as const

let extraCharityColumnsEnsured = false

// Idempotently adds the extra charity columns on first use (once per warm
// container). Kept separate from the main charity INSERT/UPDATE statements so a
// migration problem can't break signups or profile saves.
export async function ensureExtraCharityColumns(): Promise<void> {
  if (extraCharityColumnsEnsured) return
  const pool = getPool()
  const [rows]: any = await pool.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'charity'`
  )
  const existing = new Set<string>(rows.map((r: any) => String(r.COLUMN_NAME).toLowerCase()))
  const missing = EXTRA_CHARITY_COLUMNS.filter((c) => !existing.has(c))
  if (missing.length) {
    try {
      await pool.query(
        `ALTER TABLE charity ${missing.map((c) => `ADD COLUMN ${c} VARCHAR(255) NULL`).join(', ')}`
      )
    } catch (e: any) {
      // A concurrent cold start may have added them already
      if (e?.code !== 'ER_DUP_FIELDNAME') throw e
    }
  }
  extraCharityColumnsEnsured = true
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



