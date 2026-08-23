import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { config } from './config.js'

const region = process.env.AWS_REGION || 'us-east-2'
const ses = new SESv2Client({ region })
const s3 = new S3Client({ region })

const ADMIN_REVIEW_URL = 'https://app.reusefull.org/admin'
const SENT_EMAILS_BUCKET = process.env.SES_ARCHIVE_BUCKET || 'reusefull-sent-emails'

async function archiveSentEmail(record: { to: string; from: string; subject: string; body: string; sentAt: string }) {
  const key = `charity-signup/${record.sentAt.replace(/[:.]/g, '-')}.json`
  await s3.send(
    new PutObjectCommand({
      Bucket: SENT_EMAILS_BUCKET,
      Key: key,
      Body: JSON.stringify(record, null, 2),
      ContentType: 'application/json',
    })
  )
}

export async function sendCharitySignupNotification(charity: {
  name: string
  contactName?: string | null
  email?: string | null
  phone?: string | null
}) {
  const subject = `New charity partner signup: ${charity.name}`
  const body = [
    'A new charity partner has signed up and is awaiting approval.',
    '',
    `Organization: ${charity.name}`,
    `Contact: ${charity.contactName || 'N/A'}`,
    `Email: ${charity.email || 'N/A'}`,
    `Phone: ${charity.phone || 'N/A'}`,
    '',
    `Review it here: ${ADMIN_REVIEW_URL}`,
  ].join('\n')

  await ses.send(
    new SendEmailCommand({
      FromEmailAddress: config.email.fromAddress,
      Destination: { ToAddresses: [config.email.adminNotificationAddress] },
      Content: {
        Simple: {
          Subject: { Data: subject, Charset: 'UTF-8' },
          Body: { Text: { Data: body, Charset: 'UTF-8' } },
        },
      },
    })
  )

  // Best-effort archive copy; a logging failure shouldn't be treated as a send failure
  archiveSentEmail({
    to: config.email.adminNotificationAddress,
    from: config.email.fromAddress,
    subject,
    body,
    sentAt: new Date().toISOString(),
  }).catch(() => {})
}
