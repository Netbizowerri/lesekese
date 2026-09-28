import { useEffect, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Flame,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  BUNDLES,
  INSTANT_KILLER_PRODUCT_ID,
  LOCATIONS,
  NAIROBI_PHONE,
  NAIROBI_WHATSAPP,
  ORDER_FORMSPREE_ENDPOINT,
  PRODUCTS,
  priceForBottleCount,
  savingsForBottleCount,
  tierForBottleCount,
} from '../data/mockData';
import { buildOrderMessage, buildOrderMailto, buildWhatsAppUrl, formatUnits, type OrderSummary } from '../lib/orderMessage';
import { recordOrder } from '../lib/queries';
import { isSupabaseConfigured } from '../lib/supabase';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  bottleCount?: number;
}

const MAX_BOTTLES = 24;
const NIGERIAN_STATES = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Ogun', 'Kano', 'Ibadan (Oyo)', 'Kaduna', 'Enugu',
  'Anambra', 'Delta', 'Edo', 'Imo', 'Kwara', 'Niger', 'Oyo', 'Plateau', 'Akwa Ibom',
  'Abia', 'Bauchi', 'Benue', 'Cross River', 'Ekiti', 'Enugu', 'Gombe', 'Ilorin (Kwara)',
];

/**
 * "Order Now" destination: an order form that POSTs to Formspree, with
 * WhatsApp, call and email kept as one-tap alternatives for customers who
 * would rather not fill anything in.
 */
export function OrderFormModal({
  isOpen,
  onClose,
  productId = INSTANT_KILLER_PRODUCT_ID,
  bottleCount = 2,
}: OrderFormModalProps) {
  const [selectedProductId, setSelectedProductId] = useState(productId);
  const [bottles, setBottles] = useState(bottleCount);
  const [packs, setPacks] = useState(1);
  const [store, setStore] = useState(LOCATIONS[0].name);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [notes, setNotes] = useState('');

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [reference, setReference] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setSelectedProductId(productId);
    setBottles(bottleCount);
    setPacks(1);
    setSending(false);
    setError(null);
    setSent(false);
    setReference('');
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

  const units = isPowder ? packs : Math.min(MAX_BOTTLES, Math.max(1, bottles * packs));
  const totalNgn = isPowder ? product.priceNgn * packs : priceForBottleCount(units);
  const savings = isPowder ? 0 : savingsForBottleCount(units);
  const activeTier = isPowder ? null : tierForBottleCount(units);
  const packLabel = isPowder ? `${packs} pack${packs > 1 ? 's' : ''}` : (activeTier?.label ?? `${units} bottles`);
  const unitLabel = isPowder ? '250g pack' : '500ml bottle';

  const address = [street.trim(), city.trim(), state.trim()].filter(Boolean).join(', ');

  const summary: OrderSummary = {
    productName: isPowder ? `${product.name} ${product.sizeLabel}` : `${product.name} ${product.sizeMl}ml`,
    packLabel,
    units,
    unitLabel,
    totalNgn,
    pickup: store,
    customerName: name,
    customerPhone: phone,
    customerEmail: email,
    address,
    notes,
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;

    if (!name.trim() || !phone.trim() || !state.trim() || !city.trim() || !street.trim()) {
      setError('Please fill in your name, phone, state, city and street so we can deliver.');
      return;
    }
    setError(null);
    setSending(true);

    const reference = `LSK-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setReference(reference);

    // Field names intentionally match the existing LandingPage order form so
    // the same Formspree inbox and notification template keep working.
    const payload = {
      form: `LESEKESE Order — ${summary.productName}`,
      reference,
      full_name: name.trim(),
      phone_number: phone.trim(),
      email: email.trim(),
      package: `${packLabel} — ${formatUnits(units, unitLabel)}`,
      quantity: String(units),
      price: `₦${totalNgn.toLocaleString()}`,
      delivery_address: address,
      notes: notes.trim(),
      source: 'LESEKESE Website — Order Now form',
    };

    try {
      const endpoint =
        (import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined) || ORDER_FORMSPREE_ENDPOINT;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
    } catch (err) {
      // Do not strand the customer: fall back to WhatsApp so the order still
      // reaches the business, and tell them what happened.
      setError(
        'We could not send the form just now. Please tap WhatsApp below and we will take your order there.'
      );
      setSending(false);
      return;
    }

    // Best-effort CMS record. Never blocks or undoes a successful order.
    if (isSupabaseConfigured) {
      void recordOrder({
        reference,
        product_id: product.id,
        product_name: product.name,
        bottle_count: Math.min(24, Math.max(1, units)),
        total_ngn: totalNgn,
        customer_name: name.trim(),
        phone: phone.trim(),
        city: address || store,
        source: 'order_form',
      }).catch(() => undefined);
    }

    setSending(false);
    setSent(true);
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
  };

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30';
  const labelCls = 'mb-1.5 block text-xs font-semibold text-slate-700';

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex min-h-full items-center justify-center bg-slate-900/60 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label="Order now"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg my-auto max-h-[90vh] overflow-y-auto glass-card rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl"
        >
          <button
            onClick={onClose}
            aria-label="Close order form"
            className="absolute top-4 right-4 p-2 rounded-xl glass-pill text-slate-500 hover:text-red-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {sent ? (
            <div className="text-center py-8">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100">
                <Check className="w-7 h-7 text-emerald-600" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-slate-900 tracking-wide">
                Order received
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Thank you{name.trim() ? `, ${name.trim().split(' ')[0]}` : ''}. We have your order for{' '}
                <strong>{packLabel}</strong> (₦{totalNgn.toLocaleString()}) and will call{' '}
                {phone.trim()} to confirm delivery.
              </p>
              <p className="mt-2 font-mono text-xs text-slate-500">Reference: {reference}</p>
              <div className="mt-7 space-y-2.5">
                <a
                  href={buildWhatsAppUrl(summary)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" aria-hidden="true" />
                  Continue on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl glass-pill text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6 pr-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-md shrink-0">
                  <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                    <Flame className="w-5 h-5 text-red-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900 tracking-wide">Order Now</h3>
                  <p className="text-xs text-amber-600 font-medium">Pay on Delivery · Lagos</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Product + pack */}
                <div>
                  <label className="block text-xs font-accent font-bold uppercase text-slate-700 mb-2">
                    Select Product
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRODUCTS.filter((p) => p.productType !== 'powder').map((p) => (
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
                  <div className="flex items-center justify-between glass-pill p-3 rounded-xl">
                    <div>
                      <span className="block text-xs font-bold text-slate-900">Number of Packs</span>
                      <span className="text-[10px] text-slate-500">
                        ₦{product.priceNgn.toLocaleString()} per 250g pack
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPacks(Math.max(1, packs - 1))}
                        aria-label="Decrease packs"
                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center hover:bg-emerald-600 hover:text-white cursor-pointer"
                      >
                        −
                      </button>
                      <span className="font-display text-xl font-bold text-slate-900 w-6 text-center">{packs}</span>
                      <button
                        type="button"
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
                              <span className="block font-display text-lg font-bold leading-tight">{tier.label}</span>
                              <span
                                className={`block text-xs font-mono mt-0.5 ${
                                  isActive ? 'text-amber-200' : 'text-amber-600'
                                }`}
                              >
                                ₦{tier.priceNgn.toLocaleString()}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between glass-pill p-3 rounded-xl">
                      <div>
                        <span className="block text-xs font-bold text-slate-900">Total Bottles (500ml each)</span>
                        <span className="text-[10px] text-slate-500">
                          1 bottle = ₦{priceForBottleCount(1).toLocaleString()} · 2+ bottles = ₦5,000 each
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setPacks(1);
                            setBottles(Math.max(1, units - 1));
                          }}
                          aria-label="Decrease bottles"
                          className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center hover:bg-brand hover:text-white cursor-pointer"
                        >
                          −
                        </button>
                        <span className="font-display text-xl font-bold text-slate-900 w-7 text-center">{units}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setPacks(1);
                            setBottles(Math.min(MAX_BOTTLES, units + 1));
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

                <div>
                  <label htmlFor="orderform-store" className="block text-xs font-accent font-bold uppercase text-slate-700 mb-1.5">
                    Preferred Store / Area
                  </label>
                  <select
                    id="orderform-store"
                    value={store}
                    onChange={(e) => setStore(e.target.value)}
                    className={`${inputCls} appearance-none`}
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Contact details */}
                <fieldset className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <legend className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Your details
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="orderform-name" className={labelCls}>
                        Full name *
                      </label>
                      <input
                        id="orderform-name"
                        type="text"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ada Okafor"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="orderform-phone" className={labelCls}>
                        Phone / WhatsApp *
                      </label>
                      <input
                        id="orderform-phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0802 372 5740"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="orderform-email" className={labelCls}>
                      Email (optional)
                    </label>
                    <input
                      id="orderform-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputCls}
                    />
                  </div>
                </fieldset>

                {/* Delivery */}
                <fieldset className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <legend className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Delivery address *
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="orderform-state" className={labelCls}>
                        State *
                      </label>
                      <select
                        id="orderform-state"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">Select state</option>
                        {NIGERIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="orderform-city" className={labelCls}>
                        City / LGA *
                      </label>
                      <input
                        id="orderform-city"
                        type="text"
                        autoComplete="address-level2"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Ikeja"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="orderform-street" className={labelCls}>
                      Street / area *
                    </label>
                    <input
                      id="orderform-street"
                      type="text"
                      autoComplete="street-address"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. 14 Allen Avenue, Ikeja"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="orderform-notes" className={labelCls}>
                      Notes (optional)
                    </label>
                    <textarea
                      id="orderform-notes"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Landmark, best time to deliver, etc."
                      className={`${inputCls} resize-y`}
                    />
                  </div>
                </fieldset>

                {/* Total */}
                <div className="glass-pill p-4 rounded-xl border border-amber-400/40 flex items-center justify-between">
                  <div>
                    <span className="block text-xs text-slate-600 font-medium">
                      {packLabel} · {units} × {isPowder ? '250g pack' : '500ml bottle'}
                    </span>
                    {savings > 0 && (
                      <span className="block text-[11px] text-emerald-700 font-bold">
                        You save ₦{savings.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-2xl font-display font-bold text-amber-600 tracking-wider">
                    ₦{totalNgn.toLocaleString()}
                  </span>
                </div>

                {error && (
                  <p role="alert" className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 disabled:opacity-70 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Check className="w-4 h-4" aria-hidden="true" />
                  )}
                  <span>{sending ? 'Sending your order…' : 'Send my order'}</span>
                </button>
              </form>

              {/* Alternative channels — Email, WhatsApp and call */}
              <div className="mt-5 space-y-2.5">
                <p className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Or order instantly
                </p>
                <a
                  href={buildWhatsAppUrl(summary)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" aria-hidden="true" />
                  <span>Instant WhatsApp Checkout</span>
                </a>
                <a
                  href={`tel:${NAIROBI_PHONE}`}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  <span>Call Dispatch Directly ({NAIROBI_PHONE})</span>
                </a>
                <a
                  href={buildOrderMailto(summary)}
                  className="w-full py-3 px-4 rounded-xl glass-pill text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>Email my order</span>
                </a>
              </div>

              <p className="mt-4 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                <span>Direct from Fagba Main Depot, Lagos. WhatsApp {NAIROBI_WHATSAPP}</span>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/** Exposed for tests and reuse: the plain-text summary the channels share. */
export { buildOrderMessage };
