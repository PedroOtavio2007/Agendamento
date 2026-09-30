import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };
export const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className, ...props }, ref) => <label className="block space-y-2 text-sm font-medium text-zinc-300"><span>{label}</span><input ref={ref} className={clsx("w-full rounded-xl border bg-zinc-950 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-zinc-600 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20", error && "border-red-500", className)} {...props}/>{error && <span className="block text-xs text-red-400">{error}</span>}</label>);
Input.displayName = "Input";
