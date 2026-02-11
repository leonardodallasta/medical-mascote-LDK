# medical-mascote-LDK

## Dia Leve

Dia Leve é uma aplicação web pensada para ajudar alguém especial a manter a rotina diária de medicação de forma simples e consistente.

Desenvolvido com React, TypeScript, Bootstrap e Supabase, o projeto permite cadastrar um medicamento, definir um horário fixo, receber notificações no navegador e registrar quando a dose foi tomada.

Além das funcionalidades básicas de lembrete e histórico, o app inclui um mascote interativo que reage ao comprometimento com o tratamento. A ideia é transformar uma obrigação diária em algo mais leve e visualmente envolvente.

A aplicação é mobile-first e funciona como PWA, permitindo o envio de notificações diretamente no navegador do celular.

---

## Getting Started

### Prerequisites

```bash
Node.js >= 18
npm >= 9
Supabase configurations
Gemini API
```

### Environment Variables

This project uses Supabase as backend.

Create a `.env` file in the root of the project and add:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
GEMINI_API_KEY=your_gemini_api_key
```

You can find these values in your Supabase dashboard under:

Project Settings → API

### Installation

```bash
git clone https://github.com/leonardodallasta/medical-mascote-LDK.git
cd medical-mascote-LDK
npm install
```

### Run in Development

```bash
npm run dev
```
