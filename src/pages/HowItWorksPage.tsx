import { useState } from 'react';
import { FAQS } from '../data/mockData';
import { Flame, Zap, ShieldCheck, ChevronDown, Search, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HowItWorksPageProps {
  onNavigate: (path: string) => void;
  onOpenOrderModal: (sizeMl?: number) => void;
}

export function HowItWorksPage({ onNavigate, onOpenOrderModal }: HowItWorksPageProps) {
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQS[0].id);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');

  const categories = ['All', 'Safety', 'Efficacy', 'Application', 'Ordering', 'Storage', 'Send Off'];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCat = activeFaqCategory === 'All' || faq.category === activeFaqCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-20 pt-28 sm:pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-brand shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://i.ibb.co/j9VDxGwf/Lesekese-banners-5.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-slate-950/30" />
        <div className="relative max-w-3xl mx-auto text-center space-y-4 px-6 py-20 md:py-28">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950/50 backdrop-blur-md text-xs font-bold text-amber-300 uppercase tracking-widest border border-amber-400/40">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Scientific Action & Safety Guide</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-white tracking-tight drop-shadow-lg">
            HOW LESEKESE ERADICATES PESTS
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed drop-shadow">
            Learn how our fast-acting knockdown formula disrupts insect nervous systems and dehydrates bedbugs and cockroaches on contact — and how LESEKESE SEND OFF creates an unbeatable reptile barrier around your home.
          </p>
        </div>
      </section>

      {/* ================= 4-STEP TIMELINE ================= */}
      <div className="space-y-8">
        <h2 className="text-2xl font-display font-bold text-slate-900 tracking-wide text-center">
          4-STEP TOTAL FUMIGATION PROCESS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              step: 'Step 1',
              title: 'Targeted Application',
              badge: 'Preparation',
              desc: 'Shake bottle thoroughly. Spray directly onto bed frame joints, wooden slats, mattress seams, sofa crevices, wall cracks, and dark kitchen corners where pests hide.'
            },
            {
              step: 'Step 2',
              title: 'Immediate Knockdown',
              badge: 'First 30 Seconds',
              desc: 'Active agents penetrate insect cuticle chitin within seconds, triggering rapid nerve disruption. Adult bedbugs and cockroaches drop and stop moving almost instantly.'
            },
            {
              step: 'Step 3',
              title: 'Desiccation & Larvae Breakdown',
              badge: 'Desiccation Tech',
              desc: 'LESEKESE breaks down the protective waxy outer coating of insects and egg sacs, forcing moisture depletion and complete dehydration.'
            },
            {
              step: 'Step 4',
              title: '3+ Days Residual Barrier',
              badge: '72+ Hour Protection',
              desc: 'Micro-crystalline residues remain active on sprayed surfaces for 3+ days, catching newly hatched nymphs and late-emerging pests.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-8 rounded-3xl border border-slate-200 space-y-4 relative overflow-hidden group hover:border-red-500/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-display font-bold text-red-500">{item.step}</span>
                <span className="glass-pill px-3 py-1 rounded-full text-[10px] font-accent font-bold uppercase text-amber-700 border border-amber-400/40">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-xl font-accent font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SEND OFF USAGE GUIDE ================= */}
      <div className="glass-card p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/30 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl">🐍</div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700 uppercase tracking-widest border border-emerald-300/60 mb-1">
              NEW PRODUCT
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900 tracking-wide">
              HOW TO USE LESEKESE SEND OFF
            </h2>
            <p className="text-xs text-emerald-600 font-medium">Snakes &amp; Scorpions Repellent Powder — 250g</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Steps */}
          <div className="space-y-4">
            <h3 className="text-sm font-accent font-bold text-slate-900 uppercase tracking-wider">Application Steps:</h3>
            {[
              { step: '01', title: 'Identify the Perimeter', desc: 'Walk around your home, farm, or compound and identify all entry points — doorways, wall edges, drains, fence bases, storage room entrances, and outdoor paths.' },
              { step: '02', title: 'Sprinkle the Powder', desc: 'Sprinkle LESEKESE SEND OFF evenly on the ground around the perimeter, concentrating on areas of reptile activity or entry. No mixing, no sprayer needed.' },
              { step: '03', title: 'Create a Continuous Barrier', desc: 'Ensure the powder forms an unbroken line around the area requiring protection. Do not leave gaps — snakes and scorpions will find and exploit any opening.' },
              { step: '04', title: 'Reapply as Needed', desc: 'The repellent barrier lasts up to 3 weeks. After heavy rain or when effectiveness reduces, reapply to maintain full protection.' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-display font-bold text-sm flex items-center justify-center shrink-0">{item.step}</div>
                <div>
                  <h4 className="font-accent font-bold text-sm text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Safety & Where to use */}
          <div className="space-y-4">
            <h3 className="text-sm font-accent font-bold text-slate-900 uppercase tracking-wider">Best Use Locations:</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: '🏡', label: 'Home Compounds' },
                { icon: '🌾', label: 'Farms & Plantations' },
                { icon: '🏢', label: 'Offices & Stores' },
                { icon: '🏚️', label: 'Storage Areas' },
                { icon: '🔒', label: 'Fence Perimeters' },
                { icon: '🚪', label: 'Doorways & Entrances' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/80 border border-emerald-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700">
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs text-amber-800">
              <p className="font-bold uppercase tracking-wide">⚠️ Safety Precautions:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Keep out of reach of children</li>
                <li>Avoid breathing dust during application</li>
                <li>Do not apply to food, water, animals, or people</li>
                <li>Wash hands thoroughly after use</li>
                <li>Keep pets away from freshly treated areas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SAFETY PRECAUTIONS CALLOUT ================= */}
      <div className="glass-card p-8 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-50 via-white to-white space-y-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
          <div>
            <h3 className="text-xl font-display font-bold text-slate-900 tracking-wide">
              SAFETY & VENTILATION GUIDELINES
            </h3>
            <p className="text-xs text-amber-700 font-medium">
              Please follow these safe handling steps during residential application
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 pt-2">
          <div className="glass-pill p-4 rounded-2xl space-y-1">
            <strong className="text-slate-900 block">1. Ventilate Room:</strong>
            <span>Keep windows open during and after spraying for 30–45 minutes until dry.</span>
          </div>

          <div className="glass-pill p-4 rounded-2xl space-y-1">
            <strong className="text-slate-900 block">2. Avoid Food Contact:</strong>
            <span>Do not spray directly on foodstuffs or open dining utensils. Cover food items.</span>
          </div>

          <div className="glass-pill p-4 rounded-2xl space-y-1">
            <strong className="text-slate-900 block">3. Keep Away From Children:</strong>
            <span>Store spray bottle sealed in a cool, dry place out of reach of young children and pets.</span>
          </div>
        </div>
      </div>

      {/* ================= SEARCHABLE FAQ ACCORDION ================= */}
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-xs font-bold text-amber-600 uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        {/* Search & Filter bar */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                placeholder="Search question (e.g. bedbug eggs, safety, hotel)..."
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-xs font-medium placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFaqCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeFaqCategory === cat
                      ? 'bg-red-600 text-white shadow-md'
                      : 'glass-pill text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="glass-card rounded-2xl border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50"
                >
                  <span className="font-accent font-bold text-sm sm:text-base text-slate-900">
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-red-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
