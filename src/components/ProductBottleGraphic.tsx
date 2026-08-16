import { motion } from 'motion/react';
import { Flame, ShieldCheck } from 'lucide-react';
import { ALL_PRODUCTS_IMAGE, BOTTLE_IMAGE_URL, BOTTLE_IMAGE_250, BOTTLE_IMAGE_100 } from '../data/mockData';

interface ProductBottleGraphicProps {
  sizeMl?: number | null;
  interactive?: boolean;
}

export function ProductBottleGraphic({ sizeMl = null, interactive = true }: ProductBottleGraphicProps) {
  // Height ratios for different sizes
  const heightScale = sizeMl === 500 ? 1 : sizeMl === 250 ? 0.92 : sizeMl === 100 ? 0.85 : 1;

  const currentImage = sizeMl === 500
    ? BOTTLE_IMAGE_URL
    : sizeMl === 250 
    ? BOTTLE_IMAGE_250 
    : sizeMl === 100 
    ? BOTTLE_IMAGE_100 
    : ALL_PRODUCTS_IMAGE;

  return (
    <div className="relative flex items-center justify-center p-1 sm:p-4 lg:p-6 select-none w-full">
      {/* Fiery Background Glow Orb */}
      <div className="absolute w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-red-600/30 via-amber-500/20 to-transparent blur-3xl fire-glow -z-10 pointer-events-none" />

      {/* Main Container */}
      <motion.div
        animate={{ scale: heightScale }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative group cursor-pointer flex flex-col items-center w-full max-w-xs sm:max-w-md"
      >
        {/* Glassmorphism Bottle Aura Card */}
        <div className="relative p-3 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl glass-card border border-brand shadow-2xl backdrop-blur-2xl flex flex-col items-center w-full transition-all duration-300 group-hover:border-brand group-hover:shadow-red-500/30">
          
          {/* Top Badge */}
          <div className="absolute -top-3 px-3 py-0.5 sm:px-3.5 sm:py-1 bg-gradient-to-r from-red-600 to-amber-500 rounded-full text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg z-10">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-bounce" />
            <span>{sizeMl ? 'INSTANT KILLER' : 'FULL RANGE (100ml, 250ml, 500ml)'}</span>
          </div>

          {/* Product Bottle Image */}
          <div className="relative w-full h-52 xs:h-60 sm:h-80 md:h-96 lg:h-[420px] flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/70 p-2 sm:p-3">
            <motion.img
              key={sizeMl || 'all'}
              src={currentImage}
              alt={sizeMl ? `LESEKESE ${sizeMl}ml Spray Bottle` : 'LESEKESE Spray Bottle Range'}
              referrerPolicy="no-referrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_30px_rgba(220,38,38,0.5)] group-hover:scale-105 transition-transform duration-300"
            />

            {/* Residual Shield Badge */}
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 glass-pill px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-amber-600 border border-amber-400/40 flex items-center gap-1 sm:gap-1.5 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>3+ Days Residual</span>
            </div>
          </div>
        </div>

        {/* Shadow base */}
        <div className="w-48 sm:w-72 h-4 sm:h-5 bg-red-500/30 blur-lg rounded-full mt-1 sm:mt-2" />
      </motion.div>
    </div>
  );
}
