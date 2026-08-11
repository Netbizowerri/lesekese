import { AlertTriangle, ArrowLeft, ShieldCheck, Download } from 'lucide-react';

interface LegalPageProps {
  onNavigate: (path: string) => void;
}

export function SafetyMSDSPage({ onNavigate }: LegalPageProps) {
  return (
    <div className="space-y-8 pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-600">
      <button
        onClick={() => onNavigate('/')}
        className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer mb-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="glass-card p-8 md:p-12 rounded-3xl border border-amber-500/40 shadow-2xl space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900 tracking-wide">
                MATERIAL SAFETY DATA SHEET (MSDS SUMMARY)
              </h1>
              <p className="text-xs text-amber-700 font-medium">LESEKESE® Instant Insecticide Spray</p>
            </div>
          </div>

          <button
            onClick={() => alert('Downloading official LESEKESE MSDS PDF document...')}
            className="py-2.5 px-4 rounded-xl glass-pill text-xs font-bold text-slate-700 hover:border-amber-500 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>Download Official MSDS PDF</span>
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-6">
          <h3 className="text-lg font-accent font-bold text-slate-900">Section 1: Product Identification</h3>
          <p>
            <strong>Product Name:</strong> LESEKESE® Bedbugs & Cockroaches Instant Killer<br />
            <strong>Manufacturer:</strong> LESEKESE Allied Products, Suite 2 Adedoja Plaza, Fagba Railway (beside Bokku), Lagos<br />
            <strong>Emergency Contact:</strong> 08023725740
          </p>

          <h3 className="text-lg font-accent font-bold text-slate-900">Section 2: Active Formulation & Mechanism</h3>
          <p>
            Contains synthetic pyrethroid nerve knockdown complex combined with cuticle-desiccating synergists. Formulated to disrupt insect sodium channels while breaking down bedbug waxy egg membranes.
          </p>

          <h3 className="text-lg font-accent font-bold text-slate-900">Section 3: First Aid Measures</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Inhalation:</strong> Move affected person to fresh air. If irritation persists, seek medical attention.</li>
            <li><strong>Eye Contact:</strong> Flush eyes immediately with clean running water for 15 minutes.</li>
            <li><strong>Skin Contact:</strong> Wash skin with soap and warm water.</li>
            <li><strong>Ingestion:</strong> Do NOT induce vomiting. Rinse mouth with water and seek immediate medical care.</li>
          </ul>

          <h3 className="text-lg font-accent font-bold text-slate-900">Section 4: Fire-Fighting & Storage</h3>
          <p>
            Store in original sealed container in a cool, ventilated area away from direct flame or heat sources above 50°C.
          </p>
        </div>
      </div>
    </div>
  );
}
