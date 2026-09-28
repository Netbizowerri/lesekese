import {
  BUNDLES,
  HERO_IMAGE_URL,
  INSTANT_KILLER_PRODUCT_ID,
  PRODUCTS,
  PRODUCT_IN_ACTION_IMAGE,
  PRODUCT_IMAGE_MULTIPLE,
  PRODUCT_IMAGE_SINGLE,
  SEND_OFF_PRODUCT_ID,
  priceForBottleCount
} from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { BundleCard } from '../components/BundleCard';
import { Flame, Zap, Truck } from 'lucide-react';

interface ProductsPageProps {
  onNavigate: (path: string) => void;
  onOpenOrderModal: (productId?: string, bottleCount?: number) => void;
}

const BOTTLE_ML = 500;

export function ProductsPage({ onNavigate, onOpenOrderModal }: ProductsPageProps) {
  const sprayProducts = PRODUCTS.filter((p) => p.productType !== 'powder');
  const powderProducts = PRODUCTS.filter((p) => p.productType === 'powder');
  const instantKiller = sprayProducts.find((p) => p.id === INSTANT_KILLER_PRODUCT_ID) ?? sprayProducts[0];

  return (
    <div className="space-y-16 pt-28 sm:pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden rounded-3xl border border-brand shadow-2xl bg-slate-950">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE_URL}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain opacity-45"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/70 to-slate-950/40" />
        <div className="relative max-w-3xl mx-auto text-center space-y-4 px-6 py-20 md:py-28">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950/50 backdrop-blur-md text-xs font-bold text-amber-300 uppercase tracking-widest border border-amber-400/40">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>LESEKESE® Official Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-white tracking-tight drop-shadow-lg">
            ONE 500ML SIZE. FOUR PRICES.
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed drop-shadow">
            We retired the 100ml and 250ml bottles. Every home now gets the full-strength 500ml —
            so choose how many bottles your apartment needs, from ₦
            {priceForBottleCount(1).toLocaleString()} up to ₦25,000.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {BUNDLES.map((tier) => (
              <span
                key={tier.id}
                className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white whitespace-nowrap"
              >
                {tier.bottles} × 500ml —{' '}
                <span className="text-amber-300">₦{tier.priceNgn.toLocaleString()}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SINGLE PRODUCT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <ProductCard
            product={instantKiller}
            onOrder={() => onOpenOrderModal(INSTANT_KILLER_PRODUCT_ID, 2)}
            onLocateStore={() => onNavigate('/locations')}
          />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { src: PRODUCT_IMAGE_SINGLE, caption: 'Single 500ml bottle' },
              { src: PRODUCT_IMAGE_MULTIPLE, caption: 'Bundled up to 5 bottles' }
            ].map((img) => (
              <div
                key={img.src}
                className="rounded-3xl border border-slate-200 bg-white/90 shadow-xl overflow-hidden group"
              >
                <div className="bg-slate-50 flex items-center justify-center p-3">
                  <img
                    src={img.src}
                    alt={`LESEKESE Instant Killer 500ml — ${img.caption}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-contain max-h-72 group-hover:scale-[1.03] transition-transform duration-500 block"
                  />
                </div>
                <p className="px-4 py-3 text-[11px] font-accent font-bold uppercase tracking-widest text-slate-500 border-t border-slate-100">
                  {img.caption}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="rounded-3xl border border-slate-200 bg-white/90 shadow-xl overflow-hidden group">
              <div className="bg-slate-50 flex items-center justify-center p-3">
                <img
                  src={PRODUCT_IN_ACTION_IMAGE}
                  alt="LESEKESE Instant Killer in action"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain max-h-64 group-hover:scale-[1.03] transition-transform duration-500 block"
                />
              </div>
              <p className="px-4 py-3 text-[11px] font-accent font-bold uppercase tracking-widest text-red-600 border-t border-slate-100">
                Kills on contact · 3-day residual
              </p>
            </div>

            <div className="glass-card rounded-3xl border border-slate-200 p-6 space-y-3">
              <span className="text-[11px] font-accent font-bold uppercase tracking-widest text-amber-600">
                Product specification
              </span>
              <dl className="space-y-2 text-sm">
                {[
                  ['Volume', `${BOTTLE_ML}ml per bottle`],
                  ['Active formula', instantKiller.sprayType],
                  ['Residual protection', '3 days active shield'],
                  ['Coverage', instantKiller.coverageArea],
                  ['Payment', 'Pay on delivery (Lagos)']
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2 last:border-0"
                  >
                    <dt className="font-accent font-bold text-slate-500 text-xs uppercase tracking-wider shrink-0">
                      {k}
                    </dt>
                    <dd className="font-bold text-slate-900 text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PRICE TIERS ================= */}
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-xs font-bold text-amber-600 uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 text-red-500" />
            <span>Official Retail Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
            CHOOSE HOW MANY 500ML BOTTLES YOU NEED
          </h2>
          <p className="text-sm text-slate-600">
            Every pack is the same 500ml bottle. The per-bottle price falls as the pack grows — from
            ₦{priceForBottleCount(1).toLocaleString()} down to ₦5,000 each.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {BUNDLES.map((tier) => (
            <BundleCard
              key={tier.id}
              bundle={tier}
              onOrder={(b) => onOpenOrderModal(INSTANT_KILLER_PRODUCT_ID, b.bottles)}
              onLocateStore={() => onNavigate('/locations')}
            />
          ))}
        </div>
      </section>

      {/* SEND OFF Powder — full-width spotlight */}
      {powderProducts.map((prod) => (
        <div key={prod.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <ProductCard
            product={prod}
            onOrder={() => onOpenOrderModal(SEND_OFF_PRODUCT_ID, 1)}
            onLocateStore={() => onNavigate('/locations')}
          />
          <div className="glass-card p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-white via-emerald-50 to-teal-50 space-y-6 h-full flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 uppercase tracking-widest border border-emerald-300/60 self-start">
              <span>🐍</span>
              <span>Snake &amp; Scorpion Repellent</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              ABOUT LESEKESE SEND OFF
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              LESEKESE SEND OFF Snakes &amp; Scorpions Repellent Powder is a specially formulated deterrent
              designed to help create a protective barrier against snakes, scorpions, reptiles and other
              unwanted crawling pests around your environment. Its active repellent action produces an
              unpleasant smell and disturbing effect that helps discourage snakes, scorpions and other
              reptiles from entering or remaining in treated areas.
            </p>
            <div className="space-y-3">
              <div className="text-xs font-accent font-bold text-slate-700 uppercase tracking-wider">Directions for Use:</div>
              <ul className="space-y-2 text-sm text-slate-600">
                {[
                  'Sprinkle powder evenly around areas where snakes & scorpions may enter.',
                  'Apply around entrances, boundaries, storage areas & outdoor perimeters.',
                  'Do not apply directly to people, animals, food or water.',
                  'Reapply after heavy rain or when repellent effect reduces.',
                  'Keep children and pets away from freshly treated areas.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
              ⚠️ <strong>Warning:</strong> Keep out of reach of children. Avoid breathing dust. Avoid contact with eyes, skin and clothing. Wash hands thoroughly after use.
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Manufactured by LESEKESE ALLIED PRODUCTS INDUSTRIES
            </p>
          </div>
        </div>
      ))}

      {/* ================= PRICE TIER COMPARISON TABLE ================= */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h3 className="text-2xl font-display font-bold text-slate-900 tracking-wide">
            PACK PRICING AT A GLANCE
          </h3>
          <p className="text-xs text-slate-500">
            Every pack contains the same {BOTTLE_ML}ml bottle.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-accent font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Pack</th>
                <th className="py-3 px-4">Bottles × 500ml</th>
                <th className="py-3 px-4 text-amber-600">You Pay</th>
                <th className="py-3 px-4">Was</th>
                <th className="py-3 px-4">Per Bottle</th>
                <th className="py-3 px-4">You Save</th>
                <th className="py-3 px-4">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {BUNDLES.map((tier) => {
                const perBottle = Math.round(tier.priceNgn / tier.bottles);
                const save = tier.listPriceNgn ? tier.listPriceNgn - tier.priceNgn : 0;
                return (
                  <tr
                    key={tier.id}
                    className={tier.highlight ? 'bg-red-50/50' : undefined}
                  >
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {tier.label}
                      {tier.badge && (
                        <span className="ml-2 text-[9px] font-accent font-bold uppercase tracking-wider text-red-600">
                          {tier.badge}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">{tier.bottles}</td>
                    <td className="py-3 px-4 font-bold text-amber-600 font-mono text-sm">
                      ₦{tier.priceNgn.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {tier.listPriceNgn ? (
                        <span className="line-through text-slate-400">
                          ₦{tier.listPriceNgn.toLocaleString()}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">₦{perBottle.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      {save > 0 ? `₦${save.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-4">{tier.bestFor}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          {BUNDLES.map((tier) => (
            <button
              key={tier.id}
              onClick={() => onOpenOrderModal(INSTANT_KILLER_PRODUCT_ID, tier.bottles)}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tier.highlight
                  ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-600/30'
                  : 'glass-pill text-slate-700 hover:border-brand hover:text-brand'
              }`}
            >
              Order {tier.label} — ₦{tier.priceNgn.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="flex items-start gap-2 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <Truck className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Pay on Delivery (Lagos).</strong> Orders placed on WhatsApp are confirmed by a
            depot representative. Nationwide delivery is quoted on request.
          </span>
        </div>
      </div>

    </div>
  );
}
