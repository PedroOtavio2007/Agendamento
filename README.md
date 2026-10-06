# Sistema de Agendamento para Barbearias

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Um sistema completo de agendamento e gerenciamento para barbearias. Construído com foco em segurança, escalabilidade e experiência do usuário, o sistema possui fluxos de autenticação independentes para clientes e profissionais, além de envio de e-mails transacionais.

## Funcionalidades Principais

* **Arquitetura Multi-Tenant:** Perfis e painéis totalmente separados para **Clientes** e **Barbeiros**, garantindo segurança e controle de acesso rigoroso.
* **Segurança Avançada (Autenticação):**
  * Verificação de E-mail (Double Opt-in) com links mágicos.
  * Fluxo completo de Recuperação e Redefinição de Senha utilizando Tokens com tempo de expiração (TTL).
  * Senhas criptografadas no banco de dados (Bcrypt).
* **Painel do Profissional:** Dashboard administrativa para visualização da agenda diária e controle de horários.
* **Experiência do Cliente:** Interface intuitiva para escolha de serviços, datas e horários disponíveis.
* **Design System Responsivo:** UI moderna com tema dark e detalhes em dourado (`zinc-950` e `gold-400`), 100% responsiva (Mobile First).

## Tecnologias Utilizadas

* **Front-end:** React, Next.js (App Router), Tailwind CSS.
* **Back-end:** Next.js API Routes (Serverless), TypeScript.
* **Banco de Dados & ORM:** PostgreSQL (Neon Serverless) e Prisma ORM.
* **Serviços Externos:** Resend (Disparo de E-mails Transacionais).
* **Deploy:** Vercel.

## Variáveis de Ambiente

Para rodar este projeto localmente, você precisará adicionar as seguintes variáveis de ambiente no seu arquivo `.env`:

```env
DATABASE_URL="sua_string_de_conexao_do_neon"
RESEND_API_KEY="sua_chave_api_do_resend"
APP_URL="http://localhost:3000" # Ou a URL de produção na Vercel
EMAIL_FROM="onboarding@resend.dev" # Ou seu domínio verificado
