"use client";
import { useEffect, useState } from "react";
import { appointmentSchema } from "@/lib/schemas";
import type { LastAppointment } from "./quick-booking-card";

type BookingOptions = { barbers: { id: string; name: string }[]; services: { id: string; name: string; durationMin: number }[] };

type CreatedAppointment = { id: string; startsAt: string; service: { name: string; durationMin: number }; barber: { name: string } };
export function BookingModal({ appointment, open, onClose, onCreated }: { appointment?: LastAppointment | null; open: boolean; onClose: () => void; onCreated?: (appointment: CreatedAppointment) => void }) {
  const [options, setOptions] = useState<BookingOptions | null>(null);
  const [barberId, setBarberId] = useState(""); const [serviceId, setServiceId] = useState(""); const [startsAt, setStartsAt] = useState("");
  const [error, setError] = useState(""); const [done, setDone] = useState(false); const [loading, setLoading] = useState(false);
  const quick = Boolean(appointment);
  useEffect(() => {
    if (!open) return;
    setError(""); setDone(false); setStartsAt("");
    if (appointment) { setBarberId(appointment.barber.id); setServiceId(appointment.service.id); return; }
    fetch("/api/booking-options").then(async (response) => {
      if (!response.ok) throw new Error(); const data: BookingOptions = await response.json();
      setOptions(data); setBarberId(data.barbers[0]?.id ?? ""); setServiceId(data.services[0]?.id ?? "");
    }).catch(() => setError("Não foi possível carregar os serviços. Tente novamente."));
  }, [open, appointment]);
  async function confirm() {
    setError(""); const payload = { barberId, serviceId, startsAt }; const parsed = appointmentSchema.safeParse(payload);
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Horário inválido");
    setLoading(true); const response = await fetch("/api/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); const data = await response.json(); setLoading(false);
    if (!response.ok) return setError(data.error); onCreated?.(data.appointment); setDone(true);
  }
  if (!open) return null;
  return <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-5 backdrop-blur-sm"><div className="w-full max-w-lg rounded-3xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl sm:p-8">{done ? <><p className="text-xs font-bold tracking-[.2em] text-gold-400">CONFIRMADO</p><h3 className="mt-3 text-2xl font-semibold">Seu horário está reservado.</h3><button onClick={onClose} className="mt-7 rounded-xl bg-white px-5 py-3 font-semibold text-zinc-950">Concluir</button></> : <><div className="flex items-start justify-between"><div><p className="text-xs font-bold tracking-[.2em] text-gold-400">{quick ? "REAGENDAR" : "NOVO AGENDAMENTO"}</p><h3 className="mt-2 text-xl font-semibold">Escolha seu novo horário</h3></div><button onClick={onClose} aria-label="Fechar" className="text-zinc-400 hover:text-white">×</button></div>{quick ? <div className="mt-6 rounded-xl bg-zinc-800/70 p-4 text-sm"><p>{appointment!.service.name}</p><p className="mt-1 text-zinc-400">Profissional: {appointment!.barber.name}</p></div> : <label className="mt-6 block text-sm text-zinc-300">Serviço<select value={serviceId} onChange={(event) => setServiceId(event.target.value)} className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white focus:border-gold-400">{options?.services.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.durationMin} min</option>)}</select></label>}<label className="mt-6 block text-sm font-medium text-zinc-300">Data e horário<input type="datetime-local" value={startsAt} min={new Date().toISOString().slice(0, 16)} onChange={(event) => setStartsAt(event.target.value)} className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-gold-400"/></label>{error && <p className="mt-3 text-sm text-red-300">{error}</p>}<div className="mt-7 flex justify-end gap-3"><button onClick={onClose} className="rounded-xl px-4 py-3 text-sm text-zinc-300 hover:text-white">Cancelar</button><button disabled={loading || (!quick && !options)} onClick={confirm} className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-all duration-300 hover:bg-gold-400 disabled:opacity-60">{loading ? "Reservando..." : "Confirmar horário"}</button></div></>}</div></div>;
}
