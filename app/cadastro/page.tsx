"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/lib/schemas";

export default function RegisterPage() {
  const router = useRouter(); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(""); const parsed = registerSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget))); if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Dados inválidos"); setLoading(true); const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) }); const data = await response.json(); setLoading(false); if (!response.ok) return setError(data.error); router.push("/dashboard"); router.refresh(); }
  return <main className="grid min-h-screen place-items-center bg-zinc-950 px-5"><section className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl shadow-black/30 sm:p-10"><p className="text-xs font-bold tracking-[.25em] text-gold-400">CORTE</p><h1 className="mt-3 text-3xl font-semibold">Crie sua conta.</h1><p className="mt-2 text-sm text-zinc-400">Seu próximo ritual começa agora.</p><form onSubmit={submit} className="mt-8 space-y-5" noValidate><Input label="Nome" name="name" autoComplete="name" placeholder="Seu nome"/><Input label="E-mail" name="email" type="email" autoComplete="email" placeholder="voce@email.com"/><Input label="Senha" name="password" type="password" autoComplete="new-password" placeholder="Mínimo de 8 caracteres"/>{error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-white py-3 font-semibold text-zinc-950 transition-all duration-300 hover:bg-gold-400 disabled:opacity-60">{loading ? "Criando..." : "Criar conta"}</button></form><p className="mt-7 text-center text-sm text-zinc-400">Já possui conta? <Link href="/login" className="font-semibold text-white hover:text-gold-400">Entrar</Link></p></section></main>;
}
