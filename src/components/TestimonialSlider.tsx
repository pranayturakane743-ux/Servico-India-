import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { useLocale } from '../LocaleContext';

const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Dharampeth, Nagpur",
    rating: 5,
    review: "The electrician was incredibly professional. Arrived in 30 minutes, fixed the inverter issue, and cleaned up afterwards. The upfront pricing is a game-changer!",
    initial: "P",
    color: "bg-orange-100 text-orange-600"
  },
  {
    id: 2,
    name: "Rahul Desai",
    location: "Sadar, Nagpur",
    rating: 5,
    review: "I had a massive plumbing emergency at 10 PM. Servico saved the day! The technician was extremely polite, efficient, and the UPI payment made it entirely hassle-free.",
    initial: "R",
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: 3,
    name: "Anita Kapoor",
    location: "Pratap Nagar, Nagpur",
    rating: 4,
    review: "Booking AC repair was so easy. The live tracking map is awesome, I knew exactly when they would arrive. The technician explained the issue clearly before starting.",
    initial: "A",
    color: "bg-emerald-100 text-emerald-600"
  },
  {
    id: 4,
    name: "Vikram Singh",
    location: "Ramdaspeth, Nagpur",
    rating: 5,
    review: "Best pest control service I've ever used. The products were eco-friendly, there was no harsh smell, and the whole house is finally bug-free. Will definitely rebook.",
    initial: "V",
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: 5,
    name: "Meera Patel",
    location: "Civil Lines, Nagpur",
    rating: 5,
    review: "Transparent pricing is what won me over. No haggling with local vendors, just clear estimates, professional GST invoices, and top-notch work quality.",
    initial: "M",
    color: "bg-pink-100 text-pink-600"
  }
];

export const TestimonialSlider = () => {
  const { t } = useLocale();
  const carousel = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (carousel.current) {
        setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
      }
    };
    
    // Initial width calculation
    updateWidth();
    
    // Recalculate on window resize
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-navy tracking-tight">{t('testimonials.title')}</h2>
        <p className="text-slate-500 font-medium mt-3 max-w-xl mx-auto px-4">{t('testimonials.subtitle')}</p>
      </div>
      
      <motion.div ref={carousel} className="cursor-grab overflow-hidden active:cursor-grabbing w-full">
        <motion.div 
          drag="x" 
          dragConstraints={{ right: 0, left: -width }} 
          className="flex gap-6 w-max px-4 sm:px-6 lg:px-8"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.div 
              key={testimonial.id}
              className="w-[320px] sm:w-[400px] bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 shrink-0 relative flex flex-col justify-between select-none"
            >
              <Quote className="absolute top-6 right-6 w-16 h-16 text-slate-50 -z-0" />
              
              <div className="relative z-10 flex-grow">
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-saffron text-saffron" />
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <Star key={i + testimonial.rating} className="w-5 h-5 fill-slate-100 text-slate-100" />
                  ))}
                </div>
                
                <p className="text-slate-600 font-medium leading-relaxed mb-8 text-lg">
                  "{testimonial.review}"
                </p>
              </div>

              <div className="flex items-center gap-4 relative z-10 pt-6 border-t border-slate-50 mt-auto">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg select-none ${testimonial.color}`}>
                  {testimonial.initial}
                </div>
                <div>
                  <h4 className="font-bold text-navy flex items-center gap-1.5">
                    {testimonial.name}
                    <CheckCircle2 className="w-4 h-4 text-india-green" />
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      
      <div className="flex justify-center items-center gap-2 mt-8 hidden sm:flex">
         <p className="text-sm font-medium text-slate-400">Drag to explore more reviews</p>
         <motion.div
           animate={{ x: [0, 10, 0] }}
           transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
         >
           <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
           </svg>
         </motion.div>
      </div>
    </div>
  );
}
