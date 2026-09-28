import { getSupabase } from './supabase';
import type {
  AdminUser,
  Lead,
  LeadStatus,
  NewLead,
  NewOrder,
  Order,
  OrderStatus,
  Post,
  PostStatus,
} from './types';

const unavailable = () =>
  Promise.reject(new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'));

/* ------------------------------------------------------------------ *
 * Auth
 * ------------------------------------------------------------------ */

export async function signIn(email: string, password: string): Promise<void> {
  const sb = getSupabase() ?? (await unavailable());
  const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw new Error(error.message);
}

/**
 * Starts the Google OAuth handshake. The browser leaves for Google and comes
 * back to /admin, so this never resolves on success — it only throws if the
 * provider is disabled or the redirect URL is not allowlisted.
 *
 * Google identity does NOT grant access on its own: the returned user still
 * has to exist in the admin_users allowlist.
 */
export async function signInWithGoogle(): Promise<void> {
  const sb = getSupabase() ?? (await unavailable());
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Return to the CMS, not the marketing site.
      redirectTo: `${window.location.origin}/admin`,
    },
  });
  if (error) throw new Error(error.message);
}

/**
 * A signed-in user is not automatically staff — they must also appear in the
 * `admin_users` allowlist. RLS enforces this server-side; this check exists
 * so the UI can explain the difference instead of showing an empty CMS.
 */
export async function fetchAdminProfile(userId: string): Promise<AdminUser | null> {
  const sb = getSupabase() ?? (await unavailable());
  const { data, error } = await sb
    .from('admin_users')
    .select('id, email, full_name, role, created_at')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as AdminUser) ?? null;
}

export async function signOut(): Promise<void> {
  const sb = getSupabase() ?? (await unavailable());
  const { error } = await sb.auth.signOut();
  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------------ *
 * Orders
 * ------------------------------------------------------------------ */

const ORDER_COLUMNS =
  'id, reference, product_id, product_name, bottle_count, total_ngn, customer_name, phone, email, address, city, notes, status, source, created_at, updated_at';

/**
 * Records an order from checkout. Called by anonymous visitors, so it must
 * never throw into the customer flow — callers treat failure as non-fatal.
 */
export async function recordOrder(order: NewOrder): Promise<void> {
  const sb = getSupabase() ?? (await unavailable());
  const { error } = await sb.from('orders').insert(order);
  if (error) throw new Error(error.message);
}

/**
 * Records a contact-form lead. Like recordOrder this is additive: callers
 * treat failure as non-fatal so the customer still sees a success state.
 */
export async function recordLead(lead: NewLead): Promise<void> {
  const sb = getSupabase() ?? (await unavailable());
  const { error } = await sb.from('leads').insert(lead);
  if (error) throw new Error(error.message);
}

export async function fetchOrders(status?: OrderStatus): Promise<Order[]> {
  const sb = getSupabase() ?? (await unavailable());  let query = sb.from('orders').select(ORDER_COLUMNS);
  if (status) query = query.eq('status', status);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Order[];
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const sb = getSupabase() ?? (await unavailable());
  const { error } = await sb.from('orders').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteOrder(id: string): Promise<void> {
  const sb = getSupabase() ?? (await unavailable());
  const { error } = await sb.from('orders').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------------ *
 * Leads
 * ------------------------------------------------------------------ */

export async function fetchLeads(status?: LeadStatus): Promise<Lead[]> {
  const sb = getSupabase() ?? (await unavailable());
  let query = sb.from('leads').select(
    'id, full_name, email, phone, location, inquiry_type, message, status, created_at, updated_at'
  );
  if (status) query = query.eq('status', status);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Lead[];
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const sb = getSupabase() ?? (await unavailable());
  const { error } = await sb.from('leads').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------------ *
 * Posts (admin CRUD)
 * ------------------------------------------------------------------ */

const POST_COLUMNS =
  'id, slug, title, excerpt, content, cover_image_url, image_1_url, image_2_url, author_id, status, published_at, created_at, updated_at';

export type PostInput = Pick<Post, 'title' | 'slug'> &
  Partial<Pick<Post, 'excerpt' | 'content' | 'cover_image_url' | 'image_1_url' | 'image_2_url' | 'status'>>;

export async function fetchPosts(): Promise<Post[]> {
  const sb = getSupabase() ?? (await unavailable());
  const { data, error } = await sb
    .from('posts')
    .select(POST_COLUMNS)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Post[];
}

export async function createPost(input: PostInput, authorId: string): Promise<void> {
  const sb = getSupabase() ?? (await unavailable());
  const { error } = await sb.from('posts').insert({ ...input, author_id: authorId });
  if (error) throw new Error(error.message);
}

export async function updatePost(id: string, input: PostInput): Promise<void> {
  const sb = getSupabase() ?? (await unavailable());
  const { error } = await sb.from('posts').update(input).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deletePost(id: string): Promise<void> {
  const sb = getSupabase() ?? (await unavailable());
  const { error } = await sb.from('posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

const POST_IMAGES_BUCKET = 'post-images';

/**
 * Uploads an image into the public `post-images` bucket and returns its public
 * URL. Requires the 0002_post_images.sql migration (bucket + policies) to have
 * run, and the current user to be on the admin_users allowlist. Client-side
 * size guard keeps jumbo camera photos out of a storage bucket with a 5MB cap.
 */
export async function uploadPostImage(file: File): Promise<string> {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image is larger than 5MB. Compress it or use an image URL instead.');
  }
  const sb = getSupabase() ?? (await unavailable());
  const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const rand =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : String(Math.random()).slice(2);
  const path = `${Date.now()}-${rand}.${ext}`;
  const { error } = await sb.storage
    .from(POST_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'image/jpeg',
    });
  if (error) throw new Error(error.message);
  const { data } = sb.storage.from(POST_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/* ------------------------------------------------------------------ *
 * Posts (public read — used by the blog pages, no auth required)
 * ------------------------------------------------------------------ */

/** Published posts only. RLS already filters drafts, so no status filter here. */
export async function fetchPublishedPosts(limit?: number): Promise<Post[]> {
  const sb = getSupabase() ?? (await unavailable());
  let query = sb
    .from('posts')
    .select(POST_COLUMNS)
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Post[];
}

export async function fetchPublishedPostBySlug(slug: string): Promise<Post | null> {
  const sb = getSupabase() ?? (await unavailable());
  const { data, error } = await sb
    .from('posts')
    .select(POST_COLUMNS)
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Post) ?? null;
}

export const POST_STATUS_LABEL: Record<PostStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};
