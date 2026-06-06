import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock } from 'lucide-react';

const cities = ["Dharampeth", "Sitabuldi", "Sadar", "Wardhaman Nagar", "Manish Nagar", "Itwari", "Pratap Nagar", "Ramdaspeth", "Civil Lines", "Laxmi Nagar", "Trimurti Nagar", "Besa", "Khamla", "Wadi", "Koradi", "Medical Chowk"];
const services = ["AC Repair", "Deep Cleaning", "Plumber", "Pest Control", "Electrician"];
const names = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali"];

export const LiveActivityFeed = () => {
  const [activities, setActivities] = useState<{ id: number, text: string, time: string }[]>([]);

  useEffect(() => {
    // Initial feed
    const initial = Array.from({ length: 3 }).map((_, i) => ({
      id: Date.now() - i * 1000,
      text: `${names[Math.floor(Math.random() * names.length)]} booked ${services[Math.floor(Math.random() * services.length)]} in ${cities[Math.floor(Math.random() * cities.length)]}`,
      time: 'Just now'
    }));
    setActivities(initial);

    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivity = {
          id: Date.now(),
          text: `${names[Math.floor(Math.random() * names.length)]} booked ${services[Math.floor(Math.random() * services.length)]} in ${cities[Math.floor(Math.random() * cities.length)]}`,
          time: 'Just now'
        };
        return [newActivity, ...prev].slice(0, 4);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 overflow-hidden shadow-2xl border border-slate-800/80 relative z-20">
      <div className="flex items-center gap-2 text-saffron shrink-0 font-bold text-xs sm:text-sm tracking-wide">
        <span className="relative flex h-2 sm:h-3 w-2 sm:w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron opacity-75"></span>
          <span className="relative inline-flex rounded-full h-full w-full bg-saffron"></span>
        </span>
        LIVE BOOKINGS
      </div>
      <div className="flex-1 w-full relative h-5 sm:h-6 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {activities.slice(0, 1).map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex items-center text-xs sm:text-sm w-full"
            >
              <span className="font-medium text-slate-300 truncate flex-1 mr-2 sm:mr-4">{activity.text}</span>
              <span className="text-slate-500 text-[10px] sm:text-xs shrink-0 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {activity.time}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
