import { Product } from '../types';
import { motion } from 'motion/react';
import { CheckCircle2, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';

interface ProductCardProps {
  key?: string;
  product: Product;
  onOrder: (product: Product) => void;
  onLocateStore: () => void;
}

export function ProductCard({ product, onOrder, onLocateStore }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`relative glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between overflow-hidden ${
        product.popular ? 'border-2 border-red-500/60 shadow-2xl shadow-red-600/20' : ''
      }`}
    >
      {/* Popular Badge */}
      {product.popular && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[11px] font-accent font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
          <Zap className="w-3 h-3 fill-white" />
          <span>Most Popular</span>
        </div>
      )}

      <div>
        {/* Product Image Showcase */}
        <div className="relative w-full h-48 sm:h-52 mb-5 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 via-slate-50 to-white p-3 border border-slate-200 group-hover:border-red-500/40 transition-all">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(220,38,38,0.4)] transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-amber-400/40 text-[10px] font-bold text-amber-600 flex items-center gap-1 shadow-md">
            <span>{product.sizeMl}ml Bottle</span>
          </div>
        </div>

        {/* Header Title & Size */}
        <div className="mb-4">
          <span className="text-sm font-accent font-bold uppercase tracking-widest text-red-600">
            {product.sizeLabel}
          </span>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-wide mt-1">
            {product.name}
          </h3>
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

        {/* Key Features & Target Pests */}
        <div className="space-y-2 mb-6">
          <div className="text-xs font-accent font-bold text-slate-700 uppercase tracking-wider">
            Target Pests Eradicated:
          </div>
          <div className="grid grid-cols-1 gap-2">
            {product.kills.slice(0, 4).map((pest, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>{pest}</span>
              </div>
            ))}
          </div>
        </div>

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
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-600 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-red-600/30 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-4.5 h-4.5" />
          <span>Order Now / Bulk Request</span>
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
