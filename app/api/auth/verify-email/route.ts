import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json(); const token = typeof body.token === "string" ? body.token : "";
  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record) return NextResponse.json({ error: "Link de confirmação inválido." }, { status: 400 });
  if (record.expires < new Date()) { await prisma.verificationToken.delete({ where: { token } }); return NextResponse.json({ error: "Este link de confirmação expirou." }, { status: 400 }); }
  const verified = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { email: record.email } });
    if (!user) return false;
    await tx.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
    await tx.verificationToken.delete({ where: { token } });
    return true;
  });
  if (!verified) return NextResponse.json({ error: "Conta não encontrada." }, { status: 404 });
  return NextResponse.json({ message: "E-mail confirmado com sucesso." });
}
