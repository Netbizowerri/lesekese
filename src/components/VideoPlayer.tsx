import { useRef, useState } from 'react';
import { Play, VideoOff } from 'lucide-react';

interface VideoPlayerProps {
  /** Public path to an MP4, e.g. '/video/foo.mp4' */
  src: string;
  /** Still frame shown before playback starts. */
  poster?: string;
  /** Optional kicker above the title. Omit for a caption-free card. */
  eyebrow?: string;
  title: string;
  badge?: string;
}

/**
 * Self-hosted HTML5 video player.
 *
 * The MP4 lives in /public/video/ and is rendered with a native <video>, so it
 * plays inside the page with no external dependency. `playsInline` stops iOS
 * from hijacking playback into its own fullscreen player, and
 * `preload="metadata"` keeps the page weight down (the file stays on the wire
 * only once the visitor presses play).
 */
export function VideoPlayer({ src, poster, eyebrow, title, badge }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [started, setStarted] = useState(false);

  const handlePlay = () => {
    setStarted(true);
    void videoRef.current?.play().catch(() => setFailed(true));
  };

  return (
    <div className="group relative w-full rounded-3xl overflow-hidden border border-brand bg-white/90 shadow-2xl hover:border-brand transition-all duration-300 flex flex-col">
      <div className="w-full relative overflow-hidden bg-slate-950 aspect-video flex items-center justify-center">
        {!started && !failed && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label={`Play video: ${title}`}
            className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
          >
            {poster && (
              <img
                src={poster}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-contain opacity-70 group-hover:opacity-90 transition-opacity duration-500"
              />
            )}
            <span className="relative flex flex-col items-center gap-3">
              <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-600 to-amber-500 shadow-2xl shadow-red-900/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="w-7 h-7 sm:w-9 sm:h-9 text-white fill-white translate-x-0.5" />
              </span>
              <span className="px-3 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-accent font-bold uppercase tracking-widest text-white">
                Play Video
              </span>
            </span>
          </button>
        )}

        {failed ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 text-center px-6 bg-slate-950/85 backdrop-blur-sm">
            <VideoOff className="w-9 h-9 text-amber-400" />
            <p className="text-xs font-semibold text-white leading-relaxed">
              Video unavailable right now.
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={src}
            poster={started ? undefined : poster}
            controls
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
            onCanPlay={() => setFailed(false)}
            className="absolute inset-0 w-full h-full object-contain bg-slate-950"
            aria-label={title}
          />
        )}
      </div>

      <div className="p-4 sm:p-5 bg-gradient-to-t from-white via-white/95 to-transparent border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          {eyebrow && (
            <span className="text-[11px] font-accent font-bold uppercase tracking-widest text-red-600">
              {eyebrow}
            </span>
          )}
          <h3 className="text-base sm:text-lg font-display font-bold text-slate-900">{title}</h3>
        </div>
        {badge && (
          <span className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-accent font-bold uppercase tracking-wider text-slate-500">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
