-- Run in Supabase SQL Editor after 006_job_applications.sql.
-- Custom screening questions per job, plus answers on each application.

alter table public.jobs
  add column if not exists questions jsonb not null default '[]'::jsonb;

alter table public.job_applications
  add column if not exists answers jsonb not null default '[]'::jsonb;

alter table public.job_applications
  add column if not exists featured boolean not null default false;
