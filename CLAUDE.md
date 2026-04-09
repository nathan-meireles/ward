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

- **Frontend:** Next.js 16.2.3 (Turbopack), TypeScript, Tailwind CSS v4
- **Banco:** Supabase (PostgreSQL) — projeto `ward` em `aavkukshppkhxoahmaem.supabase.co`
- **Storage:** Supabase Storage — bucket `swipe-images` (public)
- **Deploy:** Vercel → GitHub (`nathan-meireles/ward`) → auto-deploy no push para `main`
- **Domínio:** `ward.notreglr.com` (Cloudflare proxy → Vercel)
- **Auth:** Cloudflare Zero Trust Access (PIN por email)

---

## Design System

**AIOXSquad Brandbook v2.0 — Gold Edition (Dark Cockpit)**
Referência completa em `design-system.md` (30 source URLs documentadas).

### Tema
- **Padrão:** escuro (Gold Edition). Variáveis definidas em `:root`.
- **Claro:** via classe `html.light` (toggle sun/moon na sidebar, persiste em `localStorage`).

### Fontes (todas via `next/font/google`)
| Variável CSS | Font | Uso |
|---|---|---|
| `var(--font)` = `var(--font-jakarta)` | Plus Jakarta Sans | Corpo/UI — padrão |
| `var(--font-display)` = `var(--font-bebas)` | Bebas Neue | Logo, títulos display |
| `var(--font-mono)` = `var(--font-mono)` | Roboto Mono | Labels HUD, nav items, badges |
| `var(--font-alt)` = `var(--font-calistoga)` | Calistoga | Alternativa decorativa |

### Tokens principais
```css
/* Accent gold */
--brand: #DDD1BB  (dark) | #7A5C1E  (light)

/* Superfícies (6 níveis) */
--bg: #09090A → --surface: #151517 → --surface-2: #1D1D20
--surface-panel: #18181B → --surface-3: #222225 → --surface-hover: #28282C

/* Bordas */
--border: rgba(255,255,255,0.09)  |  --border-input: rgba(255,255,255,0.12)

/* Texto */
--text: #F4F4F4 → --text-2: #E8E8E8 → --text-3: #AFAFAF → --text-4: #6E6E6E

/* Radius */
--radius: 8px | --radius-sm: 4px | --radius-lg: 12px | --radius-full: 9999px

/* Glow */
--brand-glow: rgba(221,209,187,0.25) | --brand-dim: rgba(221,209,187,0.12)
```

### Classes de componente disponíveis (globals.css)
`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-destructive`
`.form-input`, `.form-label`
`.card`, `.badge`, `.badge-success`, `.badge-error`, `.badge-warning`, `.badge-neutral`
`.data-table`, `.bento`, `.nav-item`, `.shimmer`

---

## Regras de código críticas

### ⚠️ Supabase client — NUNCA instanciar no nível do módulo
```ts
// ❌ ERRADO — falha no build do Vercel (env vars não disponíveis em build time)
const supabase = createClient(URL, KEY)
export async function POST() { ... }

// ✅ CORRETO — criar dentro do handler
export async function POST() {
  const supabase = createClient(URL, KEY)
  ...
}
```

### Schema de banco
Para mudanças de schema: rodar SQL via Management API do Supabase com `SUPABASE_ACCESS_TOKEN`:
```
POST https://api.supabase.com/v1/projects/aavkukshppkhxoahmaem/database/query
Authorization: Bearer $SUPABASE_ACCESS_TOKEN
```

---

## Módulos

| Status | Módulo | Rota | Notas |
|---|---|---|---|
| ✅ Operacional | Swipe File | `/swipe` | Meta Ad URL + upload de imagem direta |
| ✅ Operacional | Tarefas/Kanban | `/tarefas` | Título, desc, prazo+hora, responsável, tags, subtarefas |
| 🔲 A construir | Esteira de Produtos | `/produtos` | Pipeline de produtos com checklist |
| 🔲 A construir | Produção de Criativos | `/criativos` | Checklist de produção por criativo |
| 🔲 A construir | Benchmark | `/benchmark` | Concorrentes, meta ads, análise |

---

## Fluxo de deploy

```
git push origin main → GitHub → Vercel (auto-deploy) → ward.notreglr.com
```

Build: `next build` (Next.js 16 + Turbopack)
Env vars: definidas em `.env.local` (local) **e** no painel Vercel (produção).
Sempre que adicionar nova env var: adicionar em ambos os lugares.

---

## Projeto NOTREGLR

Loja de bolsas femininas DTC para Europa. Ver `c:\claude-notreglr\CLAUDE.md` para contexto completo.
Esta plataforma é a central de operações interna — não é produto público.
