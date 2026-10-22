-- Hide projects from the public site while keeping them in the CMS.
alter table public.projects add column if not exists hidden boolean not null default false;
