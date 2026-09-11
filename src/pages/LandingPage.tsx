import { useState, useEffect, useRef, FormEvent, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  XCircle,
  Star,
  ChevronDown,
  Phone,
  MessageCircle,
  MessageSquare,
  ShieldCheck,
  Zap,
  Clock,
  Wind,
  Home,
  Truck,
  AlertTriangle,
  Flame,
  Package,
} from 'lucide-react';

const HERO_IMG = 'https://i.ibb.co/B23957FQ/Buy-Lesekese-Bedbugs-and-Cockroaches-Instant-Killer-3-1.png';
const SHARE_IMG = 'https://i.ibb.co/3m6SSFYM/Buy-Lesekese-Bedbugs-and-Cockroaches-Instant-Killer.jpg';
const BOTTLE_IMG = 'https://i.ibb.co/3yKmDdjr/Lesekese.png';
const LOGO_URL = 'https://i.ibb.co/zhWkB5Fh/LESEKESE.jpg';

const PRODUCT_NAME = 'Lesekese Bedbugs and Cockroaches Instant Killer';
const BRAND_NAME = 'LESEKESE';

const WA_NUMBER = '2348023725740';
const PHONE_NUMBER = '08023725740';

const PACKAGES = [
  {
    id: 'pkg-1',
    label: 'Starter',
    qty: 1,
    price: 9000,
    badge: null as string | null,
    highlight: false,
    desc: 'Perfect for a 1-bedroom apartment. Kills bedbugs, eggs & cockroaches on contact.',
    savings: null as number | null,
  },
  {
    id: 'pkg-2',
    label: 'Family',
    qty: 2,
    price: 15000,
    badge: 'MOST POPULAR' as string | null,
    highlight: true,
    desc: 'Ideal for a 2-bedroom flat. Covers full fumigation including hidden cracks & seams.',
    savings: 3000 as number | null,
  },
  {
    id: 'pkg-3',
    label: 'Full House',
    qty: 3,
    price: 20000,
    badge: 'BEST VALUE' as string | null,
    highlight: false,
    desc: 'Complete 3-bedroom apartment fumigation. No more bedbugs or their eggs — guaranteed.',
    savings: 7000 as number | null,
  },
  {
    id: 'pkg-5',
    label: 'Landlord',
    qty: 5,
    price: 25000,
    badge: 'MAX SAVINGS' as string | null,
    highlight: false,
    desc: 'Treat multiple rooms or an entire building. Best for landlords, hostels & hotels.',
    savings: 20000 as number | null,
  },
];

const TESTIMONIALS = [
  {
    name: 'Mrs. Adunola Bakare',
    city: 'Surulere, Lagos',
    text: `I spent ₦40,000 on fumigators twice and the bedbugs returned within a week. One bottle of ${PRODUCT_NAME} and they were dead within MINUTES. This thing is real!`,
    stars: 5,
  },
  {
    name: 'Alhaji Musa Ibrahim',
    city: 'Wuse II, Abuja',
    text: 'My hotel had a bedbug embarrassment for months. I ordered 5 bottles, sprayed all rooms on a Friday — zero complaints ever since. My guests are very happy.',
    stars: 5,
  },
  {
    name: 'Chidinma Okafor',
    city: 'Enugu',
    text: `I was too ashamed to invite visitors because of cockroaches everywhere. ${PRODUCT_NAME} cleared my kitchen in one spray. The smell is mild — not harsh like SNIPER.`,
    stars: 5,
  },
  {
    name: 'Engr. Tunde Adeleke',
    city: 'Ikeja, Lagos',
    text: `As a pest control professional, I tested ${PRODUCT_NAME} against 3 other brands. Fastest knockdown I have ever seen. I now recommend it to every single client.`,
    stars: 5,
  },
  {
    name: 'Mama Ngozi',
    city: 'Port Harcourt',
    text: `My daughter brought bedbugs from school hostel. Within 3 days of ${PRODUCT_NAME}, everything was gone — even the eggs. God bless whoever made this product!`,
    stars: 5,
  },
  {
    name: 'Pastor Kehinde Falade',
    city: 'Ikorodu, Lagos',
    text: 'Ordered 3 bottles for our church dormitory. Perfect fumigation. No irritating smell — children were back in their rooms same day after ventilation.',
    stars: 5,
  },
];

const FAQS = [
  {
    q: `How fast does ${PRODUCT_NAME} kill bedbugs in Lagos?`,
    a: `${PRODUCT_NAME} delivers instant knockdown on contact — bedbugs die within seconds of being sprayed in any Lagos home. The residual formula continues killing survivors and newly hatched eggs for 3+ days after application, making it the fastest bedbug killer available in Nigeria.`,
  },
  {
    q: `Is ${PRODUCT_NAME} safe to use in bedrooms with children and pets?`,
    a: `Yes. After spraying, leave the room ventilated for 30–45 minutes before re-entry. ${PRODUCT_NAME} has a mild odour — not harsh like SNIPER — and leaves no greasy residue. It is formulated for residential bedrooms across Lagos and Nigeria, not just industrial use.`,
  },
  {
    q: `Does ${PRODUCT_NAME} kill bedbug eggs too?`,
    a: `Yes. ${PRODUCT_NAME} disrupts the outer waxy membrane of bedbug eggs and dehydrates larvae on contact. For severe infestations common in Lagos apartments, repeat the treatment after 7–10 days to eliminate any newly hatched nymphs.`,
  },
  {
    q: 'How many bottles do I need for my Lagos apartment?',
    a: '1 bottle (500ml) is suitable for a 1-bedroom apartment. 2 bottles cover a 2-bedroom flat comfortably. 3 bottles handle a full 3-bedroom apartment with thorough treatment of all cracks, seams, and furniture joints — ideal for typical Lagos apartment sizes.',
  },
  {
    q: 'Do you deliver to my state in Nigeria? How long does delivery take?',
    a: 'We deliver nationwide across Nigeria. Lagos orders typically arrive within 24 hours. Other states including Abuja, Enugu, Port Harcourt and Oyo take 2–3 business days. Pay on delivery is available in Lagos. For other states, order confirmation is required before dispatch.',
  },
];

function useCountdown() {
  const getTarget = () => {
    const t = new Date();
    t.setHours(23, 59, 59, 999);
    return t.getTime();
  };
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, getTarget() - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return timeLeft;
}

function buildWaLink(pkg: (typeof PACKAGES)[number]) {
  const msg = encodeURIComponent(
    `Hello! I want to order the Lesekese Bedbugs and Cockroaches Instant Killer *${pkg.label} Pack* — ${pkg.qty} bottle${pkg.qty > 1 ? 's' : ''} (500ml) for ₦${pkg.price.toLocaleString()}. Please confirm my order and delivery details.`
  );
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  key?: string | number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const LANDING_URL = 'https://www.lesekeseproducts.com/lesekese-bedbugs-and-cockroaches-instant-killer';

function useLandingSeo() {
  useEffect(() => {
    const prev = { title: document.title };

    document.title = `Buy ${PRODUCT_NAME} in Lagos Nigeria | Instant Insecticide ₦9,000`;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', `Buy ${PRODUCT_NAME} — Nigeria's #1 bedbug and cockroach insecticide in Lagos. Kills bedbugs, eggs & cockroaches on contact with 3+ days residual protection. Order via WhatsApp for nationwide delivery. Starting ₦9,000.`);
    setMeta('name', 'keywords', 'bedbug killer Nigeria, cockroach killer Lagos, buy insecticide online Nigeria, bedbug spray Lagos, Lesekese insecticide, pest control product Nigeria, instant bedbug killer, bedbug treatment Lagos, cockroach spray Nigeria, fumigation alternative Nigeria, bedbug killer price Nigeria, best bedbug killer in Nigeria, how to kill bedbugs Lagos, buy bedbug killer online Lagos, household insecticide Nigeria');
    setMeta('name', 'geo.region', 'NG-LA');
    setMeta('name', 'geo.placename', 'Lagos');
    setMeta('name', 'geo.position', '6.5244;3.3792');
    setMeta('name', 'ICBM', '6.5244, 3.3792');

    setMeta('property', 'og:title', `Buy ${PRODUCT_NAME} in Lagos Nigeria | Instant Insecticide`);
    setMeta('property', 'og:description', `Nigeria's #1 instant bedbug and cockroach killer. Kills on contact with 3+ days residual protection. Order via WhatsApp — nationwide delivery from Lagos. Packages from ₦9,000.`);
    setMeta('property', 'og:url', LANDING_URL);
    setMeta('property', 'og:type', 'product');
    setMeta('property', 'og:image', SHARE_IMG);

    setMeta('name', 'twitter:title', `Buy ${PRODUCT_NAME} in Lagos Nigeria`);
    setMeta('name', 'twitter:description', `Nigeria's #1 instant bedbug and cockroach killer. Kills on contact. Order via WhatsApp — nationwide delivery. Packages from ₦9,000.`);
    setMeta('name', 'twitter:image', SHARE_IMG);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', LANDING_URL);

    return () => {
      document.title = prev.title;
    };
  }, []);
}

export function LandingPage() {
  useLandingSeo();

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<string>('pkg-2');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryState, setDeliveryState] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [formError, setFormError] = useState('');
  const [smsSending, setSmsSending] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [smsError, setSmsError] = useState('');
  const orderRef = useRef<HTMLDivElement>(null);
  const { h, m, s } = useCountdown();

  const pad = (n: number) => String(n).padStart(2, '0');

  const scrollToOrder = () => {
    orderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectedPackage = PACKAGES.find((p) => p.id === selectedPkg) ?? PACKAGES[1];

  const formValid = fullName.trim() && phoneNumber.trim() && deliveryState.trim() && deliveryCity.trim() && deliveryStreet.trim();

  const buildOrderWaLink = () => {
    const pkg = selectedPackage;
    const address = `${deliveryStreet.trim()}, ${deliveryCity.trim()}, ${deliveryState.trim()}`;
    const msg = encodeURIComponent(
      `NEW ORDER — ${PRODUCT_NAME}\n\n` +
        `*Package:* ${pkg.label} Pack (${pkg.qty} bottle${pkg.qty > 1 ? 's' : ''} × 500ml)\n` +
        `*Price:* ₦${pkg.price.toLocaleString()}\n\n` +
        `*Full Name:* ${fullName.trim()}\n` +
        `*Phone Number:* ${phoneNumber.trim()}\n` +
        `*Delivery Address:* ${address}\n\n` +
        `Please confirm my order and delivery details.`
    );
    return `https://wa.me/${WA_NUMBER}?text=${msg}`;
  };

  const handleSendOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!formValid) {
      setFormError('All fields are required — package, full name, phone number, state, city and address.');
      return;
    }
    setFormError('');
    window.open(buildOrderWaLink(), '_blank', 'noopener,noreferrer');
  };

  const buildSmsContent = () => {
    const pkg = selectedPackage;
    const address = `${deliveryStreet.trim()}, ${deliveryCity.trim()}, ${deliveryState.trim()}`;
    return (
      `NEW ORDER — ${PRODUCT_NAME}\n\n` +
      `Package: ${pkg.label} Pack (${pkg.qty} bottle${pkg.qty > 1 ? 's' : ''} × 500ml)\n` +
      `Price: ₦${pkg.price.toLocaleString()}\n\n` +
      `Full Name: ${fullName.trim()}\n` +
      `Phone Number: ${phoneNumber.trim()}\n` +
      `Delivery Address: ${address}\n\n` +
      `Please confirm my order and delivery details.`
    );
  };

  const handleSendSms = async (e: FormEvent) => {
    e.preventDefault();
    if (!formValid) {
      setFormError('All fields are required — package, full name, phone number, state, city and address.');
      return;
    }
    setFormError('');
    setSmsSending(true);
    setSmsSent(false);
    setSmsError('');
    try {
      const res = await fetch('/send-sms.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: '+2348023725740',
          content: buildSmsContent(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSmsSent(true);
      } else {
        setSmsError(data.message || 'SMS failed. Please try WhatsApp or call us instead.');
      }
    } catch {
      setSmsError('Network error. Please try WhatsApp or call us instead.');
    } finally {
      setSmsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d0a] text-white font-sans overflow-x-hidden selection:bg-red-600 selection:text-white">
      {/* ── STRUCTURED DATA (FAQPage + Product) ──────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'FAQPage',
                '@id': `${LANDING_URL}#faq`,
                mainEntity: FAQS.map((faq) => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.a,
                  },
                })),
              },
              {
                '@type': 'Product',
                '@id': `${LANDING_URL}#product`,
                name: `${PRODUCT_NAME} — Bedbug & Cockroach Insecticide`,
                description: `${PRODUCT_NAME} is Nigeria's fast-acting insecticide for bedbugs, cockroaches, mosquitoes and household pests. Kills on contact with 3+ days residual protection. Available in 500ml bottles with nationwide delivery from Lagos.`,
                brand: { '@type': 'Brand', name: BRAND_NAME },
                category: 'Insecticide / Pest Control',
                image: HERO_IMG,
                offers: PACKAGES.map((pkg) => ({
                  '@type': 'Offer',
                  name: `${pkg.label} Pack — ${pkg.qty} Bottle${pkg.qty > 1 ? 's' : ''} × 500ml`,
                  price: pkg.price,
                  priceCurrency: 'NGN',
                  availability: 'https://schema.org/InStock',
                  url: LANDING_URL,
                  seller: { '@id': 'https://www.lesekeseproducts.com/#organization' },
                  priceValidUntil: '2026-12-31',
                  itemCondition: 'https://schema.org/NewCondition',
                  shippingDetails: {
                    '@type': 'OfferShippingDetails',
                    shippingDestination: {
                      '@type': 'DefinedRegion',
                      addressCountry: 'NG',
                    },
                    deliveryTime: {
                      '@type': 'ShippingDeliveryTime',
                      handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
                      transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
                    },
                  },
                })),
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.9',
                  reviewCount: '5000',
                  bestRating: '5',
                },
                review: TESTIMONIALS.slice(0, 4).map((t) => ({
                  '@type': 'Review',
                  author: { '@type': 'Person', name: t.name },
                  reviewRating: { '@type': 'Rating', ratingValue: t.stars, bestRating: 5 },
                  reviewBody: t.text,
                  locationCreated: { '@type': 'Place', name: t.city },
                })),
              },
              {
                '@type': 'HowTo',
                '@id': `${LANDING_URL}#howto`,
                name: `How to Use ${PRODUCT_NAME} — 4 Easy Steps`,
                description: `Learn how to apply ${PRODUCT_NAME} to eliminate bedbugs and cockroaches from your home in 4 simple steps.`,
                totalTime: 'PT45M',
                step: [
                  { '@type': 'HowToStep', position: 1, name: 'Remove People & Pets', text: 'Clear the room of children, pets and food items before you start spraying.' },
                  { '@type': 'HowToStep', position: 2, name: 'Spray All Hiding Spots', text: 'Focus on mattress seams, bed frame joints, wall cracks, skirting boards, sofa cushions and electrical outlet surrounds.' },
                  { '@type': 'HowToStep', position: 3, name: 'Wait 30–45 Minutes', text: 'Leave windows open for ventilation. The formula kills on contact and forms a powerful residual barrier.' },
                  { '@type': 'HowToStep', position: 4, name: 'Return to a Bug-Free Room', text: 'Re-enter your room and sleep peacefully. For heavy infestations, repeat after 7–10 days.' },
                ],
              },
            ],
          }),
        }}
      />
      {/* ── ANNOUNCEMENT BAR ────────────────────────────────────────────── */}
      <div className="bg-red-600 text-white text-center py-2 px-4 text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2">
        <Flame className="w-3.5 h-3.5 animate-pulse shrink-0" />
        <span>🚨 LIMITED STOCK — {PRODUCT_NAME} — Nigeria&apos;s #1 Bedbug &amp; Cockroach Solution</span>
        <Flame className="w-3.5 h-3.5 animate-pulse shrink-0" />
      </div>

      {/* ── LOGO HEADER ─────────────────────────────────────────────────── */}
      <header className="flex justify-center py-4 px-4 border-b border-white/5 bg-[#080d0a]">
        <img src={LOGO_URL} alt={`${BRAND_NAME} Products`} className="h-14 w-auto rounded-lg object-contain" />
      </header>

      {/* ── HERO SECTION ────────────────────────────────────────────────── */}
      <section className="relative py-10 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.18)_0%,transparent_65%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left copy */}
            <div className="order-2 md:order-1">
              <FadeIn>
                <span className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                  <AlertTriangle className="w-3 h-3" /> Are Bedbugs Stealing Your Sleep?
                </span>
              </FadeIn>
              <FadeIn delay={0.08}>
                <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4 text-white">
                  Nigeria&apos;s #1{' '}
                  <span className="text-red-500">Bedbug &amp; Cockroach Instant Killer</span>{' '}
                  <span className="font-normal">
                    — Buy {PRODUCT_NAME} in Lagos &amp; Nationwide
                  </span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.14}>
                <p className="text-slate-300 text-base md:text-lg mb-6 leading-relaxed">
                  {PRODUCT_NAME} works in <strong className="text-white">seconds</strong> — not hours. Kills bedbugs, nymphs,
                  eggs, cockroaches, mosquitoes and more.{' '}
                  <strong className="text-amber-400">3+ days residual protection</strong> so they can&apos;t come back.
                </p>
              </FadeIn>
              <FadeIn delay={0.18}>
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    { icon: ShieldCheck, label: 'Pay on Delivery' },
                    { icon: Truck, label: 'Nationwide Delivery' },
                    { icon: Star, label: '5,000+ Customers' },
                    { icon: CheckCircle2, label: 'Kills Eggs & Larvae' },
                  ].map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-slate-300"
                    >
                      <Icon className="w-3.5 h-3.5 text-green-400" /> {label}
                    </span>
                  ))}
                </div>
              </FadeIn>
              <FadeIn delay={0.22}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={scrollToOrder}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-black text-sm px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" /> Order on WhatsApp
                  </button>
                  <button
                    onClick={scrollToOrder}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-black text-sm px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" /> Order via SMS
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2 ml-1">⚡ Fast Delivery · Pay on Delivery Available in Lagos</p>
              </FadeIn>
            </div>

            {/* Right — product image */}
            <FadeIn delay={0.1} className="order-1 md:order-2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-red-600/20 rounded-full blur-3xl scale-90" />
                <img
                  src={HERO_IMG}
                  alt={`${PRODUCT_NAME} 500ml bottles`}
                  className="relative w-full max-w-xs md:max-w-sm mx-auto drop-shadow-2xl"
                  fetchPriority="high"
                  decoding="async"
                  width={800}
                  height={800}
                />
              </div>
            </FadeIn>
          </div>

          {/* Countdown timer */}
          <FadeIn delay={0.28}>
            <div className="mt-8 bg-slate-900/80 border border-red-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <Clock className="w-4 h-4" />
                <span>TODAY&apos;S PROMO ENDS IN:</span>
              </div>
              <div className="flex gap-2">
                {[pad(h), pad(m), pad(s)].map((val, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="bg-red-600 text-white font-black text-2xl px-3 py-1 rounded-lg min-w-[2.5rem] text-center tabular-nums">
                      {val}
                    </span>
                    <span className="text-slate-500 text-[10px] mt-0.5">{['HRS', 'MIN', 'SEC'][i]}</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-xs">Order before midnight to secure today&apos;s price</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── PAIN AGITATION ──────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* Left — content */}
            <div className="order-2 md:order-1">
              <FadeIn>
                <h2 className="text-2xl md:text-4xl font-black text-white mb-5 leading-tight">
                  Bedbugs &amp; Cockroaches Are Ruining Lagos Homes —{' '}
                  <span className="text-red-500">Here&apos;s the Solution</span> 😡
                </h2>
              </FadeIn>
              <FadeIn delay={0.08}>
                <p className="text-slate-300 text-base md:text-lg mb-7 leading-relaxed">
                  Imagine waking up every night covered in bites. You check your mattress seams and see them — dozens of
                  bedbugs scattering into cracks. You&apos;re too embarrassed to tell anyone. You&apos;ve tried
                  fumigators, SNIPER, local powders... nothing lasts more than a week.
                </p>
              </FadeIn>
              <div className="space-y-3">
                {[
                  {
                    emoji: '😴',
                    title: 'Sleepless Nights',
                    body: 'Itchy bites that wake you at 2AM. Red welts all over your body. Dread every time you get into bed.',
                  },
                  {
                    emoji: '😰',
                    title: 'Public Shame',
                    body: 'Too embarrassed to have visitors. Afraid a guest will see the infestation. Dragging your mattress outside in public.',
                  },
                  {
                    emoji: '💸',
                    title: 'Wasted Money',
                    body: 'Spending ₦20,000–₦50,000 on fumigators who return within 2 weeks... and the bugs always come back.',
                  },
                ].map(({ emoji, title, body }, idx) => (
                  <FadeIn key={title} delay={0.1 + idx * 0.06}>
                    <div className="flex gap-4 items-start bg-slate-900 border border-slate-700 rounded-2xl p-4">
                      <span className="text-2xl shrink-0">{emoji}</span>
                      <div>
                        <h3 className="font-bold text-white text-sm mb-1">{title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>

            {/* Right — image */}
            <FadeIn delay={0.06} className="order-1 md:order-2 flex justify-center">
              <div className="relative w-full max-w-sm md:max-w-none">
                <div className="absolute -inset-4 bg-red-600/15 rounded-3xl blur-2xl" />
                <img
                  src="https://i.ibb.co/tpt3Gp1V/Chat-GPT-Image-Sep-11-2026-12-58-57-AM-1.png"
                  alt="Bedbug and cockroach infestation in a Nigerian home"
                  className="relative w-full rounded-2xl object-cover shadow-2xl border border-red-500/20"
                />
                <div className="absolute bottom-3 left-3 bg-red-600/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                  😱 Does this look familiar?
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ── OLD WAYS FAIL ───────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-[#080d0a]">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-2">
              Why Other Bedbug Killers in Nigeria{' '}
              <span className="text-red-500">Always Fail</span>
            </h2>
            <p className="text-slate-400 text-center text-sm mb-8">The brutal truth about common pest solutions in Lagos &amp; across Nigeria</p>
          </FadeIn>
          <div className="space-y-3">
            {[
              {
                label: 'Professional Fumigators',
                why: 'Chemicals evaporate within days — eggs survive and hatch. They return, you pay again. Endless cycle.',
              },
              {
                label: 'SNIPER &amp; Baygon Sprays',
                why: 'Highly toxic fumes that endanger your family. Very short residual life, and pests develop resistance quickly.',
              },
              {
                label: 'Mosquito Coils &amp; Repellents',
                why: 'Only masks the problem temporarily. Bedbugs hide deeper and re-emerge the moment the smoke clears.',
              },
              {
                label: 'Dragging Mattress Outside',
                why: 'Public embarrassment — and the bugs in your bed frame and walls remain completely untreated.',
              },
              {
                label: 'Herbal &amp; Local Remedies',
                why: 'No scientific basis. Bedbugs laugh at camphor, kerosene and most so-called "natural" solutions.',
              },
            ].map(({ label, why }) => (
              <FadeIn key={label} delay={0.06}>
                <div className="flex gap-4 items-start bg-slate-900/60 border border-red-500/20 rounded-xl p-4">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p
                      className="font-bold text-white text-sm"
                      dangerouslySetInnerHTML={{ __html: label }}
                    />
                    <p className="text-slate-400 text-sm mt-0.5">{why}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION REVEAL ─────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(1,89,18,0.12)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="bg-green-600/20 border border-green-500/40 text-green-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
                ✅ The Real Solution
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                Introducing{' '}
                <span className="text-red-500">{PRODUCT_NAME}</span> —<br />
                The Best Bedbug &amp; Cockroach Insecticide in Nigeria
              </h2>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <FadeIn className="flex justify-center">
              <div className="relative w-full max-w-sm mx-auto">
                <div className="absolute -inset-3 bg-green-600/10 rounded-3xl blur-2xl" />
                <div className="relative w-full aspect-[9/16] max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl border border-green-500/20 bg-black">
                  <iframe
                    src="https://www.youtube.com/embed/TdwVGgQlyM8?autoplay=1&mute=1&loop=1&playlist=TdwVGgQlyM8&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1"
                    title={`${PRODUCT_NAME} — watch it kill bedbugs and cockroaches`}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-[122%]"
                  />
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="space-y-5">
                {[
                  {
                    icon: Zap,
                    color: 'text-red-400',
                    bg: 'bg-red-500/10',
                    label: 'Kills on Contact in Seconds',
                    body: 'Active formula penetrates the exoskeleton instantly — no waiting, no chasing bugs.',
                  },
                  {
                    icon: Clock,
                    color: 'text-amber-400',
                    bg: 'bg-amber-500/10',
                    label: '3+ Days Residual Protection',
                    body: 'Micro-crystallization technology keeps killing newly hatched eggs and stragglers for 72+ hours.',
                  },
                  {
                    icon: Wind,
                    color: 'text-blue-400',
                    bg: 'bg-blue-500/10',
                    label: 'Low-Odour — No Harsh Fumes',
                    body: 'Not toxic to breathe. Back in the room after just 30–45 minutes ventilation. No SNIPER-style headaches.',
                  },
                  {
                    icon: Home,
                    color: 'text-green-400',
                    bg: 'bg-green-500/10',
                    label: 'Kills ALL Life Stages',
                    body: `Adults, nymphs, eggs, larvae — ${PRODUCT_NAME} eliminates the entire bedbug lifecycle.`,
                  },
                  {
                    icon: Package,
                    color: 'text-purple-400',
                    bg: 'bg-purple-500/10',
                    label: 'Treats a Full 3-Bedroom Apartment',
                    body: '3 × 500ml bottles cover your entire home — mattress seams, wall cracks, furniture joints.',
                  },
                ].map(({ icon: Icon, color, bg, label, body }) => (
                  <div key={label} className="flex gap-4 items-start">
                    <div
                      className={`shrink-0 w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{label}</p>
                      <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-[#080d0a]">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                5,000+ Lagos &amp; Nigeria Families Trust {PRODUCT_NAME} for Bedbug Treatment
              </h2>
              <p className="text-slate-400 text-sm">Real customers across Lagos, Abuja, Enugu &amp; Port Harcourt. Zero paid reviews.</p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.06}>
                <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-5 flex flex-col gap-3 h-full">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.city}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO USE ──────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                How to Use {PRODUCT_NAME} — 4 Easy Steps to a <span className="text-green-400">Bug-Free Home</span>
              </h2>
              <p className="text-slate-400 text-sm">No professional fumigator needed. Anyone in Lagos can do this in one afternoon.</p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left — steps */}
            <div className="space-y-5">
              {[
                {
                  step: 1,
                  title: 'Remove People &amp; Pets',
                  body: 'Clear the room of children, pets and food items before you start spraying.',
                },
                {
                  step: 2,
                  title: 'Spray All Hiding Spots',
                  body: 'Focus on mattress seams, bed frame joints, wall cracks, skirting boards, sofa cushions and electrical outlet surrounds. Bedbugs hide in gaps as small as 1mm!',
                },
                {
                  step: 3,
                  title: 'Wait 30–45 Minutes',
                  body: 'Leave windows open for ventilation. The formula kills on contact and forms a powerful residual barrier without any harsh lingering odour.',
                },
                {
                  step: 4,
                  title: 'Return to a Bug-Free Room',
                  body: 'Re-enter your room and sleep peacefully. For heavy infestations, repeat after 7–10 days to eliminate any newly hatched nymphs.',
                },
              ].map(({ step, title, body }) => (
                <FadeIn key={step} delay={step * 0.08}>
                  <div className="flex gap-5 items-start">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-red-600 text-white font-black flex items-center justify-center text-sm">
                      {step}
                    </div>
                    <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-4 flex-1">
                      <p
                        className="font-bold text-white mb-1"
                        dangerouslySetInnerHTML={{ __html: title }}
                      />
                      <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Right — image */}
            <FadeIn delay={0.1} className="flex justify-center">
              <div className="relative w-full max-w-sm md:max-w-none">
                <div className="absolute -inset-4 bg-green-600/15 rounded-3xl blur-2xl" />
                <img
                  src="https://i.ibb.co/3m6SSFYM/Buy-Lesekese-Bedbugs-and-Cockroaches-Instant-Killer.jpg"
                  alt={`How to use ${PRODUCT_NAME} — application steps`}
                  className="relative w-full rounded-2xl object-cover shadow-2xl border border-green-500/20"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── PRICING PACKAGES ────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-[#080d0a]">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
                🔥 Limited Time Promo Price
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                {PRODUCT_NAME} Price in Nigeria — Choose Your Package &amp; Order via WhatsApp
              </h2>
              <p className="text-slate-400 text-sm">
                Pay on Delivery available in Lagos. Fast nationwide shipping across Nigeria 🚚
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PACKAGES.map((pkg, i) => (
              <FadeIn key={pkg.id} delay={i * 0.07}>
                <div
                  className={`relative rounded-2xl border flex flex-col overflow-hidden transition-all duration-200 h-full ${
                    pkg.highlight
                      ? 'border-red-500 bg-gradient-to-b from-red-950/60 to-slate-900 shadow-[0_0_30px_rgba(220,38,38,0.25)]'
                      : 'border-slate-700/60 bg-slate-900'
                  }`}
                >
                  {pkg.badge && (
                    <div
                      className={`text-center text-xs font-black py-1.5 px-3 tracking-widest uppercase ${
                        pkg.highlight ? 'bg-red-600' : 'bg-amber-500'
                      } text-white`}
                    >
                      {pkg.badge}
                    </div>
                  )}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">{pkg.label}</p>
                      <p className="text-white font-black text-lg mt-1">
                        {pkg.qty} Bottle{pkg.qty > 1 ? 's' : ''} × 500ml
                      </p>
                    </div>
                    <div className="my-1">
                      {pkg.savings && (
                        <p className="text-slate-500 line-through text-sm">
                          ₦{(pkg.qty * 9000).toLocaleString()}
                        </p>
                      )}
                      <p className="text-3xl font-black text-white">₦{pkg.price.toLocaleString()}</p>
                      {pkg.savings && (
                        <span className="inline-block bg-green-600/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full mt-1">
                          Save ₦{pkg.savings.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed flex-1">{pkg.desc}</p>

                    <div className="space-y-1.5">
                      {[
                        `${pkg.qty} × ${PRODUCT_NAME} 500ml Bottle${pkg.qty > 1 ? 's' : ''}`,
                        'Kills Bedbugs on Contact',
                        '3-Day Residual Protection',
                        pkg.qty >= 3 ? '✅ Full Apartment Fumigation' : '✅ Room-by-Room Treatment',
                        'Pay on Delivery (Lagos)',
                      ].map((feat) => (
                        <div key={feat} className="flex items-center gap-1.5 text-slate-300 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => { setSelectedPkg(pkg.id); scrollToOrder(); }}
                      className={`mt-auto w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-sm transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer ${
                        pkg.highlight
                          ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                          : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Order on WhatsApp
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.2}>
            <div className="mt-8 flex flex-wrap justify-center gap-5 text-slate-400 text-xs text-center">
              {[
                { icon: '🛡️', label: 'Satisfaction Guarantee' },
                { icon: '🚚', label: 'Nationwide Delivery' },
                { icon: '💳', label: 'Pay on Delivery (Lagos)' },
                { icon: '✅', label: '5,000+ Customers Served' },
                { icon: '⚡', label: 'Fast Dispatch 24–48hr' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="text-base">{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── ORDER SECTION ───────────────────────────────────────────────── */}
      <section ref={orderRef} id="order" className="py-14 px-4 bg-slate-950">
        <div className="max-w-xl mx-auto">
          <FadeIn>
            <div className="text-center mb-8">
              <span className="bg-green-600/20 border border-green-500/40 text-green-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
                🛒 Place Your Order
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                Buy {PRODUCT_NAME} Now — Pay on Delivery in Lagos
              </h2>
              <p className="text-slate-400 text-sm">
                Fill in your details, select your package, and we&apos;ll confirm your order via WhatsApp within minutes. Nationwide delivery.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6 space-y-5">
              {/* Order form */}
              <form onSubmit={handleSendOrder} className="space-y-5">
                {/* Package selector */}
                <div>
                  <label className="block text-white font-bold text-sm mb-2">
                    Select Your Package <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PACKAGES.map((pkg) => (
                      <button
                        type="button"
                        key={pkg.id}
                        onClick={() => setSelectedPkg(pkg.id)}
                        className={`text-left p-3 rounded-xl border text-xs transition-all duration-150 ${
                          selectedPkg === pkg.id
                            ? 'border-red-500 bg-red-600/20 text-white'
                            : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        <p className="font-bold">{pkg.label} Pack</p>
                        <p className="text-[10px] opacity-70 mt-0.5">
                          {pkg.qty} bottle{pkg.qty > 1 ? 's' : ''} — ₦{pkg.price.toLocaleString()}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Full name */}
                <div>
                  <label htmlFor="order-name" className="block text-white font-bold text-sm mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="order-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Adaeze Okafor"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all"
                  />
                </div>

                {/* Phone number */}
                <div>
                  <label htmlFor="order-phone" className="block text-white font-bold text-sm mb-2">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="order-phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 0803 123 4567"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all"
                  />
                </div>

                {/* Delivery address */}
                <div>
                  <label className="block text-white font-bold text-sm mb-2">
                    Delivery Address
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label htmlFor="order-state" className="block text-slate-400 text-xs mb-1">
                        State <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="order-state"
                        type="text"
                        value={deliveryState}
                        onChange={(e) => setDeliveryState(e.target.value)}
                        placeholder="e.g. Lagos"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="order-city" className="block text-slate-400 text-xs mb-1">
                        City <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="order-city"
                        type="text"
                        value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)}
                        placeholder="e.g. Ikeja"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all"
                      />
                    </div>
                  </div>
                  <label htmlFor="order-address" className="block text-slate-400 text-xs mb-1">
                    Street Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="order-address"
                    type="text"
                    value={deliveryStreet}
                    onChange={(e) => setDeliveryStreet(e.target.value)}
                    placeholder="e.g. No. 12 Adebayo Street"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all"
                  />
                </div>

                {formError && (
                  <p className="text-red-400 text-sm font-semibold" role="alert">
                    {formError}
                  </p>
                )}

                {/* Send order */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                  <p className="text-slate-400 text-xs mb-3 leading-relaxed">
                    Clicking &quot;Send Order&quot; opens WhatsApp with your order details pre-filled.
                    Just hit send and our team will confirm your delivery!
                  </p>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-black text-base px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Send Order via WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={handleSendSms}
                    disabled={smsSending}
                    className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-base px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer mt-3"
                  >
                    <MessageSquare className="w-5 h-5" />
                    {smsSending ? 'Sending SMS...' : 'Order via SMS'}
                  </button>

                  {smsSent && (
                    <p className="text-green-400 text-sm font-semibold mt-2" role="status">
                      Order sent via SMS! We&apos;ll call you to confirm delivery.
                    </p>
                  )}
                  {smsError && (
                    <p className="text-red-400 text-sm font-semibold mt-2" role="alert">
                      {smsError}
                    </p>
                  )}
                  <p className="text-slate-500 text-xs mt-2">
                    Selected:{' '}
                    <strong className="text-white">
                      {selectedPackage.label} Pack — ₦{selectedPackage.price.toLocaleString()}
                    </strong>
                  </p>
                </div>
              </form>

              {/* Call option */}
              <div className="text-center">
                <p className="text-slate-500 text-xs mb-2">— OR CALL US DIRECTLY —</p>
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all"
                >
                  <Phone className="w-4 h-4 text-green-400" />
                  {PHONE_NUMBER}
                </a>
              </div>

              {/* Guarantee */}
              <div className="flex items-center gap-3 bg-green-600/10 border border-green-500/30 rounded-xl p-3">
                <ShieldCheck className="w-8 h-8 text-green-400 shrink-0" />
                <div>
                  <p className="text-green-400 font-bold text-xs">Satisfaction Guaranteed</p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    If {PRODUCT_NAME} doesn&apos;t work as described, contact us within 7 days and we&apos;ll make it right.
                    Zero risk to you.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-[#080d0a]">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-8">
              Frequently Asked Questions — {PRODUCT_NAME} Nigeria
            </h2>
          </FadeIn>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-3 p-4 text-left"
                  >
                    <span className="font-bold text-white text-sm pr-2">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="text-slate-400 text-sm px-4 pb-4 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── URGENCY FOOTER ──────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-red-950/40 border-t border-red-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.1)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <FadeIn>
            <div className="text-5xl mb-4">🚨</div>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight">
              Don&apos;t Sleep With Bedbugs in Lagos One More Night
            </h2>
            <img
              src="https://i.ibb.co/dJQ2rXSC/Buy-Lesekese-Bedbugs-and-Cockroaches-Instant-Killer-1.jpg"
              alt={`Stop sleeping with bedbugs — order ${PRODUCT_NAME} now`}
              className="w-full max-w-lg mx-auto rounded-2xl object-cover shadow-2xl border border-red-500/20 mb-6"
            />
            <p className="text-slate-300 text-base mb-8 leading-relaxed">
              Every night you wait is another night of bites, itching, and shame. {PRODUCT_NAME} is in stock{' '}
              <strong className="text-amber-400">right now</strong> — but promo pricing ends at midnight.
              Order in the next few minutes and stop the suffering today.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={scrollToOrder}
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black text-lg px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-200 hover:scale-[1.03] active:scale-95 fire-glow cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                ORDER NOW
              </button>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base px-6 py-4 rounded-2xl transition-all"
              >
                <Phone className="w-5 h-5" />
                Call {PHONE_NUMBER}
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={0.18}>
            <p className="text-slate-500 text-xs mt-6">
              © {new Date().getFullYear()} LESEKESE Products Nigeria · Fagba, Lagos ·{' '}
              <a href="/" className="underline hover:text-slate-300 transition-colors">
                Visit Main Website
              </a>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── STICKY MOBILE CTA ───────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-950/95 backdrop-blur border-t border-slate-800 px-3 py-2 flex gap-2">
        <button
          onClick={scrollToOrder}
          className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 text-white font-bold text-xs py-2.5 rounded-lg shadow-[0_0_12px_rgba(220,38,38,0.3)] active:scale-95 transition-transform cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5" /> Order Now
        </button>
        <button
          onClick={scrollToOrder}
          className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500 text-white font-bold text-xs py-2.5 rounded-lg shadow-[0_0_12px_rgba(245,158,11,0.25)] active:scale-95 transition-transform cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" /> SMS Order
        </button>
      </div>

      {/* Bottom padding for mobile sticky bar */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
