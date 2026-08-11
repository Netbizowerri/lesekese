import { useState } from 'react';
import { PRODUCTS, LOCATIONS } from '../data/mockData';
import { X, ShoppingBag, MessageSquare, Phone, Flame, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSizeMl?: number;
}

export function OrderModal({ isOpen, onClose, selectedSizeMl = 500 }: OrderModalProps) {
  const [sizeMl, setSizeMl] = useState<number>(selectedSizeMl);
  const [quantity, setQuantity] = useState<number>(2);
  const [selectedStore, setSelectedStore] = useState<string>(LOCATIONS[0].name);

  if (!isOpen) return null;

  const product = PRODUCTS.find((p) => p.sizeMl === sizeMl) || PRODUCTS[0];
  const totalPriceNgn = product.priceNgn * quantity;

  const whatsappMessage = encodeURIComponent(
    `Hello LESEKESE Depot! I want to order ${quantity}x ${product.name} (Total: ₦${totalPriceNgn.toLocaleString()}). Preferred Pickup/Delivery: ${selectedStore}.`
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex min-h-full items-center justify-center bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg my-auto max-h-[90vh] overflow-y-auto glass-card rounded-3xl p-6 md:p-8 border border-red-500/40 shadow-2xl bg-gradient-to-b from-white via-white to-slate-50 custom-scrollbar"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl glass-pill text-slate-500 hover:text-red-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-slate-900 tracking-wide">
                Quick Order / Instant Checkout
              </h3>
              <p className="text-xs text-amber-600 font-medium">
                Retail & Bulk Fast Dispatch
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Size Selector */}
            <div>
              <label className="block text-xs font-accent font-bold uppercase text-slate-700 mb-2">
                Select Bottle Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PRODUCTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSizeMl(p.sizeMl)}
                    className={`py-2.5 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      sizeMl === p.sizeMl
                        ? 'bg-red-600 text-white border border-red-400 shadow-md shadow-red-600/30'
                        : 'glass-pill text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div>{p.sizeLabel}</div>
                    <div className="text-xs text-amber-600 font-mono mt-0.5">₦{p.priceNgn.toLocaleString()}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between glass-pill p-3 rounded-xl">
              <div>
                <span className="block text-xs font-bold text-slate-900">Quantity (Bottles)</span>
                <span className="text-[10px] text-slate-500">₦{product.priceNgn} per bottle</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center hover:bg-red-600 hover:text-white cursor-pointer"
                >
                  -
                </button>
                <span className="font-display text-xl font-bold text-slate-900 w-6 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center hover:bg-red-600 hover:text-white cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-xs font-accent font-bold uppercase text-slate-700 mb-1.5">
                Preferred Store / Area
              </label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium bg-white text-slate-900"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.name} className="bg-white text-slate-900">
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Price Box */}
            <div className="glass-card p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">Total Amount:</span>
              <span className="text-2xl font-display font-bold text-amber-600 tracking-wider">
                ₦{totalPriceNgn.toLocaleString()}
              </span>
            </div>

            {/* Direct WhatsApp / Call Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <a
                href={`https://wa.me/2348023725740?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Checkout</span>
              </a>

              <a
                href="tel:08023725740"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Dispatch Directly (08023725740)</span>
              </a>
            </div>

            <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>100% Genuine LESEKESE Formula. Direct from Factory.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
