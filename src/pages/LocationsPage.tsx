import { MapLocator } from '../components/MapLocator';
import { Building2, Flame, MapPin, PhoneCall, ShieldCheck } from 'lucide-react';

interface LocationsPageProps {
  onNavigate: (path: string) => void;
  onOpenOrderModal: (sizeMl?: number) => void;
}

export function LocationsPage({ onNavigate, onOpenOrderModal }: LocationsPageProps) {
  return (
    <div className="space-y-12 pt-28 sm:pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://i.ibb.co/j9VDxGwf/Lesekese-banners-5.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-slate-950/30" />
        <div className="relative max-w-3xl mx-auto text-center space-y-4 px-6 py-20 md:py-28">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950/50 backdrop-blur-md text-xs font-bold text-amber-300 uppercase tracking-widest border border-amber-400/40">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Verified Outlets & Depot Locator</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-white tracking-tight drop-shadow-lg">
            FIND LESEKESE NEAR YOU
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed drop-shadow">
            Locate our primary market depot at Abule Egba, Fagba, or find authorized distributors and chemical partners across Lagos, Abuja, Port Harcourt, and Nigeria.
          </p>
        </div>
      </section>

      {/* ================= PRIMARY DEPOT FEATURE CARD ================= */}
      <div className="rounded-3xl border border-red-500/60 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl shadow-red-600/30 p-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-accent font-bold uppercase tracking-wider shadow-md backdrop-blur-sm">
            <Flame className="w-3.5 h-3.5" /> Primary Market Headquarters
          </div>
          <h2 className="text-3xl font-display font-bold text-white tracking-wide">
            Fagba Main Depot (Suite 2 Adedoja Plaza HQ)
          </h2>
          <p className="text-xs sm:text-sm text-red-50 leading-relaxed">
            <strong className="text-white">Address:</strong> Suite 2 Adedoja Plaza, Fagba Railway (beside Bokku), Lagos.<br />
            <strong className="text-white">Landmark:</strong> Beside Bokku Supermarket, Fagba Railway Station, Lagos.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-amber-200 pt-2 font-medium">
            <span>📞 Call Depot: 08023725740</span>
            <span>🕒 Hours: Mon–Sat 7:30 AM – 6:30 PM WAT</span>
            <span>📦 Wholesale & Retail In Stock</span>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-3">
          <button
            onClick={() => onOpenOrderModal(500)}
            className="w-full py-3.5 px-6 rounded-xl bg-white text-red-600 font-accent font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 cursor-pointer"
          >
            Order Direct From Abule Egba HQ
          </button>
          <a
            href="tel:08023725740"
            className="w-full py-3 px-6 rounded-xl bg-white/10 text-white border border-white/30 text-xs font-semibold text-center hover:bg-white/20"
          >
            Call HQ Manager Directly
          </a>
        </div>
      </div>

      {/* ================= INTERACTIVE MAP & STORE LOCATOR ================= */}
      <MapLocator />

    </div>
  );
}
