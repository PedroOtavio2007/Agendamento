import { AppointmentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const userId = await getUserId(request);
  const { id } = await params;
  
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  
  const body = await request.json();
  const status = body.status as AppointmentStatus;
  
  if (status !== "COMPLETED" && status !== "CANCELLED") {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }
  
  // CORREÇÃO AQUI: Substituímos barber: { userId } por barberId: userId
  const result = await prisma.appointment.updateMany({ 
    where: { 
      id, 
      status: "SCHEDULED", 
      barberId: userId 
    }, 
    data: { status } 
  });
  
  if (!result.count) {
    return NextResponse.json({ error: "Agendamento não encontrado ou sem permissão" }, { status: 404 });
  }
  
  return NextResponse.json({ ok: true, status });
}