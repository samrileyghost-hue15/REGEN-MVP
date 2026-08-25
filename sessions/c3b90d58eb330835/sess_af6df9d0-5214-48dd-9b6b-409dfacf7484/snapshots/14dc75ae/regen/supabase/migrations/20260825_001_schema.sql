-- ============================================================
-- REGEN — Full schema + seed data
-- Run this in Supabase SQL Editor (Project: tdchbeknugydofcabxft)
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Drop existing tables (for clean re-run) ─────────────────
drop table if exists sensor_readings    cascade;
drop table if exists maintenance_records cascade;
drop table if exists work_orders        cascade;
drop table if exists predictions        cascade;
drop table if exists alerts             cascade;
drop table if exists sensors            cascade;
drop table if exists assets             cascade;
drop table if exists users              cascade;

-- ── USERS ────────────────────────────────────────────────────
create table users (
  id     text primary key,
  name   text not null,
  role   text not null check (role in ('maintenance_engineer','operations_manager','administrator')),
  email  text not null unique,
  avatar text
);

alter table users enable row level security;
create policy "users_public_read" on users for select using (true);

-- ── ASSETS ───────────────────────────────────────────────────
create table assets (
  id              text primary key,
  name            text not null,
  type            text not null check (type in ('track','switch','bridge','sleeper','station')),
  location        text not null,
  line_id         text not null,
  severity        text not null check (severity in ('critical','warning','info','healthy','offline')),
  last_inspection date not null,
  install_date    date not null,
  description     text,
  map_x           integer not null default 0,
  map_y           integer not null default 0
);

alter table assets enable row level security;
create policy "assets_public_read"   on assets for select using (true);
create policy "assets_public_update" on assets for update using (true);

-- ── SENSORS ──────────────────────────────────────────────────
create table sensors (
  id            text primary key,
  asset_id      text not null references assets(id) on delete cascade,
  name          text not null,
  type          text not null check (type in ('vibration','temperature','strain','seismic')),
  unit          text not null,
  status        text not null check (status in ('online','offline','degraded')),
  severity      text not null check (severity in ('critical','warning','info','healthy','offline')),
  current_value numeric(10,4) not null default 0,
  normal_min    numeric(10,4) not null default 0,
  normal_max    numeric(10,4) not null default 1,
  warning_max   numeric(10,4) not null default 1,
  critical_max  numeric(10,4) not null default 1,
  last_update   timestamptz not null default now(),
  map_x         integer not null default 0,
  map_y         integer not null default 0
);

alter table sensors enable row level security;
create policy "sensors_public_read"   on sensors for select using (true);
create policy "sensors_public_update" on sensors for update using (true);

-- ── SENSOR_READINGS ──────────────────────────────────────────
create table sensor_readings (
  id         text primary key,
  sensor_id  text not null references sensors(id) on delete cascade,
  value      numeric(10,4) not null,
  timestamp  timestamptz not null default now(),
  severity   text not null check (severity in ('critical','warning','info','healthy'))
);

alter table sensor_readings enable row level security;
create policy "readings_public_read" on sensor_readings for select using (true);

create index sensor_readings_sensor_id_ts on sensor_readings (sensor_id, timestamp);

-- ── ALERTS ───────────────────────────────────────────────────
create table alerts (
  id              text primary key,
  asset_id        text not null references assets(id) on delete cascade,
  sensor_id       text references sensors(id) on delete set null,
  title           text not null,
  description     text not null,
  severity        text not null check (severity in ('critical','warning','info','healthy','offline')),
  status          text not null check (status in ('active','acknowledged','resolved')),
  created_at      timestamptz not null default now(),
  acknowledged_at timestamptz,
  acknowledged_by text,
  resolved_at     timestamptz
);

alter table alerts enable row level security;
create policy "alerts_public_read"   on alerts for select using (true);
create policy "alerts_public_insert" on alerts for insert with check (true);
create policy "alerts_public_update" on alerts for update using (true);

-- ── PREDICTIONS ──────────────────────────────────────────────
create table predictions (
  id                   text primary key,
  asset_id             text not null references assets(id) on delete cascade,
  sensor_id            text references sensors(id) on delete set null,
  risk_level           text not null check (risk_level in ('high','medium','low')),
  issue                text not null,
  rul_days             integer not null,
  failure_probability  integer not null check (failure_probability between 0 and 100),
  recommended_action   text not null,
  generated_at         timestamptz not null default now()
);

alter table predictions enable row level security;
create policy "predictions_public_read" on predictions for select using (true);

-- ── WORK_ORDERS ──────────────────────────────────────────────
create table work_orders (
  id             text primary key,
  asset_id       text not null references assets(id) on delete cascade,
  alert_id       text references alerts(id) on delete set null,
  prediction_id  text references predictions(id) on delete set null,
  title          text not null,
  description    text not null,
  priority       text not null check (priority in ('critical','high','medium','low')),
  status         text not null check (status in ('open','in_progress','resolved','closed')),
  assigned_team  text not null,
  assigned_to    text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  resolved_at    timestamptz,
  notes          text
);

alter table work_orders enable row level security;
create policy "wo_public_read"   on work_orders for select using (true);
create policy "wo_public_insert" on work_orders for insert with check (true);
create policy "wo_public_update" on work_orders for update using (true);

-- ── MAINTENANCE_RECORDS ──────────────────────────────────────
create table maintenance_records (
  id             text primary key,
  asset_id       text not null references assets(id) on delete cascade,
  work_order_id  text references work_orders(id) on delete set null,
  type           text not null,
  description    text not null,
  performed_by   text not null,
  performed_at   timestamptz not null,
  outcome        text not null check (outcome in ('completed','partial','deferred'))
);

alter table maintenance_records enable row level security;
create policy "maint_public_read" on maintenance_records for select using (true);
