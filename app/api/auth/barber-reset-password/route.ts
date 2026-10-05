import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { barberResetPasswordSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const parsed = barberResetPasswordSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const { token, newPassword } = parsed.data; const record = await prisma.passwordResetToken.findFirst({ where: { token, owner: "BARBER" } });
  if (!record) return NextResponse.json({ error: "Link de redefinição inválido." }, { status: 400 });
  if (record.expires < new Date()) { await prisma.passwordResetToken.delete({ where: { token } }); return NextResponse.json({ error: "Este link de redefinição expirou." }, { status: 400 }); }
  const barber = await prisma.barber.findUnique({ where: { email: record.email } });
  if (!barber) return NextResponse.json({ error: "Conta profissional não encontrada." }, { status: 404 });
  await prisma.$transaction([prisma.barber.update({ where: { id: barber.id }, data: { passwordHash: await bcrypt.hash(newPassword, 12) } }), prisma.passwordResetToken.delete({ where: { token } })]);
  return NextResponse.json({ message: "Senha profissional redefinida com sucesso." });
}
