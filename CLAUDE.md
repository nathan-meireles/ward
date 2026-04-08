@AGENTS.md

# WARD Platform — Instruções para Claude Code

## Regra obrigatória: Credenciais e variáveis de ambiente

**Sempre que precisar de um token, chave de API, URL, senha ou qualquer credencial externa:**

1. Adicionar o campo vazio no arquivo correto ANTES de pedir ao Nathan
2. Incluir comentário explicando onde gerar/encontrar o valor
3. Só então pedir que Nathan preencha

O arquivo de credenciais desta plataforma é sempre: `platform/.env.local`

Exemplo do padrão correto:
```
# Descrição do que é e para que serve
# → onde-gerar.com → caminho exato para gerar
NOME_DA_VARIAVEL=
```

**Nunca pedir uma credencial sem já ter criado o campo no .env.local.**

---

## Stack

- **Frontend:** Next.js 14 App Router, TypeScript, Tailwind CSS
- **Banco:** Supabase (PostgreSQL) — projeto `ward` em `aavkukshppkhxoahmaem.supabase.co`
- **Deploy:** Vercel → GitHub (`nathan-meireles/ward`) → auto-deploy no push para `main`
- **Domínio:** `ward.notreglr.com` (Cloudflare proxy → Vercel)
- **Auth:** Cloudflare Zero Trust Access (PIN por email)

## Design System

Aplicar o design system Paytcall em toda a plataforma:
- **Fontes:** Plus Jakarta Sans (corpo/UI), Bebas Neue (display/logo), Calistoga (alt) — carregadas via `next/font/google`
- **Brand color:** `#e47c24` (laranja)
- **Tema padrão:** light. Dark via `html.dark` class
- **Variáveis CSS:** `--font`, `--font-display`, `--font-alt`, `--brand`, `--bg`, `--surface`, `--surface-2`, `--surface-3`, `--border`, `--text`, `--text-2`, `--text-3`, `--text-4`
- **Raios:** `--radius` (10px), `--radius-sm` (6px), `--radius-lg` (16px)

## Fluxo de deploy

Todo push para `main` dispara deploy automático no Vercel.
Para mudanças de schema: rodar SQL via Management API do Supabase com `SUPABASE_ACCESS_TOKEN`.

## Projeto NOTREGLR

Loja de bolsas femininas DTC para Europa. Ver `c:\claude-notreglr\CLAUDE.md` para contexto completo.
Esta plataforma é a central de operações interna — não é produto público.

## Módulos (roadmap)

- ✅ Swipe File — `/swipe`
- 🔲 Tarefas/Kanban — `/tarefas`
- 🔲 Esteira de Produtos — `/produtos`
- 🔲 Produção de Criativos — `/criativos`
- 🔲 Benchmark de Concorrentes — `/benchmark`
