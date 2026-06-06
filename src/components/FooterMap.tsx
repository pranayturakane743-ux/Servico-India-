import React from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export const FooterMap = () => {
  const pins = [
    { top: '35%', left: '40%', name: 'Dharampeth' },
    { top: '48%', left: '55%', name: 'Sitabuldi' },
    { top: '25%', left: '48%', name: 'Sadar' },
    { top: '40%', left: '75%', name: 'Wardhaman' },
    { top: '75%', left: '60%', name: 'Manish Nagar' },
    { top: '65%', left: '30%', name: 'Pratap Nagar' },
    { top: '28%', left: '32%', name: 'Civil Lines' },
    { top: '80%', left: '45%', name: 'Khamla' },
  ];

  return (
    <div className="relative w-full h-48 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/50 group">
      <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center grayscale mix-blend-overlay" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
      
      <div className="absolute top-3 left-3 text-[10px] font-bold text-white flex items-center gap-1.5 z-10 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 uppercase tracking-wider shadow-lg">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-india-green opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-india-green" />
        </span>
        Live Map
      </div>

      {pins.map((pin, i) => (
        <motion.div
          key={i}
          className="absolute z-10 flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2"
          style={{ top: pin.top, left: pin.left }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, type: 'spring' }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <span className="absolute -inset-1 inline-flex rounded-full bg-saffron opacity-40 animate-ping" />
            <MapPin className="w-5 h-5 text-saffron relative fill-saffron/20 drop-shadow-lg" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-bold text-white mt-1 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10 whitespace-nowrap shadow-xl">
            {pin.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
};
