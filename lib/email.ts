const appUrl = process.env.APP_URL;
const from = process.env.EMAIL_FROM;
const apiKey = process.env.RESEND_API_KEY;

async function sendEmail(to: string, subject: string, html: string) {
  if (!appUrl || !from || !apiKey) throw new Error("Serviço de e-mail não configurado");
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [to], subject, html }) });
  if (!response.ok) throw new Error("Não foi possível enviar o e-mail");
}

function message(title: string, text: string, url: string, action: string) {
  return `<main style="font-family:Arial,sans-serif;background:#18181b;color:#fafafa;padding:32px"><section style="max-width:520px;margin:auto;background:#27272a;border-radius:18px;padding:32px"><p style="color:#d4af65;letter-spacing:2px;font-weight:bold">CORTE</p><h1>${title}</h1><p style="color:#d4d4d8;line-height:1.5">${text}</p><a href="${url}" style="display:inline-block;margin-top:16px;background:#d4af65;color:#18181b;padding:12px 18px;border-radius:10px;font-weight:bold;text-decoration:none">${action}</a><p style="color:#a1a1aa;font-size:12px;margin-top:24px">Se não solicitou esta ação, ignore este e-mail.</p></section></main>`;
}

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${appUrl}/verify-email?token=${encodeURIComponent(token)}`;
  return sendEmail(email, "Confirme o seu e-mail", message("Confirme a sua conta", "Use o botão abaixo para validar o seu e-mail e ativar a conta.", url, "Confirmar e-mail"));
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;
  return sendEmail(email, "Redefina a sua senha", message("Redefinição de senha", "Use o botão abaixo para escolher uma nova senha. Este link expira em uma hora.", url, "Redefinir senha"));
}
