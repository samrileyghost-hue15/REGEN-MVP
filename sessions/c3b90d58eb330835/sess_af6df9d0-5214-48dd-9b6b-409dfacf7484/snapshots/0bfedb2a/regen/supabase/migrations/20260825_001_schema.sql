-- ============================================================
-- REGEN — Schema migration
-- Paste this into: Supabase Dashboard → SQL Editor → Run
-- Project: tdchbeknugydofcabxft
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── USERS ────────────────────────────────────────────────────
-- Table already exists; ensure required columns are present
alter table users add column if not exists id    text;
alter table users add column if not exists name  text;
alter table users add column if not exists role  text;
alter table users add column if not exists email text;
alter table users add column if not exists avatar text;

-- Make id the primary key if it isn't yet
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where table_name='users' and constraint_type='PRIMARY KEY'
  ) then
    alter table users add primary key (id);
  end if;
end$$;

-- Add unique constraint on email if missing
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where table_name='users' and constraint_name='users_email_key'
  ) then
    alter table users add constraint users_email_key unique (email);
  end if;
end$$;

drop policy if exists "users_public_read" on users;
create policy "users_public_read" on users for select using (true);

-- ── ASSETS ───────────────────────────────────────────────────
alter table assets add column if not exists id              text;
alter table assets add column if not exists name            text;
alter table assets add column if not exists type            text;
alter table assets add column if not exists location        text;
alter table assets add column if not exists line_id         text;
alter table assets add column if not exists severity        text;
alter table assets add column if not exists last_inspection date;
alter table assets add column if not exists install_date    date;
alter table assets add column if not exists description     text;
alter table assets add column if not exists map_x           integer default 0;
alter table assets add column if not exists map_y           integer default 0;

-- Migrate asset_id → id if needed
do $$
begin
  if exists (select 1 from information_schema.columns where table_name='assets' and column_name='asset_id')
     and not exists (select 1 from information_schema.columns where table_name='assets' and column_name='id') then
    alter table assets rename column asset_id to id;
  end if;
end$$;

do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where table_name='assets' and constraint_type='PRIMARY KEY'
  ) then
    alter table assets add primary key (id);
  end if;
end$$;

drop policy if exists "assets_public_read"   on assets;
drop policy if exists "assets_public_update" on assets;
create policy "assets_public_read"   on assets for select using (true);
create policy "assets_public_update" on assets for update using (true);

-- ── SENSORS ──────────────────────────────────────────────────
alter table sensors add column if not exists id            text;
alter table sensors add column if not exists asset_id      text;
alter table sensors add column if not exists name          text;
alter table sensors add column if not exists type          text;
alter table sensors add column if not exists unit          text;
alter table sensors add column if not exists status        text default 'online';
alter table sensors add column if not exists severity      text default 'healthy';
alter table sensors add column if not exists current_value numeric(10,4) default 0;
alter table sensors add column if not exists normal_min    numeric(10,4) default 0;
alter table sensors add column if not exists normal_max    numeric(10,4) default 1;
alter table sensors add column if not exists warning_max   numeric(10,4) default 1;
alter table sensors add column if not exists critical_max  numeric(10,4) default 1;
alter table sensors add column if not exists last_update   timestamptz default now();
alter table sensors add column if not exists map_x         integer default 0;
alter table sensors add column if not exists map_y         integer default 0;

do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where table_name='sensors' and constraint_type='PRIMARY KEY'
  ) then
    alter table sensors add primary key (id);
  end if;
end$$;

drop policy if exists "sensors_public_read"   on sensors;
drop policy if exists "sensors_public_update" on sensors;
create policy "sensors_public_read"   on sensors for select using (true);
create policy "sensors_public_update" on sensors for update using (true);

-- ── ALERTS ───────────────────────────────────────────────────
alter table alerts add column if not exists id              text;
alter table alerts add column if not exists asset_id        text;
alter table alerts add column if not exists sensor_id       text;
alter table alerts add column if not exists title           text;
alter table alerts add column if not exists description     text;
alter table alerts add column if not exists severity        text;
alter table alerts add column if not exists status          text default 'active';
alter table alerts add column if not exists created_at      timestamptz default now();
alter table alerts add column if not exists acknowledged_at timestamptz;
alter table alerts add column if not exists acknowledged_by text;
alter table alerts add column if not exists resolved_at     timestamptz;

do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where table_name='alerts' and constraint_type='PRIMARY KEY'
  ) then
    alter table alerts add primary key (id);
  end if;
end$$;

drop policy if exists "alerts_public_read"   on alerts;
drop policy if exists "alerts_public_insert" on alerts;
drop policy if exists "alerts_public_update" on alerts;
create policy "alerts_public_read"   on alerts for select using (true);
create policy "alerts_public_insert" on alerts for insert with check (true);
create policy "alerts_public_update" on alerts for update using (true);

-- ── PREDICTIONS ──────────────────────────────────────────────
alter table predictions add column if not exists id                   text;
alter table predictions add column if not exists asset_id             text;
alter table predictions add column if not exists sensor_id            text;
alter table predictions add column if not exists risk_level           text;
alter table predictions add column if not exists issue                text;
alter table predictions add column if not exists rul_days             integer;
alter table predictions add column if not exists failure_probability  integer;
alter table predictions add column if not exists recommended_action   text;
alter table predictions add column if not exists generated_at         timestamptz default now();

do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where table_name='predictions' and constraint_type='PRIMARY KEY'
  ) then
    alter table predictions add primary key (id);
  end if;
end$$;

drop policy if exists "predictions_public_read" on predictions;
create policy "predictions_public_read" on predictions for select using (true);

-- ── WORK_ORDERS (create if missing) ─────────────────────────
create table if not exists work_orders (
  id             text primary key,
  asset_id       text not null,
  alert_id       text,
  prediction_id  text,
  title          text not null,
  description    text not null,
  priority       text not null,
  status         text not null default 'open',
  assigned_team  text not null,
  assigned_to    text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  resolved_at    timestamptz,
  notes          text
);

alter table work_orders enable row level security;
drop policy if exists "wo_public_read"   on work_orders;
drop policy if exists "wo_public_insert" on work_orders;
drop policy if exists "wo_public_update" on work_orders;
create policy "wo_public_read"   on work_orders for select using (true);
create policy "wo_public_insert" on work_orders for insert with check (true);
create policy "wo_public_update" on work_orders for update using (true);

-- ── MAINTENANCE_RECORDS (create if missing) ──────────────────
create table if not exists maintenance_records (
  id             text primary key,
  asset_id       text not null,
  work_order_id  text,
  type           text not null,
  description    text not null,
  performed_by   text not null,
  performed_at   timestamptz not null,
  outcome        text not null
);

alter table maintenance_records enable row level security;
drop policy if exists "maint_public_read" on maintenance_records;
create policy "maint_public_read" on maintenance_records for select using (true);

-- ── SENSOR_READINGS (create if missing) ──────────────────────
create table if not exists sensor_readings (
  id         text primary key,
  sensor_id  text not null,
  value      numeric(10,4) not null,
  timestamp  timestamptz not null default now(),
  severity   text not null
);

alter table sensor_readings enable row level security;
drop policy if exists "readings_public_read" on sensor_readings;
create policy "readings_public_read" on sensor_readings for select using (true);

create index if not exists sensor_readings_sensor_id_ts on sensor_readings (sensor_id, timestamp);
