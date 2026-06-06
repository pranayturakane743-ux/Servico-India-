import React from 'react';
import { motion } from 'motion/react';

const cities = ["Nagpur", "Delhi", "Bangalore", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Surat", "Jaipur"];
const brands = ["Urban Company Alternative", "NoBroker", "JustDial", "Housejoy", "Zimmber", "Timesaverz", "Helpr"];

export const PartnersMarquee = () => {
  return (
    <div className="py-12 overflow-hidden border-y border-slate-100 bg-white">
      <div className="flex gap-4">
        <motion.div 
          animate={{ x: [0, -1035] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          className="flex gap-4 shrink-0"
        >
          {/* Double array for seamless loop */}
          {[...cities, ...cities, ...cities].map((city, i) => (
            <div key={i} className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-full font-semibold text-slate-500 whitespace-nowrap">
              {city}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
