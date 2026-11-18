# Sistema de Agendamento para Barbearias

[![Acessar Deploy](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://agendamento-lyart.vercel.app)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Aplicação web full-stack desenvolvida para digitalizar o agendamento de serviços e a gestão de horários em barbearias. Projetado com foco em segurança, separação estrita de papéis e experiência do usuário, o **CORTE** conta com fluxos independentes de autenticação para clientes e profissionais, e-mails transacionais e ambiente de demonstração integrado.

---

## Acesso ao Projeto & Modo Demonstração

A aplicação está publicada e pronta para testes diretamente pelo navegador, sem necessidade de configuração local:

* **Visão do Cliente:** [agendamento-lyart.vercel.app/login](https://agendamento-lyart.vercel.app/login)
* **Painel do Barbeiro:** [agendamento-lyart.vercel.app/barber/login](https://agendamento-lyart.vercel.app/barber/login)

### Facilidades para Avaliação
* **Navegação Rápida entre Perfis:** A tela de login dos clientes possui um atalho discreto na parte inferior (*"É profissional da barbearia? Acessar painel administrativo →"*) para transição imediata à área restrita.
* **Login Administrativo em 1 Clique:** Na tela de acesso do barbeiro, utilize o botão **"Preencher credenciais de demonstração"** para carregar automaticamente os dados da conta de teste pré-configurada via seed no banco de dados:
  * **E-mail:** `demo@corte.com`
  * **Senha:** `Demo@1234`

> *Nota sobre envios de e-mail: Devido às políticas anti-spam do plano gratuito do Resend (sem domínio customizado), o disparo de e-mails de verificação de conta e recuperação de senha está restrito a endereços autorizados.*

---

## Funcionalidades Principais

* **Arquitetura Multi-Role:** Separação rigorosa entre entidades (`User` e `Barber`), rotas de API e painéis de acesso, garantindo isolamento de permissões.
* **Autenticação e Segurança:**
  * Verificação de e-mail (*Double Opt-in*) por meio de tokens únicos com expiração (TTL).
  * Recuperação e redefinição de senha independentes tanto para clientes quanto para barbeiros.
  * Armazenamento seguro de credenciais com hash criptográfico (`Bcrypt`).
* **Gestão de Agendamentos e Agenda:**
  * Fluxo intuitivo para o cliente selecionar serviços, datas e horários disponíveis.
  * Dashboard administrativa exclusiva para o barbeiro acompanhar os atendimentos do dia e gerenciar a agenda.
* **Database Seeding Automatizado:** Script configurado com Prisma para provisionar a conta de demonstração (`demo@corte.com`) de forma idempotente (`upsert`).
* **Interface Responsiva:** Design system moderno com tema dark e acentos em dourado (`zinc-950` / `gold-400`), adaptado para dispositivos móveis e desktop.

---

## Stack Tecnológica

* **Front-end:** Next.js (App Router), React, TypeScript, Tailwind CSS
* **Back-end:** Next.js API Routes (Serverless)
* **Banco de Dados & ORM:** PostgreSQL (Neon Serverless), Prisma ORM
* **E-mails Transacionais:** Resend
* **Deploy & Hospedagem:** Vercel

---
