-- Supabase Storage: public bucket for CMS-uploaded images.
-- Run in Supabase SQL Editor after 001_cms.sql.

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

-- Optional: tighten max size / MIME types in Dashboard → Storage → portfolio-media → Configuration.

drop policy if exists "Public read portfolio-media" on storage.objects;

create policy "Public read portfolio-media"
on storage.objects for select
to public
using (bucket_id = 'portfolio-media');
