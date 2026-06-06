import React, { useState, useRef } from 'react';
import { MoveHorizontal } from 'lucide-react';

export const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let clientX = 0;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleInteractionStart = () => {
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleInteractionEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleInteractionEnd);
  }

  const handleInteractionEnd = () => {
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('mouseup', handleInteractionEnd);
    window.removeEventListener('touchmove', handleMove);
    window.removeEventListener('touchend', handleInteractionEnd);
  }

  return (
    <div 
      className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden cursor-ew-resize select-none"
      ref={containerRef}
      onMouseDown={handleInteractionStart}
      onTouchStart={handleInteractionStart}
    >
      {/* After image (background) */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200" alt="After Cleaning" className="w-full h-full object-cover" />
        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full font-bold text-navy shadow-lg">After</div>
      </div>

      {/* Before image (foreground overlay) */}
      <div 
        className="absolute inset-0 overflow-hidden z-10"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="absolute inset-0 h-[400px] md:h-[500px]" style={{ width: containerRef.current?.clientWidth || '100vw' }}>
           <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200" alt="Before Cleaning" className="w-full h-full object-cover filter brightness-[0.7] contrast-[0.85] sepia-[0.2] saturate-[0.7] blur-[0.5px]" />
           {/* Subtle ambient darkening instead of fake textures */}
           <div className="absolute inset-0 bg-[#3a2e24] mix-blend-multiply opacity-40" />
        </div>
        <div className="absolute top-6 left-6 bg-navy/90 backdrop-blur px-4 py-2 rounded-full font-bold text-white shadow-lg">Before</div>
      </div>

      {/* Slider Handle Line & Glow */}
      <div 
        className="absolute top-0 bottom-0 w-[4px] bg-purple-300 z-20 shadow-[0_0_20px_6px_rgba(168,85,247,0.8)]"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_10px_rgba(168,85,247,0.9)] border-[3px] border-purple-400 cursor-ew-resize">
          <MoveHorizontal className="w-6 h-6 text-purple-600" />
        </div>
      </div>
    </div>
  );
};
