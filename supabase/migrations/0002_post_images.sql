-- LESEKESE Admin CMS - body images on posts + public upload bucket.
--
-- Run this in the Supabase SQL editor. Two inline images (image_1_url,
-- image_2_url) give the classic blog layout a third text column; the
-- post-images bucket lets admins upload from their device instead of pasting
-- an external URL. Admin uploads are gated by the admin_users allowlist;
-- everyone may view the public bucket.

alter table public.posts
  add column if not exists image_1_url text,
  add column if not exists image_2_url text;

-- Public bucket, capped at 5MB images. Images keep their original on-view URL,
-- so no signed URLs are needed.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set public = true;

-- Anyone may read files in the public bucket.
drop policy if exists "public read post image files" on storage.objects;
create policy "public read post image files"
  on storage.objects for select
  to public
  using (bucket_id = 'post-images');

-- Only staff on the admin_users allowlist may add images.
drop policy if exists "admin_users can insert post image files" on storage.objects;
create policy "admin_users can insert post image files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'post-images'
    and exists (select 1 from public.admin_users where id = auth.uid())
  );

drop policy if exists "admin_users can update post image files" on storage.objects;
create policy "admin_users can update post image files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'post-images')
  with check (bucket_id = 'post-images');

drop policy if exists "admin_users can delete post image files" on storage.objects;
create policy "admin_users can delete post image files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'post-images');