import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/schemas";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const userId = await getUserId(request); const { id } = await params;
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const current = await prisma.appointment.findFirst({ where: { id, userId, status: "SCHEDULED" } });
  if (!current) return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 });
  const parsed = appointmentSchema.pick({ serviceId: true, startsAt: true }).safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const { serviceId, startsAt } = parsed.data;
  try {
    const appointment = await prisma.$transaction(async (tx) => {
      const lockedBarber = await tx.$queryRaw<{ id: string }[]>`SELECT id FROM "Barber" WHERE id = ${current.barberId} FOR UPDATE`;
      if (!lockedBarber.length) throw new Error("Profissional não encontrado");
      const service = await tx.service.findUnique({ where: { id: serviceId } });
      if (!service) throw new Error("Serviço não encontrado");
      const endsAt = new Date(startsAt.getTime() + service.durationMin * 60_000);
      const conflict = await tx.appointment.findFirst({ where: { id: { not: id }, barberId: current.barberId, status: "SCHEDULED", startsAt: { lt: endsAt }, endsAt: { gt: startsAt } } });
      if (conflict) throw new Error("Este horário acabou de ser reservado. Selecione outro.");
      return tx.appointment.update({ where: { id }, data: { serviceId, startsAt, endsAt }, include: { barber: true, service: true } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return NextResponse.json({ appointment });
  } catch (error) { const message = error instanceof Error ? error.message : "Não foi possível editar o agendamento"; return NextResponse.json({ error: message }, { status: message.includes("reservado") ? 409 : 400 }); }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const userId = await getUserId(request); const { id } = await params;
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const result = await prisma.appointment.updateMany({ where: { id, userId, status: "SCHEDULED" }, data: { status: "CANCELLED" } });
  if (!result.count) return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
