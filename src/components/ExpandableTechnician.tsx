import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Award, ShieldCheck, Star, BadgeCheck, Map, MapPin, Navigation, Clock } from 'lucide-react';
import type { TechnicianProfile } from '../types';
import { SafeVideo } from './SafeVideo';

export const ExpandableTechnician = ({ technician }: { technician?: TechnicianProfile }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeToReach, setTimeToReach] = useState<string | null>(null);

  React.useEffect(() => {
    if (isExpanded && !timeToReach && technician) {
        let techSeed = 0;
        for (let i = 0; i < technician.name.length; i++) {
            techSeed += technician.name.charCodeAt(i);
        }

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const pseudoRandom = Math.abs(Math.sin(lat + techSeed) * 10000 % 1);
                    const mins = Math.floor(pseudoRandom * 20) + 5; // 5 to 25 mins
                    setTimeToReach(`${mins} mins away`);
                },
                (error) => {
                    const fallbackRandom = Math.abs(Math.sin(techSeed) * 10000 % 1);
                    const mins = Math.floor(fallbackRandom * 20) + 5;
                    setTimeToReach(`${mins} mins away`); 
                }
            );
        } else {
             const fallbackRandom = Math.abs(Math.sin(techSeed) * 10000 % 1);
             const mins = Math.floor(fallbackRandom * 20) + 5;
             setTimeToReach(`${mins} mins away`);
        }
    }
  }, [isExpanded, timeToReach, technician]);

  if (!technician) return null;

  return (
    <div 
      className="relative mt-4 flex-grow" 
      onMouseEnter={() => setIsExpanded(true)} 
      onMouseLeave={() => setIsExpanded(false)}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 p-3 bg-slate-50 group-hover:bg-white rounded-xl border border-slate-100 transition-colors">
        <div className="w-10 h-10 bg-saffron/10 text-saffron rounded-full flex items-center justify-center shrink-0 overflow-hidden">
          {technician.videoUrl ? (
            <SafeVideo 
              src={technician.videoUrl} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover"
            />
          ) : technician.imageUrl ? (
            <img 
              src={technician.imageUrl} 
              alt={technician.name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <User className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-navy text-sm flex items-center gap-1">
            {technician.name}
            <BadgeCheck className="w-4 h-4 text-india-green" />
          </h4>
          <p className="text-xs text-slate-500 font-medium">Verified Pro • {technician.rating} ★</p>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 right-0 mb-2 p-5 bg-navy text-white rounded-2xl shadow-xl z-20 pointer-events-none overflow-hidden"
          >
            {(technician.videoUrl || technician.imageUrl) && (
              <div className="absolute inset-0 z-0 opacity-20">
                {technician.videoUrl ? (
                  <SafeVideo 
                    src={technician.videoUrl} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                ) : technician.imageUrl ? (
                  <img 
                    src={technician.imageUrl} 
                    alt={technician.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : null}
              </div>
            )}
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4 mb-4 border-b border-slate-700/50 pb-4">
                <div className="text-center flex-1">
                  <p className="text-xl font-bold text-saffron">{technician.experience}</p>
                  <p className="text-xs text-slate-300 mt-1">Experience</p>
                </div>
                <div className="w-px h-8 bg-slate-700/50" />
                <div className="text-center flex-1">
                  <p className="text-xl font-bold text-india-green">{technician.jobsCompleted}+</p>
                  <p className="text-xs text-slate-300 mt-1">Jobs Done</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-saffron" /> Certifications
                </p>
                <ul className="space-y-2">
                  {technician.certifications.map((cert, idx) => (
                    <li key={idx} className="text-sm font-medium flex items-center gap-2 text-white">
                      <span className="w-1.5 h-1.5 bg-saffron rounded-full shrink-0" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
                    <Map className="w-5 h-5 text-saffron relative z-10" />
                    <div className="absolute w-2 h-2 bg-india-green rounded-full animate-ping z-10" />
                    <div className="absolute w-2 h-2 bg-india-green rounded-full z-10" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-300">Active Zone</p>
                    <p className="text-sm font-bold text-white flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-india-green" /> 
                      {technician.activeZone || 'Your Neighborhood'}
                    </p>
                  </div>
                </div>
                
                {timeToReach && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden shrink-0">
                      <Clock className="w-5 h-5 text-sky-400 relative z-10" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-300">Estimated Arrival</p>
                      <p className="text-sm font-bold text-white flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" /> 
                        {timeToReach}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
