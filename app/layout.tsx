import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Corte | Barbearia", description: "Agendamentos premium" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
