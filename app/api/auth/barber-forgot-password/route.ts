import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { sendBarberPasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/schemas";

const responseMessage = "Se este e-mail estiver cadastrado como profissional, você receberá um link para redefinir a senha.";

export async function POST(request: Request) {
  const parsed = forgotPasswordSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const email = parsed.data.email.toLowerCase(); const barber = await prisma.barber.findUnique({ where: { email } });
  if (!barber) return NextResponse.json({ message: responseMessage });
  const token = randomBytes(32).toString("hex");
  await prisma.$transaction([prisma.passwordResetToken.deleteMany({ where: { email, owner: "BARBER" } }), prisma.passwordResetToken.create({ data: { email, token, owner: "BARBER", expires: new Date(Date.now() + 3_600_000) } })]);
  try { await sendBarberPasswordResetEmail(email, token); } catch { return NextResponse.json({ error: "Não foi possível enviar o e-mail agora. Tente novamente mais tarde." }, { status: 503 }); }
  return NextResponse.json({ message: responseMessage });
}
