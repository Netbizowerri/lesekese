import { useState, useEffect } from 'react';
import { Menu, X, PhoneCall, ShoppingBag, MapPin, ShieldAlert, ChevronRight, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LOGO_IMAGE_URL } from '../data/mockData';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenOrderModal?: (productSize?: number) => void;
}

export function Navbar({ currentPath, onNavigate, onOpenOrderModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Distributor Locator', path: '/locations' },
    { label: 'Contact & Orders', path: '/contact' }
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-slate-200/80 shadow-md ${
      scrolled ? 'py-2 sm:py-2.5' : 'py-3 sm:py-3.5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={() => handleNavClick('/')}
          className="flex items-center group cursor-pointer focus:outline-none"
        >
          <img 
            src={LOGO_IMAGE_URL} 
            alt="LESEKESE Logo" 
            referrerPolicy="no-referrer"
            className="h-[62px] sm:h-[78px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-red-50 text-red-600 border border-red-200 font-bold shadow-xs'
                    : 'text-slate-800 hover:text-red-600 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:08023725740"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-sm font-semibold hover:bg-slate-200 hover:text-red-600 transition-all"
          >
            <PhoneCall className="w-4 h-4 text-red-600" />
            <span>08023725740</span>
          </a>

          <button
            onClick={() => onOpenOrderModal ? onOpenOrderModal(500) : handleNavClick('/contact')}
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white text-sm font-bold shadow-lg shadow-red-600/30 hover:brightness-110 hover:shadow-red-600/50 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Now</span>
          </button>
        </div>

        {/* Mobile Header Controls */}
        <div className="flex md:hidden items-center gap-3.5 sm:gap-4">
          <button
            onClick={() => onOpenOrderModal ? onOpenOrderModal(500) : handleNavClick('/contact')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 hover:text-red-600 hover:bg-slate-200 focus:outline-none transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-red-600" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/98 backdrop-blur-xl border-b border-slate-200 shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-3">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-red-50 text-red-600 border border-red-200 font-bold'
                        : 'text-slate-800 hover:bg-slate-100 hover:text-red-600'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                );
              })}

              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-3">
                <a
                  href="tel:08023725740"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-200"
                >
                  <PhoneCall className="w-4 h-4 text-red-600" />
                  <span>Call Us</span>
                </a>

                <button
                  onClick={() => handleNavClick('/locations')}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 text-white text-xs font-bold shadow-lg shadow-red-600/30"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Find Store</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
