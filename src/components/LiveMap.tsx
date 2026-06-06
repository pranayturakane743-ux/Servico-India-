import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Phone, ShieldCheck, MessageCircle, X, Send } from 'lucide-react';
import { useToast } from './ToastContext';
import { auth, db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { SafeVideo } from './SafeVideo';

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
}

export const LiveMap = ({ onAdvance, technician, bookingId }: { onAdvance: () => void, technician?: any, bookingId?: string }) => {
  const [eta, setEta] = useState(60);
  const [distance, setDistance] = useState("2.4 km");
  const { toast } = useToast();
  
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = auth.currentUser?.uid;
  
  const techName = technician?.name || "Ramesh";
  const techAvatar = technician?.imageUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${techName}`;

  // Simulate progress
  useEffect(() => {
    // Only advance ETA if chat is not open so user can actually type
    let timer: NodeJS.Timeout;
    if (!showChat) {
      timer = setInterval(() => {
        setEta((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000); // Fast simulation
    }
    return () => clearInterval(timer);
  }, [showChat]);

  useEffect(() => {
    if (eta === 2) {
      toast('info', 'Technician Arriving Soon', `${techName} is just 2 minutes away from your location.`);
    }
    if (eta === 0 && !showChat) { // wait for chat to close if open
      const timeoutId = setTimeout(() => onAdvance(), 1000);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eta, showChat]);

  // Chat subscription
  useEffect(() => {
    if (!bookingId || !currentUserId) return;
    
    const messagesRef = collection(db, `bookings/${bookingId}/messages`);
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages: Message[] = [];
      snapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(fetchedMessages);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, (error) => {
      console.error("Firestore Listen Error:", error);
    });

    return () => unsubscribe();
  }, [bookingId, currentUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !bookingId || !currentUserId) return;

    try {
      await addDoc(collection(db, `bookings/${bookingId}/messages`), {
        text: newMessage.trim(),
        senderId: currentUserId,
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error("Failed to send message:", error);
      toast('error', 'Error', 'Failed to send message');
    }
  };

  return (
    <div className="w-full flex flex-col h-full bg-slate-50 relative overflow-hidden rounded-xl">
      {/* Faux Map Background */}
      <div className="absolute inset-0 bg-[#e5e3df] overflow-hidden">
        {/* Decorative Grid / Streets */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Moving Technician Indicator */}
        <motion.div
          animate={{
            x: [0, 80, 100, 200, 250],
            y: [0, -50, 20, 0, -80],
          }}
          transition={{ duration: 60, ease: 'linear' }}
          className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <div className="relative">
            <span className="absolute -inset-4 bg-saffron/20 rounded-full animate-ping" />
            <div className="bg-saffron text-white p-3 rounded-full shadow-lg relative z-10">
              <Navigation className="w-6 h-6" />
            </div>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-bold shadow">
              {techName}
            </div>
          </div>
        </motion.div>

        {/* Home Destination */}
        <div className="absolute top-[30%] left-[80%] z-0">
          <MapPin className="text-india-green w-10 h-10 -ml-5 -mt-10" />
        </div>
        
        {/* Simulated Route Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 stroke-navy" strokeWidth="4" fill="none" strokeDasharray="8 8">
          <path d="M 150 200 Q 250 100, 300 230 T 450 150" />
        </svg>
      </div>

      {/* Foreground Overlay UI */}
      <div className="relative z-20 mt-auto bg-white p-6 pt-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-3xl border-t border-slate-100 flex-shrink-0">
        
        <AnimatePresence>
          {showChat && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 300, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden flex flex-col mb-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner relative"
            >
              <div className="bg-navy p-3 flex items-center justify-between sticky top-0 z-10 rounded-t-2xl">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10">
                     <img src={techAvatar} alt={techName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight">{techName}</h4>
                    <p className="text-[10px] text-white/70">Assigned Technician</p>
                  </div>
                </div>
                <button onClick={() => setShowChat(false)} className="text-white/70 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <MessageCircle className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm font-medium">Say hi to {techName}!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-navy text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-navy rounded-tl-sm shadow-sm'}`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2 rounded-b-2xl">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="w-9 h-9 flex-shrink-0 bg-navy hover:bg-navy-light disabled:opacity-50 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {!showChat && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-navy">
                  {eta > 0 ? `${eta} min away` : 'Arriving now!'}
                </h3>
                <p className="text-slate-500 font-medium">{distance} towards destination</p>
              </div>
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                {technician?.videoUrl ? (
                  <SafeVideo 
                    src={technician.videoUrl} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src={techAvatar} alt={techName} className="w-full h-full object-cover" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 w-full">
              <div className="bg-green-100 p-2 rounded-full shrink-0">
                <ShieldCheck className="text-india-green w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-navy text-sm max-w-full truncate overflow-hidden text-ellipsis">Verified</p>
                <p className="text-[11px] text-slate-500 max-w-full truncate overflow-hidden text-ellipsis">OTP: <strong className="ml-1">8192</strong></p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setShowChat(true)} className="bg-saffron text-white p-2.5 rounded-full shadow hover:bg-saffron-dark transition-colors border-2 border-transparent">
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button className="bg-navy text-white p-2.5 rounded-full shadow hover:bg-navy-light transition-colors border-2 border-transparent">
                  <Phone className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          </>
        )}
        
        {(!showChat && eta <= 0) && (
          <button onClick={onAdvance} className="w-full bg-saffron hover:bg-saffron-dark text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
            Mark as Completed
          </button>
        )}
      </div>
    </div>
  );
};
