import { useState } from 'react';
import { PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { ProductBottleGraphic } from '../components/ProductBottleGraphic';
import { CheckCircle2, Flame, ShieldCheck, Zap, ShoppingBag, Calculator } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductsPageProps {
  onNavigate: (path: string) => void;
  onOpenOrderModal: (sizeMl?: number) => void;
}

export function ProductsPage({ onNavigate, onOpenOrderModal }: ProductsPageProps) {
  const [selectedSizeForComparison, setSelectedSizeForComparison] = useState<number>(500);
  const [cartonQty, setCartonQty] = useState<number>(5);

  const sprayProducts = PRODUCTS.filter((p) => p.productType !== 'powder');
  const powderProducts = PRODUCTS.filter((p) => p.productType === 'powder');
  const selectedProduct = sprayProducts.find((p) => p.sizeMl === selectedSizeForComparison) || sprayProducts[0];
  
  // Bulk carton discount calculation: 24 bottles per carton
  const bottlesPerCarton = 24;
  const totalBottles = cartonQty * bottlesPerCarton;
  const standardPrice = totalBottles * selectedProduct.priceNgn;
  const wholesaleDiscountRate = cartonQty >= 10 ? 0.15 : cartonQty >= 5 ? 0.10 : 0.05;
  const wholesaleTotal = standardPrice * (1 - wholesaleDiscountRate);
  const savingsNgn = standardPrice - wholesaleTotal;

  return (
    <div className="space-y-16 pt-28 sm:pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden rounded-3xl border border-brand shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://i.ibb.co/j9VDxGwf/Lesekese-banners-5.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-slate-950/30" />
        <div className="relative max-w-3xl mx-auto text-center space-y-4 px-6 py-20 md:py-28">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950/50 backdrop-blur-md text-xs font-bold text-amber-300 uppercase tracking-widest border border-amber-400/40">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>LESEKESE® Official Product Catalog</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-white tracking-tight drop-shadow-lg">
            FAST-ACTING PEST KILLER SIZES
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed drop-shadow">
            Formulated for immediate knockdown of bedbugs, cockroaches, mosquitoes, and household pests with 3+ days active residual barrier.
          </p>
        </div>
      </section>

      {/* Spray Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sprayProducts.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            onOrder={(p) => onOpenOrderModal(p.sizeMl)}
            onLocateStore={() => onNavigate('/locations')}
          />
        ))}
      </div>

      {/* SEND OFF Powder — full-width spotlight */}
      {powderProducts.map((prod) => (
        <div key={prod.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <ProductCard
            product={prod}
            onOrder={(p) => onOpenOrderModal(p.sizeMl)}
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

      {/* ================= WHOLESALE & BULK CARTON CALCULATOR ================= */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-red-50 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Calculator className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold text-slate-900 tracking-wide">
                Wholesale & Hotel Bulk Carton Pricing
              </h3>
              <p className="text-xs text-amber-600 font-medium">
                Save up to 15% on bulk carton orders (24 bottles per carton)
              </p>
            </div>
          </div>

          {/* Size selector */}
          <div className="flex items-center gap-2">
            {[500, 250, 100].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSizeForComparison(s)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSizeForComparison === s
                    ? 'bg-red-600 text-white border border-red-400'
                    : 'glass-pill text-slate-600'
                }`}
              >
                {s}ml
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <label className="block text-xs font-accent font-bold uppercase text-slate-700 mb-2">
                Cartons Required (24 bottles / carton): <span className="text-amber-600 font-mono text-sm">{cartonQty} Cartons ({totalBottles} bottles)</span>
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCartonQty(Math.max(1, cartonQty - 1))}
                  className="w-10 h-10 rounded-xl glass-pill text-slate-700 font-bold text-lg hover:bg-red-600 hover:text-white cursor-pointer"
                >
                  -
                </button>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={cartonQty}
                  onChange={(e) => setCartonQty(parseInt(e.target.value))}
                  className="w-full accent-red-500"
                />
                <button
                  onClick={() => setCartonQty(cartonQty + 1)}
                  className="w-10 h-10 rounded-xl glass-pill text-slate-700 font-bold text-lg hover:bg-red-600 hover:text-white cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="glass-pill p-3 rounded-2xl">
                <span className="block text-[11px] text-slate-500 font-bold uppercase">Standard Retail</span>
                <span className="text-base font-display font-bold text-slate-700 line-through">
                  ₦{standardPrice.toLocaleString()}
                </span>
              </div>

              <div className="glass-pill p-3 rounded-2xl border border-amber-400/40">
                <span className="block text-[11px] text-amber-600 font-bold uppercase">Bulk Discount</span>
                <span className="text-base font-display font-bold text-amber-600">
                  {(wholesaleDiscountRate * 100)}% OFF
                </span>
              </div>

              <div className="glass-pill p-3 rounded-2xl border border-emerald-500/40 bg-emerald-50">
                <span className="block text-[11px] text-emerald-600 font-bold uppercase">Your Savings</span>
                <span className="text-base font-display font-bold text-emerald-600">
                  ₦{savingsNgn.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-red-500/40 bg-white text-center space-y-4">
            <span className="text-xs font-accent font-bold uppercase tracking-wider text-slate-500">
              Wholesale Package Total:
            </span>
            <div className="text-4xl font-display font-bold text-amber-600">
              ₦{wholesaleTotal.toLocaleString()}
            </div>
            <p className="text-xs text-slate-600">
              Includes priority dispatch from Abule Egba Main Depot to anywhere in Nigeria.
            </p>
            <button
              onClick={() => onOpenOrderModal(selectedSizeForComparison)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 cursor-pointer"
            >
              Order {cartonQty} Cartons Now
            </button>
          </div>
        </div>
      </div>

      {/* ================= SPECIFICATIONS COMPARISON TABLE ================= */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
        <h3 className="text-2xl font-display font-bold text-slate-900 tracking-wide">
          DETAILED SIZE COMPARISON & SPECIFICATIONS
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-accent font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Feature / Spec</th>
                <th className="py-3 px-4 text-amber-600">500ml (Big Size)</th>
                <th className="py-3 px-4">250ml (Medium)</th>
                <th className="py-3 px-4">100ml (Small)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Retail Price</td>
                <td className="py-3 px-4 font-bold text-amber-600 font-mono text-sm">₦3,000</td>
                <td className="py-3 px-4 font-bold text-amber-600 font-mono text-sm">₦2,000</td>
                <td className="py-3 px-4 font-bold text-amber-600 font-mono text-sm">₦1,000</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Coverage Area</td>
                <td className="py-3 px-4">3–4 Bedrooms (Up to 120 sq.m)</td>
                <td className="py-3 px-4">1–2 Bedrooms (Up to 60 sq.m)</td>
                <td className="py-3 px-4">Spot Treatment / Travel</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Spray Nozzle Mechanism</td>
                <td className="py-3 px-4 text-red-600 font-semibold">Heavy Duty Ergofit Trigger</td>
                <td className="py-3 px-4">Stream & Mist Pump</td>
                <td className="py-3 px-4">Pocket Atomizer</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Primary Use Case</td>
                <td className="py-3 px-4">Severe bedbug infestations & hotels</td>
                <td className="py-3 px-4">Routine apartment bug spray</td>
                <td className="py-3 px-4">Travel, hotel beds, luggage</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Residual Duration</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">3+ Days Active Shield</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">3+ Days Active Shield</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">3+ Days Active Shield</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
