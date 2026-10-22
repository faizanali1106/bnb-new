-- Run in Supabase SQL Editor.
-- Schedules automatic rejection emails 7 days after an application is rejected.

alter table public.job_applications
  add column if not exists rejected_at timestamptz,
  add column if not exists rejection_email_at timestamptz,
  add column if not exists rejection_email_sent_at timestamptz;

create index if not exists job_applications_rejection_email_due_idx
  on public.job_applications (rejection_email_at)
  where status = 'rejected' and rejection_email_sent_at is null;
