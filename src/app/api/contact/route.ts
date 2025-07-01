import { TRes } from '@/contracts/response';
import { Resend } from 'resend';

export async function POST(req: Request) {
  const body = await req.json();

  if (body.extra) {
    return Response.json({ success: false, error: 'Bot detected' }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_TOKEN!);

  try {
    await resend.emails.send({
      from: 'diogolara@resend.dev',
      to: process.env.MAIL_RECEIVER!,
      subject: `Message from ${body.name}`,
      html: `
        <p><strong>From:</strong> ${body.email}</p>
        ${body.phone ? `<p><strong>Phone:</strong> ${body.phone || '-'}</p>` : undefined}

        <p><strong>Message:</strong></p>
        <p>${body.message}</p>

        Sent with Resend
      `,
    });

    return Response.json({ success: true }, { status: 200 });

  } catch (err) {

    return Response.json({ success: false, error: err }, { status: 400 });
  }
}
