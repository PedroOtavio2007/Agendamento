"use client";
import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPasswordSchema } from "@/lib/schemas";
import { Input } from "@/components/ui/input";

function ResetPasswordForm() {
  const token = useSearchParams().get("token") ?? ""; const [error, setError] = useState(""); const [success, setSuccess] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(""); const form = new FormData(event.currentTarget); const password = String(form.get("password") ?? ""); const confirmPassword = String(form.get("confirmPassword") ?? ""); if (password !== confirmPassword) return setError("As senhas não coincidem."); const parsed = resetPasswordSchema.safeParse({ token, password }); if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Dados inválidos"); setLoading(true); const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) }); const body = await response.json(); setLoading(false); if (!response.ok) return setError(body.error); setSuccess(body.message); }
  return <main className="grid min-h-screen place-items-center bg-zinc-950 px-5"><section className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl shadow-black/30"><p className="text-xs font-bold tracking-[.25em] text-gold-400">CORTE</p><h1 className="mt-3 text-3xl font-semibold">Nova senha</h1><p className="mt-2 text-sm text-zinc-400">Escolha uma senha segura com pelo menos 8 caracteres.</p><form onSubmit={submit} className="mt-8 space-y-5" noValidate><Input label="Nova senha" name="password" type="password" autoComplete="new-password"/><Input label="Confirmar nova senha" name="confirmPassword" type="password" autoComplete="new-password"/>{error && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}{success && <p role="status" className="rounded-xl bg-gold-500/10 p-3 text-sm text-gold-400">{success}</p>}<button disabled={loading || Boolean(success)} className="w-full rounded-xl bg-white py-3 font-semibold text-zinc-950 transition-all duration-300 hover:bg-gold-400 disabled:opacity-60">{loading ? "Salvando..." : "Redefinir senha"}</button></form>{success && <p className="mt-7 text-center text-sm text-zinc-400"><Link href="/login" className="font-semibold text-white hover:text-gold-400">Entrar com a nova senha</Link></p>}</section></main>;
}

export default function ResetPasswordPage() { return <Suspense fallback={<main className="min-h-screen bg-zinc-950"/>}><ResetPasswordForm/></Suspense>; }
