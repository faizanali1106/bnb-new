-- Run in Supabase SQL Editor after 007_job_questions.sql.
-- Lets HR star / favorite applications.

alter table public.job_applications
  add column if not exists featured boolean not null default false;

create index if not exists job_applications_featured_idx
  on public.job_applications (featured);
