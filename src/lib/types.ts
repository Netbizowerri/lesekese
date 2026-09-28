/** Shapes returned by the Supabase tables in supabase/migrations/0001_admin_cms.sql */

export type PostStatus = 'draft' | 'published' | 'archived';
export type OrderStatus = 'new' | 'contacted' | 'confirmed' | 'delivered' | 'cancelled';
export type LeadStatus = 'new' | 'contacted' | 'converted' | 'closed';
export type AdminRole = 'admin' | 'editor';

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  /** Inline image inserted roughly halfway through the body. */
  image_1_url: string | null;
  /** Inline image inserted later in the body. */
  image_2_url: string | null;
  author_id: string | null;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  reference: string;
  product_id: string | null;
  product_name: string;
  bottle_count: number;
  total_ngn: number;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  status: OrderStatus;
  source: string;
  created_at: string;
  updated_at: string;
}

/** Payload the checkout form sends when recording an order. */
export interface NewOrder {
  reference: string;
  product_id: string | null;
  product_name: string;
  bottle_count: number;
  total_ngn: number;
  customer_name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  notes?: string;
  /** Where the order came from, e.g. 'website'. */
  source?: string;
}

export interface Lead {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  inquiry_type: string | null;
  message: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

/** Payload the contact form sends when recording a lead. */
export interface NewLead {
  full_name: string;
  email?: string;
  phone?: string;
  location?: string;
  inquiry_type?: string;
  message?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: AdminRole;
  created_at: string;
}

export const ORDER_STATUSES: OrderStatus[] = [
  'new',
  'contacted',
  'confirmed',
  'delivered',
  'cancelled',
];

export const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'converted', 'closed'];

export const POST_STATUSES: PostStatus[] = ['draft', 'published', 'archived'];
