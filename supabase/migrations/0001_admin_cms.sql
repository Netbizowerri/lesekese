-- LESEKESE Admin CMS — schema, RLS policies, and triggers
-- Target: Supabase project "Lesekese Blogs"
-- Apply with: supabase db push   (or paste into Dashboard → SQL Editor → Run)

-- ============================================================
-- 0. Extensions
-- ============================================================
create extension if not exists pgcrypto with schema extensions;

-- ============================================================
-- 1. Admin allowlist
--    Only users whose auth.users row is mirrored here can read/write
--    private data. This is the gate the whole CMS hangs off.
-- ============================================================
create table if not exists public.admin_users (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null unique,
  full_name  text,
  role       text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

comment on table public.admin_users is 'Allowlist of LESEKESE staff permitted to use the admin CMS.';

-- Helper used by every other policy.
-- SECURITY DEFINER + pinned search_path so RLS on admin_users cannot recurse
-- and so this function cannot be hijacked via a poisoned search_path.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ============================================================
-- 2. Shared updated_at trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- 3. Blog posts
-- ============================================================
create table if not exists public.posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  excerpt          text not null default '',
  content          text not null default '',
  cover_image_url  text,
  author_id        uuid references public.admin_users (id) on delete set null,
  status           text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint published_posts_need_date check (
    status <> 'published' or published_at is not null
  )
);

create index if not exists posts_status_published_at_idx
  on public.posts (status, published_at desc);

create index if not exists posts_slug_idx on public.posts (slug);

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- Publish stamps the date; unpublish clears it so the CHECK stays satisfied.
create or replace function public.stamp_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  elsif new.status <> 'published' then
    new.published_at = null;
  end if;
  return new;
end;
$$;

drop trigger if exists posts_stamp_published_at on public.posts;
create trigger posts_stamp_published_at
  before insert or update on public.posts
  for each row execute function public.stamp_published_at();

-- ============================================================
-- 4. Orders
--    Written by anonymous checkout visitors; read/updated only by admins.
-- ============================================================
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  reference     text not null unique,
  product_id    text,
  product_name  text not null,
  bottle_count  int  not null check (bottle_count between 1 and 24),
  total_ngn     int  not null check (total_ngn >= 0),
  customer_name text not null,
  phone         text not null,
  email         text,
  address       text,
  city          text,
  notes         text,
  status        text not null default 'new'
                  check (status in ('new', 'contacted', 'confirmed', 'delivered', 'cancelled')),
  source        text not null default 'website',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists orders_status_created_at_idx
  on public.orders (status, created_at desc);

create index if not exists orders_created_at_idx
  on public.orders (created_at desc);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ============================================================
-- 5. Leads (contact-form submissions)
-- ============================================================
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  email         text,
  phone         text,
  location      text,
  inquiry_type  text,
  message       text not null default '',
  status        text not null default 'new'
                  check (status in ('new', 'contacted', 'converted', 'closed')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists leads_status_created_at_idx
  on public.leads (status, created_at desc);

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ============================================================
-- 6. Row Level Security
-- ============================================================
alter table public.admin_users enable row level security;
alter table public.posts        enable row level security;
alter table public.orders        enable row level security;
alter table public.leads         enable row level security;

-- --- admin_users -------------------------------------------------
-- Readable only by the person it describes. Insert/delete is deliberately
-- NOT granted: the allowlist is seeded by hand so it cannot grow itself.
drop policy if exists admin_users_select_own on public.admin_users;
create policy admin_users_select_own on public.admin_users
  for select
  to authenticated
  using (id = auth.uid());

-- --- posts -------------------------------------------------------
-- Published posts are public (the blog renders them anonymously).
-- Drafts/archived stay invisible until an admin flips them.
drop policy if exists posts_public_read on public.posts;
create policy posts_public_read on public.posts
  for select
  to anon, authenticated
  using (status = 'published' or public.is_admin());

drop policy if exists posts_admin_insert on public.posts;
create policy posts_admin_insert on public.posts
  for insert
  to authenticated
  with check (public.is_admin() and author_id = auth.uid());

drop policy if exists posts_admin_update on public.posts;
create policy posts_admin_update on public.posts
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists posts_admin_delete on public.posts;
create policy posts_admin_delete on public.posts
  for delete
  to authenticated
  using (public.is_admin());

-- --- orders ------------------------------------------------------
-- Insert-only for the public: checkout can create an order, but can never
-- read the book or touch anyone else's row.
drop policy if exists orders_public_insert on public.orders;
create policy orders_public_insert on public.orders
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists orders_admin_read on public.orders;
create policy orders_admin_read on public.orders
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists orders_admin_update on public.orders;
create policy orders_admin_update on public.orders
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists orders_admin_delete on public.orders;
create policy orders_admin_delete on public.orders
  for delete
  to authenticated
  using (public.is_admin());

-- --- leads -------------------------------------------------------
drop policy if exists leads_public_insert on public.leads;
create policy leads_public_insert on public.leads
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists leads_admin_read on public.leads;
create policy leads_admin_read on public.leads
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists leads_admin_update on public.leads;
create policy leads_admin_update on public.leads
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists leads_admin_delete on public.leads;
create policy leads_admin_delete on public.leads
  for delete
  to authenticated
  using (public.is_admin());

-- ============================================================
-- 7. Grants
--    RLS decides WHICH ROWS a role may touch; grants decide whether the
--    operation is possible at all. Supabase's default privileges usually
--    cover this, but stating it explicitly keeps the migration correct on
--    projects with non-standard default privileges.
--    Re-running is harmless.
-- ============================================================
grant usage on schema public to anon, authenticated;

-- The public blog reads published posts; only admins may write.
grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;

-- Anyone may create an order or a lead; nobody but admins may read them.
grant insert on public.orders to anon, authenticated;
grant select, update, delete on public.orders to authenticated;

grant insert on public.leads to anon, authenticated;
grant select, update, delete on public.leads to authenticated;

grant select on public.admin_users to authenticated;

-- ============================================================
-- 8. First admin — run this AFTER creating the user
--    in Dashboard → Authentication → Users → Add user.
--    Replace the email, then re-run this block for each extra admin.
--    The SELECT is the safest way to attach: it takes the id from
--    auth.users by email, so it cannot mismatch the auth row.
-- ============================================================
-- insert into public.admin_users (id, email, full_name, role)
-- select id, email, 'Brand Team', 'admin'
-- from auth.users
-- where email = 'admin@lesekeseproducts.com'
-- on conflict (id) do nothing;
