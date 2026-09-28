import { useEffect, useState } from 'react';
import {
  INSTANT_KILLER_PRODUCT_ID,
  LOCATIONS,
  NAIROBI_PHONE,
  NAIROBI_WHATSAPP,
  BUNDLES,
  PRODUCTS,
  priceForBottleCount,
  savingsForBottleCount,
  tierForBottleCount,
  VOLUME_RATE_NGN
} from '../data/mockData';
import { X, MessageSquare, Phone, Mail, Flame, ShieldCheck, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { recordOrder } from '../lib/queries';
import { isSupabaseConfigured } from '../lib/supabase';
import { buildOrderMailto, type OrderSummary } from '../lib/orderMessage';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  bottleCount?: number;
}

const MAX_BOTTLES = 24;

export function OrderModal({
  isOpen,
  onClose,
  productId = INSTANT_KILLER_PRODUCT_ID,
  bottleCount = 2
}: OrderModalProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(productId);
  const [bottles, setBottles] = useState<number>(bottleCount);
  const [packs, setPacks] = useState<number>(1);
  const [selectedStore, setSelectedStore] = useState<string>(LOCATIONS[0].name);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [recording, setRecording] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  // Re-sync when the caller opens the modal for a different product / quantity.
  useEffect(() => {
    if (!isOpen) return;
    setSelectedProductId(productId);
    setBottles(bottleCount);
    setPacks(1);
  }, [isOpen, productId, bottleCount]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const product = PRODUCTS.find((p) => p.id === selectedProductId) ?? PRODUCTS[0];
  const isPowder = product.productType === 'powder';
  const sprayOnly = PRODUCTS.filter((p) => p.productType !== 'powder');

  const totalBottles = Math.min(MAX_BOTTLES, Math.max(1, bottles * packs));
  const totalPriceNgn = isPowder
    ? product.priceNgn * packs
    : priceForBottleCount(totalBottles);
  const savings = isPowder ? 0 : savingsForBottleCount(totalBottles);
  const activeTier = isPowder ? null : tierForBottleCount(totalBottles);
  const listPrice = isPowder
    ? product.priceNgn * packs
    : (activeTier?.listPriceNgn ?? totalBottles * priceForBottleCount(1));

  const whatsappMessage = isPowder
    ? encodeURIComponent(
        `Hello LESEKESE Depot! I want to order ${packs} x ${product.name} — ${product.sizeLabel} (Total: ₦${totalPriceNgn.toLocaleString()}). Preferred Pickup/Delivery: ${selectedStore}.`
      )
    : encodeURIComponent(
        `Hello LESEKESE Depot! I want to order the ${activeTier?.label} pack — ${totalBottles} x Lesekese Bedbugs and Cockroaches Instant Killer 500ml (Total: ₦${totalPriceNgn.toLocaleString()}). Preferred Pickup/Delivery: ${selectedStore}.`
      );

  // Email channel. The WhatsApp wording above is deliberately left untouched
  // because it is the primary, test-covered revenue path; this reuses the
  // same order details in a plain-text body for mailto:.
  const orderSummary: OrderSummary = {
    productName: isPowder
      ? `${product.name} ${product.sizeLabel}`
      : `${product.name} ${product.sizeMl}ml`,
    packLabel: isPowder ? `${packs} pack${packs > 1 ? 's' : ''}` : (activeTier?.label ?? `${totalBottles} bottles`),
    units: isPowder ? packs : totalBottles,
    unitLabel: isPowder ? '250g pack' : '500ml bottle',
    totalNgn: totalPriceNgn,
    pickup: selectedStore,
    customerName,
    customerPhone,
  };

  // The WhatsApp handoff is the revenue path, so it must never wait on the
  // CMS. window.open runs synchronously inside the click (so it is not
  // popup-blocked), and the Supabase insert is then fired and forgotten: a
  // missing table, slow network, or failure only degrades the admin's order
  // list, never the customer's ability to order.
  const checkout = () => {
    window.open(`https://wa.me/${NAIROBI_WHATSAPP}?text=${whatsappMessage}`, '_blank', 'noopener');

    if (!isSupabaseConfigured) return;

    const ref = `LSK-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setRecording(true);
    void recordOrder({
      reference: ref,
      product_id: product.id,
      product_name: product.name,
      // The orders table checks bottle_count between 1 and 24, and powder
      // pack counts are unbounded in the UI, so clamp before writing.
      bottle_count: Math.min(24, Math.max(1, isPowder ? packs : totalBottles)),
      total_ngn: totalPriceNgn,
      customer_name: customerName.trim() || 'WhatsApp customer',
      phone: customerPhone.trim() || 'Not provided',
      city: selectedStore,
      source: 'website',
    })
      .then(() => setReference(ref))
      .catch(() => setReference(null))
      .finally(() => setRecording(false));
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex min-h-full items-center justify-center bg-slate-900/60 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label="Quick order"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg my-auto max-h-[90vh] overflow-y-auto glass-card rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl"
        >
          <button
            onClick={onClose}
            aria-label="Close order dialog"
            className="absolute top-4 right-4 p-2 rounded-xl glass-pill text-slate-500 hover:text-red-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-6 pr-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-slate-900 tracking-wide">
                Quick Order / Instant Checkout
              </h3>
              <p className="text-xs text-amber-600 font-medium">Pay on Delivery · Lagos</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Product selector — Instant Killer 500ml or SEND OFF */}
            <div>
              <label className="block text-xs font-accent font-bold uppercase text-slate-700 mb-2">
                Select Product
              </label>
              <div className="grid grid-cols-2 gap-2">
                {sprayOnly.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProductId(p.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-left ${
                      selectedProductId === p.id
                        ? 'bg-brand text-white border border-emerald-400 shadow-md shadow-emerald-900/30'
                        : 'glass-pill text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold block truncate">Instant Killer 500ml</span>
                    <span
                      className={`text-xs font-mono mt-0.5 block ${
                        selectedProductId === p.id ? 'text-amber-200' : 'text-amber-600'
                      }`}
                    >
                      From ₦{priceForBottleCount(1).toLocaleString()}
                    </span>
                  </button>
                ))}
                {PRODUCTS.filter((p) => p.productType === 'powder').map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProductId(p.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-left ${
                      selectedProductId === p.id
                        ? 'bg-emerald-600 text-white border border-emerald-400 shadow-md shadow-emerald-600/30'
                        : 'glass-pill text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold block truncate">SEND OFF 250g</span>
                    <span
                      className={`text-xs font-mono mt-0.5 block ${
                        selectedProductId === p.id ? 'text-amber-200' : 'text-amber-600'
                      }`}
                    >
                      ₦{p.priceNgn.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {isPowder ? (
              /* ---- SEND OFF: pack stepper ---- */
              <div className="flex items-center justify-between glass-pill p-3 rounded-xl">
                <div>
                  <span className="block text-xs font-bold text-slate-900">Number of Packs</span>
                  <span className="text-[10px] text-slate-500">
                    ₦{product.priceNgn.toLocaleString()} per 250g pack
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPacks(Math.max(1, packs - 1))}
                    aria-label="Decrease packs"
                    className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center hover:bg-emerald-600 hover:text-white cursor-pointer"
                  >
                    −
                  </button>
                  <span className="font-display text-xl font-bold text-slate-900 w-6 text-center">
                    {packs}
                  </span>
                  <button
                    onClick={() => setPacks(packs + 1)}
                    aria-label="Increase packs"
                    className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center hover:bg-emerald-600 hover:text-white cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Published price tiers */}
                <div>
                  <label className="block text-xs font-accent font-bold uppercase text-slate-700 mb-2">
                    Choose Your Pack
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {BUNDLES.map((tier) => {
                      const isActive = activeTier?.id === tier.id;
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => {
                            setBottles(tier.bottles);
                            setPacks(1);
                          }}
                          className={`relative py-3 px-3 rounded-xl text-left transition-all cursor-pointer border ${
                            isActive
                              ? 'bg-brand text-white border-emerald-500 shadow-lg shadow-emerald-900/30'
                              : 'glass-pill text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {tier.badge && (
                            <span
                              className={`absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-accent font-bold uppercase tracking-wider ${
                                isActive ? 'bg-amber-400 text-slate-900' : 'bg-red-600 text-white'
                              }`}
                            >
                              {tier.badge}
                            </span>
                          )}
                          <span className="block text-[10px] font-accent font-bold uppercase tracking-wider opacity-80">
                            {tier.headline}
                          </span>
                          <span className="block font-display text-lg font-bold leading-tight">
                            {tier.label}
                          </span>
                          <span
                            className={`block text-xs font-mono mt-0.5 ${
                              isActive ? 'text-amber-200' : 'text-amber-600'
                            }`}
                          >
                            ₦{tier.priceNgn.toLocaleString()}
                            {tier.listPriceNgn && (
                              <span className="line-through opacity-60 ml-1">
                                ₦{tier.listPriceNgn.toLocaleString()}
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottle count — allows quantities off the published tiers */}
                <div className="flex items-center justify-between glass-pill p-3 rounded-xl">
                  <div>
                    <span className="block text-xs font-bold text-slate-900">
                      Total Bottles (500ml each)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      1 bottle = ₦{priceForBottleCount(1).toLocaleString()} · 2+ bottles = ₦
                      {VOLUME_RATE_NGN.toLocaleString()} each
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setPacks(1);
                        setBottles(Math.max(1, totalBottles - 1));
                      }}
                      aria-label="Decrease bottles"
                      className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center hover:bg-brand hover:text-white cursor-pointer"
                    >
                      −
                    </button>
                    <span className="font-display text-xl font-bold text-slate-900 w-7 text-center">
                      {totalBottles}
                    </span>
                    <button
                      onClick={() => {
                        setPacks(1);
                        setBottles(Math.min(MAX_BOTTLES, totalBottles + 1));
                      }}
                      aria-label="Increase bottles"
                      className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center hover:bg-brand hover:text-white cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </>
            )}

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

            {/* Total */}
            <div className="glass-pill p-4 rounded-xl border border-amber-400/40 flex items-center justify-between">
              <div>
                <span className="block text-xs text-slate-600 font-medium">
                  {isPowder
                    ? `${packs} × SEND OFF 250g`
                    : `${activeTier?.label} pack · ${totalBottles} × 500ml`}
                </span>
                {savings > 0 && (
                  <span className="block text-[11px] text-emerald-700 font-bold">
                    You save ₦{savings.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="text-right">
                {listPrice > totalPriceNgn && (
                  <span className="block text-xs text-slate-400 line-through">
                    ₦{listPrice.toLocaleString()}
                  </span>
                )}
                <span className="block text-2xl font-display font-bold text-amber-600 tracking-wider">
                  ₦{totalPriceNgn.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Customer details — feeds the admin Orders list */}
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Your details
                <span className="ml-1.5 font-normal normal-case tracking-normal text-slate-500">
                  (optional — speeds up delivery)
                </span>
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="order-customer-name" className="mb-1 block text-xs font-semibold text-slate-700">
                    Full name
                  </label>
                  <input
                    id="order-customer-name"
                    type="text"
                    autoComplete="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ada Okafor"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  />
                </div>
                <div>
                  <label htmlFor="order-customer-phone" className="mb-1 block text-xs font-semibold text-slate-700">
                    Phone / WhatsApp
                  </label>
                  <input
                    id="order-customer-phone"
                    type="tel"
                    autoComplete="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0802 372 5740"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  />
                </div>
              </div>
              {reference && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Order saved as <span className="font-mono">{reference}</span>
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={checkout}
                disabled={recording}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-70 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {recording ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <MessageSquare className="w-4 h-4" aria-hidden="true" />
                )}
                <span>{recording ? 'Saving order…' : 'Instant WhatsApp Checkout'}</span>
              </button>

              <a
                href={`tel:${NAIROBI_PHONE}`}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Dispatch Directly ({NAIROBI_PHONE})</span>
              </a>

              <a
                href={buildOrderMailto(orderSummary)}
                className="w-full py-3 px-4 rounded-xl glass-pill text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>Email my order</span>
              </a>
            </div>

            <ul className="text-[10px] text-slate-500 space-y-1">
              {[
                '100% Genuine LESEKESE formula — direct from the factory',
                'Pay on delivery available in Lagos',
                isPowder
                  ? 'Repellent barrier lasts up to 3 weeks per application'
                  : 'Kills bedbugs on contact with 3-day residual protection'
              ].map((line) => (
                <li key={line} className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-brand shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Direct from Fagba Main Depot, Lagos.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
