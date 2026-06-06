import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = 
              t.type === 'success' ? CheckCircle :
              t.type === 'error' ? XCircle :
              t.type === 'warning' ? AlertCircle : Info;
            
            const bgStyles = 
              t.type === 'success' ? 'bg-white border-green-200 text-india-green shadow-green-900/5' :
              t.type === 'error' ? 'bg-white border-red-200 text-red-500 shadow-red-900/5' :
              t.type === 'warning' ? 'bg-white border-orange-200 text-orange-500 shadow-orange-900/5' :
              'bg-white border-blue-200 text-blue-500 shadow-blue-900/5';

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border-2 shadow-2xl backdrop-blur-md ${bgStyles}`}
              >
                <Icon className="w-6 h-6 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-navy">{t.title}</h4>
                  {t.message && <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">{t.message}</p>}
                </div>
                <button onClick={() => removeToast(t.id)} className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1 bg-slate-50 hover:bg-slate-100 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
