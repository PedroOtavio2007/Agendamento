# Corte — agendamentos premium

## Executar localmente

1. Copie `.env.example` para `.env` e informe um PostgreSQL.
2. Execute `npm install`, `npm run db:generate`, `npm run db:migrate` e `npm run db:seed`.
3. Inicie com `npm run dev`.

## Arquitetura

- `prisma/schema.prisma`: entidades relacionais User, Barber, Service e Appointment.
- JWT em cookie `httpOnly`, com senha protegida por bcrypt.
- O endpoint de criação usa Zod e transação serializável; a busca de colisão aplica o intervalo `startsAt < novoFim && endsAt > novoInício` para bloquear sobreposição por barbeiro.
- A dashboard consulta `/api/appointments/last`, apresenta o último atendimento concluído e reaproveita serviço/profissional no modal de reagendamento.

Para produção na Vercel, configure `DATABASE_URL` e `JWT_SECRET` nas variáveis de ambiente. Use um PostgreSQL gerenciado compatível (Neon, Supabase ou Vercel Postgres).
