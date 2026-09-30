"use client";
import { useEffect, useState } from "react";
import { QuickBookingCard, type LastAppointment } from "@/components/booking/quick-booking-card";
import { ManageAppointmentModal, type UpcomingAppointment } from "@/components/booking/manage-appointment-modal";

export default function DashboardPage() {
  const [appointment, setAppointment] = useState<LastAppointment | null>(null);
  const [upcoming, setUpcoming] = useState<UpcomingAppointment | null>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/appointments/last"),
      fetch("/api/appointments/upcoming"),
    ])
      .then(async ([last, next]) => {
        if (last.status === 401 || next.status === 401) {
          return window.location.assign("/login");
        }
        setAppointment((await last.json()).appointment);
        setUpcoming((await next.json()).appointment);
      })
      .finally(() => setLoading(false));
  }, []);

  const dateLabel = upcoming && new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(upcoming.startsAt));

  return (
    <main className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <span className="text-sm font-bold tracking-[.25em] text-gold-400">
            CORTE
          </span>
          <span className="text-sm text-zinc-400">Sua agenda</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-sm text-gold-400">EXPERIÊNCIA PREMIUM</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Olá. Pronto para o próximo corte?
        </h1>

        {upcoming && (
          <button
            onClick={() => setManageOpen(true)}
            className="mt-7 block w-full max-w-xl rounded-2xl border border-zinc-700 bg-zinc-900 p-5 text-left transition-all duration-300 hover:border-gold-400/70 hover:bg-zinc-800"
          >
            <p className="text-xs font-bold tracking-[.18em] text-gold-400">
              PRÓXIMO AGENDAMENTO
            </p>
            <h2 className="mt-3 text-lg font-semibold">{upcoming.service.name}</h2>
            <p className="mt-1 capitalize text-sm text-zinc-300">{dateLabel}</p>
            <p className="mt-1 text-sm text-zinc-500">
              {upcoming.barber.name} · {upcoming.service.durationMin} min
            </p>
          </button>
        )}

        <div className="mt-9 max-w-xl">
          {loading ? (
            <div className="h-52 animate-pulse rounded-3xl bg-zinc-900" />
          ) : (
            <QuickBookingCard
              appointment={appointment}
              onCreated={(item) => setUpcoming(item)}
            />
          )}
        </div>
      </div>

      {upcoming && (
        <ManageAppointmentModal
          appointment={upcoming}
          open={manageOpen}
          onClose={() => setManageOpen(false)}
          onUpdated={(item) => setUpcoming(item)}
          onCancelled={() => setUpcoming(null)}
        />
      )}
    </main>
  );
}