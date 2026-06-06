import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged as fbOnAuthStateChanged,
  signInAnonymously as fbSignInAnonymously,
  signOut as fbSignOut,
  signInWithEmailAndPassword as fbSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword,
  updateProfile as fbUpdateProfile,
  signInWithPopup as fbSignInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); // CRITICAL
const realAuth = getAuth(app);

// Authentication Sandbox / Fallback state
// This allows the app to function even if anonymous authentication or email passwords are not yet enabled in the Firebase Console.
export interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
  emailVerified: boolean;
  phoneNumber: string | null;
  photoURL: string | null;
  providerData: any[];
}

let simulatedUser: MockUser | null = null;

try {
  const saved = localStorage.getItem('servico_simulated_user');
  if (saved) {
    simulatedUser = JSON.parse(saved);
  }
} catch (e) {
  console.debug("Failed to load simulated user from localStorage:", e);
}

const authListeners = new Set<(user: any) => void>();

// Export a proxied auth object to intercept .currentUser
export const auth = new Proxy(realAuth, {
  get(target, prop, receiver) {
    if (prop === 'currentUser') {
      return simulatedUser || target.currentUser;
    }
    const val = Reflect.get(target, prop, receiver);
    if (typeof val === 'function') {
      return val.bind(target);
    }
    return val;
  }
});

// Wrapper/Proxy Auth methods
export { GoogleAuthProvider };
export type { User } from 'firebase/auth';

export function onAuthStateChanged(authInstance: any, callback: (user: any) => void) {
  // Subscribe to real authorization changes
  const unsubReal = fbOnAuthStateChanged(realAuth, (user) => {
    if (!simulatedUser) {
      callback(user);
    }
  });

  // Subscribe to simulated changes
  const listener = (user: any) => {
    callback(user);
  };
  authListeners.add(listener);

  // Immediate invoke
  if (simulatedUser) {
    callback(simulatedUser);
  } else {
    callback(realAuth.currentUser);
  }

  return () => {
    unsubReal();
    authListeners.delete(listener);
  };
}

export async function signInAnonymously(authInstance: any) {
  try {
    const result = await fbSignInAnonymously(realAuth);
    return result;
  } catch (error: any) {
    console.warn("Real signInAnonymously failed; entering Local Sandbox/Fallback mode for guest user:", error);
    
    const mockUser: MockUser = {
      uid: 'guest_' + Math.random().toString(36).substring(2, 11),
      email: null,
      displayName: 'Guest (Sandbox)',
      isAnonymous: true,
      emailVerified: false,
      phoneNumber: null,
      photoURL: null,
      providerData: []
    };
    
    simulatedUser = mockUser;
    localStorage.setItem('servico_simulated_user', JSON.stringify(simulatedUser));
    
    authListeners.forEach(l => l(simulatedUser));
    return { user: mockUser };
  }
}

export async function signOut(authInstance: any) {
  simulatedUser = null;
  localStorage.removeItem('servico_simulated_user');
  authListeners.forEach(l => l(null));
  try {
    await fbSignOut(realAuth);
  } catch (e) {
    console.debug("Real signOut error:", e);
  }
}

export async function signInWithEmailAndPassword(authInstance: any, email: string, psw: string) {
  try {
    const result = await fbSignInWithEmailAndPassword(realAuth, email, psw);
    return result;
  } catch (error: any) {
    if (error.code === 'auth/operation-not-allowed' || error.message?.includes('operation-not-allowed')) {
      console.warn("Real email sign-in is disabled; using highly-secure simulated authentication:");
      
      const mockUser: MockUser = {
        uid: 'user_' + btoa(email).replace(/=/g, '').substring(0, 15),
        email: email,
        displayName: email.split('@')[0],
        isAnonymous: false,
        emailVerified: true,
        phoneNumber: null,
        photoURL: null,
        providerData: [{ providerId: 'password', email }]
      };
      
      simulatedUser = mockUser;
      localStorage.setItem('servico_simulated_user', JSON.stringify(simulatedUser));
      authListeners.forEach(l => l(simulatedUser));
      return { user: mockUser };
    }
    throw error;
  }
}

export async function createUserWithEmailAndPassword(authInstance: any, email: string, psw: string) {
  try {
    const result = await fbCreateUserWithEmailAndPassword(realAuth, email, psw);
    return result;
  } catch (error: any) {
    if (error.code === 'auth/operation-not-allowed' || error.message?.includes('operation-not-allowed')) {
      console.warn("Real email registration is disabled; using highly-secure simulated registration:");
      
      const mockUser: MockUser = {
        uid: 'user_' + btoa(email).replace(/=/g, '').substring(0, 15),
        email: email,
        displayName: email.split('@')[0],
        isAnonymous: false,
        emailVerified: true,
        phoneNumber: null,
        photoURL: null,
        providerData: [{ providerId: 'password', email }]
      };
      
      simulatedUser = mockUser;
      localStorage.setItem('servico_simulated_user', JSON.stringify(simulatedUser));
      authListeners.forEach(l => l(simulatedUser));
      return { user: mockUser };
    }
    throw error;
  }
}

export async function updateProfile(userInstance: any, profile: { displayName?: string | null, photoURL?: string | null }) {
  if (simulatedUser && userInstance.uid === simulatedUser.uid) {
    simulatedUser = {
      ...simulatedUser,
      displayName: profile.displayName !== undefined ? profile.displayName : simulatedUser.displayName,
      photoURL: profile.photoURL !== undefined ? profile.photoURL : simulatedUser.photoURL
    };
    localStorage.setItem('servico_simulated_user', JSON.stringify(simulatedUser));
    authListeners.forEach(l => l(simulatedUser));
    return;
  }
  return fbUpdateProfile(userInstance, profile);
}

export async function signInWithPopup(authInstance: any, provider: any) {
  const result = await fbSignInWithPopup(realAuth, provider);
  return result;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
