import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Trophy, Star, Crown } from 'lucide-react';

export const LoyaltyRewards = () => {
  const [inView, setInView] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({ width: '65%' });
    }
  }, [inView, controls]);

  return (
    <div 
      className="bg-navy rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden"
      onMouseEnter={() => setInView(true)}
    >
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-saffron/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-india-green/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-md">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Servico Elite<span className="text-saffron">.</span></h2>
          <p className="text-slate-300 font-medium mb-8">Earn points on every booking. Unlock exclusive tier benefits, priority support, and up to 20% off on premium services.</p>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-slate-400">Current Points: <span className="text-white">650</span></span>
              <span className="text-saffron">Next Tier: 1000</span>
            </div>
            <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5">
              <motion.div 
                initial={{ width: '0%' }}
                animate={controls}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-saffron to-saffron-dark rounded-full"
                onViewportEnter={() => setInView(true)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {[
            { name: 'Bronze', pts: '0+', icon: Star, color: 'text-orange-300', bg: 'bg-orange-300/10', border: 'border-orange-300/20' },
            { name: 'Gold', pts: '1k+', icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/20', border: 'border-yellow-400/50', active: true },
            { name: 'Platinum', pts: '5k+', icon: Crown, color: 'text-slate-200', bg: 'bg-slate-200/10', border: 'border-slate-200/20' },
          ].map((tier, i) => (
            <div key={i} className={`flex-1 sm:w-32 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border backdrop-blur-md ${tier.bg} ${tier.border} ${tier.active ? 'scale-110 shadow-[0_0_30px_rgba(250,204,21,0.2)] z-10' : 'opacity-60 grayscale'}`}>
              <tier.icon className={`w-8 h-8 ${tier.color}`} />
              <div className="text-center">
                <p className="font-bold text-sm tracking-tight">{tier.name}</p>
                <p className="text-xs opacity-70 font-medium">{tier.pts} pts</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
