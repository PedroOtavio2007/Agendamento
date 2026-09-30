import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [barbers, services] = await Promise.all([
    prisma.barber.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.service.findMany({ select: { id: true, name: true, durationMin: true, priceCents: true }, orderBy: { name: "asc" } }),
  ]);
  return NextResponse.json({ barbers, services });
}
