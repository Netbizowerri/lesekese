import { ContactForm } from '../components/ContactForm';
import { Mail, PhoneCall, ShieldCheck, Flame } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (path: string) => void;
  onOpenOrderModal: (sizeMl?: number) => void;
}

export function ContactPage({ onNavigate, onOpenOrderModal }: ContactPageProps) {
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
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Formspree + Privyr Processed Portal</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-white tracking-tight drop-shadow-lg">
            CONTACT & BULK ORDER INQUIRIES
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed drop-shadow">
            Submit bulk carton requests, retailer applications, or general questions. All submissions are processed instantly by our dispatch unit.
          </p>
        </div>
      </section>

      {/* Main Form Component */}
      <ContactForm />

    </div>
  );
}
