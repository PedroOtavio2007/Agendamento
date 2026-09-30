import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { gold: { 400: "#D4AF65", 500: "#B98A3D" } } } }, plugins: [] } satisfies Config;
