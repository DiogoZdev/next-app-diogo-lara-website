import nodemailer from "nodemailer"
import { MailtrapTransport } from "mailtrap"
import { NextApiRequest, NextApiResponse } from "next"

const transport = nodemailer.createTransport(
    MailtrapTransport({
        token: process.env.SMTP_TOKEN!,
        accountId: Number(process.env.SMTP_ACCOUNT_ID!),
        testInboxId: Number(process.env.SMTP_TEST_INBOX_ID!)
    })
)

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    if (request.method !== 'POST') {
        return
    }

    const { name, email, phone, message } = JSON.parse(request.body)

    const sender = {
        name,
        address: email
    }
    const recipient = [process.env.SMTP_EMAIL!]

    await transport.sendMail({
        from: sender,
        to: recipient,
        subject: `Message from ${name}`,
        text: `${message}${phone ? `\n\nPhone: ${phone}` : ''}`,
        category: "Integration Test",
        sandbox: true
    }).then((res) => {
        console.log('res', res)
        response.status(200).json({ message: 'Email sent successfully' })
    }, (err) => {
        console.error('err', err)
        response.status(500).json({ message: 'Error sending email' })
    });
}
