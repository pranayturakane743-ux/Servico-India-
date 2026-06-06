import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { useLocale } from '../LocaleContext';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const FloatingAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { locale } = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages = {
    en: "Hi! I'm Aura, your AI guide. Need help finding a verified Electrician or Plumber?",
    hi: "नमस्ते! मैं ऑरा हूँ, आपकी एआई गाइड। क्या आपको इलेक्ट्रीशियन या प्लंबर खोजने में मदद चाहिए?",
    mr: "नमस्कार! मी ऑरा, तुमची एआय मार्गदर्शक. तुम्हाला इलेक्ट्रीशियन किंवा प्लंबर शोधण्यात मदत हवी आहे का?"
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'model', text: initialMessages[locale] || initialMessages.en }]);
    }
  }, [locale]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput("");
    
    const newMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages as Message[]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to start stream');
      }

      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let isDone = false;
        while (!isDone) {
          const { value, done } = await reader.read();
          isDone = done;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.text) {
                    setMessages(prev => {
                      const updated = [...prev];
                      const last = updated[updated.length - 1];
                      if (last && last.role === 'model') {
                        last.text += data.text;
                      }
                      return updated;
                    });
                  }
                } catch (e) {
                  console.error("Error parsing stream chunk", e, line);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I am having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

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
              {isLoading && (
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
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 flex-shrink-0 bg-saffron hover:bg-saffron-dark text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
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
