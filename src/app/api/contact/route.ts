import { Resend } from 'resend';

export async function POST(req: Request) {
  const body = await req.json();

  if (body.extra) {
    return new Response(JSON.stringify({ success: false, error: 'Bot detected' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body.message || body.message.length < 35) {
    return new Response(JSON.stringify({
      sucess: false,
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
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

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {

    return new Response(JSON.stringify({ success: false, error: err }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
