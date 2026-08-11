import { ShieldCheck, ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  onNavigate: (path: string) => void;
}

export function PrivacyPage({ onNavigate }: LegalPageProps) {
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
          <ShieldCheck className="w-8 h-8 text-amber-600" />
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-wide">
              PRIVACY POLICY
            </h1>
            <p className="text-xs text-slate-500">Effective Date: August 10, 2026 | LESEKESE® Allied Products</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-6">
          <h3 className="text-lg font-accent font-bold text-slate-900">1. Information We Collect</h3>
          <p>
            When you interact with the LESEKESE® web platform, order products, or submit distributor inquiries, we collect information you voluntarily provide, including your full name, phone number, email address, physical/delivery address, and inquiry details via Formspree and Privyr CRM integrations.
          </p>

          <h3 className="text-lg font-accent font-bold text-slate-900">2. How We Use Your Information</h3>
          <p>
            Your information is strictly used to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process and fulfill retail, wholesale, and bulk carton orders.</li>
            <li>Connect you with authorized local distributors in Abule Egba, Fagba, Ikeja, Abuja, or Port Harcourt.</li>
            <li>Send order confirmation updates and customer support responses.</li>
            <li>Verify distributor credentials and process partner applications.</li>
          </ul>

          <h3 className="text-lg font-accent font-bold text-slate-900">3. Data Security & Storage</h3>
          <p>
            We deploy secure encryption protocols across all form handling workflows. Your personal data is never sold, leased, or traded to third-party advertisers. Form entries are transmitted safely via HTTPS to our Formspree and Privyr endpoints.
          </p>

          <h3 className="text-lg font-accent font-bold text-slate-900">4. Your Data Rights</h3>
          <p>
            You have the right to request deletion or modification of your lead or customer data at any time by contacting our data team at <strong className="text-slate-900">lesekeseproducts@gmail.com</strong> or calling <strong className="text-slate-900">08023725740</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
