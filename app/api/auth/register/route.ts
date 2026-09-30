import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const { name, password } = parsed.data; const email = parsed.data.email.toLowerCase();
  if (await prisma.user.findUnique({ where: { email } })) return NextResponse.json({ error: "Este e-mail já está cadastrado" }, { status: 409 });
  const token = randomBytes(32).toString("hex");
  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12) } });
    await tx.verificationToken.create({ data: { email, token, expires: new Date(Date.now() + 86_400_000) } });
    return created;
  });
  try { await sendVerificationEmail(email, token); } catch { return NextResponse.json({ error: "Conta criada, mas não foi possível enviar o e-mail de confirmação." }, { status: 503 }); }
  return NextResponse.json({ message: "Conta criada. Confirme o e-mail para entrar.", user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
}
