import { ShieldCheck, ArrowLeft, Truck } from 'lucide-react';

interface LegalPageProps {
  onNavigate: (path: string) => void;
}

export function RefundsPage({ onNavigate }: LegalPageProps) {
  return (
    <div className="space-y-8 pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-600">
      <button
        onClick={() => onNavigate('/')}
        className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer mb-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="glass-card p-8 md:p-12 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Truck className="w-8 h-8 text-amber-600" />
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-wide">
              REFUND & DELIVERY POLICY
            </h1>
            <p className="text-xs text-slate-500">Effective Date: August 10, 2026 | LESEKESE® Allied Products</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-6">
          <h3 className="text-lg font-accent font-bold text-slate-900">1. Nationwide Dispatch & Delivery</h3>
          <p>
            Retail and wholesale orders placed through our website or Fagba HQ are dispatched within 24 to 48 hours. Express same-day delivery is available within Lagos Metropolis (Fagba, Ikeja, Surulere, Lekki).
          </p>

          <h3 className="text-lg font-accent font-bold text-slate-900">2. Quality Assurance & Factory Seal</h3>
          <p>
            All LESEKESE® spray bottles leave our primary warehouse with factory-sealed trigger pumps. Please inspect your package upon receipt.
          </p>

          <h3 className="text-lg font-accent font-bold text-slate-900">3. Returns & Replacements</h3>
          <p>
            In the rare event of a damaged bottle seal or transit leak, notify our support team within 48 hours of delivery at <strong className="text-slate-900">08023725740</strong> for an immediate replacement bottle at zero additional cost.
          </p>

          <h3 className="text-lg font-accent font-bold text-slate-900">4. Refund Eligibility</h3>
          <p>
            Unopened cartons in original factory condition may be returned within 7 business days for a full refund or stock exchange at Fagba Main Depot (Suite 2 Adedoja Plaza).
          </p>
        </div>
      </div>
    </div>
  );
}
