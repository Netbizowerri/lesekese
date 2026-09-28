import { Fragment, useEffect, useState } from 'react';
import { Calendar, ChevronRight, Newspaper } from 'lucide-react';
import { fetchPublishedPostBySlug, fetchPublishedPosts } from '../lib/queries';
import { isSupabaseConfigured } from '../lib/supabase';
import type { Post } from '../lib/types';
import { formatDate } from '../components/admin/ui';
import { VideoPlayer } from '../components/VideoPlayer';
import {
  ACTION_VIDEO_POSTER,
  ACTION_VIDEO_URL,
  GOODBYE_VIDEO_POSTER,
  GOODBYE_VIDEO_URL,
  PRODUCTS,
} from '../data/mockData';

interface BlogProps {
  onNavigate: (path: string) => void;
}

/**
 * Splits the stored body on blank lines, interleaving the two optional body
 * images. Keeps the admin editor plain-text while the public page stays
 * classic-blog shaped.
 */
function renderBody(content: string, image1Url?: string | null, image2Url?: string | null) {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) return null;

  // image_1 sits at the midpoint, image_2 a little further down.
  const mid = Math.floor(blocks.length / 2);
  const second = Math.min(blocks.length - 1, mid + 2);

  const inline = (src: string, i: number) => (
    <img
      key={`img-${i}`}
      src={src}
      alt=""
      loading="lazy"
      className="my-2 aspect-[16/9] w-full rounded-2xl border border-slate-200 object-cover"
    />
  );

  return (
    <div className="mt-8 space-y-5">
      {blocks.map((block, i) => (
        <Fragment key={i}>
          <p className="text-base leading-relaxed text-slate-700">{block}</p>
          {image1Url && i === mid ? inline(image1Url, 1) : null}
          {image2Url && i === second ? inline(image2Url, 2) : null}
        </Fragment>
      ))}
    </div>
  );
}

function NotPublished() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
      <p className="text-sm text-slate-500">Blog</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-wide text-slate-900">
        No posts published yet
      </h1>
      <p className="mt-3 max-w-prose text-slate-600">
        Guides on bedbug treatment, cockroach control and safe insecticide handling will appear here.
      </p>
    </div>
  );
}

export function BlogPage({ onNavigate }: BlogProps) {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setPosts([]);
      return;
    }
    fetchPublishedPosts()
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  if (posts && posts.length === 0) return <NotPublished />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
      <p className="text-sm text-slate-500">Blog</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-wide text-slate-900 sm:text-5xl">
        Pest control, done right
      </h1>
      <p className="mt-4 max-w-prose text-lg text-slate-600">
        Practical guides on killing bedbugs and cockroaches safely in Nigerian homes.
      </p>

      <div className="mt-12">
        {posts === null ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-busy="true">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {post.cover_image_url ? (
                  <img
                    src={post.cover_image_url}
                    alt=""
                    loading="lazy"
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="grid h-48 w-full place-items-center bg-slate-100">
                    <Newspaper className="h-8 w-8 text-slate-400" aria-hidden="true" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs text-slate-500">
                    {post.published_at ? formatDate(post.published_at) : ''}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-bold leading-tight text-slate-900">
                    {post.title}
                  </h2>
                  {post.excerpt && <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>}
                  <button
                    type="button"
                    onClick={() => onNavigate(`/blog/${post.slug}`)}
                    className="mt-4 self-start text-sm font-semibold text-red-700 hover:underline"
                  >
                    Read article
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function BlogPostPage({ slug, onNavigate }: BlogProps & { slug: string }) {
  const [post, setPost] = useState<Post | null | 'loading'>('loading');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setPost(null);
      return;
    }
    fetchPublishedPostBySlug(slug)
      .then((row) => setPost(row))
      .catch(() => setPost(null));
  }, [slug]);

  useEffect(() => {
    if (post === null) {
      document.title = 'Article not found | LESEKESE';
    } else if (post !== 'loading' && post.title) {
      document.title = `${post.title} | LESEKESE`;
    }
  }, [post]);

  if (post === 'loading') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8" role="status" aria-busy="true">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/2 rounded bg-slate-200" />
          <div className="h-64 rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-28 text-center sm:px-6">
        <h1 className="font-display text-3xl font-bold text-slate-900">Article not found</h1>
        <p className="mt-3 text-slate-600">This post may have been unpublished or moved.</p>
        <button
          type="button"
          onClick={() => onNavigate('/blog')}
          className="mt-6 text-sm font-semibold text-red-700 hover:underline"
        >
          Back to blog
        </button>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-4 lg:gap-10">
        {/* ---- Main column (75%) ---- */}
        <div className="min-w-0 lg:col-span-3">
          <button
            type="button"
            onClick={() => onNavigate('/blog')}
            className="text-sm font-semibold text-red-700 hover:underline"
          >
            &larr; All articles
          </button>

          <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-wide text-slate-900 sm:text-5xl">
            {post.title}
          </h1>

          {post.published_at && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Published {formatDate(post.published_at)}
            </p>
          )}

          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt=""
              className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover"
            />
          )}

          {post.excerpt && (
            <p className="mt-8 border-l-4 border-red-600 pl-4 text-lg font-medium leading-relaxed text-slate-800">
              {post.excerpt}
            </p>
          )}

          {renderBody(post.content, post.image_1_url, post.image_2_url)}
        </div>

        {/* ---- Sidebar (25%) ---- */}
        <aside className="mt-12 lg:mt-0 lg:col-span-1">
          <PostSidebar currentSlug={post.slug} onNavigate={onNavigate} />
        </aside>
      </div>
    </article>
  );
}

/** All self-hosted site videos — embedded in the classic blog sidebar. */
const BLOG_VIDEOS = [
  {
    src: ACTION_VIDEO_URL,
    poster: ACTION_VIDEO_POSTER,
    title: 'See LESEKESE in action',
    eyebrow: 'Video',
  },
  {
    src: GOODBYE_VIDEO_URL,
    poster: GOODBYE_VIDEO_POSTER,
    title: 'Say goodbye to bedbugs',
    eyebrow: 'Video',
  },
];

/**
 * Classic-blog right rail: recent posts, the two hero products, and every
 * self-hosted video. Stacks under the article on mobile.
 */
function PostSidebar({ currentSlug, onNavigate }: { currentSlug: string; onNavigate: (path: string) => void }) {
  const [recent, setRecent] = useState<Post[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setRecent([]);
      return;
    }
    fetchPublishedPosts(6)
      .then((rows) => setRecent(rows.filter((p) => p.slug !== currentSlug).slice(0, 5)))
      .catch(() => setRecent([]));
  }, [currentSlug]);

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      {/* Recent posts */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-display text-lg font-bold tracking-wide text-slate-900">Recent posts</h2>
        {recent.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">More guides coming soon.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {recent.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(`/blog/${p.slug}`)}
                  className="group flex w-full items-center justify-between gap-2 py-3 text-left"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-800 group-hover:text-red-700">
                      {p.title}
                    </span>
                    {p.published_at && (
                      <span className="block text-xs text-slate-500">
                        {formatDate(p.published_at)}
                      </span>
                    )}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-red-600" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* The two hero products */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-display text-lg font-bold tracking-wide text-slate-900">Our products</h2>
        <div className="mt-3 space-y-3">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="flex items-center gap-3">
              <img
                src={product.image}
                alt=""
                loading="lazy"
                className="h-14 w-14 shrink-0 rounded-xl border border-slate-200 bg-slate-50 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {product.productType === 'powder' ? product.name : 'LESEKESE Instant Killer 500ml'}
                </p>
                <p className="text-sm font-bold text-red-700">
                  {product.productType === 'powder'
                    ? `₦${product.priceNgn.toLocaleString()}`
                    : `From ₦${product.priceNgn.toLocaleString()}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/products')}
                className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
              >
                Order
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Videos */}
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-display text-lg font-bold tracking-wide text-slate-900">Videos</h2>
        {BLOG_VIDEOS.map((video) => (
          <VideoPlayer
            key={video.src}
            src={video.src}
            poster={video.poster}
            eyebrow={video.eyebrow}
            title={video.title}
          />
        ))}
      </section>
    </div>
  );
}