"use client";

import { useCallback, useEffect, useState } from "react";
import { AgendaCard, type AgendaAppointment } from "@/components/barber/agenda-card";

type AgendaResponse = { barber: { id: string; name: string }; appointments: AgendaAppointment[] };

export default function BarberDashboardPage() {
  const [appointments, setAppointments] = useState<AgendaAppointment[]>([]);
  const [barberName, setBarberName] = useState("");
  const [loading, setLoading] = useState(true); const [processingId, setProcessingId] = useState<string | null>(null); const [error, setError] = useState("");
  const loadAgenda = useCallback(async () => {
    setLoading(true); setError("");
    const response = await fetch("/api/barber/agenda");
    if (response.status === 401) return window.location.assign("/login");
    const data = await response.json();
    if (!response.ok) { setError(data.error ?? "Não foi possível carregar a agenda."); setLoading(false); return; }
    const agenda: AgendaResponse = data; setAppointments(agenda.appointments); setBarberName(agenda.barber.name); setLoading(false);
  }, []);
  useEffect(() => { void loadAgenda(); }, [loadAgenda]);
  async function updateAppointment(id: string, status: "COMPLETED" | "CANCELLED") {
    setProcessingId(id); setError("");
    const response = await fetch(`/api/barber/agenda/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setProcessingId(null);
    if (!response.ok) { const data = await response.json(); return setError(data.error ?? "Não foi possível atualizar o agendamento."); }
    setAppointments((current) => current.filter((item) => item.id !== id));
  }
  const today = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  return <main className="min-h-screen bg-zinc-950"><header className="border-b border-zinc-800"><div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5"><div><p className="text-xs font-bold tracking-[.22em] text-gold-400">CORTE</p><h1 className="mt-1 text-lg font-semibold">Painel do Profissional</h1></div><span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-400">{barberName || "Agenda"}</span></div></header><section className="mx-auto max-w-3xl px-5 py-10"><p className="capitalize text-sm font-medium text-gold-400">{today}</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Agenda de hoje</h2><p className="mt-2 text-sm text-zinc-500">Clientes confirmados para o seu atendimento.</p>{error && <div className="mt-7 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}<div className="mt-8 space-y-3">{loading ? <><div className="h-36 animate-pulse rounded-2xl bg-zinc-900"/><div className="h-36 animate-pulse rounded-2xl bg-zinc-900"/></> : appointments.length ? appointments.map((appointment) => <AgendaCard key={appointment.id} appointment={appointment} processing={processingId === appointment.id} onUpdate={updateAppointment}/>) : <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-12 text-center"><p className="text-lg font-medium text-zinc-200">Sua agenda está livre.</p><p className="mt-2 text-sm text-zinc-500">Não há clientes agendados para hoje.</p></div>}</div></section></main>;
}
