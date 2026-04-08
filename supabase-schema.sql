-- ============================================================
-- WARD — Schema Supabase
-- Rodar no SQL Editor: supabase.com > projeto ward > SQL Editor
-- ============================================================

-- Projetos (multi-tenant)
create table if not exists projects (
  id         text primary key default gen_random_uuid()::text,
  name       text not null,
  slug       text not null unique,
  color      text not null default '#e47c24',
  created_at timestamptz not null default now()
);

-- Seed: projeto NOTREGLR
insert into projects (id, name, slug, color)
values ('notreglr', 'NOTREGLR', 'notreglr', '#e47c24')
on conflict (id) do nothing;

-- ── Swipe File ───────────────────────────────────────────────
create table if not exists swipe_items (
  id                 text primary key default gen_random_uuid()::text,
  project_id         text not null references projects(id) on delete cascade,
  source_type        text not null default 'meta_ad' check (source_type in ('meta_ad', 'manual')),
  meta_ad_id         text,
  page_name          text,
  page_url           text,
  title              text,
  body               text,
  destination_domain text,
  snapshot_url       text,
  platforms          text[] not null default '{}',
  status             text,
  days_running       integer,
  start_date         text,
  tags               text[] not null default '{}',
  notes              text,
  created_at         timestamptz not null default now()
);

create index if not exists swipe_items_project_id_idx on swipe_items(project_id);
create index if not exists swipe_items_tags_idx on swipe_items using gin(tags);
create index if not exists swipe_items_created_at_idx on swipe_items(created_at desc);

-- ── Produtos ─────────────────────────────────────────────────
create table if not exists products (
  id             text primary key default gen_random_uuid()::text,
  project_id     text not null references projects(id) on delete cascade,
  name           text not null,
  line_category  text,
  source_url     text,
  cost_eur       numeric(10, 2),
  sell_price_eur numeric(10, 2),
  status         text not null default 'evaluating'
                   check (status in ('mining', 'evaluating', 'testing', 'approved', 'discarded')),
  checklist      jsonb not null default '{}',
  notes          text,
  created_at     timestamptz not null default now()
);

create index if not exists products_project_id_idx on products(project_id);
create index if not exists products_status_idx on products(status);

-- ── Criativos ────────────────────────────────────────────────
create table if not exists creatives (
  id                   text primary key default gen_random_uuid()::text,
  project_id           text not null references projects(id) on delete cascade,
  product_id           text references products(id) on delete set null,
  title                text not null,
  brief                text,
  format               text not null default 'image'
                         check (format in ('image', 'video', 'carousel')),
  platform             text not null default 'both'
                         check (platform in ('instagram', 'facebook', 'both')),
  angle                text,
  status               text not null default 'briefing'
                         check (status in ('briefing', 'production', 'review', 'approved', 'published')),
  checklist            jsonb not null default '{}',
  result_ctr           numeric(6, 4),
  result_cpc           numeric(10, 4),
  kill_criteria_result text,
  swipe_refs           text[] not null default '{}',
  created_at           timestamptz not null default now()
);

create index if not exists creatives_project_id_idx on creatives(project_id);
create index if not exists creatives_status_idx on creatives(status);

-- ── Tarefas ──────────────────────────────────────────────────
create table if not exists tasks (
  id          text primary key default gen_random_uuid()::text,
  project_id  text not null references projects(id) on delete cascade,
  title       text not null,
  description text,
  status      text not null default 'backlog'
                check (status in ('backlog', 'todo', 'in_progress', 'done')),
  priority    text not null default 'medium'
                check (priority in ('low', 'medium', 'high', 'urgent')),
  due_date    date,
  linked_type text,
  linked_id   text,
  created_at  timestamptz not null default now()
);

create index if not exists tasks_project_id_idx on tasks(project_id);
create index if not exists tasks_status_idx on tasks(status);

-- ── RLS (Row Level Security) ─────────────────────────────────
-- Por ser uso interno pessoal, usamos uma policy permissiva
-- que pode ser endurecida depois com auth.uid()

alter table projects    enable row level security;
alter table swipe_items enable row level security;
alter table products    enable row level security;
alter table creatives   enable row level security;
alter table tasks       enable row level security;

-- Acesso total via anon key (ok para uso interno com Cloudflare Zero Trust na frente)
create policy "allow_all_projects"    on projects    for all using (true) with check (true);
create policy "allow_all_swipe"       on swipe_items for all using (true) with check (true);
create policy "allow_all_products"    on products    for all using (true) with check (true);
create policy "allow_all_creatives"   on creatives   for all using (true) with check (true);
create policy "allow_all_tasks"       on tasks       for all using (true) with check (true);
