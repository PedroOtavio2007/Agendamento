import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
export async function createToken(userId: string) { return new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setSubject(userId).setIssuedAt().setExpirationTime("7d").sign(secret); }
export async function getUserId(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  if (!token || !process.env.JWT_SECRET) return null;
  try { return (await jwtVerify(token, secret)).payload.sub ?? null; } catch { return null; }
}
