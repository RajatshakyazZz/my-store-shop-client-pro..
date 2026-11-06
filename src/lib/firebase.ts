import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyD8rz1-VaHEaS-ZpEMeShK-v1CG66BFz9s',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'creator-mint-bf2b1.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'creator-mint-bf2b1',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'creator-mint-bf2b1.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '720751971659',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:720751971659:web:2b924dce33742132796cce',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-90HTFP4RB2',
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported && app) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {});
  }
} catch (error) {
  console.warn('Firebase initialized in fallback mode:', error);
}

export { app, db, auth, analytics };
export const getFirebaseDb = () => db;

export interface StoreOrder {
  id?: string;
  orderNumber: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  items: Array<{
    id: string;
    title: string;
    price: number;
    license: 'personal' | 'reseller';
    googleDriveLink?: string;
  }>;
  orderBump?: {
    id: string;
    title: string;
    price: number;
  } | null;
  totalAmount: number;
  paymentMethod: string;
  status: 'completed' | 'processing' | 'pending';
  createdAt?: any;
}

// 1. Create Order in Firestore
export async function createOrderInFirestore(order: Omit<StoreOrder, 'id' | 'createdAt'>): Promise<string> {
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
  const orderPayload = {
    ...order,
    orderNumber,
    createdAt: serverTimestamp(),
    timestampIso: new Date().toISOString(),
  };

  if (db) {
    try {
      const docRef = await addDoc(collection(db, 'orders'), orderPayload);
      return docRef.id;
    } catch (err) {
      console.error('Failed to create order in Firestore, using local fallback:', err);
    }
  }

  // Local fallback persistence
  const localOrders = JSON.parse(localStorage.getItem('vaultzet_orders') || '[]');
  const fallbackOrder = { id: `local-${Date.now()}`, ...orderPayload };
  localOrders.unshift(fallbackOrder);
  localStorage.setItem('vaultzet_orders', JSON.stringify(localOrders));
  return fallbackOrder.id;
}

// 2. Fetch Orders by Customer Email (for /my-order portal)
export async function getCustomerOrders(email: string): Promise<StoreOrder[]> {
  const cleanEmail = email.trim().toLowerCase();
  if (db) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('customer.email', '==', cleanEmail),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as StoreOrder));
      }
    } catch (err) {
      console.warn('Firestore query failed, checking fallback:', err);
    }
  }

  // Fallback to local storage
  const localOrders: StoreOrder[] = JSON.parse(localStorage.getItem('vaultzet_orders') || '[]');
  return localOrders.filter((o) => o.customer.email.toLowerCase() === cleanEmail);
}

// 3. Fetch Single Order by ID (for /order-success page)
export async function getOrderById(orderId: string): Promise<StoreOrder | null> {
  if (db && !orderId.startsWith('local-')) {
    try {
      const docRef = doc(db, 'orders', orderId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as StoreOrder;
      }
    } catch (err) {
      console.warn('Error fetching order by ID:', err);
    }
  }

  // Fallback to local storage
  const localOrders: StoreOrder[] = JSON.parse(localStorage.getItem('vaultzet_orders') || '[]');
  return localOrders.find((o) => o.id === orderId || o.orderNumber === orderId) || null;
}
