import { useState } from 'react';
import { DistributorLocation } from '../types';
import { LOCATIONS } from '../data/mockData';
import { MapPin, Phone, MessageSquare, Navigation, CheckCircle2, AlertCircle, Search, Store, Building2, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MapLocatorProps {
  onSelectStoreForOrder?: (store: DistributorLocation) => void;
}

export function MapLocator({ onSelectStoreForOrder }: MapLocatorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedStore, setSelectedStore] = useState<DistributorLocation>(LOCATIONS[0]);

  const zones = ['All', 'Lagos Mainland', 'Lagos Island', 'Abuja', 'Port Harcourt'];

  const filteredLocations = LOCATIONS.filter((loc) => {
    const matchesZone = selectedZone === 'All' || loc.zone === selectedZone;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.landmark.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search & Filter Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area (e.g. Abule Egba, Fagba, Ikeja, Abuja)..."
              className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm font-medium placeholder-slate-400 focus:border-red-500"
            />
          </div>

          {/* Zone Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {zones.map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedZone === zone
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'glass-pill text-slate-600 hover:bg-slate-100'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Map & Store List Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Store List Column */}
        <div className="lg:col-span-5 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredLocations.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl text-center text-slate-500">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-semibold">No store found matching your search query.</p>
              <p className="text-xs text-slate-500 mt-1">Try searching "Abule Egba" or "Fagba".</p>
            </div>
          ) : (
            filteredLocations.map((loc) => {
              const isSelected = selectedStore.id === loc.id;
              return (
                <motion.div
                  key={loc.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedStore(loc)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'glass-card border-2 border-brand bg-red-50 shadow-xl shadow-red-600/10'
                      : 'glass-card border border-slate-200 hover:border-brand'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Store className={`w-4 h-4 ${loc.isPrimary ? 'text-amber-500' : 'text-red-600'}`} />
                      <h4 className="font-accent font-bold text-sm text-slate-900">{loc.name}</h4>
                    </div>
                    {loc.isPrimary && (
                      <span className="bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-accent font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5" /> HQ Depot
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {loc.address}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-red-600" />
                      {loc.phone}
                    </span>
                    <span className="font-medium text-amber-600">{loc.hours}</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Visual Map Canvas & Selected Store Detail Card */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
          
          {/* Simulated Leaflet Visual Map View */}
          <div className="relative w-full h-64 md:h-80 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex flex-col justify-between p-4">
            {/* Map Grid Pattern background */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Interactive Pins Overlay */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="relative w-full max-w-md h-full flex items-center justify-around">
                {filteredLocations.map((loc, idx) => {
                  const isCur = loc.id === selectedStore.id;
                  return (
                    <motion.button
                      key={loc.id}
                      animate={isCur ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                      onClick={() => setSelectedStore(loc)}
                      className={`relative flex flex-col items-center group cursor-pointer ${
                        isCur ? 'z-20' : 'z-10'
                      }`}
                    >
                      <div className={`p-2 rounded-full shadow-lg transition-transform ${
                        isCur ? 'bg-red-600 text-white ring-4 ring-red-500/30' : 'bg-white text-red-600 border border-slate-300'
                      }`}>
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 bg-white/90 px-2 py-0.5 rounded-full border border-slate-200 mt-1 shadow whitespace-nowrap">
                        {loc.name.split(' ')[0]}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Map Footer Label */}
            <div className="relative z-10 glass-pill px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 self-start flex items-center gap-2 border border-slate-200">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Showing {filteredLocations.length} Verified LESEKESE Outlets</span>
            </div>
          </div>

          {/* Selected Store Detailed Info Box */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStore.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card p-6 rounded-2xl border border-red-500/40 bg-gradient-to-br from-white via-slate-50 to-red-50 space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-display font-bold text-slate-900 tracking-wide">
                      {selectedStore.name}
                    </h3>
                  </div>
                  <p className="text-xs text-amber-600 font-medium">
                    Landmark: {selectedStore.landmark}
                  </p>
                </div>

                <a
                  href={`https://maps.google.com/?q=${selectedStore.lat},${selectedStore.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-pill px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 hover:border-red-500 flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-red-600" />
                  <span>Google Maps Directions</span>
                </a>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed border-t border-b border-slate-100 py-3">
                <p><strong className="text-slate-700">Address:</strong> {selectedStore.address}</p>
                <p className="mt-1"><strong className="text-slate-700">Hours:</strong> {selectedStore.hours}</p>
              </div>

              {/* In-Stock Status Indicators */}
              <div>
                <span className="text-[11px] font-accent font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Live Product Size Availability:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="glass-pill p-2 rounded-xl text-center text-xs">
                    <span className="block text-[10px] text-slate-500">500ml Big</span>
                    {selectedStore.stockAvailable.ml500 ? (
                      <span className="text-emerald-600 font-bold flex items-center justify-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> In Stock
                      </span>
                    ) : (
                      <span className="text-red-600 font-bold mt-0.5">Out of Stock</span>
                    )}
                  </div>

                  <div className="glass-pill p-2 rounded-xl text-center text-xs">
                    <span className="block text-[10px] text-slate-500">250ml Medium</span>
                    {selectedStore.stockAvailable.ml250 ? (
                      <span className="text-emerald-600 font-bold flex items-center justify-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> In Stock
                      </span>
                    ) : (
                      <span className="text-red-600 font-bold mt-0.5">Out of Stock</span>
                    )}
                  </div>

                  <div className="glass-pill p-2 rounded-xl text-center text-xs">
                    <span className="block text-[10px] text-slate-500">100ml Small</span>
                    {selectedStore.stockAvailable.ml100 ? (
                      <span className="text-emerald-600 font-bold flex items-center justify-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> In Stock
                      </span>
                    ) : (
                      <span className="text-amber-600 font-bold mt-0.5">Restocking</span>
                    )}
                  </div>

                  <div className="glass-pill p-2 rounded-xl text-center text-xs border border-emerald-200/60">
                    <span className="block text-[10px] text-emerald-700 font-semibold">SEND OFF 🐍</span>
                    {selectedStore.stockAvailable.sendOff ? (
                      <span className="text-emerald-600 font-bold flex items-center justify-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> In Stock
                      </span>
                    ) : (
                      <span className="text-amber-600 font-bold mt-0.5">Restocking</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={`https://wa.me/${selectedStore.whatsapp}?text=Hello%20${encodeURIComponent(selectedStore.name)},%20I%20want%20to%20buy%20LESEKESE%20Instant%20Killer.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Store Direct</span>
                </a>

                <a
                  href={`tel:${selectedStore.phone}`}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Store ({selectedStore.phone})</span>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
