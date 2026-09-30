"use client";
import { useState } from "react";
import { BookingModal } from "./booking-modal";
export type LastAppointment = { service: { id: string; name: string; durationMin: number; priceCents: number }; barber: { id: string; name: string }; startsAt: string };
type CreatedAppointment = { id: string; startsAt: string; service: { name: string; durationMin: number }; barber: { name: string } };
export function QuickBookingCard({ appointment, onCreated }: { appointment: LastAppointment | null; onCreated?: (appointment: CreatedAppointment) => void }) {
  const [open, setOpen] = useState(false);
  if (!appointment) return <><section className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-7"><p className="text-sm text-zinc-400">Seu primeiro corte começa aqui.</p><button onClick={() => setOpen(true)} className="mt-4 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-all duration-300 hover:bg-gold-400">Novo agendamento</button></section><BookingModal open={open} onClose={() => setOpen(false)} onCreated={onCreated}/></>;
  return <><section className="overflow-hidden rounded-3xl border border-gold-400/30 bg-gradient-to-br from-zinc-800 to-zinc-900 p-7 shadow-xl shadow-black/20"><p className="text-xs font-bold tracking-[.2em] text-gold-400">AGENDAMENTO RÁPIDO</p><h2 className="mt-4 text-2xl font-semibold">Seu ritual, novamente.</h2><p className="mt-2 text-zinc-400">{appointment.service.name} com {appointment.barber.name} · {appointment.service.durationMin} min</p><button onClick={() => setOpen(true)} className="mt-7 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-all duration-300 hover:scale-[1.02] hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400">Agendar novamente</button></section><BookingModal appointment={appointment} open={open} onClose={() => setOpen(false)} onCreated={onCreated}/></>;
}
