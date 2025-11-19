import express from 'express'
import cors from 'cors'
import { config } from './config.js'
import { requireAuth } from './auth.js'
import { getPool, pingDb } from './db.js'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const app = express()
app.use(cors({ origin: config.corsOrigin, credentials: false }))
app.use(express.json({ limit: '1mb' }))

app.get('/health', async (_req, res) => {
  try {
    await pingDb()
    res.send('ok')
  } catch (e) {
    res.status(500).send('db-failed')
  }
})

// Presigned S3 upload URL for logo images
app.post('/uploads/logo-url', requireAuth, async (req: any, res) => {
  try {
    const sub: string | undefined = req.auth?.payload?.sub
    if (!sub) return res.status(401).end()
    const { fileName, contentType } = req.body || {}
    if (!fileName || !contentType) return res.status(400).json({ error: 'fileName and contentType are required' })
    const region = process.env.AWS_REGION || 'us-east-2'
    const bucket = process.env.S3_BUCKET
    if (!bucket) return res.status(500).json({ error: 'S3_BUCKET not configured' })
    const s3 = new S3Client({ region })
    const safe = String(fileName).replace(/[^\w.\-]/g, '_')
    // Store uploads under charities/{userSub}/filename
    const key = `charities/${encodeURIComponent(sub)}/${Date.now()}-${safe}`
    const put = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType })
    const uploadUrl = await getSignedUrl(s3, put, { expiresIn: 60 })
    const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`
    res.json({ uploadUrl, publicUrl, key })
  } catch {
    res.status(500).json({ error: 'failed_to_sign' })
  }
})

// Upsert a user (intended to be called by Auth0 Action after signup)
// Accepts either a shared secret or a valid JWT
app.post('/users', async (req, res) => {
  const hasSharedSecret = config.actionSecret && req.header('x-action-secret') === config.actionSecret
  if (!hasSharedSecret) {
    // allow from authenticated SPA as well (optional)
    // if you want to require only Action calls, enforce shared secret strictly
  }
  const { sub, email_verified } = req.body || {}
  if (!sub) {
    return res.status(400).json({ error: 'sub is required' })
  }
  const pool = getPool()
  // Matches existing RDS table: `user` (id PK, admin tinyint default 0, email_verified tinyint)
  await pool.execute(
    'INSERT INTO `user` (id, admin, email_verified) VALUES (?, 0, ?) ON DUPLICATE KEY UPDATE email_verified = VALUES(email_verified)',
    [sub, Number(Boolean(email_verified))]
  )
  res.status(204).end()
})

// Auth0 Log Stream webhook: set email_verified=1 immediately upon successful verification
// Configure Auth0 Logs → Streams → HTTP with:
//   - URL: https://your-public-url/auth0/logs/webhook  (use ngrok for local)
//   - Header: x-action-secret: <ACTION_SHARED_SECRET>
//   - Events: include "Success Email Verification" (type "sv")
app.post('/auth0/logs/webhook', async (req, res) => {
  try {
    if (config.actionSecret && req.header('x-action-secret') !== config.actionSecret) {
      return res.status(401).end()
    }
    const events = Array.isArray(req.body) ? req.body : [req.body]
    if (!events.length) return res.status(204).end()
    const pool = getPool()
    for (const evt of events) {
      const type = (evt as any)?.type
      const userId = (evt as any)?.user_id || (evt as any)?.details?.user_id
      if (type === 'sv' && userId) {
        // idempotent upsert: create user with verified=1 or flip existing to 1
        await pool.execute(
          'INSERT INTO `user` (id, admin, email_verified) VALUES (?, 0, 1) ON DUPLICATE KEY UPDATE email_verified = 1',
          [userId]
        )
      }
    }
    res.status(204).end()
  } catch {
    // Acknowledge to prevent repeated retries; add logging here if needed
    res.status(200).end()
  }
})

// Save or update draft (requires JWT; uses sub from token)
app.put('/charity-signup/draft', requireAuth, async (req: any, res) => {
  const sub: string | undefined = req.auth?.payload?.sub
  if (!sub) return res.status(401).json({ error: 'unauthorized' })
  const draft = req.body ?? {}
  await upsertCharityForUser(sub, draft)
  res.status(204).end()
})

// Final submit
app.post('/charity-signup/submit', requireAuth, async (req: any, res) => {
  const sub: string | undefined = req.auth?.payload?.sub
  if (!sub) return res.status(401).json({ error: 'unauthorized' })
  const submission = req.body ?? {}
  const charityId = await upsertCharityForUser(sub, submission, { markPendingApproval: true })
  res.status(201).json({ ok: true, charityId })
})

// Current user profile + optional draft
app.get('/me', requireAuth, async (req: any, res) => {
  const sub: string | undefined = req.auth?.payload?.sub
  if (!sub) return res.status(401).json({ error: 'unauthorized' })
  const pool = getPool()
  const [[user]]: any = await pool.query('SELECT id AS sub, admin, email_verified FROM `user` WHERE id = ?', [sub])
  const [[charity]]: any = await pool.query('SELECT * FROM charity WHERE user_id = ?', [sub])
  const [typesRows]: any = charity ? await pool.query('SELECT t.name FROM charity_type ct JOIN types t ON t.id = ct.type_id WHERE ct.charity_id = ?', [charity.id]) : [[]]
  const [itemsRows]: any = charity ? await pool.query('SELECT i.name FROM charity_item ci JOIN item i ON i.id = ci.item_id WHERE ci.charity_id = ?', [charity.id]) : [[]]
  const completed = Array.isArray(itemsRows) && itemsRows.length > 0
  res.json({
    user: user || null,
    draft: charity
      ? {
          charity,
          categories: (typesRows as any[]).map((r: any) => r.name),
          acceptedItemTypes: (itemsRows as any[]).map((r: any) => r.name),
        }
      : null,
    completed,
  })
})

function safeParseJSON(text: string | Buffer) {
  try {
    return JSON.parse(text.toString())
  } catch {
    return null
  }
}

async function upsertCharityForUser(
  sub: string,
  payload: any,
  opts?: { markPendingApproval?: boolean }
): Promise<number> {
  const pool = getPool()
  const [existingRows]: any = await pool.query('SELECT id FROM charity WHERE user_id = ?', [sub])
  const existingId: number | undefined = existingRows?.[0]?.id

  // Map SPA payload → charity columns
  const data = normalizeCharityPayload(payload)

  if (opts?.markPendingApproval) {
    // In this schema, pending can be represented by approved = 0 (or NULL). We'll set 0.
    data.approved = 0
  }

  if (!existingId) {
    const [result]: any = await pool.execute(
      `INSERT INTO charity
      (name, address, zip_code, phone, email, contact_name, mission, description,
       link_donate_cash, link_volunteer, link_website, link_wishlist, link_logo,
       pickup, dropoff, resell, faith, new_items, taxid, user_id, logo_url, city, state, paused)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.address,
        data.zip_code,
        data.phone,
        data.email,
        data.contact_name,
        data.mission,
        data.description,
        data.link_donate_cash,
        data.link_volunteer,
        data.link_website,
        data.link_wishlist,
        data.link_logo,
        data.pickup,
        data.dropoff,
        data.resell,
        data.faith,
        data.new_items,
        data.taxid,
        sub,
        data.logo_url,
        data.city,
        data.state,
        data.paused,
      ]
    )
    const charityId = Number(result.insertId)
    await upsertJoinTables(charityId, payload)
    return charityId
  } else {
    await pool.execute(
      `UPDATE charity SET
        name = ?, address = ?, zip_code = ?, phone = ?, email = ?, contact_name = ?,
        mission = ?, description = ?, link_donate_cash = ?, link_volunteer = ?,
        link_website = ?, link_wishlist = ?, link_logo = ?, pickup = ?, dropoff = ?,
        resell = ?, faith = ?, new_items = ?, taxid = ?, logo_url = ?, city = ?, state = ?,
        approved = COALESCE(?, approved), paused = COALESCE(?, paused)
       WHERE id = ?`,
      [
        data.name,
        data.address,
        data.zip_code,
        data.phone,
        data.email,
        data.contact_name,
        data.mission,
        data.description,
        data.link_donate_cash,
        data.link_volunteer,
        data.link_website,
        data.link_wishlist,
        data.link_logo,
        data.pickup,
        data.dropoff,
        data.resell,
        data.faith,
        data.new_items,
        data.taxid,
        data.logo_url,
        data.city,
        data.state,
        data.approved ?? null,
        data.paused ?? null,
        existingId,
      ]
    )
    await upsertJoinTables(existingId, payload)
    return existingId
  }
}

function normalizeCharityPayload(p: any) {
  return {
    name: p.organizationName ?? p.name ?? null,
    address: p.address ?? null,
    zip_code: p.zip ?? p.zip_code ?? null,
    phone: p.phone ?? null,
    // NOT NULL in schema: default to empty string if missing
    email: stringOrEmpty(p.email),
    contact_name: p.contactName ?? p.contact_name ?? null,
    mission: p.mission ?? null,
    description: p.description ?? null,
    // NOT NULL in schema: default to empty string if missing
    link_donate_cash: stringOrEmpty(p.cashDonationsUrl ?? p.link_donate_cash),
    link_volunteer: stringOrEmpty(p.volunteerSignupUrl ?? p.link_volunteer),
    link_website: stringOrEmpty(p.website ?? p.link_website),
    link_wishlist: stringOrEmpty(p.amazonWishlistUrl ?? p.link_wishlist),
    link_logo: stringOrEmpty(p.link_logo),
    pickup: boolNum(p.pickupDonations ?? p.pickup),
    dropoff: boolNum(p.acceptDropOffs ?? p.dropoff),
    resell: boolNum(p.resellItems ?? p.resell),
    faith: boolNum(p.faithBased ?? p.faith),
    // Ensure NOT NULL default for new_items
    new_items: Array.isArray(p.acceptedItemTypes)
      ? (p.acceptedItemTypes.includes('New items only') ? 1 : 0)
      : Number(!!p.new_items),
    taxid: p.taxId ?? p.taxid ?? null,
    logo_url: stringOrEmpty(p.logoUrl),
    city: p.city ?? null,
    state: p.state ?? null,
    approved: p.approved,
    // Ensure NOT NULL default for paused
    paused: Number(!!p.paused),
  }
}

function boolNum(v: any): number | null {
  if (v === undefined || v === null) return null
  return v ? 1 : 0
}

function stringOrEmpty(v: any): string {
  if (v === undefined || v === null) return ''
  return String(v)
}
async function upsertJoinTables(charityId: number, payload: any) {
  const pool = getPool()
  // Categories (types)
  if (Array.isArray(payload.categories)) {
    const [rows]: any = await pool.query('SELECT id, name FROM types')
    const nameToId = new Map<string, number>(rows.map((r: any) => [r.name, r.id]))
    const typeIds: number[] = payload.categories.map((name: string) => nameToId.get(name)).filter(Boolean)
    await pool.execute('DELETE FROM charity_type WHERE charity_id = ?', [charityId])
    if (typeIds.length) {
      const values = typeIds.map((t) => [charityId, t])
      await pool.query('INSERT INTO charity_type (charity_id, type_id) VALUES ?', [values] as any)
    }
  }
  // Accepted items
  if (Array.isArray(payload.acceptedItemTypes)) {
    const [rows]: any = await pool.query('SELECT id, name FROM item')
    const nameToId = new Map<string, number>(rows.map((r: any) => [r.name, r.id]))
    const itemIds: number[] = payload.acceptedItemTypes.map((name: string) => nameToId.get(name)).filter(Boolean)
    await pool.execute('DELETE FROM charity_item WHERE charity_id = ?', [charityId])
    if (itemIds.length) {
      const values = itemIds.map((i) => [charityId, i])
      await pool.query('INSERT INTO charity_item (charity_id, item_id) VALUES ?', [values] as any)
    }
  }
}

export default app



