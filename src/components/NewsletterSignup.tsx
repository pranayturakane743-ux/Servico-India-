import React, { useState } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    try {
      await addDoc(collection(db, 'newsletters'), {
        email,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error(err);
      setStatus('error');
      handleFirestoreError(err, OperationType.CREATE, 'newsletters');
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-navy rounded-3xl p-8 lg:p-12 border border-slate-800 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/10 rounded-full blur-3xl -mx-20 -my-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-saffron/5 rounded-full blur-3xl -mx-20 -my-20" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="max-w-lg text-center lg:text-left">
          <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Stay ahead with <span className="text-saffron">Servico</span>.</h3>
          <p className="text-slate-400 font-medium leading-relaxed">
            Join 50,000+ others and get seasonal discounts, home maintenance tips, and exclusive offers delivered to your inbox.
          </p>
        </div>
        
        <div className="w-full lg:w-auto flex-1 max-w-md">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-india-green/10 border border-india-green/20 rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-india-green/20 rounded-full flex items-center justify-center mx-auto mb-4 text-india-green">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-white font-bold mb-2">You're all set!</h4>
                <p className="text-india-green/80 text-sm">Thanks for subscribing. Keep an eye on your inbox.</p>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit} 
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-4 flex flex-col justify-center text-slate-500">
                     <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                    placeholder="Enter your email address"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all font-medium"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-saffron hover:bg-saffron-dark text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-[0_4px_15px_rgba(255,153,51,0.3)] hover:shadow-[0_6px_20px_rgba(255,153,51,0.4)] disabled:opacity-70 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-saffron/50"
                >
                  {status === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Subscribe <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
          {status === 'error' && (
            <p className="text-red-400 text-sm mt-3 font-medium text-center lg:text-left">Something went wrong. Please try again.</p>
          )}
          {status === 'idle' && (
            <p className="text-slate-500 text-xs mt-3 text-center lg:text-left font-medium">We respect your privacy. No spam, ever.</p>
          )}
        </div>
      </div>
    </div>
  );
};
