import { Mail, MessageSquare, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { NAIROBI_PHONE, ORDER_EMAIL } from '../data/mockData';
import { buildOrderMessage, buildOrderMailto, buildWhatsAppUrl, type OrderSummary } from '../lib/orderMessage';

interface OrderCtaClusterProps {
  /** Opens the Order Now form (submits to Formspree). */
  onOrderNow: () => void;
  /** Optional pre-selection so the form opens on the right pack. */
  productName?: string;
  packLabel?: string;
  units?: number;
  unitLabel?: string;
  totalNgn?: number;
  pickup?: string;
  /** Compact single-row layout for tight headers. */
  layout?: 'stacked' | 'inline';
}

/**
 * The three ordering channels side by side, with Order Now leading.
 *
 * Every channel carries the same order details, so a customer can switch
 * between the form, WhatsApp and email without retyping anything.
 */
export function OrderCtaCluster({
  onOrderNow,
  productName = 'LESEKESE Bedbugs & Cockroaches Instant Killer 500ml',
  packLabel = '2-Bottle',
  units = 2,
  unitLabel = '500ml bottle',
  totalNgn = 15000,
  pickup = 'Fagba Main Depot, Lagos',
  layout = 'stacked',
}: OrderCtaClusterProps) {
  const summary: OrderSummary = { productName, packLabel, units, unitLabel, totalNgn, pickup };

  const base =
    'flex items-center justify-center gap-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98]';
  const width = layout === 'inline' ? 'flex-1 min-w-[9.5rem]' : 'w-full';

  return (
    <div className={layout === 'inline' ? 'flex flex-wrap gap-2.5' : 'space-y-2.5'}>
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        onClick={onOrderNow}
        className={`${base} ${width} py-3.5 px-4 bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-600/30 hover:brightness-110`}
      >
        <span>Order Now</span>
      </motion.button>

      <a
        href={buildWhatsAppUrl(summary)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${width} py-3.5 px-4 bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-500`}
      >
        <MessageSquare className="w-4 h-4" aria-hidden="true" />
        <span>Instant WhatsApp</span>
      </a>

      <a
        href={`tel:${NAIROBI_PHONE}`}
        className={`${base} ${width} py-3.5 px-4 bg-slate-900 text-white shadow-lg hover:bg-slate-800`}
      >
        <Phone className="w-4 h-4" aria-hidden="true" />
        <span>Call {NAIROBI_PHONE}</span>
      </a>

      <a
        href={buildOrderMailto(summary)}
        className={`${base} ${width} py-3.5 px-4 glass-pill text-slate-800 hover:bg-slate-100`}
      >
        <Mail className="w-4 h-4" aria-hidden="true" />
        <span>Email us</span>
      </a>
    </div>
  );
}

export { buildOrderMessage, ORDER_EMAIL };
