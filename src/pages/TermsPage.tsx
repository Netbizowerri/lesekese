import { FileText, ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  onNavigate: (path: string) => void;
}

export function TermsPage({ onNavigate }: LegalPageProps) {
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
          <FileText className="w-8 h-8 text-amber-600" />
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-wide">
              TERMS OF SERVICE
            </h1>
            <p className="text-xs text-slate-500">Effective Date: August 10, 2026 | LESEKESE® Allied Products</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-6">
          <h3 className="text-lg font-accent font-bold text-slate-900">1. Agreement to Terms</h3>
          <p>
            By accessing or purchasing products through LESEKESE®, you agree to be bound by these Terms of Service and comply with all applicable Nigerian chemical safety guidelines.
          </p>

          <h3 className="text-lg font-accent font-bold text-slate-900">2. Authorized Product Use</h3>
          <p>
            LESEKESE® is an active insecticide spray intended for bedbugs, cockroaches, mosquitoes, and household pest control. Users must follow the label instructions and safety directions provided on the bottle packaging. LESEKESE® Allied Products is not liable for misuse resulting from non-compliance with ventilation guidelines.
          </p>

          <h3 className="text-lg font-accent font-bold text-slate-900">3. Distributor & Retail Licensing</h3>
          <p>
            Retailers and market stalls selling LESEKESE® must source genuine stock directly from Fagba Main Depot (Suite 2 Adedoja Plaza) or verified brand representatives to prevent counterfeit distribution.
          </p>

          <h3 className="text-lg font-accent font-bold text-slate-900">4. Pricing & Wholesale Orders</h3>
          <p>
            Product prices (₦3,000 for 500ml, ₦2,000 for 250ml, ₦1,000 for 100ml) are subject to official manufacturer adjustments. Bulk carton orders qualify for wholesale discount rates as confirmed upon invoice.
          </p>
        </div>
      </div>
    </div>
  );
}
