import { motion } from 'motion/react';
import { Flame, ShieldCheck } from 'lucide-react';
import {
  PRODUCT_IMAGE_MULTIPLE,
  PRODUCT_IMAGE_SINGLE,
  INSTANT_KILLER_PRODUCT_ID,
  PRODUCTS
} from '../data/mockData';

interface ProductBottleGraphicProps {
  bottles?: number;
  tierLabel?: string;
  totalNgn?: number;
  className?: string;
}

export function ProductBottleGraphic({
  bottles = 1,
  tierLabel,
  totalNgn,
  className = ''
}: ProductBottleGraphicProps) {
  const isSingle = bottles <= 1;
  const currentImage = isSingle ? PRODUCT_IMAGE_SINGLE : PRODUCT_IMAGE_MULTIPLE;
  const product = PRODUCTS.find((p) => p.id === INSTANT_KILLER_PRODUCT_ID);

  return (
    <div className={`relative flex items-center justify-center p-1 sm:p-4 lg:p-6 select-none w-full ${className}`}>
      {/* Fiery Background Glow Orb */}
      <div className="absolute w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-red-500/25 via-amber-400/20 to-transparent blur-3xl fire-glow -z-10 pointer-events-none" />

      <div className="relative group flex flex-col items-center w-full max-w-xs sm:max-w-md">
        {/* Glassmorphism Bottle Aura Card */}
        <div className="relative p-3 sm:p-5 rounded-2xl sm:rounded-3xl glass-card shadow-2xl flex flex-col items-center w-full transition-all duration-300">
          {/* Top Badge */}
          <div className="absolute -top-3 px-3 py-0.5 sm:px-3.5 sm:py-1 bg-gradient-to-r from-red-600 to-amber-500 rounded-full text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg z-10 whitespace-nowrap">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>500ml Instant Killer</span>
          </div>

          {/* Product Image */}
          <div className="relative w-full h-56 xs:h-64 sm:h-80 md:h-96 lg:h-[400px] flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/70 p-2 sm:p-3">
            <motion.img
              key={currentImage}
              src={currentImage}
              alt={`LESEKESE Bedbugs and Cockroaches Instant Killer 500ml — ${
                isSingle ? 'single bottle' : `${bottles} bottle pack`
              }`}
              referrerPolicy="no-referrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_30px_rgba(220,38,38,0.35)] group-hover:scale-105 transition-transform duration-300"
            />

            {/* Residual Shield Badge */}
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 glass-pill px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-amber-700 border border-amber-400/40 flex items-center gap-1 sm:gap-1.5 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>3-Day Residual</span>
            </div>
          </div>

          {/* Live price strip */}
          {tierLabel && totalNgn !== undefined && (
            <div className="mt-3 w-full flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/85 px-4 py-2.5">
              <span className="text-[11px] font-accent font-bold uppercase tracking-widest text-slate-500">
                {tierLabel}
              </span>
              <span className="text-xl font-display font-bold text-amber-600">
                ₦{totalNgn.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Shadow base */}
        <div className="w-48 sm:w-72 h-4 sm:h-5 bg-slate-400/25 blur-lg rounded-full mt-2" />

        {product && (
          <p className="mt-2 text-center text-[11px] sm:text-xs text-slate-500 max-w-[16rem]">
            {product.sprayType} · {product.coverageArea}
          </p>
        )}
      </div>
    </div>
  );
}
