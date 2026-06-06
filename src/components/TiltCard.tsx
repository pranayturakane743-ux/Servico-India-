import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  image?: string;
}> = ({ children, className, onClick, image }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Moderate tilt constraints to simulate depth
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: 'preserve-3d',
      }}
      className={`relative rounded-2xl bg-white shadow-xl hover:shadow-[0_0_40px_rgba(255,153,51,0.25)] transition-all duration-300 cursor-pointer ${className}`}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {image && (
        <>
          <img 
            src={image} 
            alt="Background" 
            referrerPolicy="no-referrer" 
            className="absolute inset-0 w-full h-full object-cover rounded-2xl z-0 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/60 to-black/20 z-0 rounded-2xl transition-opacity duration-500" />
        </>
      )}
      {!image && (
        <div className="absolute inset-0 bg-navy z-0 rounded-2xl" />
      )}
      <div
        style={{ transform: 'translateZ(30px)' }}
        className="relative z-10 w-full h-full p-6 flex flex-col justify-between"
      >
        {children}
      </div>
    </motion.div>
  );
};
