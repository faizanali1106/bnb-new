-- Run in Supabase SQL Editor.
-- 1) Remove duplicate applications (keep the earliest row per job+email / title+email)
-- 2) Add unique indexes so the same email cannot apply twice to the same role

-- Duplicates with a job_id: keep lowest id
delete from public.job_applications a
using public.job_applications b
where a.job_id is not null
  and b.job_id is not null
  and a.job_id = b.job_id
  and lower(a.email) = lower(b.email)
  and a.id > b.id;

-- Duplicates with null job_id: keep lowest id per title+email
delete from public.job_applications a
using public.job_applications b
where a.job_id is null
  and b.job_id is null
  and lower(a.job_title) = lower(b.job_title)
  and lower(a.email) = lower(b.email)
  and a.id > b.id;

create unique index if not exists job_applications_job_email_uidx
  on public.job_applications (job_id, lower(email))
  where job_id is not null;

create unique index if not exists job_applications_title_email_uidx
  on public.job_applications (lower(job_title), lower(email))
  where job_id is null;
