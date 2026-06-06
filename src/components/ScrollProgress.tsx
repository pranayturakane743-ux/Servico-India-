import React from 'react';
import { motion, useScroll } from 'motion/react';

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron via-india-green to-navy z-[100]"
    />
  );
};
