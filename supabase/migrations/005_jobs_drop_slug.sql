-- Run after 004_jobs.sql if that version included a slug column.
-- Job URLs now use the numeric id: /careers/12

drop index if exists public.jobs_slug_idx;
alter table public.jobs drop column if exists slug;
