"use client";

export type AgendaAppointment = {
  id: string;
  startsAt: string;
  user: { name: string; email: string };
  service: { name: string; durationMin: number };
};

type Props = { appointment: AgendaAppointment; processing: boolean; onUpdate: (id: string, status: "COMPLETED" | "CANCELLED") => void };

export function AgendaCard({ appointment, processing, onUpdate }: Props) {
  const time = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(appointment.startsAt));
  return <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/90"><div className="flex items-start gap-4"><time className="rounded-xl bg-gold-500/10 px-3 py-2 text-lg font-bold text-gold-400">{time}</time><div className="min-w-0 flex-1"><h2 className="truncate text-lg font-semibold text-white">{appointment.user.name}</h2><p className="mt-1 truncate text-sm text-zinc-500">{appointment.user.email}</p><p className="mt-4 text-sm text-zinc-300">{appointment.service.name} <span className="text-zinc-600">·</span> {appointment.service.durationMin} min</p></div></div><div className="mt-5 flex justify-end gap-3"><button disabled={processing} onClick={() => onUpdate(appointment.id, "CANCELLED")} className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-300 hover:border-red-400/70 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50">Cancelar</button><button disabled={processing} onClick={() => onUpdate(appointment.id, "COMPLETED")} className="rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-bold text-zinc-950 transition-all duration-300 hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/20 disabled:opacity-50">{processing ? "Salvando..." : "Concluir"}</button></div></article>;
}
