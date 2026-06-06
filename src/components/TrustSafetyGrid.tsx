import React from 'react';
import { Shield, Award, Sparkles, CheckCircle, Clock, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

const TRUST_FEATURES = [
  { icon: Shield, title: 'Background Verified', desc: '100% ID & criminal record checked.' },
  { icon: Award, title: 'Expert Trained', desc: 'Minimum 5 years of industry experience.' },
  { icon: Sparkles, title: 'Top Quality', desc: 'Premium materials & standard practices.' },
  { icon: CheckCircle, title: 'Damage Protection', desc: 'Up to ₹10,000 insurance cover.' },
  { icon: Clock, title: 'Punctual Service', desc: 'Guaranteed on-time arrival.' },
  { icon: MapPin, title: 'Local Heroes', desc: 'Technicians from your neighborhood.' }
];

export const TrustSafetyGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {TRUST_FEATURES.map((feature, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-saffron/30 transition-all flex items-start gap-4"
        >
          <div className="w-12 h-12 bg-slate-50 text-saffron rounded-xl flex items-center justify-center shrink-0">
            <feature.icon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-navy mb-1">{feature.title}</h4>
            <p className="text-sm text-slate-500 font-medium">{feature.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
