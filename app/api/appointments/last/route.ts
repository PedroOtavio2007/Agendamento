import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const appointment = await prisma.appointment.findFirst({ where: { userId, status: "COMPLETED" }, orderBy: { startsAt: "desc" }, include: { barber: true, service: true } });
  return NextResponse.json({ appointment });
}
