import { VideoPlayer } from './VideoPlayer';
import { ACTION_VIDEO_POSTER, ACTION_VIDEO_URL, INSTANT_KILLER_PRODUCT_ID, PRODUCTS } from '../data/mockData';

/**
 * Product reel in the "Power of LESEKESE in action" grid.
 *
 * The MP4 is self-hosted in /public/video/ and played with a native player, so
 * it plays in-page with no external dependency.
 */
export function ActionVideoCard() {
  const instantKiller = PRODUCTS.find((p) => p.id === INSTANT_KILLER_PRODUCT_ID);

  return (
    <VideoPlayer
      src={ACTION_VIDEO_URL}
      poster={ACTION_VIDEO_POSTER}
      title={instantKiller?.name ?? 'LESEKESE Instant Killer'}
      badge="Video"
    />
  );
}
