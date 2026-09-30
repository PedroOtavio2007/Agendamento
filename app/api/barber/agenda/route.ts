import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  // CORREÇÃO: Usar 'id: userId' em vez de apenas 'userId'
  const barber = await prisma.barber.findUnique({ 
    where: { id: userId }, 
    select: { id: true, name: true } 
  });
  
  if (!barber) return NextResponse.json({ error: "Perfil de profissional não encontrado" }, { status: 403 });

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
  const appointments = await prisma.appointment.findMany({
    where: { 
      barberId: barber.id, 
      status: "SCHEDULED", 
      startsAt: { gte: startOfDay, lt: endOfDay } 
    },
    orderBy: { startsAt: "asc" },
    include: { 
      user: { select: { name: true, email: true } }, 
      service: { select: { name: true, durationMin: true } } 
    },
  });
  
  return NextResponse.json({ barber, appointments });
}