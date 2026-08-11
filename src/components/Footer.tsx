import { Phone, Mail, MapPin, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import { LOGO_IMAGE_URL } from '../data/mockData';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative mt-24 border-t border-slate-200 bg-white text-slate-700 pt-16 pb-12 overflow-hidden shadow-sm">
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-red-500/5 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={LOGO_IMAGE_URL} 
                alt="LESEKESE Logo" 
                referrerPolicy="no-referrer"
                className="h-[76px] sm:h-[88px] w-auto object-contain rounded-lg bg-slate-50 p-1 border border-slate-200 shadow-sm"
              />
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              LESEKESE Allied Products is Nigeria’s leading instant pest elimination formula for bedbugs, cockroaches, mosquitoes, and household insects. Built with fast-knockdown dehydration technology and 3+ days residual action.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-300/80 flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>NAFDAC / Quality Formula Certified</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-accent font-bold uppercase tracking-wider text-slate-900">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Home Page', path: '/' },
                { label: 'Product Range (500ml, 250ml)', path: '/products' },
                { label: 'How It Works & Mechanism', path: '/how-it-works' },
                { label: 'Abule Egba & Store Locator', path: '/locations' },
                { label: 'Bulk Orders & Contact', path: '/contact' }
              ].map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    className="hover:text-red-600 transition-colors flex items-center gap-1.5 text-slate-600 cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3 text-red-600 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Compliance Pages */}
          <div className="space-y-3">
            <h4 className="text-sm font-accent font-bold uppercase tracking-wider text-slate-900">
              Legal & Safety
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Terms of Service', path: '/terms' },
                { label: 'Safety Guidelines & MSDS', path: '/safety' },
                { label: 'Refund & Delivery Policy', path: '/refunds' },
                { label: 'Admin Portal Login', path: '/admin' }
              ].map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    className="hover:text-amber-700 transition-colors flex items-center gap-1.5 text-slate-600 cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-amber-600" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-accent font-bold uppercase tracking-wider text-slate-900">
              Headquarters & Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Main Depot: Suite 2 Adedoja Plaza, Fagba Railway (beside Bokku), Lagos</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600 shrink-0" />
                <a href="tel:08023725740" className="hover:text-red-600 text-slate-800 transition-colors font-semibold">08023725740</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-600 shrink-0" />
                <a href="mailto:lesekeseproducts@gmail.com" className="hover:text-red-600 text-slate-800 transition-colors text-xs font-medium">lesekeseproducts@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 LESEKESE® Allied Products. All rights reserved. Registered trademark in Nigeria.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('/privacy')} className="hover:text-slate-900">Privacy</button>
            <span>•</span>
            <button onClick={() => onNavigate('/terms')} className="hover:text-slate-900">Terms</button>
            <span>•</span>
            <button onClick={() => onNavigate('/safety')} className="hover:text-slate-900">MSDS Sheet</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
