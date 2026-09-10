import { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, ShieldCheck, Zap, ArrowRight, Award, CheckCircle2, MapPin, PhoneCall, Sparkles, Building2, Star, Users, HandCoins, Store } from 'lucide-react';
import { PRODUCTS, LOCATIONS } from '../data/mockData';
import { ProductBottleGraphic } from '../components/ProductBottleGraphic';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenOrderModal: (sizeMl?: number) => void;
}

export function HomePage({ onNavigate, onOpenOrderModal }: HomePageProps) {
  const [selectedHeroSize, setSelectedHeroSize] = useState<number | null>(null);

  return (
    <div className="space-y-12 lg:space-y-20 pt-28 sm:pt-36 lg:pt-40">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[calc(100dvh-5rem)] lg:min-h-[85vh] flex flex-col justify-center overflow-hidden">
        {/* Background Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-500/15 rounded-full blur-3xl pointer-events-none fire-glow" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full pt-4 pb-2 sm:py-6 lg:py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            
            {/* Product Visual (Mobile First - Order 1 on mobile, Order 2 on desktop) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2"
            >
              <ProductBottleGraphic sizeMl={selectedHeroSize} />

              {/* Size Selector Tabs directly after hero image */}
              <div className="w-full max-w-xs sm:max-w-sm mt-0 sm:mt-1 mb-2 sm:mb-3 px-1 sm:px-2">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className="text-[11px] sm:text-xs font-accent font-bold uppercase tracking-wider text-amber-600">
                    Select Bottle Size Preview:
                  </span>
                  {selectedHeroSize !== null && (
                    <button
                      onClick={() => setSelectedHeroSize(null)}
                      className="text-[10px] sm:text-[11px] text-slate-500 hover:text-amber-600 underline cursor-pointer"
                    >
                      Show All 3
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full">
                  {[
                    { size: 500, label: '500ml' },
                    { size: 250, label: '250ml' },
                    { size: 100, label: '100ml' }
                  ].map((item) => (
                    <button
                      key={item.size}
                      onClick={() => setSelectedHeroSize(selectedHeroSize === item.size ? null : item.size)}
                      className={`py-1.5 sm:py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        selectedHeroSize === item.size
                          ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white border border-red-400 shadow-lg shadow-red-600/40 ring-2 ring-red-500/30'
                          : 'glass-pill text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Market Depot Callout */}
              <div className="mt-1 sm:mt-2 glass-card p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-red-500/30 max-w-xs sm:max-w-sm text-center">
                <div className="text-[11px] sm:text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Fagba Main Depot HQ
                </div>
                <p className="text-[10px] sm:text-xs text-slate-600 mt-0.5 sm:mt-1">
                  Suite 2 Adedoja Plaza, Fagba Railway (beside Bokku), Lagos. Wholesale & Retail in stock.
                </p>
              </div>
            </motion.div>

            {/* Hero Text Content (Order 2 on mobile, Order 1 on desktop) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 order-2 lg:order-1"
            >
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-red-500/40 text-xs font-bold text-red-600 uppercase tracking-widest shadow-lg">
                <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>Nigeria’s #1 Instant Insecticide Formula</span>
              </div>

              {/* Main Display Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-slate-900 tracking-tight leading-[0.95]">
                HOTTER THAN FIRE.<br />
                <span className="bg-gradient-to-r from-red-500 via-amber-400 to-red-600 bg-clip-text text-transparent">
                  TOUGHER THAN PESTS.
                </span>
              </h1>

              {/* Subheadline Copy */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Rapid-action spray formula engineered to kill bedbugs, bedbug larvae, German cockroaches, and household insects on contact. Engineered with 3+ days active residual protection.
              </p>

              {/* Call-To-Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <button
                  onClick={() => onOpenOrderModal(selectedHeroSize || 500)}
                  className="py-4 px-8 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white font-accent font-bold text-sm uppercase tracking-wider shadow-2xl shadow-red-600/40 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 fill-white" />
                  <span>Order Now (Fast Dispatch)</span>
                </button>

                <button
                  onClick={() => onNavigate('/locations')}
                  className="py-4 px-6 rounded-2xl glass-pill text-slate-800 font-accent font-bold text-sm hover:border-red-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <span>Find Abule Egba & Stores</span>
                </button>
              </div>

              {/* Feature Pills */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Instant Nerve Knockdown</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Dehydration Technology</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>3+ Days Residual Shield</span>
                </div>
              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= TRUST STATS BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 rounded-3xl border border-red-500/20 bg-gradient-to-r from-white via-slate-50 to-red-50 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-wider">
              350,000+
            </div>
            <p className="text-xs text-red-600 font-accent uppercase font-bold">Bottles Distributed</p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-wider">
              99.4%
            </div>
            <p className="text-xs text-red-600 font-accent uppercase font-bold">Pest Knockdown Rate</p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-wider">
              2,400+
            </div>
            <p className="text-xs text-red-600 font-accent uppercase font-bold">Retail Partners in Nigeria</p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-wider">
              3+ DAYS
            </div>
            <p className="text-xs text-red-600 font-accent uppercase font-bold">Active Residual Barrier</p>
          </div>
        </div>
      </section>

      {/* ================= PRODUCT RANGE SHOWCASE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-xs font-bold text-amber-600 uppercase tracking-widest">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>Product Catalog</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
            AVAILABLE IN THREE CONVENIENT SIZES
          </h2>
          <p className="text-sm text-slate-500">
            Choose the exact volume needed for your room, hotel, or wholesale distribution requirement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOrder={(p) => onOpenOrderModal(p.sizeMl)}
              onLocateStore={() => onNavigate('/locations')}
            />
          ))}
        </div>
      </section>

      {/* ================= FEATURED BRAND BANNERS SHOWCASE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-xs font-bold text-amber-600 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Product Highlights</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            THE POWER OF LESEKESE IN ACTION
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Banner 1 */}
          <div className="group relative rounded-3xl overflow-hidden border border-brand bg-white/90 shadow-2xl hover:border-brand transition-all duration-300 flex flex-col justify-between">
            <div className="w-full relative overflow-hidden bg-slate-100 flex items-center justify-center">
              <img
                src="https://i.ibb.co/gFtmPNLB/Lesekese-banners-1.jpg"
                alt="LESEKESE Formula Banner 1"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-500 block"
              />
            </div>
            <div className="p-4 sm:p-5 bg-gradient-to-t from-white via-white/95 to-transparent border-t border-slate-100 flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-accent font-bold uppercase tracking-widest text-amber-600">
                  Fast Knockdown Formula
                </span>
                <h3 className="text-base sm:text-lg font-display font-bold text-slate-900">
                  Instant Elimination for Bedbugs & Insects
                </h3>
              </div>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="group relative rounded-3xl overflow-hidden border border-brand bg-white/90 shadow-2xl hover:border-brand transition-all duration-300 flex flex-col justify-between">
            <div className="w-full relative overflow-hidden bg-slate-100 flex items-center justify-center">
              <img
                src="https://i.ibb.co/kWsG7Lt/Lesekese-banners.jpg"
                alt="LESEKESE Formula Banner 2"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-500 block"
              />
            </div>
            <div className="p-4 sm:p-5 bg-gradient-to-t from-white via-white/95 to-transparent border-t border-slate-100 flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-accent font-bold uppercase tracking-widest text-red-600">
                  Long-Lasting Residual Protection
                </span>
                <h3 className="text-base sm:text-lg font-display font-bold text-slate-900">
                  Complete Household & Commercial Defense
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DISTRIBUTOR & STORE LOCATOR SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-brand bg-gradient-to-br from-white via-slate-50 to-red-50 overflow-hidden shadow-2xl p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Image Showcase */}
            <div className="lg:col-span-5 relative group rounded-2xl overflow-hidden border border-brand shadow-xl">
              <img
                src="https://i.ibb.co/9m1PXhGw/Lesekese-1.jpg"
                alt="LESEKESE Distributor Products"
                referrerPolicy="no-referrer"
                className="w-full h-64 sm:h-80 lg:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-60" />
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-accent font-bold flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Wholesale & Retail Network</span>
              </div>
            </div>

            {/* Content & Call to Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-xs font-bold text-amber-600 uppercase tracking-widest">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  <span>Authorized Distributors Across Nigeria</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                  BECOME A DISTRIBUTOR OR FIND A STORE NEAR YOU
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Join hundreds of chemical shops, supermarkets, and pest control distributors stocking Nigeria’s fastest-selling insect elimination formula. Direct factory dispatch available from our Fagba Lagos depot (Suite 2 Adedoja Plaza).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                <div className="flex items-center gap-2 bg-white/80 p-3 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>High Profit Wholesale Margins</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 p-3 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Fast Nationwide Delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 p-3 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Original Certified Formula</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 p-3 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Marketing Support & POS Display</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => onNavigate('/locations')}
                  className="py-4 px-8 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white font-accent font-bold text-sm uppercase tracking-wider shadow-xl shadow-red-600/30 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Locate Nearest Store or Distributor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS MECHANISM ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-xs font-bold text-red-600 uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Fast Action Mechanism</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
            WHY LESEKESE OUTPERFORMS REGULAR SPRAYS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: '1. Direct Target Spray',
              desc: 'Spray directly on bed frames, mattress seams, sofa joints, wall cracks, and cockroach hideouts.'
            },
            {
              step: '02',
              title: '2. Rapid Nerve Attack',
              desc: 'Active agents penetrate insect chitin within seconds, immobilizing adults and nymphs on contact.'
            },
            {
              step: '03',
              title: '3. Dehydration Tech',
              desc: 'Breaks down the waxy protective cuticle layer of bugs and egg sacs, causing total desiccation.'
            },
            {
              step: '04',
              title: '4. 3+ Days Residual Barrier',
              desc: 'Micro-crystalline residual film stays active for 72+ hours to catch late-blooming insects.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-3xl border border-slate-200 hover:border-red-500/40 transition-all space-y-3"
            >
              <div className="text-3xl font-display font-bold text-red-500">{item.step}</div>
              <h3 className="text-lg font-accent font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('/how-it-works')}
            className="py-3 px-8 rounded-2xl glass-pill text-slate-700 font-accent font-bold text-xs uppercase tracking-wider hover:border-red-500 hover:text-red-600 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Learn Full Application & FAQ</span>
            <ArrowRight className="w-4 h-4 text-amber-600" />
          </button>
        </div>
      </section>

      {/* ================= JOIN THE LESEKESE FAMILY (EARN) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          {/* Image (shown in full, not cropped) */}
          <div className="relative bg-slate-100 flex items-center justify-center">
            <img
              src="https://i.ibb.co/gbH2yzrP/Lesekese-banners-3.jpg"
              alt="Join the LESEKESE family and earn as a distributor"
              loading="lazy"
              className="w-full h-auto object-contain p-4 sm:p-8"
            />
          </div>

          {/* Earn content */}
          <div className="p-8 md:p-12 space-y-6 bg-gradient-to-br from-white via-red-50 to-amber-50">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-xs font-bold text-red-600 uppercase tracking-widest border border-red-500/30">
              <HandCoins className="w-3.5 h-3.5 text-amber-600" />
              <span>Earn With LESEKESE</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
                JOIN THE LESEKESE FAMILY & TURN EVERY SALE INTO INCOME
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether you run a market stall, a chemist, or an online store, becoming an authorized LESEKESE reseller gives you the margin, stock supply, and brand power to grow your business.
              </p>
            </div>

            <ul className="space-y-4">
              {[
                {
                  icon: <HandCoins className="w-5 h-5 text-amber-600 shrink-0" />,
                  title: 'Wholesale Margin Benefits',
                  desc: 'Buy in bulk cartons at up to 15% off and resell at retail rates for steady profit on every bottle.'
                },
                {
                  icon: <Store className="w-5 h-5 text-red-500 shrink-0" />,
                  title: 'Marketing & Brand Support',
                  desc: 'Receive promotional flyers, WhatsApp graphics, and verified store listings that drive customers to you.'
                },
                {
                  icon: <Users className="w-5 h-5 text-emerald-600 shrink-0" />,
                  title: 'Priority Nationwide Supply',
                  desc: 'Fast refills from our Fagba Main Depot with priority dispatch to Abuja, Port Harcourt, and all states.'
                }
              ].map((item, idx) => (
                <li key={idx} className="glass-pill p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <strong className="block text-sm font-accent font-bold text-slate-900">{item.title}</strong>
                    <span className="text-xs text-slate-600 leading-relaxed">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigate('/contact')}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-accent font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Become a Distributor
              </button>
              <button
                onClick={() => onNavigate('/locations')}
                className="py-3 px-6 rounded-xl glass-pill text-slate-700 font-accent font-bold text-xs uppercase tracking-wider border border-slate-300 hover:border-red-500 hover:text-red-600 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Find a Store Near You</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VERIFIED REVIEWS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-xs font-bold text-amber-600 uppercase tracking-widest">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Customer Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
            TRUSTED BY HOMEOWNERS & HOTELS ACROSS NIGERIA
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Alhaji Rasheed K.',
              role: 'Hostel Manager, Fagba',
              text: 'We suffered bedbug complaints for 3 months in our student lodge. One carton of 500ml LESEKESE wiped out the bedbugs in 24 hours. No re-infestation since!'
            },
            {
              name: 'Dr. (Mrs) Chidimma N.',
              role: 'Homeowner, Surulere',
              text: 'I bought the 250ml size at Abule Egba market. Sprayed my bed frames and mattress joints. Cockroaches and bedbugs dropped immediately. Very effective formula.'
            },
            {
              name: 'Mallam Ibrahim B.',
              role: 'Chemical Retailer, Wuse II Abuja',
              text: 'LESEKESE is my fastest-selling pest spray. Customers keep coming back to request it by name because it actually works on tough German cockroaches.'
            }
          ].map((rev, i) => (
            <div key={i} className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "{rev.text}"
              </p>
              <div className="pt-2 border-t border-slate-200">
                <div className="font-accent font-bold text-sm text-slate-900">{rev.name}</div>
                <div className="text-[11px] text-amber-600">{rev.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FINAL CTA CALLOUT ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative glass-card rounded-3xl border border-red-500/60 bg-gradient-to-br from-white via-red-50 to-amber-50 overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="p-10 md:p-16 space-y-4 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 tracking-tight">
              SAY GOODBYE TO BEDBUGS & COCKROACHES TODAY
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Get LESEKESE delivered to your home or visit our Fagba Main Depot (Suite 2 Adedoja Plaza, beside Bokku) and verified stores across Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 pt-4">
              <button
                onClick={() => onOpenOrderModal(500)}
                className="py-4 px-8 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-accent font-bold text-sm uppercase tracking-wider shadow-lg shadow-red-600/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Order Direct Now
              </button>
              <a
                href="tel:08023725740"
                className="py-4 px-8 rounded-2xl bg-white border-2 border-red-500/50 text-red-600 font-accent font-bold text-sm hover:border-red-500 hover:bg-red-50 flex items-center gap-2 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-amber-600" />
                <span>Call Dispatch: 08023725740</span>
              </a>
            </div>
          </div>

          <div className="relative bg-slate-100 flex items-center justify-center min-h-[240px] lg:min-h-full">
            <img
              src="https://i.ibb.co/tpCFTmL0/Lesekese-banners-6.jpg"
              alt="LESEKESE instant killer spray for bedbugs and cockroaches"
              loading="lazy"
              className="w-full h-auto object-contain p-4 sm:p-8"
            />
          </div>
        </div>
      </section>

      {/* ================= LESEKESE SEND OFF SPOTLIGHT ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Left Column — Hero Image */}
            <div className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 flex items-center justify-center min-h-[340px] lg:min-h-full overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-teal-400/15 rounded-full blur-2xl" />
              </div>
              <img
                src="https://i.ibb.co/0Rwr9sPR/Whats-App-Image-2026-08-31-at-12-19-47-PM.jpg"
                alt="LESEKESE SEND OFF - Snakes and Scorpions Repellent Powder"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="relative z-10 w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-4 left-4 z-20 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-accent font-bold flex items-center gap-2">
                <span>🐍</span>
                <span>Snakes &amp; Scorpions Repellent Powder</span>
              </div>
            </div>

            {/* Right Column — Content */}
            <div className="p-8 md:p-12 space-y-6 bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/30">

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 uppercase tracking-widest border border-emerald-300/60">
                <span>🆕</span>
                <span>New Product — Now Available</span>
              </div>

              <div className="space-y-1">
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                  LESEKESE SEND OFF
                </h2>
                <p className="text-sm font-accent font-semibold text-emerald-600 uppercase tracking-wide">
                  250g · Snakes &amp; Scorpions Repellent Powder
                </p>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-display font-bold text-amber-600">₦6,000</span>
                <span className="text-xs bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded border border-red-200">Retail Price</span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                LESEKESE SEND OFF is a specially formulated deterrent designed to create a powerful
                protective barrier against snakes, scorpions, reptiles and other unwanted crawling pests.
                Its active repellent action produces an unpleasant smell and disturbing effect that
                helps discourage reptiles from entering or remaining in treated areas — for up to{' '}
                <strong className="text-slate-900">3 weeks</strong> per application.
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: '🐍', label: 'Repels Snakes & Reptiles' },
                  { icon: '🦂', label: 'Repels Scorpions' },
                  { icon: '🏡', label: 'Homes, Farms & Offices' },
                  { icon: '⏱️', label: 'Up to 3 Weeks Protection' },
                  { icon: '🌿', label: 'Outdoor Perimeter Safe' },
                  { icon: '✅', label: 'Tested & Confirmed' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/80 border border-emerald-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700">
                    <span className="text-base leading-none">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-accent font-bold text-slate-700 uppercase tracking-wider">
                  Suitable for Use Around:
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Homes, offices, farms, stores, compounds and outdoor areas where reptile and pest
                  activity is a concern. Sprinkle evenly around perimeters, entrances, boundaries
                  and storage areas. Reapply after heavy rain for continuous protection.
                </p>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                <span className="text-base leading-none shrink-0">⚠️</span>
                <span>
                  <strong>Warning:</strong> Keep out of reach of children. Avoid breathing dust. Avoid
                  contact with eyes, skin and clothing. Do not eat, drink or smoke while handling.
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenOrderModal()}
                  className="py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 text-white font-accent font-bold text-sm uppercase tracking-wider shadow-xl shadow-emerald-600/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>🛒</span>
                  <span>Order SEND OFF Now</span>
                </button>
                <button
                  onClick={() => onNavigate('/products')}
                  className="py-4 px-6 rounded-2xl glass-pill text-slate-700 font-accent font-bold text-sm hover:border-emerald-500 hover:text-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                  <span>See Full Product Details</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                Manufactured by LESEKESE ALLIED PRODUCTS INDUSTRIES
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
