import React, { useEffect, useState } from 'react';
import { LiquidEther } from './LiquidEther';

export const AmbientBackground = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-slate-50 bg-gradient-to-br from-slate-50 via-slate-50/50 to-slate-100">
      {mounted && (
        <div className="absolute inset-0 opacity-40">
          <LiquidEther 
            colors={['#2e1065', '#4c1d95', '#6d28d9', '#8b5cf6', '#c4b5fd']} // deep pure purples
            mouseForce={20}
            cursorSize={120}
            autoDemo={true}
            autoSpeed={0.4}
            autoIntensity={1.5}
            resolution={0.5}
            BFECC={true}
          />
        </div>
      )}

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #64748b 1px, transparent 1px),
            linear-gradient(to bottom, #64748b 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 20%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 95%)'
        }}
      />
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.25] pointer-events-none mix-blend-overlay"></div>
    </div>
  );
};
