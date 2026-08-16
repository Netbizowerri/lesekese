import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X, MessageSquare, Phone, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface ThankYouModalProps {
  isOpen: boolean;
  fullName: string;
  phone: string;
  inquiryType: string;
  onClose: () => void;
}

export function ThankYouModal({ isOpen, fullName, phone, inquiryType, onClose }: ThankYouModalProps) {
  // Celebrate on open
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      try {
        confetti({ particleCount: 100, spread: 75, origin: { y: 0.5 } });
      } catch {
        // canvas unavailable — ignore
      }
    }, 150);
    return () => clearTimeout(t);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex min-h-full items-center justify-center bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md my-auto glass-card rounded-3xl p-6 md:p-8 border border-emerald-500/30 shadow-2xl bg-gradient-to-b from-white via-white to-slate-50"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl glass-pill text-slate-500 hover:text-red-600 cursor-pointer"
            aria-label="Close thank you message"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          {/* Heading */}
          <h3 className="mt-5 text-3xl font-display font-bold text-slate-900 tracking-wide text-center">
            Inquiry Received Successfully!
          </h3>

          <p className="mt-3 text-sm text-slate-600 text-center leading-relaxed">
            Thank you, <strong className="text-slate-900">{fullName}</strong>. Your{' '}
            <strong className="text-amber-600">{inquiryType}</strong> submission has been received and
            our dispatch team will reach out to you at{' '}
            <strong className="text-slate-900">{phone}</strong> shortly.
          </p>

          {/* Quick actions */}
          <div className="mt-6 space-y-2.5">
            <a
              href="https://wa.me/2348023725740"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat With Us on WhatsApp</span>
            </a>
            <a
              href="tel:08023725740"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call Dispatch (08023725740)</span>
            </a>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="mt-5 w-full py-2.5 rounded-xl glass-pill text-xs font-bold text-slate-600 hover:text-red-600 hover:border-red-400 transition-all cursor-pointer"
          >
            Done — Submit Another Request
          </button>

          <p className="mt-4 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>LESEKESE — Dispatch confirmation within 24–48 hours across Nigeria.</span>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}