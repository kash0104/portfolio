import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.email(),
  message: z.string().min(1).max(5000),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return Response.json({ error: "Invalid input" }, { status: 400 });

  const { name, email, message } = parsed.data;
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const { error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL!,
    replyTo: email,
    subject: `New portfolio inquiry from ${name}`,
    text: message,
  });
  if (error) return Response.json({ error: "Send failed" }, { status: 500 });
  return Response.json({ ok: true });
}
