import { motion } from 'motion/react';
import { Check, MessageSquare, Sparkles, Truck, Zap } from 'lucide-react';
import { BundleTier } from '../types';
import { NAIROBI_WHATSAPP } from '../data/mockData';

interface BundleCardProps {
  bundle: BundleTier;
  onOrder: (bundle: BundleTier) => void;
  onLocateStore?: () => void;
  compact?: boolean;
}

export function buildBundleWhatsAppLink(bundle: BundleTier): string {
  const message = encodeURIComponent(
    `Hello LESEKESE Depot! I want to order the ${bundle.label} pack — ` +
      `${bundle.bottles} x Lesekese Bedbugs and Cockroaches Instant Killer 500ml ` +
      `(Total: ₦${bundle.priceNgn.toLocaleString()}). Pay on Delivery (Lagos). Please confirm my order.`
  );
  return `https://wa.me/${NAIROBI_WHATSAPP}?text=${message}`;
}

export function BundleCard({ bundle, onOrder, onLocateStore, compact = false }: BundleCardProps) {
  const savings = bundle.listPriceNgn ? bundle.listPriceNgn - bundle.priceNgn : 0;
  const perBottle = Math.round(bundle.priceNgn / bundle.bottles);

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className={`relative flex flex-col glass-card rounded-3xl overflow-hidden ${
        bundle.highlight
          ? 'border-2 border-brand shadow-2xl shadow-emerald-900/20 lg:-mt-4 lg:mb-[-1rem]'
          : 'border border-slate-200 shadow-xl'
      }`}
    >
      {/* Tier badge */}
      {bundle.badge && (
        <div
          className={`absolute top-0 right-0 z-20 px-4 py-1.5 rounded-bl-2xl text-[10px] font-accent font-bold uppercase tracking-widest text-white shadow-lg flex items-center gap-1 ${
            bundle.highlight
              ? 'bg-gradient-to-r from-red-600 to-amber-500'
              : 'bg-gradient-to-r from-emerald-700 to-emerald-600'
          }`}
        >
          {bundle.highlight ? (
            <Zap className="w-3 h-3 fill-white" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          <span>{bundle.badge}</span>
        </div>
      )}

      <div
        className={`px-6 pt-7 pb-5 border-b border-slate-200/80 ${
          bundle.highlight
            ? 'bg-gradient-to-b from-red-50/90 via-white to-white'
            : 'bg-gradient-to-b from-slate-50 to-white'
        }`}
      >
        <p className="text-[11px] font-accent font-bold uppercase tracking-widest text-amber-600">
          {bundle.headline}
        </p>
        <h3 className="mt-1 text-3xl font-display font-bold text-slate-900 tracking-tight">
          {bundle.label}
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{bundle.description}</p>
      </div>

      <div className="px-6 py-5 flex-1 flex flex-col">
        <div className="flex items-end gap-2.5">
          <span className="text-4xl font-display font-bold text-amber-600 tracking-tight leading-none">
            ₦{bundle.priceNgn.toLocaleString()}
          </span>
          {bundle.listPriceNgn && (
            <span className="text-base text-slate-400 line-through pb-0.5">
              ₦{bundle.listPriceNgn.toLocaleString()}
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-accent font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg">
            ₦{perBottle.toLocaleString()} / bottle
          </span>
          {savings > 0 && (
            <span className="text-[11px] font-accent font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
              Save ₦{savings.toLocaleString()}
            </span>
          )}
        </div>

        {!compact && (
          <ul className="mt-5 space-y-2">
            {bundle.includes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <Truck className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>Pay on Delivery (Lagos)</span>
            </li>
          </ul>
        )}

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3">
          <span className="block text-[10px] font-accent font-bold uppercase tracking-widest text-slate-500">
            Best for
          </span>
          <span className="block text-sm font-bold text-slate-900">{bundle.bestFor}</span>
        </div>

        <div className="mt-5 space-y-2.5">
          <button
            onClick={() => onOrder(bundle)}
            className={`w-full py-3.5 px-4 rounded-xl text-white font-accent font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
              bundle.highlight
                ? 'bg-gradient-to-r from-red-600 via-red-500 to-amber-500 shadow-red-600/40'
                : 'bg-gradient-to-r from-emerald-800 to-brand shadow-emerald-900/30'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Order on WhatsApp</span>
          </button>

          {onLocateStore && (
            <button
              onClick={onLocateStore}
              className="w-full py-3 px-4 rounded-xl glass-pill text-slate-700 text-xs font-semibold hover:border-brand hover:text-brand transition-all cursor-pointer"
            >
              Buy at a nearby store
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
