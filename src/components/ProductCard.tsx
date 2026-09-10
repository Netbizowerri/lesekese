import { Product } from '../types';
import { motion } from 'motion/react';
import { CheckCircle2, ShoppingBag, ShieldCheck, Zap, ShieldPlus } from 'lucide-react';

interface ProductCardProps {
  key?: string;
  product: Product;
  onOrder: (product: Product) => void;
  onLocateStore: () => void;
}

export function ProductCard({ product, onOrder, onLocateStore }: ProductCardProps) {
  const isPowder = product.productType === 'powder';
  const displayList = isPowder ? (product.features ?? []) : product.kills;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`relative glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between overflow-hidden ${
        product.popular ? 'border-2 border-brand shadow-2xl shadow-red-600/20' : ''
      }`}
    >
      {/* Most Popular Badge */}
      {product.popular && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[11px] font-accent font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
          <Zap className="w-3 h-3 fill-white" />
          <span>Most Popular</span>
        </div>
      )}

      {/* Powder / New Product Badge */}
      {isPowder && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[11px] font-accent font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
          <ShieldPlus className="w-3 h-3" />
          <span>NEW — Repellent</span>
        </div>
      )}

      <div>
        {/* Product Image Showcase */}
        <div className="relative w-full h-48 sm:h-52 mb-5 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 via-slate-50 to-white p-3 border border-brand transition-all">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(220,38,38,0.4)] transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-amber-400/40 text-[10px] font-bold text-amber-600 flex items-center gap-1 shadow-md">
            <span>{product.sizeLabel}</span>
          </div>
        </div>

        {/* Header Title */}
        <div className="mb-4">
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-wide">
            {product.name}
          </h3>
          {isPowder && (
            <p className="text-xs font-accent font-semibold text-emerald-600 mt-0.5">
              Snakes &amp; Scorpions Repellent Powder
            </p>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-3 my-4">
          <span className="text-3xl sm:text-4xl font-display font-bold text-amber-600 tracking-wider">
            ₦{product.priceNgn.toLocaleString()}
          </span>
          {product.originalPriceNgn && (
            <span className="text-base line-through text-slate-400">
              ₦{product.originalPriceNgn.toLocaleString()}
            </span>
          )}
          <span className="text-xs bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded border border-red-200">
            Retail Price
          </span>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
          {product.description}
        </p>

        {/* Features or Kills list */}
        {displayList.length > 0 && (
          <div className="space-y-2 mb-6">
            <div className="text-xs font-accent font-bold text-slate-700 uppercase tracking-wider">
              {isPowder ? 'Features & Protection:' : 'Target Pests Eradicated:'}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {displayList.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${isPowder ? 'text-emerald-500' : 'text-red-500'}`}
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coverage details */}
        <div className="glass-pill p-3 rounded-xl text-xs sm:text-sm text-slate-600 mb-6 flex items-center justify-between border border-slate-200">
          <span className="text-slate-500 font-medium">Coverage:</span>
          <span className="font-bold text-slate-900">{product.coverageArea}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={() => onOrder(product)}
          className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isPowder
              ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 shadow-emerald-600/30'
              : 'bg-gradient-to-r from-red-600 via-red-500 to-amber-600 shadow-red-600/30'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isPowder ? 'Order Now / Enquire' : 'Order Now / Bulk Request'}</span>
        </button>

        <button
          onClick={onLocateStore}
          className="w-full py-3 px-4 rounded-xl glass-pill text-slate-700 text-xs sm:text-sm font-semibold hover:border-red-500/40 hover:text-red-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>Buy at Nearby Store</span>
        </button>
      </div>
    </motion.div>
  );
}
