import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";
import { registerSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const { name, email, password } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Este e-mail já está cadastrado" }, { status: 409 });
  const user = await prisma.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12) } });
  const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
  response.cookies.set("session", await createToken(user.id), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return response;
}
