import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const parsed = resetPasswordSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const { token, password } = parsed.data; const record = await prisma.passwordResetToken.findFirst({ where: { token, owner: "USER" } });
  if (!record) return NextResponse.json({ error: "Link de redefinição inválido." }, { status: 400 });
  if (record.expires < new Date()) { await prisma.passwordResetToken.delete({ where: { token } }); return NextResponse.json({ error: "Este link de redefinição expirou." }, { status: 400 }); }
  const user = await prisma.user.findUnique({ where: { email: record.email } });
  if (!user) return NextResponse.json({ error: "Conta não encontrada." }, { status: 404 });
  await prisma.$transaction([prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(password, 12) } }), prisma.passwordResetToken.delete({ where: { token } })]);
  return NextResponse.json({ message: "Senha redefinida com sucesso." });
}
