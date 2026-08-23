import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { config } from './config.js'

const ses = new SESv2Client({ region: process.env.AWS_REGION || 'us-east-2' })

const ADMIN_REVIEW_URL = 'https://app.reusefull.org/admin'

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
}
