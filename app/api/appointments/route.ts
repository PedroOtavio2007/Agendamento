import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const parsed = appointmentSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const { barberId, serviceId, startsAt } = parsed.data;
  try {
    const appointment = await prisma.$transaction(async (tx) => {
      // Serializes booking attempts for this professional, closing the check-then-insert race.
      const barbers = await tx.$queryRaw<{ id: string }[]>`SELECT id FROM "Barber" WHERE id = ${barberId} FOR UPDATE`;
      if (!barbers.length) throw new Error("Profissional não encontrado");
      const service = await tx.service.findUnique({ where: { id: serviceId } });
      if (!service) throw new Error("Serviço não encontrado");
      const endsAt = new Date(startsAt.getTime() + service.durationMin * 60_000);
      // Serializable transaction makes the availability read and the insert atomic.
      const conflict = await tx.appointment.findFirst({ where: { barberId, status: "SCHEDULED", startsAt: { lt: endsAt }, endsAt: { gt: startsAt } } });
      if (conflict) throw new Error("Este horário acabou de ser reservado. Selecione outro.");
      return tx.appointment.create({ data: { userId, barberId, serviceId, startsAt, endsAt }, include: { barber: true, service: true } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível criar o agendamento";
    return NextResponse.json({ error: message }, { status: message.includes("reservado") ? 409 : 400 });
  }
}
