import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { useLocale } from '../LocaleContext';
import { auth, db, handleFirestoreError, OperationType, onAuthStateChanged } from '../lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

interface Message {
  role: 'user' | 'model';
  text: string;
  createdAt?: any;
}

export const FloatingAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { locale } = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages = {
    en: "Hi! I'm Aura, your AI guide. Need help finding a verified Electrician or Plumber?",
    hi: "नमस्ते! मैं ऑरा हूँ, आपकी एआई गाइड। क्या आपको इलेक्ट्रीशियन या प्लंबर खोजने में मदद चाहिए?",
    mr: "नमस्कार! मी ऑरा, तुमची एआय मार्गदर्शक. तुम्हाला इलेक्ट्रीशियन किंवा प्लंबर शोधण्यात मदत हवी आहे का?"
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        let sessId = localStorage.getItem('aura_chat_session');
        if (!sessId) {
          sessId = 'guest_' + Math.random().toString(36).substring(2, 11);
          localStorage.setItem('aura_chat_session', sessId);
        }
        setCurrentUserId(sessId);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const auraCol = collection(db, 'aura_messages');
    const q = query(
      auraCol,
      where('userId', '==', currentUserId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.role === 'user' || data.role === 'model') {
          msgs.push({
            role: data.role,
            text: data.text,
            createdAt: data.createdAt
          });
        }
      });

      // Sort in-memory by createdAt timestamp dynamically
      msgs.sort((a, b) => {
        const t1 = a.createdAt?.toMillis?.() || 0;
        const t2 = b.createdAt?.toMillis?.() || 0;
        return t1 - t2;
      });

      if (msgs.length > 0) {
        setMessages(msgs);
      } else {
        setMessages([{ role: 'model', text: initialMessages[locale] || initialMessages.en }]);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'aura_messages');
    });

    return () => unsubscribe();
  }, [currentUserId, locale]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !currentUserId) return;
    
    const userMsg = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      const auraCol = collection(db, 'aura_messages');
      await addDoc(auraCol, {
        text: userMsg,
        role: 'user',
        userId: currentUserId,
        createdAt: serverTimestamp(),
        responded: false
      });

      // Trigger server-side response generation securely
      await fetch('/api/chat-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUserId,
          text: userMsg
        })
      });
    } catch (error) {
      console.error("Direct-to-DB message save error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Could not send message. Please review your network or try again." }]);
      handleFirestoreError(error, OperationType.CREATE, 'aura_messages');
    } finally {
      setIsLoading(false);
    }
  };

  const isModelTyping = isLoading || (messages.length > 0 && messages[messages.length - 1].role === 'user');

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white/95 backdrop-blur-xl p-0 rounded-3xl rounded-br-sm shadow-2xl border border-white/40 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[70vh] pointer-events-auto origin-bottom-right flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-saffron/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-saffron flex items-center justify-center text-white relative">
                   <div className="absolute inset-0 rounded-full bg-saffron animate-ping opacity-20" />
                   <span className="font-bold text-xs tracking-wider">AU</span>
                </div>
                <div>
                  <span className="font-bold text-navy flex items-center gap-1.5 text-sm">
                    Aura AI
                    <span className="w-1.5 h-1.5 bg-india-green rounded-full shadow-[0_0_8px_rgba(19,136,8,0.8)]" />
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">QuickFix Assistant</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-navy transition-colors bg-white rounded-full p-1.5 shadow-sm border border-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   key={i} 
                   className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                     msg.role === 'user' 
                       ? 'bg-navy text-white rounded-tr-sm self-end' 
                       : 'bg-slate-100 text-slate-700 rounded-tl-sm self-start shadow-sm border border-slate-50'
                   }`}
                >
                  {msg.text}
                </motion.div>
              ))}
              {isModelTyping && (
                <div className="bg-slate-100 text-slate-700 rounded-2xl rounded-tl-sm self-start shadow-sm border border-slate-50 p-3 max-w-[85%] flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about a service..."
                className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all text-navy placeholder-slate-400 border border-slate-100"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isModelTyping}
                className="w-12 h-12 flex-shrink-0 bg-saffron hover:bg-saffron-dark text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isModelTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 sm:w-16 sm:h-16 relative cursor-pointer group pointer-events-auto focus:outline-none flex items-center justify-center rounded-full"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-saffron via-saffron to-orange-400 rounded-full shadow-[0_8px_30px_rgba(255,153,51,0.5)] group-hover:scale-110 group-active:scale-95 transition-all duration-300 z-10 flex items-center justify-center border-2 border-white">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </motion.div>
            ) : (
              <motion.div key="sparkle" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {!isOpen && (
          <>
            <div className="absolute inset-0 bg-saffron rounded-full animate-ping opacity-40 duration-[3000ms]"></div>
            <div className="absolute -inset-4 border border-saffron/30 rounded-full animate-[spin_4s_linear_infinite] border-t-saffron"></div>
            <div className="absolute -inset-8 border border-saffron/10 rounded-full animate-[spin_6s_linear_infinite_reverse] border-b-saffron"></div>
          </>
        )}
      </button>
    </div>
  );
}
