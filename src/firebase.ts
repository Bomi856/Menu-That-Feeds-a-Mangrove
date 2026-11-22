import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  Auth,
  GoogleAuthProvider,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  browserSessionPersistence,
  getAuth,
  inMemoryPersistence,
  indexedDBLocalPersistence,
  initializeAuth,
} from 'firebase/auth';
import {
  Firestore,
  doc,
  getDocFromServer,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

interface FirebaseAppletConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  appId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  firestoreDatabaseId?: string;
}

const localConfigModules = import.meta.glob<{ default: FirebaseAppletConfig }>(
  '../firebase-applet-config.json',
  { eager: true }
);
const localConfig: FirebaseAppletConfig =
  Object.values(localConfigModules)[0]?.default || {};

const envApiKey = (import.meta.env.VITE_FIREBASE_API_KEY || '').trim();
const envProjectId = (import.meta.env.VITE_FIREBASE_PROJECT_ID || '').trim();

const envConfig: FirebaseAppletConfig = {
  apiKey: envApiKey,
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '').trim(),
  projectId: envProjectId,
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || '').trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '').trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '').trim(),
  firestoreDatabaseId: (import.meta.env.VITE_FIREBASE_DATABASE_ID || '').trim(),
};

const resolvedConfig: FirebaseAppletConfig =
  envConfig.apiKey && envConfig.projectId ? envConfig : localConfig;

function createAuth(app: FirebaseApp): Auth {
  try {
    return initializeAuth(app, {
      persistence: [
        indexedDBLocalPersistence,
        browserLocalPersistence,
        browserSessionPersistence,
        inMemoryPersistence,
      ],
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch {
    return getAuth(app);
  }
}

let app: FirebaseApp | null = null;
export let db: Firestore | null = null;
export let auth: Auth | null = null;
export let googleProvider: GoogleAuthProvider | null = null;
export let firebaseEnabled = false;

if (resolvedConfig.apiKey && resolvedConfig.projectId) {
  try {
    app = initializeApp({
      apiKey: resolvedConfig.apiKey,
      authDomain: resolvedConfig.authDomain,
      projectId: resolvedConfig.projectId,
      appId: resolvedConfig.appId,
      storageBucket: resolvedConfig.storageBucket,
      messagingSenderId: resolvedConfig.messagingSenderId,
    });
    db = resolvedConfig.firestoreDatabaseId
      ? getFirestore(app, resolvedConfig.firestoreDatabaseId)
      : getFirestore(app);
    auth = createAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    firebaseEnabled = true;
  } catch (err) {
    console.warn('Firebase initialization skipped; using local save mode:', err);
    app = null;
    db = null;
    auth = null;
    googleProvider = null;
    firebaseEnabled = false;
  }
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
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo:
        auth?.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection(): Promise<void> {
  if (!db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

void testConnection();

export interface CloudProgressPayload {
  theme: 'blue' | 'green' | 'pink';
  lang?: 'en' | 'th' | 'my';
  shellsPending: number;
  shellsFed: number;
  kp: number;
  mealsCooked: number;
  cookedCounts: Record<string, number>;
  readStories: Record<string, boolean>;
  solvedQuizzes: Record<string, boolean>;
  unlockedWardrobe: string[];
  equippedWardrobe: string[];
  lastDaily: string;
  streak: number;
  dailyDate: string;
  dailyCooked: number;
  dailyQuizzes: number;
  dailyFed: number;
  saplingName?: string;
  activeRestaurantId?: 'jaOh' | 'lungYa' | 'ruenTalay' | 'baanChayTalay';
  explorer: {
    name: string;
    gender?: 'girl' | 'boy';
    pronouns?: 'he' | 'she' | 'they' | 'none';
    hair: number;
    skin: number;
    apron: number;
    style: number;
    accessory: number;
  };
}

function sanitizePayload(data: CloudProgressPayload) {
  const clampInt = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, Math.floor(Number.isFinite(n) ? n : min)));

  return {
    theme: (['blue', 'green', 'pink'].includes(data.theme) ? data.theme : 'blue') as
      | 'blue'
      | 'green'
      | 'pink',
    lang: (['en', 'th', 'my'].includes(data.lang || '') ? data.lang : 'en') as 'en' | 'th' | 'my',
    shellsPending: clampInt(data.shellsPending, 0, 10000),
    shellsFed: clampInt(data.shellsFed, 0, 100000),
    kp: clampInt(data.kp, 0, 1000000),
    mealsCooked: clampInt(data.mealsCooked, 0, 100000),
    cookedCounts: data.cookedCounts || {},
    readStories: data.readStories || {},
    solvedQuizzes: data.solvedQuizzes || {},
    unlockedWardrobe: (data.unlockedWardrobe || []).slice(0, 10),
    equippedWardrobe: (data.equippedWardrobe || []).slice(0, 10),
    lastDaily: String(data.lastDaily || '').slice(0, 64),
    streak: clampInt(data.streak, 0, 10000),
    dailyDate: String(data.dailyDate || '').slice(0, 64),
    dailyCooked: clampInt(data.dailyCooked, 0, 1000),
    dailyQuizzes: clampInt(data.dailyQuizzes, 0, 1000),
    dailyFed: clampInt(data.dailyFed, 0, 1000),
    saplingName: String(data.saplingName || 'Sprouty').trim().slice(0, 24) || 'Sprouty',
    activeRestaurantId: (['jaOh', 'lungYa', 'ruenTalay', 'baanChayTalay'].includes(
      data.activeRestaurantId || ''
    )
      ? data.activeRestaurantId
      : 'jaOh') as 'jaOh' | 'lungYa' | 'ruenTalay' | 'baanChayTalay',
    explorer: {
      name: String(data.explorer?.name || 'Coastal Chef').trim().slice(0, 24) || 'Coastal Chef',
      gender: (data.explorer?.gender === 'boy' ? 'boy' : 'girl') as 'girl' | 'boy',
      pronouns: (['he', 'she', 'they', 'none'].includes(data.explorer?.pronouns || '')
        ? data.explorer?.pronouns
        : 'none') as 'he' | 'she' | 'they' | 'none',
      hair: clampInt(data.explorer?.hair ?? 0, 0, 10),
      skin: clampInt(data.explorer?.skin ?? 1, 0, 10),
      apron: clampInt(data.explorer?.apron ?? 0, 0, 10),
      style: clampInt(data.explorer?.style ?? 0, 0, 10),
      accessory: clampInt(data.explorer?.accessory ?? 0, 0, 10),
    },
  };
}

export function subscribeUserProgress(
  uid: string,
  onData: (data: CloudProgressPayload | null) => void,
  onError: (err: Error) => void
): () => void {
  if (!db) {
    onData(null);
    return () => {};
  }
  const path = `users/${uid}`;
  const ref = doc(db, 'users', uid);

  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      onData(snap.data() as CloudProgressPayload);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function saveUserProgressToCloud(
  uid: string,
  payload: CloudProgressPayload,
  existsInCloud: boolean
): Promise<void> {
  if (!db) return;
  const path = `users/${uid}`;
  const ref = doc(db, 'users', uid);
  const clean = sanitizePayload(payload);

  try {
    if (!existsInCloud) {
      await setDoc(ref, {
        uid,
        ...clean,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        ...clean,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, existsInCloud ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}
