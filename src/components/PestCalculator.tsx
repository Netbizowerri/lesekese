import { useState } from 'react';
import { Calculator, Flame, ShoppingBag, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface PestCalculatorProps {
  onOrderRecommended: (sizeMl: number, qty: number) => void;
}

export function PestCalculator({ onOrderRecommended }: PestCalculatorProps) {
  const [rooms, setRooms] = useState<number>(2);
  const [beds, setBeds] = useState<number>(2);
  const [infestation, setInfestation] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [pestType, setPestType] = useState<'Bedbugs' | 'Cockroaches' | 'Both' | 'Snakes/Scorpions'>('Bedbugs');
  const isSendOff = pestType === 'Snakes/Scorpions';

  // Calculation Logic
  const totalAreaUnits = rooms * 1.5 + beds * 1 + (infestation === 'Severe' ? 2 : infestation === 'Moderate' ? 1 : 0.5);
  
  let recommended500ml = 1;
  let recommended250ml = 0;

  if (totalAreaUnits > 5) {
    recommended500ml = Math.ceil(totalAreaUnits / 3);
  } else if (totalAreaUnits > 2.5) {
    recommended500ml = 1;
    recommended250ml = 1;
  } else {
    recommended500ml = 1;
  }

  const estimatedCostNgn = isSendOff ? 6000 : (recommended500ml * 3000) + (recommended250ml * 2000);

  return (
    <div className="relative glass-card rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-lg shadow-red-600/30">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
            <Calculator className="w-6 h-6 text-red-500" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-display font-bold text-slate-900 tracking-wide">
            LESEKESE Spray Dosage & Coverage Estimator
          </h3>
          <p className="text-xs text-slate-500">
            Calculate exact bottle requirements for guaranteed eradication in your home
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Target Pest Select */}
          <div>
            <label className="block text-xs font-accent font-bold uppercase text-slate-700 mb-2">
              Primary Pest Infestation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Bedbugs', 'Cockroaches', 'Both', 'Snakes/Scorpions'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPestType(p)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    pestType === p
                      ? p === 'Snakes/Scorpions'
                        ? 'bg-emerald-600 text-white border border-emerald-400 shadow-md shadow-emerald-600/30'
                        : 'bg-red-600 text-white border border-red-400 shadow-md shadow-red-600/30'
                      : 'glass-pill text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Rooms Slider / Stepper */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-accent font-bold uppercase text-slate-700 mb-2">
                Rooms to Treat: <span className="text-red-600 font-mono text-sm">{rooms}</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRooms(Math.max(1, rooms - 1))}
                  className="w-9 h-9 rounded-xl glass-pill text-slate-700 font-bold flex items-center justify-center hover:bg-red-50 hover:text-red-600 cursor-pointer"
                >
                  -
                </button>
                <div className="flex-1 text-center font-display text-xl text-slate-900 font-bold">
                  {rooms} {rooms === 1 ? 'Room' : 'Rooms'}
                </div>
                <button
                  onClick={() => setRooms(Math.min(10, rooms + 1))}
                  className="w-9 h-9 rounded-xl glass-pill text-slate-700 font-bold flex items-center justify-center hover:bg-red-50 hover:text-red-600 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-accent font-bold uppercase text-slate-700 mb-2">
                Beds / Mattresses: <span className="text-red-600 font-mono text-sm">{beds}</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBeds(Math.max(1, beds - 1))}
                  className="w-9 h-9 rounded-xl glass-pill text-slate-700 font-bold flex items-center justify-center hover:bg-red-50 hover:text-red-600 cursor-pointer"
                >
                  -
                </button>
                <div className="flex-1 text-center font-display text-xl text-slate-900 font-bold">
                  {beds} {beds === 1 ? 'Bed' : 'Beds'}
                </div>
                <button
                  onClick={() => setBeds(Math.min(12, beds + 1))}
                  className="w-9 h-9 rounded-xl glass-pill text-slate-700 font-bold flex items-center justify-center hover:bg-red-50 hover:text-red-600 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Infestation Severity */}
          <div>
            <label className="block text-xs font-accent font-bold uppercase text-slate-700 mb-2">
              Infestation Severity Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Mild', 'Moderate', 'Severe'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setInfestation(level)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    infestation === level
                      ? level === 'Severe'
                        ? 'bg-red-600 text-white border border-red-400 shadow-md shadow-red-600/40'
                        : 'bg-amber-500 text-slate-950 font-bold border border-amber-300'
                      : 'glass-pill text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Calculation Result Card */}
        <div className={`lg:col-span-5 glass-card p-6 rounded-2xl border bg-gradient-to-b ${
            isSendOff
              ? 'border-emerald-500/40 from-emerald-50 to-white'
              : 'border-red-500/40 from-red-50 to-white'
          }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-accent font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> Recommended Package
            </span>
            <span className="text-[11px] bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-200 font-mono font-bold">
              Guaranteed Efficacy
            </span>
          </div>

          {isSendOff ? (
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm text-slate-700 py-1.5 border-b border-slate-100">
                <span className="font-semibold">1× LESEKESE SEND OFF 250g</span>
                <span className="font-bold text-amber-600 font-mono">₦6,000</span>
              </div>
              <div className="pt-2 flex items-baseline justify-between">
                <span className="text-xs text-slate-500 font-medium">Estimated Total Price:</span>
                <span className="text-3xl font-display font-bold text-slate-900 tracking-wider">₦6,000</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {recommended500ml > 0 && (
                <div className="flex items-center justify-between text-sm text-slate-700 py-1.5 border-b border-slate-100">
                  <span className="font-semibold">{recommended500ml}× LESEKESE 500ml (Big Size)</span>
                  <span className="font-bold text-amber-600 font-mono">₦{(recommended500ml * 3000).toLocaleString()}</span>
                </div>
              )}
              {recommended250ml > 0 && (
                <div className="flex items-center justify-between text-sm text-slate-700 py-1.5 border-b border-slate-100">
                  <span className="font-semibold">{recommended250ml}× LESEKESE 250ml (Medium)</span>
                  <span className="font-bold text-amber-600 font-mono">₦{(recommended250ml * 2000).toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 flex items-baseline justify-between">
                <span className="text-xs text-slate-500 font-medium">Estimated Total Price:</span>
                <span className="text-3xl font-display font-bold text-slate-900 tracking-wider">
                  ₦{estimatedCostNgn.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="text-[11px] text-slate-600 glass-pill p-3 rounded-xl mb-6 flex items-start gap-2">
            <Flame className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>
              {isSendOff
                ? 'Sprinkle around perimeter walls, entrances, and outdoor areas. Provides up to 3 weeks reptile barrier.'
                : 'Includes coverage for mattress seams, wooden slats, wall joints, and follow-up residual protection.'}
            </span>
          </div>

          <button
            onClick={() => onOrderRecommended(isSendOff ? 250 : 500, isSendOff ? 1 : recommended500ml + recommended250ml)}
            className={`w-full py-3 px-4 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isSendOff
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 shadow-emerald-600/40'
                : 'bg-gradient-to-r from-red-600 to-amber-500 shadow-red-600/40'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isSendOff ? 'Order SEND OFF Now' : 'Order Estimated Package'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
