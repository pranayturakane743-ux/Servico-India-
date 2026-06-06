import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, X, ChevronRight } from 'lucide-react';

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show banner after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50 md:w-96"
        >
          <div className="bg-gradient-to-r from-navy to-slate-800 rounded-2xl shadow-2xl p-4 sm:p-5 flex items-start gap-4 border border-white/10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-saffron/20 rounded-full blur-2xl pointer-events-none"></div>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 bg-saffron/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Tag className="w-5 h-5 text-saffron" />
            </div>

            <div className="flex-1">
              <span className="text-saffron text-xs font-bold uppercase tracking-wider mb-1 block">Limited Time Offer</span>
              <h4 className="text-white font-bold mb-1 leading-tight">Festive Season Sparkle! ✨</h4>
              <p className="text-slate-300 text-sm mb-3 text-balance leading-relaxed">
                Get FLAT 20% OFF on all deep cleaning services this week.
              </p>
              <a 
                href="#services" 
                onClick={() => setIsVisible(false)}
                className="inline-flex items-center gap-1 text-sm font-bold text-saffron hover:text-white transition-colors group"
              >
                Book Now 
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
