# WARD — Roadmap da Plataforma

> Central de Operações interna da NOTREGLR. Não é produto público.
> Deploy: ward.notreglr.com | Stack: Next.js 16 + Supabase + Vercel

---

## Status Atual (08/04/2026)

### ✅ Fase 1 — Infraestrutura (Concluída)
- [x] Projeto Next.js 16 criado e configurado
- [x] Supabase (PostgreSQL + Storage) conectado
- [x] Vercel deploy automático via GitHub (`nathan-meireles/ward` → `main`)
- [x] Domínio `ward.notreglr.com` via Cloudflare proxy
- [x] Cloudflare Zero Trust Access (PIN por email)
- [x] Design System AIOXSquad Gold Edition aplicado
- [x] Tema claro/escuro com toggle na sidebar (persiste localStorage)
- [x] Fontes: Plus Jakarta Sans + Bebas Neue + Roboto Mono (next/font/google)

### ✅ Fase 2 — Swipe File (Concluída)
- [x] Listar, adicionar, deletar itens
- [x] Modo Meta Ad: colar URL da Ad Library → fetch automático de metadados
- [x] Modo Imagem: upload direto (PNG/JPG/WEBP) para Supabase Storage
- [x] Thumbnail de imagem nos cards
- [x] Filtro por tag, status, busca textual
- [x] Tags com cores por categoria
- [x] Modal de detalhe completo
- [x] `SUPABASE_SERVICE_ROLE_KEY` configurado (necessário para storage)

### ✅ Fase 3 — Tarefas/Kanban (Concluída)
- [x] 4 colunas: Backlog / A fazer / Em andamento / Concluído
- [x] Drag & drop entre colunas
- [x] Adicionar tarefa inline por coluna (Enter = salvar, Esc = cancelar)
- [x] TaskModal: título editável, status, prioridade, prazo (data + hora), responsável, tags, descrição
- [x] Subtarefas: criar, marcar como feito, deletar, abrir em modal próprio
- [x] Prioridades: Urgente / Alta / Média / Baixa (com ícones)
- [x] Deletar com confirmação

---

## Próximas Fases

### 🔲 Fase 4 — Esteira de Produtos (`/produtos`)
> Pipeline de gestão de produtos do catálogo NOTREGLR

**Funcionalidades planejadas:**
- [ ] Cadastro de produto: nome, linha (Shape/Furry/etc), URL fornecedor, preço custo, preço venda, margem calculada, SKU
- [ ] Upload de foto do produto
- [ ] Pipeline de estágios: Ideia → Em análise → Aprovado → Em teste → Ativo → Pausado → Descartado
- [ ] Checklist por produto: foto tirada, copy criada, ad criado, ad rodando, resultado documentado
- [ ] Filtro por linha, estágio, margem
- [ ] Integração futura: link direto para o ad no swipe file

### 🔲 Fase 5 — Produção de Criativos (`/criativos`)
> Gestão do pipeline de produção de criativos para Meta Ads

**Funcionalidades planejadas:**
- [ ] Cadastro de criativo: produto vinculado, tipo (imagem/vídeo), hook, copy, CTA
- [ ] Pipeline: Ideia → Referência coletada → Briefing → Em produção → Review → Aprovado → No ar
- [ ] Upload do criativo (imagem/vídeo)
- [ ] Checklist de produção por criativo
- [ ] Vinculação com Produto (Fase 4) e Swipe File (Fase 2)
- [ ] Status do ad: em teste / escalando / pausado / morto
- [ ] Métricas manuais: CTR, CPC, ROAS (input manual no início)

### 🔲 Fase 6 — Benchmark (`/benchmark`)
> Monitoramento de concorrentes via Meta Ad Library

**Funcionalidades planejadas:**
- [ ] Integração com `npm run search-ads` (ward CLI já funciona)
- [ ] Tabela de concorrentes: nome, domínio, nº de ads ativos, países, faixa de preço
- [ ] Feed de ads novos dos concorrentes
- [ ] Análise de copy (integração com Claude via API)
- [ ] Filtro por país, linha de produto, data
- [ ] Export para swipe file (salvar ad interessante direto do benchmark)

### 🔲 Fase 7 — Dashboard Home
> Overview executivo da operação

**Funcionalidades planejadas:**
- [ ] KPIs: ads ativos, tarefas pendentes, criativos em produção, produtos em teste
- [ ] Feed de atividade recente
- [ ] Atalhos para ações mais comuns
- [ ] Widget de métricas (input manual de ROAS, CAC, receita)

---

## Backlog Técnico

- [ ] Adicionar `SUPABASE_SERVICE_ROLE_KEY` às env vars do Vercel ao criar novas routes que usam storage
- [ ] Nunca instanciar `createClient` Supabase fora de handlers (causa build error no Vercel)
- [ ] Adicionar skeleton loading states (usar classe `.shimmer` do design system)
- [ ] Paginação/infinite scroll para listas grandes
- [ ] Keyboard shortcuts globais (J/K navegação, N nova tarefa, etc.)
- [ ] Export CSV de tarefas e swipe file
- [ ] Notificações de prazo vencido (tarefas)

---

## Decisões de Arquitetura

| Decisão | Escolhida | Razão |
|---|---|---|
| Auth | Cloudflare Zero Trust (PIN email) | Simples, sem código de auth, protege tudo |
| DB | Supabase (PostgreSQL) | Fácil de usar, RLS, storage embutido |
| Storage de imagens | Supabase Storage | Integrado, bucket público `swipe-images` |
| Deploy | Vercel + GitHub CI/CD | Auto-deploy em push para main |
| Design System | AIOXSquad Gold Edition | Dark HUD cockpit + accent gold #DDD1BB |
| Tema | Dark default, Light via html.light | Gold Edition é dark-first |
