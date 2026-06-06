import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, MapPin, Calendar, CreditCard, RotateCw, History, User as UserIcon, Settings, Home, Plus, Trash2, LogOut } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User, signOut, updateProfile, GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';
import { collection, query, where, orderBy, getDocs, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useToast } from './ToastContext';

interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  status: string;
  amount: number;
  address: string;
  phone: string;
  date: string;
  time: string;
  createdAt: any;
}

interface Address {
  id: string;
  label: string;
  address: string;
}

interface UserProfileData {
  addresses?: Address[];
  phone?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
}

interface UserProfileProps {
  onClose: () => void;
  onRebook: (serviceId: string) => void;
}

type TabType = 'bookings' | 'addresses' | 'settings';

export function UserProfile({ onClose, onRebook }: UserProfileProps) {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [activeTab, setActiveTab] = useState<TabType>('bookings');
  const [signingIn, setSigningIn] = useState<'idle' | 'google' | 'guest'>('idle');

  const handleGoogleSignIn = async () => {
    setSigningIn('google');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast('success', 'Logged In', 'Successfully signed in with Google.');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      toast('error', 'Sign-In Failed', error.message || 'Could not sign in with Google.');
    } finally {
      setSigningIn('idle');
    }
  };

  const handleGuestSignIn = async () => {
    setSigningIn('guest');
    try {
      await signInAnonymously(auth);
      toast('success', 'Guest Access', 'Logged in successfully as a guest.');
    } catch (error: any) {
      console.error('Guest Sign-In Error:', error);
      toast('error', 'Authentication Failed', error.message || 'Could not sign in as a guest.');
    } finally {
      setSigningIn('idle');
    }
  };
  
  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Profile data state
  const [profileData, setProfileData] = useState<UserProfileData>({ addresses: [], emailNotifications: true, smsNotifications: true });
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Form states
  const [saving, setSaving] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('');
  const [newAddressText, setNewAddressText] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Settings state
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setDisplayName(currentUser.displayName || '');
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setLoadingBookings(false);
        setLoadingProfile(false);
        return;
      }
      try {
        // Fetch bookings
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Booking[];
        
        // Sort in memory by createdAt descending to avoid requiring a composite index in Firestore
        data.sort((a, b) => {
          const timeA = a.createdAt?.seconds !== undefined ? a.createdAt.seconds : (a.createdAt instanceof Date ? a.createdAt.getTime() / 1000 : 0);
          const timeB = b.createdAt?.seconds !== undefined ? b.createdAt.seconds : (b.createdAt instanceof Date ? b.createdAt.getTime() / 1000 : 0);
          return timeB - timeA;
        });
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoadingBookings(false);
      }

      try {
        // Fetch profile
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const pData = userSnap.data() as UserProfileData;
          setProfileData(pData);
          setPhone(pData.phone || '');
        } else {
          // Create default profile
          await setDoc(userRef, { addresses: [], emailNotifications: true, smsNotifications: true });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchData();
  }, [user]);

  const handleAddAddress = async () => {
    if (!user || !newAddressLabel.trim() || !newAddressText.trim()) return;
    setSaving(true);
    try {
      const newAddr: Address = {
        id: Date.now().toString(),
        label: newAddressLabel,
        address: newAddressText
      };
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        addresses: arrayUnion(newAddr)
      });
      setProfileData(prev => ({ ...prev, addresses: [...(prev.addresses || []), newAddr] }));
      setNewAddressLabel('');
      setNewAddressText('');
      setShowAddAddress(false);
    } catch (error) {
      console.error('Failed to add address:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (addressToRemove: Address) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        addresses: arrayRemove(addressToRemove)
      });
      setProfileData(prev => ({
        ...prev,
        addresses: prev.addresses?.filter(a => a.id !== addressToRemove.id)
      }));
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        phone: phone,
        emailNotifications: profileData.emailNotifications,
        smsNotifications: profileData.smsNotifications
      });
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] flex justify-end bg-navy/40 backdrop-blur-sm">
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md h-full bg-slate-50 flex flex-col shadow-2xl relative"
        >
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 rounded-full bg-white shadow hover:bg-slate-100 text-slate-400 hover:text-navy transition-colors z-30"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex-1 flex flex-col justify-center px-8 py-12 relative overflow-hidden">
            {/* Background ambient accents */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-saffron/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-navy/5 rounded-full blur-3xl -ml-16 -mb-16" />
            
            <div className="relative z-10 text-center space-y-6">
              {/* Profile icon with double rings */}
              <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-navy to-slate-800 rounded-3xl flex items-center justify-center text-white shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300">
                <UserIcon className="w-10 h-10 animate-pulse" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-navy tracking-tight mb-2">Welcome to Servico</h2>
                <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Sign in to seamlessly manage home repairs, coordinate with assigned technicians in real-time, and store your delivery locations.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {/* Google Sign In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={signingIn !== 'idle'}
                  className="w-full flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transform active:scale-95 transition-all text-sm group focus:outline-none focus:ring-2 focus:ring-navy/20 cursor-pointer"
                >
                  {signingIn === 'google' ? (
                    <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.6-4.53-5.01-4.53z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign in with Google
                    </>
                  )}
                </button>

                {/* Guest Sign In Button */}
                <button
                  onClick={handleGuestSignIn}
                  disabled={signingIn !== 'idle'}
                  className="w-full flex items-center justify-center bg-navy hover:bg-navy-light text-white font-bold py-3.5 px-5 rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.15)] transform active:scale-95 transition-all text-sm focus:outline-none focus:ring-2 focus:ring-navy/50 cursor-pointer"
                >
                  {signingIn === 'guest' ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Continue as Guest'
                  )}
                </button>
              </div>

              <div className="pt-2 text-xs text-slate-400 font-medium font-sans">
                By signing in, you agree to Servico's Terms & Privacy standards.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-navy/40 backdrop-blur-sm">
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md h-full bg-slate-50 flex flex-col shadow-2xl overflow-y-auto"
      >
        <div className="bg-white px-6 pt-8 pb-4 border-b border-slate-100 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-navy/5 overflow-hidden flex items-center justify-center text-navy ring-2 ring-saffron/20 ring-offset-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-6 h-6" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy leading-tight">{user.displayName || 'User Profile'}</h2>
                <p className="text-xs text-slate-500 font-medium">{user.email}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-navy transition-colors shrink-0">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex bg-slate-100/80 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'bookings' ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-navy'}`}
            >
              <History className="w-4 h-4" /> Bookings
            </button>
            <button 
              onClick={() => setActiveTab('addresses')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'addresses' ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-navy'}`}
            >
              <MapPin className="w-4 h-4" /> Addresses
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'settings' ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-navy'}`}
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
          </div>
        </div>

        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {loadingBookings ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron"></div>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-500 py-12">
                    <History className="w-12 h-12 text-slate-300" />
                    <p className="font-medium text-lg">No past bookings found.</p>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/5 rounded-full blur-3xl -mx-10 -my-10" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-navy text-lg">{booking.serviceName}</h3>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${booking.status === 'completed' ? 'bg-green-50 text-india-green border-green-200' : booking.status === 'cancelled' ? 'bg-red-50 text-red-500 border-red-200' : 'bg-saffron/10 text-saffron-dark border-saffron/20'}`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                            <Calendar className="w-4 h-4 text-saffron" />
                            <span>{booking.date} at {booking.time}</span>
                          </div>
                          <div className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                            <MapPin className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{booking.address}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                            <CreditCard className="w-4 h-4 text-saffron" />
                            <span>₹{booking.amount}</span>
                          </div>
                        </div>

                        {/* Progress Bar for Active Bookings */}
                        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                          <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Live Status</h4>
                            <div className="relative">
                              <div className="absolute top-2.5 left-0 w-full h-1 bg-slate-200 rounded-full" />
                              <div className="absolute top-2.5 left-0 h-1 bg-saffron rounded-full transition-all duration-1000" style={{ width: booking.status === 'pending' ? '25%' : booking.status === 'assigned' ? '50%' : booking.status === 'on_the_way' ? '75%' : '100%' }} />

                              <div className="relative flex justify-between">
                                {['Accepted', 'Assigned', 'On Route', 'Completed'].map((stage, idx) => {
                                  const isActiveOrPast = 
                                    (booking.status === 'pending' && idx <= 0) ||
                                    (booking.status === 'assigned' && idx <= 1) ||
                                    (booking.status === 'on_the_way' && idx <= 2) ||
                                    (booking.status === 'completed' && idx <= 3);

                                  return (
                                    <div key={stage} className="flex flex-col items-center gap-2">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 bg-white transition-colors duration-500 ${isActiveOrPast ? 'border-saffron text-saffron shadow-[0_0_10px_rgba(255,153,51,0.3)]' : 'border-slate-200 text-slate-300'}`}>
                                        {idx + 1}
                                      </div>
                                      <span className={`text-[9px] font-bold uppercase tracking-wider text-center w-16 leading-tight ${isActiveOrPast ? 'text-navy' : 'text-slate-400'}`}>
                                        {stage}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        <button 
                          onClick={() => {
                            onRebook(booking.serviceId);
                            onClose();
                          }}
                          className="w-full bg-slate-50 hover:bg-slate-100 text-navy font-bold py-3 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <RotateCw className="w-4 h-4 text-saffron" />
                          Book Again
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {loadingProfile ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron"></div>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => setShowAddAddress(!showAddAddress)}
                      className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-saffron hover:bg-saffron/5 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-saffron transition-colors font-bold"
                    >
                      {showAddAddress ? <X className="w-5 h-5"/> : <Plus className="w-5 h-5" />}
                      {showAddAddress ? 'Cancel' : 'Add New Address'}
                    </button>

                    <AnimatePresence>
                      {showAddAddress && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location Label</label>
                              <input 
                                type="text"
                                value={newAddressLabel}
                                onChange={e => setNewAddressLabel(e.target.value)}
                                placeholder="e.g. Home, Office, Mom's House"
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Address</label>
                              <textarea 
                                value={newAddressText}
                                onChange={e => setNewAddressText(e.target.value)}
                                placeholder="Complete street address including apartment/flat number..."
                                rows={3}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron transition-all resize-none"
                              />
                            </div>
                            <button
                              onClick={handleAddAddress}
                              disabled={saving || !newAddressLabel.trim() || !newAddressText.trim()}
                              className="w-full bg-navy text-white font-bold py-3 rounded-xl hover:bg-navy-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Save Address'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {profileData.addresses?.length === 0 && !showAddAddress ? (
                      <div className="text-center py-10 text-slate-500">
                        <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="font-medium">No saved addresses yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {profileData.addresses?.map(addr => (
                          <div key={addr.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between group">
                            <div className="flex items-start gap-4 pr-4">
                              <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center text-saffron shrink-0 mt-1">
                                <Home className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-navy">{addr.label}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed mt-1">{addr.address}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteAddress(addr)}
                              className="text-slate-300 hover:text-red-500 transition-colors p-2"
                              title="Delete Address"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {loadingProfile ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron"></div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateSettings} className="space-y-8">
                    <div className="space-y-5">
                      <h3 className="font-bold text-navy text-lg flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-saffron" /> 
                        Personal Info
                      </h3>
                      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Name</label>
                          <input 
                            type="text"
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                          <input 
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full border border-slate-100 bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                          <input 
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="+91..."
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <h3 className="font-bold text-navy text-lg flex items-center gap-2">
                        <Settings className="w-5 h-5 text-saffron" /> 
                        Preferences
                      </h3>
                      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <label className="flex items-center justify-between cursor-pointer group">
                          <div>
                            <span className="block font-bold text-slate-700 text-sm group-hover:text-navy transition-colors">Email Notifications</span>
                            <span className="text-xs text-slate-500">Booking confirmations & updates</span>
                          </div>
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={profileData.emailNotifications}
                              onChange={(e) => setProfileData(prev => ({...prev, emailNotifications: e.target.checked}))}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-india-green"></div>
                          </div>
                        </label>
                        <div className="h-px w-full bg-slate-100" />
                        <label className="flex items-center justify-between cursor-pointer group">
                          <div>
                            <span className="block font-bold text-slate-700 text-sm group-hover:text-navy transition-colors">SMS Notifications</span>
                            <span className="text-xs text-slate-500">Service tracking & OTPs</span>
                          </div>
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={profileData.smsNotifications}
                              onChange={(e) => setProfileData(prev => ({...prev, smsNotifications: e.target.checked}))}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-india-green"></div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="pt-2">
                       <button
                          type="submit"
                          disabled={saving}
                          className="w-full bg-navy text-white font-bold py-3.5 rounded-xl hover:bg-navy-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
                        >
                          {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Save Changes'}
                        </button>
                        
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full bg-red-50 text-red-500 font-bold py-3.5 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <LogOut className="w-5 h-5" /> Sign Out
                        </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
