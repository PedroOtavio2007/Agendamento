"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Status = "loading" | "success" | "error";
function VerifyEmailContent() {
  const token = useSearchParams().get("token") ?? ""; const [status, setStatus] = useState<Status>("loading"); const [message, setMessage] = useState("Verificando o seu e-mail...");
  useEffect(() => { if (!token) { setStatus("error"); setMessage("Link de confirmação inválido."); return; } fetch("/api/auth/verify-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) }).then(async (response) => { const body = await response.json(); setStatus(response.ok ? "success" : "error"); setMessage(response.ok ? body.message : body.error); }).catch(() => { setStatus("error"); setMessage("Não foi possível verificar o e-mail. Tente novamente."); }); }, [token]);
  return <main className="grid min-h-screen place-items-center bg-zinc-950 px-5"><section className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 text-center shadow-2xl shadow-black/30"><p className="text-xs font-bold tracking-[.25em] text-gold-400">CORTE</p><h1 className="mt-4 text-3xl font-semibold">{status === "loading" ? "Verificando..." : status === "success" ? "E-mail confirmado" : "Não foi possível confirmar"}</h1><p className={"mt-3 text-sm " + (status === "error" ? "text-red-300" : "text-zinc-400")}>{message}</p>{status === "loading" && <div className="mx-auto mt-7 h-7 w-7 animate-spin rounded-full border-2 border-zinc-700 border-t-gold-400"/>}{status === "success" && <Link href="/login" className="mt-7 inline-block rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-gold-400">Entrar na conta</Link>}</section></main>;
}

export default function VerifyEmailPage() { return <Suspense fallback={<main className="min-h-screen bg-zinc-950"/>}><VerifyEmailContent/></Suspense>; }
