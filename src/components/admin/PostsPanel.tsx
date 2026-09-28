import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { FileText, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import {
  createPost,
  deletePost,
  fetchPosts,
  updatePost,
  uploadPostImage,
  type PostInput,
} from '../../lib/queries';
import { POST_STATUSES, type Post, type PostStatus } from '../../lib/types';
import { useAdminAuth } from './AdminAuthProvider';
import {
  DangerButton,
  EmptyState,
  ErrorState,
  Field,
  formatDate,
  GhostButton,
  inputClass,
  LoadingRows,
  PrimaryButton,
  StatusPill,
  textareaClass,
} from './ui';

const BLANK: PostInput = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  image_1_url: '',
  image_2_url: '',
  status: 'draft',
};

/* ------------------------------------------------------------------ *
 * Draft autosave. Writing on every change means the body survives a
 * sign-out, a tab close, or a computer crash — the editor state lives in
 * localStorage, not only in component memory.
 * ------------------------------------------------------------------ */

const DRAFT_PREFIX = 'lesekese:post-draft:v1:';

function draftKey(scope: string): string {
  return `${DRAFT_PREFIX}${scope}`;
}

interface SavedDraft {
  form: PostInput;
  savedAt: number;
}

function readDraft(scope: string): SavedDraft | null {
  try {
    const raw = localStorage.getItem(draftKey(scope));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedDraft;
    return parsed?.form ? parsed : null;
  } catch {
    return null;
  }
}

function writeDraft(scope: string, form: PostInput): void {
  try {
    localStorage.setItem(draftKey(scope), JSON.stringify({ form, savedAt: Date.now() }));
  } catch {
    // Private browsing can throw on quota; autosave is best-effort.
  }
}

function clearDraft(scope: string): void {
  try {
    localStorage.removeItem(draftKey(scope));
  } catch {
    // Nothing to clear.
  }
}

/** Normalises a Post row into the editable PostInput shape. */
function toInput(post: Post): PostInput {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? '',
    content: post.content ?? '',
    cover_image_url: post.cover_image_url ?? '',
    image_1_url: post.image_1_url ?? '',
    image_2_url: post.image_2_url ?? '',
    status: post.status,
  };
}

/** True when a draft holds real edits compared with the saved post. */
function differsFromPost(post: Post, form: PostInput): boolean {
  return (
    form.title !== post.title ||
    form.slug !== post.slug ||
    form.excerpt !== (post.excerpt ?? '') ||
    form.content !== (post.content ?? '') ||
    (form.cover_image_url ?? '') !== (post.cover_image_url ?? '') ||
    (form.image_1_url ?? '') !== (post.image_1_url ?? '') ||
    (form.image_2_url ?? '') !== (post.image_2_url ?? '') ||
    form.status !== post.status
  );
}

function formsEqual(a: PostInput, b: PostInput): boolean {
  return !differsFromPost(
    {
      id: '',
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt ?? '',
      content: a.content ?? '',
      cover_image_url: a.cover_image_url ?? null,
      image_1_url: a.image_1_url ?? null,
      image_2_url: a.image_2_url ?? null,
      author_id: null,
      status: a.status,
      published_at: null,
      created_at: '',
      updated_at: '',
    },
    b
  );
}

function timeLabel(savedAt: number): string {
  try {
    return new Date(savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'earlier';
  }
}

/** URL-safe slug. Matches the DB's implicit expectation that slugs are lowercase. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function PostsPanel() {
  const { session } = useAdminAuth();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Post | 'new' | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setPosts(await fetchPosts());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load posts.');
      setPosts([]);
    }
  }, []);

  useEffect(() => {
    setPosts(null);
    void load();
  }, [load]);

  const remove = async (post: Post) => {
    if (!confirm(`Delete "${post.title}" permanently?`)) return;
    try {
      await deletePost(post.id);
      setPosts((prev) => prev?.filter((p) => p.id !== post.id) ?? prev);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete post.');
    }
  };

  const save = async (input: PostInput) => {
    if (!session) return;
    if (editing === 'new') {
      await createPost(input, session.user.id);
    } else if (editing) {
      await updatePost(editing.id, input);
    }
    setEditing(null);
    await load();
  };

  if (editing) {
    const existing = editing === 'new' ? null : editing;
    return (
      <PostEditor
        post={existing}
        onCancel={() => setEditing(null)}
        onSave={save}
        onError={setError}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">Blog Posts</h2>
          <p className="mt-0.5 text-sm text-slate-600">
            Published posts appear on the public blog. Drafts stay private.
          </p>
        </div>
        <PrimaryButton type="button" onClick={() => setEditing('new')}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          New post
        </PrimaryButton>
      </div>

      {error && <ErrorState message={error} onRetry={() => void load()} />}

      {posts === null ? (
        <LoadingRows rows={4} label="Loading posts" />
      ) : posts.length === 0 ? (
        <EmptyState
          title="No blog posts yet"
          hint="Write your first post to publish pest-control guides on the LESEKESE blog."
          action={
            <PrimaryButton type="button" onClick={() => setEditing('new')} className="mt-1">
              <Plus className="h-4 w-4" aria-hidden="true" />
              New post
            </PrimaryButton>
          }
        />
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-slate-50">
                <FileText className="h-4 w-4 text-slate-500" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-900">{post.title}</p>
                  <StatusPill value={post.status} />
                </div>
                <p className="truncate font-mono text-xs text-slate-500">/{post.slug}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {post.published_at
                    ? `Published ${formatDate(post.published_at)}`
                    : `Updated ${formatDate(post.updated_at)}`}
                </p>
              </div>
              <div className="flex gap-2">
                <GhostButton type="button" onClick={() => setEditing(post)} className="px-2.5 py-1.5">
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">Edit {post.title}</span>
                </GhostButton>
                <DangerButton type="button" onClick={() => void remove(post)} className="px-2.5 py-1.5">
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">Delete {post.title}</span>
                </DangerButton>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function PostEditor({
  post,
  onSave,
  onCancel,
  onError,
}: {
  post: Post | null;
  onSave: (input: PostInput) => Promise<void>;
  onCancel: () => void;
  onError: (msg: string) => void;
}) {
  const editorScope = post ? post.id : 'new';

  const [form, setForm] = useState<PostInput>(() => {
    if (post) {
      const draft = readDraft(editorScope);
      if (draft?.form && differsFromPost(post, draft.form)) return draft.form;
      return toInput(post);
    }
    const draft = readDraft(editorScope);
    if (draft?.form && (draft.form.title || draft.form.slug || draft.form.content)) return draft.form;
    return BLANK;
  });

  /** The value the editor opened with — anything beyond this is unsaved work. */
  const [baseline] = useState(form);

  /** Non-null once a draft exists on disk (restored or autosaved). */
  const [draftInfo, setDraftInfo] = useState<{ savedAt: number; restored: boolean } | null>(() => {
    const draft = readDraft(editorScope);
    if (!draft?.form) return null;
    const hasEdits = post ? differsFromPost(post, draft.form) : Boolean(draft.form.title || draft.form.slug || draft.form.content);
    return hasEdits ? { savedAt: draft.savedAt, restored: true } : null;
  });

  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof PostInput>(key: K, value: PostInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Autosave on every keystroke. Writing synchronously (not deferred to
  // unmount) is what survives a sign-out or a closed tab.
  useEffect(() => {
    if (formsEqual(form, baseline)) return;
    writeDraft(editorScope, form);
    setDraftInfo({ savedAt: Date.now(), restored: false });
  }, [form, baseline, editorScope]);

  const discardDraft = () => {
    clearDraft(editorScope);
    setForm(post ? toInput(post) : BLANK);
    setDraftInfo(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSave({ ...form, slug: form.slug || slugify(form.title) });
      clearDraft(editorScope);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not save post.');
    } finally {
      setBusy(false);
    }
  };

  const cancel = () => {
    clearDraft(editorScope);
    onCancel();
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">
          {post ? 'Edit post' : 'New post'}
        </h2>
        <GhostButton type="button" onClick={cancel}>
          <X className="h-4 w-4" aria-hidden="true" />
          Cancel
        </GhostButton>
      </div>

      {draftInfo && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <span className="flex items-center gap-2">
            {draftInfo.restored ? (
              <>
                <FileText className="h-4 w-4" aria-hidden="true" />
                Restored an unsaved draft saved at {timeLabel(draftInfo.savedAt)}. Your work was not lost.
              </>
            ) : (
              <>Draft autosaved at {timeLabel(draftInfo.savedAt)}.</>
            )}
          </span>
          {draftInfo.restored && (
            <button
              type="button"
              onClick={discardDraft}
              className="rounded-md px-2 py-1 text-xs font-semibold text-amber-800 underline-offset-2 hover:underline"
            >
              Discard draft
            </button>
          )}
        </div>
      )}

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <Field label="Title" htmlFor="post-title" hint="Shown as the headline on the blog and in search results.">
          <input
            id="post-title"
            required
            value={form.title}
            onChange={(e) => {
              set('title', e.target.value);
              if (!slugTouched) set('slug', slugify(e.target.value));
            }}
            className={inputClass}
          />
        </Field>

        <Field label="URL slug" htmlFor="post-slug" hint="Lowercase words separated by hyphens.">
          <input
            id="post-slug"
            required
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set('slug', slugify(e.target.value));
            }}
            className={`${inputClass} font-mono`}
          />
        </Field>

        <Field
          label="Excerpt"
          htmlFor="post-excerpt"
          hint="One or two sentences for post cards and social previews."
        >
          <textarea id="post-excerpt" value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} className={textareaClass} />
        </Field>

        <Field
          label="Body"
          htmlFor="post-content"
          hint="Blank lines separate paragraphs."
        >
          <textarea
            id="post-content"
            value={form.content}
            onChange={(e) => set('content', e.target.value)}
            className={`${textareaClass} min-h-64 font-mono text-sm`}
          />
        </Field>

        <Field label="Featured image" htmlFor="post-cover" hint="Optional. Upload from device, or paste a full https:// image URL.">
          <ImageUpload
            fileId="post-cover-file"
            value={form.cover_image_url ?? ''}
            onChange={(url) => set('cover_image_url', url)}
          />
        </Field>

        <Field label="Body image 1" htmlFor="post-body-1" hint="Optional. Inserted roughly halfway through the post.">
          <ImageUpload
            fileId="post-body-1-file"
            value={form.image_1_url ?? ''}
            onChange={(url) => set('image_1_url', url)}
          />
        </Field>

        <Field label="Body image 2" htmlFor="post-body-2" hint="Optional. Inserted later in the post, near the first body image.">
          <ImageUpload
            fileId="post-body-2-file"
            value={form.image_2_url ?? ''}
            onChange={(url) => set('image_2_url', url)}
          />
        </Field>

        <Field label="Status" htmlFor="post-status">
          <select
            id="post-status"
            value={form.status}
            onChange={(e) => set('status', e.target.value as PostStatus)}
            className={inputClass}
          >
            {POST_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex flex-wrap gap-2">
        <PrimaryButton type="submit" busy={busy}>
          {post ? 'Save changes' : 'Create post'}
        </PrimaryButton>
        <GhostButton type="button" onClick={cancel}>
          Cancel
        </GhostButton>
      </div>
    </form>
  );
}

/**
 * Image picker that uploads straight to the Supabase post-images bucket.
 * Uploading needs the 0002_post_images.sql migration (bucket + policies) and
 * an admin_users row; failures surface inline instead of being silently lost.
 */
function ImageUpload({
  fileId,
  value,
  onChange,
}: {
  fileId: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const pick = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setUploadError(null);
    try {
      onChange(await uploadPostImage(file));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
        <img
          src={value}
          alt=""
          className="h-36 w-full rounded-xl border border-slate-200 bg-slate-50 object-cover"
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor={fileId}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          {busy ? 'Uploading…' : 'Upload from device'}
          <input
            id={fileId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => void pick(e)}
          />
        </label>

        <input
          type="url"
          aria-label="Image URL"
          placeholder="…or paste an image URL"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} min-w-40 flex-1`}
        />

        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-500 hover:bg-slate-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Remove
          </button>
        ) : null}
      </div>

      {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
      <p className="text-xs text-slate-500">
        Uploads are stored in the public <code className="font-mono">post-images</code> bucket.
      </p>
    </div>
  );
}
