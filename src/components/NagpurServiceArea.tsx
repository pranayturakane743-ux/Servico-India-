import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import { useLocale } from '../LocaleContext';

export const NagpurServiceArea = () => {
  const { t } = useLocale();
  
  const regions = [
    { name: 'Dharampeth', top: '35%', left: '35%' },
    { name: 'Sitabuldi', top: '50%', left: '50%' },
    { name: 'Sadar', top: '20%', left: '48%' },
    { name: 'Wardhaman Nagar', top: '35%', left: '80%' },
    { name: 'Manish Nagar', top: '80%', left: '65%' },
    { name: 'Hingna', top: '65%', left: '20%' },
    { name: 'Itwari', top: '20%', left: '68%' },
    { name: 'Pratap Nagar', top: '58%', left: '28%' },
    { name: 'Ramdaspeth', top: '42%', left: '46%' },
    { name: 'Civil Lines', top: '28%', left: '42%' },
    { name: 'Laxmi Nagar', top: '48%', left: '32%' },
    { name: 'Trimurti Nagar', top: '68%', left: '32%' },
    { name: 'Besa', top: '85%', left: '78%' },
    { name: 'Khamla', top: '60%', left: '40%' },
    { name: 'Wadi', top: '45%', left: '12%' },
    { name: 'Koradi', top: '10%', left: '52%' },
    { name: 'Medical Chowk', top: '52%', left: '62%' }
  ];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-xl group">
      {/* Map Background Pattern / Image */}
      <div className="absolute inset-0 opacity-50 group-hover:opacity-75 transition-opacity duration-700 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center grayscale" />
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
      
      {/* Floating Status Badge */}
      <div className="absolute top-6 left-6 inline-flex items-center gap-2 bg-white/90 backdrop-blur-md text-navy px-4 py-2 rounded-full border border-white/50 font-semibold text-sm shadow-lg z-10">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-india-green opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-india-green" />
        </span>
        Live Service Map
      </div>

      <div className="absolute top-6 right-6 z-10 hidden sm:flex items-center gap-2 bg-navy/90 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/10 font-medium text-sm shadow-lg">
        <Navigation className="w-4 h-4 text-saffron" />
        Nagpur Region Active
      </div>

      {/* Map Pins */}
      {regions.map((region, i) => (
        <motion.div
          key={i}
          className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 hover:z-50 z-10"
          style={{ top: region.top, left: region.left }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15, type: 'spring', stiffness: 200, damping: 15 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="group/pin cursor-pointer flex flex-col items-center hover:z-50 relative">
            {/* Pulsing ring */}
            <div className="relative">
              <span className="absolute -inset-2 inline-flex rounded-full bg-saffron opacity-30 animate-ping group-hover/pin:opacity-50 transition-opacity" />
              <div className="relative w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-saffron group-hover/pin:scale-110 transition-transform">
                 <MapPin className="w-5 h-5 text-saffron fill-saffron/20" />
              </div>
            </div>
            
            {/* Label */}
            <motion.div 
               className="mt-3 bg-navy text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-xl backdrop-blur-md whitespace-nowrap border border-white/10 group-hover/pin:bg-saffron transition-colors"
               initial={{ opacity: 0, scale: 0.8 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.15 + 0.2 }}
            >
              {region.name}
            </motion.div>
          </div>
        </motion.div>
      ))}

      {/* Stats overlay */}
      <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-auto bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/50 z-10 max-w-sm">
        <h3 className="text-xl font-bold text-navy mb-2">Nagpur Coverage</h3>
        <p className="text-slate-600 text-sm font-medium mb-4">We are actively serving across major localities in Nagpur with a response time of under 60 minutes.</p>
        <div className="grid grid-cols-2 gap-4">
           <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Technicians</p>
              <p className="text-2xl font-bold text-navy text-transparent bg-clip-text bg-gradient-to-r from-saffron to-saffron-dark">150+</p>
           </div>
           <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Avg Response</p>
              <p className="text-2xl font-bold text-india-green">45 mins</p>
           </div>
        </div>
      </div>
    </div>
  );
};
