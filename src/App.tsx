import React, { useCallback, useEffect, useRef, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { CoastalMapSection } from './components/CoastalMapSection';
import { CookingModal } from './components/CookingModal';
import { FieldGuideSection, WardrobeSection } from './components/FieldGuideAndWardrobe';
import { InteractiveMenus } from './components/InteractiveMenus';
import {
  ExplorerAvatar,
  OfficialPixelSprite,
  PixelDivider,
  PixelMascotIllustration,
  PixelMusicPlayerIcon,
  SaplingIllustration,
  ShellIllustration,
  TomodachiMood,
} from './components/KawaiiIllustrations';
import { CuteLoadingScreen, WelcomeModal } from './components/LoadingAndWelcome';
import { SanctuarySidebar } from './components/SanctuarySidebar';
import {
  AVATAR_ACCESSORIES,
  AVATAR_BOY_STYLES,
  AVATAR_COLORS,
  AVATAR_STYLES,
  BANG_KHUN_THIAN_RESTAURANTS,
  DISHES,
  Dish,
  MenuBoardType,
  RESTAURANT_IDS,
  RestaurantId,
  SAPLING_STAGES,
  SAPLING_TIPS,
  WardrobeItem,
  getRestaurantById,
} from './data/gameData';
import {
  AppLang,
  LANG_OPTIONS,
  PRONOUN_OPTIONS,
  PronounId,
  UI_TEXT,
  getChefGreeting,
} from './data/i18n';
import {
  CloudProgressPayload,
  auth,
  googleProvider,
  saveUserProgressToCloud,
  subscribeUserProgress,
} from './firebase';
import { MusicTrackId, cuteAudio } from './utils/audio';

type ActiveSection = 'menus' | 'map' | 'guide' | 'wardrobe';
type PastelTheme = 'blue' | 'green' | 'pink';

const THEME_META: Record<PastelTheme, { label: string; swatch: string }> = {
  blue: { label: 'Pastel Blue', swatch: '#91D4F5' },
  green: { label: 'Pastel Green', swatch: '#97DAA5' },
  pink: { label: 'Pastel Pink', swatch: '#FFAECC' },
};
const THEME_ORDER: PastelTheme[] = ['blue', 'green', 'pink'];
const ALONE_TIMEOUT_MS = 45000;

interface SaveState {
  lang: AppLang;
  theme: PastelTheme;
  shellsPending: number;
  shellsFed: number;
  kp: number;
  mealsCooked: number;
  cookedCounts: Record<string, number>;
  readStories: Record<string, boolean>;
  solvedQuizzes: Record<string, boolean>;
  unlockedWardrobe: WardrobeItem['id'][];
  equippedWardrobe: WardrobeItem['id'][];
  lastDaily: string;
  streak: number;
  dailyDate: string;
  dailyCooked: number;
  dailyQuizzes: number;
  dailyFed: number;
  saplingName: string;
  activeRestaurantId: RestaurantId;
  explorer: {
    name: string;
    pronouns: PronounId;
    gender: 'girl' | 'boy';
    hair: number;
    skin: number;
    apron: number;
    style: number;
    accessory: number;
  };
}

const STORAGE_KEY = 'mangrove-cafe-v4';
const WELCOME_KEY = 'mangrove-cafe-welcome-v1';
const CHEF_SETUP_KEY = 'mangrove-chef-setup-v1';

function getTodayKey(): string {
  return new Date().toDateString();
}

function normalizeLang(raw: unknown): AppLang {
  return raw === 'th' || raw === 'my' ? raw : 'en';
}

function normalizePronouns(raw: unknown): PronounId {
  return raw === 'he' || raw === 'she' || raw === 'they' ? raw : 'none';
}

function createInitialState(): SaveState {
  return {
    lang: 'en',
    theme: 'blue',
    shellsPending: 2,
    shellsFed: 0,
    kp: 10,
    mealsCooked: 0,
    cookedCounts: {},
    readStories: {},
    solvedQuizzes: {},
    unlockedWardrobe: [],
    equippedWardrobe: [],
    lastDaily: '',
    streak: 0,
    dailyDate: getTodayKey(),
    dailyCooked: 0,
    dailyQuizzes: 0,
    dailyFed: 0,
    saplingName: 'Sprouty',
    activeRestaurantId: 'jaOh',
    explorer: {
      name: 'Coastal Chef',
      pronouns: 'none',
      gender: 'girl',
      hair: 0,
      skin: 0,
      apron: 0,
      style: 0,
      accessory: 1,
    },
  };
}

function normalizeState(raw: Partial<SaveState>): SaveState {
  const base = createInitialState();
  const shellsFed = typeof raw.shellsFed === 'number' && Number.isFinite(raw.shellsFed) ? raw.shellsFed : 0;
  const candidateStop = RESTAURANT_IDS.includes(raw.activeRestaurantId as RestaurantId)
    ? getRestaurantById(raw.activeRestaurantId)
    : BANG_KHUN_THIAN_RESTAURANTS[0];
  const validStop =
    shellsFed >= candidateStop.shellsRequired ? candidateStop.id : BANG_KHUN_THIAN_RESTAURANTS[0].id;

  const merged: SaveState = {
    ...base,
    ...raw,
    lang: normalizeLang(raw.lang),
    theme: THEME_ORDER.includes(raw.theme as PastelTheme)
      ? (raw.theme as PastelTheme)
      : 'blue',
    saplingName:
      typeof raw.saplingName === 'string' && raw.saplingName.trim()
        ? raw.saplingName.trim().slice(0, 24)
        : 'Sprouty',
    activeRestaurantId: validStop,
    explorer: {
      ...base.explorer,
      ...(raw.explorer || {}),
      pronouns: normalizePronouns(raw.explorer?.pronouns),
      gender: raw.explorer?.gender === 'boy' ? 'boy' : 'girl',
    },
  };
  if (merged.dailyDate !== getTodayKey()) {
    merged.dailyDate = getTodayKey();
    merged.dailyCooked = 0;
    merged.dailyQuizzes = 0;
    merged.dailyFed = 0;
  }
  return merged;
}

function loadLocalState(): SaveState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    return normalizeState(JSON.parse(raw) as Partial<SaveState>);
  } catch {
    return createInitialState();
  }
}

function getStageIndex(shellsFed: number): number {
  let idx = 0;
  SAPLING_STAGES.forEach((stage, i) => {
    if (shellsFed >= stage.atShells) idx = i;
  });
  return idx;
}

function launchConfetti(count = 24) {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const icons = ['🌱', '🐚', '🌊', '🦀', '🌿', '✨', '⭐'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'confetti-piece';
    el.textContent = icons[Math.floor(Math.random() * icons.length)];
    el.style.left = `${Math.random() * 96}vw`;
    el.style.animationDelay = `${Math.random() * 0.45}s`;
    el.style.fontSize = `${16 + Math.random() * 14}px`;
    document.body.appendChild(el);
    window.setTimeout(() => el.remove(), 2500);
  }
}

export default function App() {
  const [state, setState] = useState<SaveState>(loadLocalState);
  const [activeSection, setActiveSection] = useState<ActiveSection>('menus');
  const [activeBoard, setActiveBoard] = useState<MenuBoardType>('coastal');
  const [filterByActiveStop, setFilterByActiveStop] = useState(false);
  const [cookingDish, setCookingDish] = useState<Dish | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const [musicTrack, setMusicTrack] = useState<MusicTrackId>('magnetic');
  const [saplingPop, setSaplingPop] = useState(false);
  const [saplingTip, setSaplingTip] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [cheerMsg, setCheerMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeAlreadyRead, setWelcomeAlreadyRead] = useState(false);
  const [showExplorerModal, setShowExplorerModal] = useState(false);
  const [isOpeningSetup, setIsOpeningSetup] = useState(false);
  const [draftExplorer, setDraftExplorer] = useState(state.explorer);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetIncludeChef, setResetIncludeChef] = useState(false);
  const reopenedWelcomeFromNavRef = useRef(false);
  const pendingMusicStartRef = useRef(false);
  const t = UI_TEXT[state.lang];

  // Tomodachi alive mood & blinking state
  const [tomodachiMood, setTomodachiMood] = useState<TomodachiMood>('idle');
  const [heroBlinking, setHeroBlinking] = useState(false);
  const lastActivityRef = useRef<number>(Date.now());
  const moodTimerRef = useRef<number | null>(null);

  // Firebase Auth & Cloud Sync state
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [cloudSyncing, setCloudSyncing] = useState(false);
  const cloudDocExistsRef = useRef(false);
  const skipNextCloudWriteRef = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const touchActivity = useCallback((nextMood?: TomodachiMood, durationMs = 3000) => {
    lastActivityRef.current = Date.now();
    if (moodTimerRef.current !== null) {
      window.clearTimeout(moodTimerRef.current);
      moodTimerRef.current = null;
    }
    if (nextMood) {
      setTomodachiMood(nextMood);
      if (nextMood !== 'idle') {
        moodTimerRef.current = window.setTimeout(() => {
          setTomodachiMood('idle');
        }, durationMs);
      }
    }
  }, []);

  // Check if Tomodachi has been left alone too long -> becomes sad!
  useEffect(() => {
    const iv = window.setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= ALONE_TIMEOUT_MS) {
        setTomodachiMood((curr) => (curr === 'sad' ? curr : 'sad'));
        setSaplingTip((curr) =>
          curr === null ? 'I missed you... tap me or feed a shell!' : curr
        );
      }
    }, 5000);
    return () => window.clearInterval(iv);
  }, []);

  // Natural blinking for the hero Tomodachi preview
  useEffect(() => {
    const iv = window.setInterval(() => {
      setHeroBlinking(true);
      window.setTimeout(() => setHeroBlinking(false), 180);
    }, 3400);
    return () => window.clearInterval(iv);
  }, []);

  // Persist locally & apply pastel theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Subscribe to signed-in user's Firestore progress
  useEffect(() => {
    if (!authUser) {
      cloudDocExistsRef.current = false;
      return;
    }

    const unsub = subscribeUserProgress(
      authUser.uid,
      (cloudData) => {
        if (!cloudData) {
          cloudDocExistsRef.current = false;
          // Seed cloud save with current local progress on first sign-in
          setCloudSyncing(true);
          void saveUserProgressToCloud(
            authUser.uid,
            stateRef.current as CloudProgressPayload,
            false
          )
            .then(() => {
              cloudDocExistsRef.current = true;
            })
            .catch(() => {
              // Errors logged by handleFirestoreError
            })
            .finally(() => setCloudSyncing(false));
          return;
        }

        cloudDocExistsRef.current = true;
        skipNextCloudWriteRef.current = true;
        setState(
          normalizeState({
            ...cloudData,
            lang: normalizeLang(cloudData.lang),
            explorer: {
              ...cloudData.explorer,
              pronouns: normalizePronouns(cloudData.explorer?.pronouns),
              gender: cloudData.explorer?.gender === 'boy' ? 'boy' : 'girl',
            },
            unlockedWardrobe: cloudData.unlockedWardrobe as WardrobeItem['id'][],
            equippedWardrobe: cloudData.equippedWardrobe as WardrobeItem['id'][],
          })
        );
      },
      (err) => {
        console.error('Firestore subscription error:', err);
        setAuthError('Cloud sync could not read your save yet—saving locally for now.');
        setCloudSyncing(false);
      }
    );

    return () => unsub();
  }, [authUser]);

  // Debounced cloud sync whenever state changes while signed in
  useEffect(() => {
    if (!authUser) return;
    if (skipNextCloudWriteRef.current) {
      skipNextCloudWriteRef.current = false;
      return;
    }

    setCloudSyncing(true);
    const t = window.setTimeout(() => {
      void saveUserProgressToCloud(
        authUser.uid,
        state as CloudProgressPayload,
        cloudDocExistsRef.current
      )
        .then(() => {
          cloudDocExistsRef.current = true;
        })
        .catch(() => {
          // Handled in firebase.ts
        })
        .finally(() => setCloudSyncing(false));
    }, 650);

    return () => window.clearTimeout(t);
  }, [state, authUser]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && cuteAudio.getIsPlaying()) {
        cuteAudio.stopMusic();
        setMusicOn(false);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 2600);
  };

  const triggerCheer = (msg: string, confettiCount = 24) => {
    setCheerMsg(msg);
    launchConfetti(confettiCount);
    window.setTimeout(() => {
      setCheerMsg((curr) => (curr === msg ? null : curr));
    }, 2300);
  };

  const handleSignIn = async () => {
    if (signingIn) return;
    setSigningIn(true);
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setAuthError(null);
      showToast(`Signed in as ${res.user.displayName || 'Coastal Chef'}! Cloud save active.`);
      touchActivity('happy', 3000);
    } catch (err) {
      console.error('Google sign-in failed:', err);
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: unknown }).code)
          : '';
      if (code === 'auth/popup-blocked') {
        setAuthError(
          'Popup blocked by your browser. Allow popups for this site and tap Sign in again.'
        );
      } else if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setAuthError('Sign-in popup closed before completing. Tap Sign in to try again.');
      } else if (code === 'auth/unauthorized-domain') {
        setAuthError(
          `Google Sign-In requires "${window.location.hostname}" in Firebase Authorized Domains. Still saving locally!`
        );
      } else {
        setAuthError(
          `Sign-in failed${code ? ` (${code})` : ''}. Your progress stays saved on this device!`
        );
      }
      showToast('Could not sign in—saving progress locally!');
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setAuthError(null);
      showToast('Signed out. Progress remains saved on this device.');
    } catch {
      showToast('Could not sign out right now.');
    }
  };

  const handleCycleTheme = () => {
    const currentIdx = THEME_ORDER.indexOf(state.theme);
    const nextTheme = THEME_ORDER[(currentIdx + 1) % THEME_ORDER.length];
    cuteAudio.playPop(740);
    setState((prev) => ({ ...prev, theme: nextTheme }));
    showToast(`Theme switched to ${THEME_META[nextTheme].label}!`);
  };

  const startMusicNow = useCallback(() => {
    pendingMusicStartRef.current = false;
    if (!cuteAudio.getIsPlaying()) {
      cuteAudio.startMusic();
    }
    setMusicOn(true);
  }, []);

  // Fallback: if browser blocked autoplay on repeat visit, start on first user gesture
  useEffect(() => {
    const onFirstGesture = () => {
      if (!pendingMusicStartRef.current) return;
      pendingMusicStartRef.current = false;
      if (!cuteAudio.getIsPlaying()) {
        cuteAudio.startMusic();
        setMusicOn(true);
      }
    };
    window.addEventListener('pointerdown', onFirstGesture);
    window.addEventListener('keydown', onFirstGesture);
    return () => {
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };
  }, []);

  const handleChangeLang = (nextLang: AppLang) => {
    setState((prev) => ({ ...prev, lang: nextLang }));
  };

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    let hasSeenWelcome = false;
    try {
      hasSeenWelcome = localStorage.getItem(WELCOME_KEY) === '1';
    } catch {
      hasSeenWelcome = false;
    }

    reopenedWelcomeFromNavRef.current = false;
    setWelcomeAlreadyRead(hasSeenWelcome);
    setShowWelcome(true);
  }, []);

  const handleConfirmWelcome = () => {
    try {
      localStorage.setItem(WELCOME_KEY, '1');
    } catch {
      // Ignore storage errors
    }
    const openedFromNav = reopenedWelcomeFromNavRef.current;
    reopenedWelcomeFromNavRef.current = false;
    setWelcomeAlreadyRead(true);
    setShowWelcome(false);
    startMusicNow();
    touchActivity('celebrating', 3000);
    setSaplingTip('Yay! Welcome to Bang Khun Thian! Let’s cook & protect the mangroves!');

    if (!openedFromNav) {
      setDraftExplorer(stateRef.current.explorer);
      setIsOpeningSetup(true);
      setShowExplorerModal(true);
    }
  };

  const handleToggleMusic = () => {
    pendingMusicStartRef.current = false;
    const playing = cuteAudio.toggleMusic();
    setMusicOn(playing);
    if (playing) {
      cuteAudio.playPop(784);
    }
  };

  const handleTrackChange = (track: MusicTrackId) => {
    setMusicTrack(track);
    cuteAudio.setTrack(track);
    if (!musicOn) {
      cuteAudio.startMusic();
      setMusicOn(true);
    } else {
      cuteAudio.playPop(700);
    }
  };

  const handleMistake = (reason: string) => {
    lastActivityRef.current = Date.now();
    if (moodTimerRef.current !== null) {
      window.clearTimeout(moodTimerRef.current);
    }
    setTomodachiMood('sad');
    setSaplingTip(reason);
    moodTimerRef.current = window.setTimeout(() => {
      setTomodachiMood('idle');
    }, 4500);
  };

  const handlePatTomodachi = () => {
    touchActivity('happy', 3200);
    const tip = SAPLING_TIPS[Math.floor(Math.random() * SAPLING_TIPS.length)];
    setSaplingTip(tip);
    setSaplingPop(true);
    window.setTimeout(() => setSaplingPop(false), 450);
  };

  const handleRenameSapling = (nextName: string) => {
    const cleaned = nextName.trim().slice(0, 24) || 'Sprouty';
    setState((prev) => ({ ...prev, saplingName: cleaned }));
    touchActivity('happy', 3000);
    setSaplingTip(`Hi! Call me ${cleaned} from now on!`);
    showToast(`Renamed sapling to ${cleaned}!`);
  };

  const handleCompleteCook = (dish: Dish) => {
    setState((prev) => {
      const prevCount = prev.cookedCounts[dish.id] || 0;
      const kpEarned = prevCount === 0 ? dish.kpReward : 4;
      const resetDay = prev.dailyDate !== getTodayKey();
      return {
        ...prev,
        mealsCooked: prev.mealsCooked + 1,
        shellsPending: prev.shellsPending + dish.shellsReward,
        kp: prev.kp + kpEarned,
        cookedCounts: { ...prev.cookedCounts, [dish.id]: prevCount + 1 },
        dailyDate: getTodayKey(),
        dailyCooked: (resetDay ? 0 : prev.dailyCooked) + 1,
        dailyQuizzes: resetDay ? 0 : prev.dailyQuizzes,
        dailyFed: resetDay ? 0 : prev.dailyFed,
      };
    });
    touchActivity('celebrating', 3600);
    setSaplingTip(`Yay! You made ${dish.en}! Feed me a shell!`);
    triggerCheer(`Yum! Cooked ${dish.en}!`, 26);
  };

  const handleReadStory = (dish: Dish) => {
    touchActivity('happy', 2500);
    if (state.readStories[dish.id]) return;
    setState((prev) => ({
      ...prev,
      kp: prev.kp + 3,
      readStories: { ...prev.readStories, [dish.id]: true },
    }));
    showToast(`Read "${dish.en}" story! +3 KP`);
  };

  const handleSolveQuiz = (dish: Dish, selectedIdx: number): boolean => {
    if (selectedIdx !== dish.quiz.answerIndex) return false;
    if (state.solvedQuizzes[dish.id]) return true;

    setState((prev) => {
      const resetDay = prev.dailyDate !== getTodayKey();
      return {
        ...prev,
        shellsPending: prev.shellsPending + 1,
        kp: prev.kp + 10,
        solvedQuizzes: { ...prev.solvedQuizzes, [dish.id]: true },
        dailyDate: getTodayKey(),
        dailyCooked: resetDay ? 0 : prev.dailyCooked,
        dailyQuizzes: (resetDay ? 0 : prev.dailyQuizzes) + 1,
        dailyFed: resetDay ? 0 : prev.dailyFed,
      };
    });
    touchActivity('celebrating', 3600);
    setSaplingTip('Smart! You got the eco-quiz right!');
    triggerCheer('Eco-Quiz Correct! +1 Shell & +10 KP', 22);
    return true;
  };

  const handleFeedShell = () => {
    if (state.shellsPending < 1) return;
    const beforeStage = getStageIndex(state.shellsFed);
    const nextFed = state.shellsFed + 1;
    const afterStage = getStageIndex(nextFed);
    const unlockedStop =
      afterStage > beforeStage
        ? BANG_KHUN_THIAN_RESTAURANTS.find((r) => r.stageRequired === afterStage)
        : undefined;

    setState((prev) => {
      const resetDay = prev.dailyDate !== getTodayKey();
      return {
        ...prev,
        shellsPending: prev.shellsPending - 1,
        shellsFed: prev.shellsFed + 1,
        activeRestaurantId: unlockedStop ? unlockedStop.id : prev.activeRestaurantId,
        dailyDate: getTodayKey(),
        dailyCooked: resetDay ? 0 : prev.dailyCooked,
        dailyQuizzes: resetDay ? 0 : prev.dailyQuizzes,
        dailyFed: (resetDay ? 0 : prev.dailyFed) + 1,
      };
    });

    setSaplingPop(true);
    window.setTimeout(() => setSaplingPop(false), 450);

    if (unlockedStop) {
      cuteAudio.playSparkle();
      touchActivity('celebrating', 4500);
      setSaplingTip(
        `Hooray! We unlocked ${unlockedStop.en} (${unlockedStop.th}) on the Coastal Map!`
      );
      triggerCheer(
        `Level up: ${SAPLING_STAGES[afterStage].en}! Unlocked ${unlockedStop.en}!`,
        42
      );
      showToast(`Map Stop #${unlockedStop.order} Unlocked: ${unlockedStop.en}!`);
    } else if (afterStage > beforeStage) {
      cuteAudio.playSparkle();
      touchActivity('celebrating', 4500);
      setSaplingTip(SAPLING_TIPS[Math.floor(Math.random() * SAPLING_TIPS.length)]);
      triggerCheer(`Level up: ${SAPLING_STAGES[afterStage].en}!`, 40);
    } else {
      const tip = SAPLING_TIPS[Math.floor(Math.random() * SAPLING_TIPS.length)];
      setSaplingTip(tip);
      touchActivity('celebrating', 2600);
    }
  };

  const handleTravelToRestaurant = (id: RestaurantId) => {
    const target = getRestaurantById(id);
    if (state.shellsFed < target.shellsRequired) {
      showToast(`Feed ${target.shellsRequired} shells to unlock ${target.en}!`);
      return;
    }
    setState((prev) => ({ ...prev, activeRestaurantId: target.id }));
    touchActivity('happy', 2800);
    setSaplingTip(`Welcome to Stop #${target.order}: ${target.en} (${target.th})!`);
    showToast(`Arrived at ${target.en}!`);
  };

  const handleClaimDaily = () => {
    const today = getTodayKey();
    if (state.lastDaily === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const nextStreak = state.lastDaily === yesterday ? state.streak + 1 : 1;

    setState((prev) => ({
      ...prev,
      lastDaily: today,
      streak: nextStreak,
      shellsPending: prev.shellsPending + 1,
    }));
    touchActivity('celebrating', 3000);
    triggerCheer(`Day ${nextStreak} Streak! +1 Shell`, 20);
  };

  const handleUnlockWardrobe = (item: WardrobeItem) => {
    if (state.kp < item.kpCost || state.unlockedWardrobe.includes(item.id)) return;
    setState((prev) => ({
      ...prev,
      kp: prev.kp - item.kpCost,
      unlockedWardrobe: [...prev.unlockedWardrobe, item.id],
      equippedWardrobe: [...prev.equippedWardrobe, item.id],
    }));
    touchActivity('celebrating', 3200);
    triggerCheer(`Unlocked ${item.en}!`, 22);
  };

  const handleToggleEquip = (id: WardrobeItem['id']) => {
    touchActivity('happy', 2400);
    setState((prev) => {
      const equipped = prev.equippedWardrobe.includes(id)
        ? prev.equippedWardrobe.filter((x) => x !== id)
        : [...prev.equippedWardrobe, id];
      return { ...prev, equippedWardrobe: equipped };
    });
  };

  const handleRequestReset = () => {
    setResetIncludeChef(false);
    setShowResetModal(true);
  };

  const handleConfirmReset = () => {
    cuteAudio.playPop(540);
    const fresh = createInitialState();
    fresh.theme = state.theme;
    fresh.lang = state.lang;
    if (!resetIncludeChef) {
      fresh.explorer = state.explorer;
    } else {
      try {
        localStorage.removeItem(CHEF_SETUP_KEY);
        localStorage.removeItem(WELCOME_KEY);
      } catch {
        // Ignore storage errors
      }
    }

    skipNextCloudWriteRef.current = true;
    setState(fresh);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // Ignore storage errors
    }

    if (authUser) {
      setCloudSyncing(true);
      void saveUserProgressToCloud(
        authUser.uid,
        fresh as CloudProgressPayload,
        cloudDocExistsRef.current
      )
        .then(() => {
          cloudDocExistsRef.current = true;
        })
        .catch(() => {
          // Handled in firebase.ts
        })
        .finally(() => setCloudSyncing(false));
    }

    setCookingDish(null);
    setSaplingTip(null);
    setFilterByActiveStop(false);
    setActiveSection('menus');
    touchActivity('idle');
    setShowResetModal(false);

    if (resetIncludeChef) {
      reopenedWelcomeFromNavRef.current = false;
      setWelcomeAlreadyRead(false);
      setShowWelcome(true);
    }

    showToast('Progress reset—fresh coastal seed planted!');
  };

  const quests = [
    {
      id: 'cook',
      label: t.questCook,
      current: state.dailyCooked,
      target: 2,
      done: state.dailyCooked >= 2,
    },
    {
      id: 'quiz',
      label: t.questQuiz,
      current: state.dailyQuizzes,
      target: 1,
      done: state.dailyQuizzes >= 1,
    },
    {
      id: 'feed',
      label: t.questFeed,
      current: state.dailyFed,
      target: 3,
      done: state.dailyFed >= 3,
    },
  ];

  const TRACK_OPTIONS: { id: MusicTrackId; label: string }[] = [
    { id: 'magnetic', label: 'Magnetic' },
    { id: 'illegal', label: 'Illegal' },
    { id: 'cafe', label: 'Sunlit Cafe' },
    { id: 'lullaby', label: 'Lullaby' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. PIXEL TOP BAR */}
      <header className="bg-[var(--surface-card)] border-b-[3px] border-[var(--outline)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 py-3">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('menus');
            }}
            className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-[var(--ink-main)] whitespace-nowrap shrink-0 truncate max-w-[220px] sm:max-w-none"
          >
            <OfficialPixelSprite name="mangrove" size={30} />
            <span className="truncate">{t.appTitle}</span>
          </a>

          <nav
            className="hidden lg:flex items-center gap-5 text-sm font-bold text-[var(--ink-soft)]"
            aria-label="Main navigation"
          >
            <button
              type="button"
              onClick={() => {
                cuteAudio.playPop(620);
                setActiveSection('menus');
              }}
              className={`whitespace-nowrap shrink-0 pb-0.5 transition-colors ${
                activeSection === 'menus'
                  ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                  : 'hover:text-[var(--ink-main)]'
              }`}
            >
              {t.navMenus}
            </button>
            <button
              type="button"
              onClick={() => {
                cuteAudio.playPop(620);
                setActiveSection('map');
              }}
              className={`whitespace-nowrap shrink-0 pb-0.5 transition-colors ${
                activeSection === 'map'
                  ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                  : 'hover:text-[var(--ink-main)]'
              }`}
            >
              {t.navMap}
            </button>
            <button
              type="button"
              onClick={() => {
                cuteAudio.playPop(620);
                setActiveSection('guide');
              }}
              className={`whitespace-nowrap shrink-0 pb-0.5 transition-colors ${
                activeSection === 'guide'
                  ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                  : 'hover:text-[var(--ink-main)]'
              }`}
            >
              {t.navGuide}
            </button>
            <button
              type="button"
              onClick={() => {
                cuteAudio.playPop(620);
                setActiveSection('wardrobe');
              }}
              className={`whitespace-nowrap shrink-0 pb-0.5 transition-colors ${
                activeSection === 'wardrobe'
                  ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                  : 'hover:text-[var(--ink-main)]'
              }`}
            >
              {t.navWardrobe}
            </button>
            <button
              type="button"
              onClick={() => {
                cuteAudio.playPop(620);
                reopenedWelcomeFromNavRef.current = true;
                setWelcomeAlreadyRead(true);
                setShowWelcome(true);
              }}
              className="whitespace-nowrap shrink-0 pb-0.5 hover:text-[var(--ink-main)] transition-colors"
            >
              {t.navHowTo}
            </button>
          </nav>

          {/* Language Switcher + Music Player Icon Button */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1" role="group" aria-label="Language">
              {LANG_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    cuteAudio.playPop(700);
                    handleChangeLang(opt.id);
                  }}
                  className={`px-btn px-2 py-1 text-[11px] font-bold whitespace-nowrap ${
                    state.lang === opt.id
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'bg-white text-[var(--ink-main)]'
                  }`}
                >
                  {opt.short}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleToggleMusic}
              aria-pressed={musicOn}
              aria-label={musicOn ? 'Pause music' : 'Play music'}
              title={musicOn ? 'Pause music' : 'Play music'}
              className={`px-btn flex h-11 w-11 items-center justify-center ${
                musicOn
                  ? 'bg-[var(--accent-butter)]'
                  : 'bg-[var(--surface-tint)] hover:bg-[var(--accent-butter)]/70'
              }`}
            >
              <PixelMusicPlayerIcon playing={musicOn} size={28} />
            </button>
          </div>
        </div>

        {/* BLUE SKY & CLOUDS HEAD DIVIDER */}
        <div className="relative w-full h-14 sm:h-20 overflow-hidden border-t-[3px] border-[var(--outline)]">
          <img
            src={`${import.meta.env.BASE_URL}assets/aistudio/a5205a89_9a1bfb81.jpg`}
            alt="Blue sky and fluffy clouds head divider"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center"
          />
          <div className="px-tape absolute bottom-0 left-0 right-0 h-2.5 opacity-85" aria-hidden="true" />
        </div>
      </header>

      {/* Mobile Nav Strip */}
      <div className="lg:hidden border-b-2 border-[var(--outline)]/25 bg-[var(--surface-card)] px-3 py-2 flex items-center justify-around gap-1.5 text-xs font-bold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSection('menus')}
          className={`px-2 py-1 whitespace-nowrap ${
            activeSection === 'menus' ? 'text-[var(--accent-primary)] underline' : 'text-[var(--ink-soft)]'
          }`}
        >
          {t.navMenus}
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('map')}
          className={`px-2 py-1 whitespace-nowrap ${
            activeSection === 'map' ? 'text-[var(--accent-primary)] underline' : 'text-[var(--ink-soft)]'
          }`}
        >
          {t.navMap}
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('guide')}
          className={`px-2 py-1 whitespace-nowrap ${
            activeSection === 'guide' ? 'text-[var(--accent-primary)] underline' : 'text-[var(--ink-soft)]'
          }`}
        >
          {t.navGuide}
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('wardrobe')}
          className={`px-2 py-1 whitespace-nowrap ${
            activeSection === 'wardrobe' ? 'text-[var(--accent-primary)] underline' : 'text-[var(--ink-soft)]'
          }`}
        >
          {t.navWardrobe}
        </button>
        <button
          type="button"
          onClick={() => {
            cuteAudio.playPop(620);
            reopenedWelcomeFromNavRef.current = true;
            setWelcomeAlreadyRead(true);
            setShowWelcome(true);
          }}
          className="px-2 py-1 whitespace-nowrap text-[var(--ink-soft)]"
        >
          {t.navHowTo}
        </button>
      </div>

      {/* MAIN CONTENT */}
      <main id="top" className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Overview + Pastel Theme Button + 4-Song Soundtrack Selector + Far-Right Tomodachi */}
        <section className="px-card bg-[var(--surface-card)] p-5 sm:p-6 relative">
          <div className="px-tape mx-auto w-40 -mt-8 mb-4" aria-hidden="true" />
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-box bg-[var(--accent-butter)]/75 px-2.5 py-1 text-xs sm:text-sm font-bold text-[var(--ink-main)] inline-flex items-center gap-1.5">
                  <span>{getChefGreeting(state.lang, state.explorer.name)}</span>
                </span>
                <span className="text-xs font-bold tracking-wide text-[var(--accent-mint)]">
                  + BANG KHUN THIAN + · เมนูที่เลี้ยงป่าชายเลน
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-[var(--ink-main)] mt-1 leading-tight text-balance">
                {t.heroTitle}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[var(--ink-soft)]">
                {t.heroSteps}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2" aria-hidden="true">
                <OfficialPixelSprite name="mangrove" size={26} />
                <OfficialPixelSprite name="crab" size={24} />
                <OfficialPixelSprite name="shrimp" size={24} />
                <OfficialPixelSprite name="cockle1" size={22} />
                <OfficialPixelSprite name="mussel" size={22} />
                <OfficialPixelSprite name="oyster" size={22} />
                <OfficialPixelSprite name="jellyfish" size={24} />
              </div>
            </div>

            <div className="flex flex-col gap-3 shrink-0 lg:w-64">
              <button
                type="button"
                onClick={handleCycleTheme}
                className="px-btn flex items-center justify-between gap-3 bg-[var(--surface-tint)] px-3.5 py-2 text-xs sm:text-sm font-bold text-[var(--ink-main)] whitespace-nowrap"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-4 w-4 border-2 border-[var(--outline)]"
                    style={{ backgroundColor: THEME_META[state.theme].swatch }}
                    aria-hidden="true"
                  />
                  {t.themeLabel}: {THEME_META[state.theme].label}
                </span>
                <span className="text-[11px] text-[var(--ink-soft)]">{t.switchBtn}</span>
              </button>

              <div className="px-box bg-[var(--surface-alt)]/55 p-2.5">
                <div className="text-[11px] font-bold text-[var(--ink-main)] mb-1.5 flex items-center justify-between gap-3">
                  <span>{t.themeSongs}</span>
                  <span className="text-[var(--accent-primary)]">
                    {musicOn ? t.playing : t.paused}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {TRACK_OPTIONS.map((tr) => (
                    <button
                      key={tr.id}
                      type="button"
                      onClick={() => handleTrackChange(tr.id)}
                      className={`px-btn px-2 py-1.5 text-xs font-bold whitespace-nowrap ${
                        musicTrack === tr.id && musicOn
                          ? 'bg-[var(--accent-primary)] text-white'
                          : 'bg-white text-[var(--ink-main)]'
                      }`}
                    >
                      {tr.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Far-Right Live Tomodachi Spot */}
            <button
              type="button"
              onClick={() => {
                cuteAudio.playPop(820);
                handlePatTomodachi();
              }}
              aria-label={`Pat ${state.saplingName} the mangrove Tomodachi`}
              className="px-box shrink-0 bg-[var(--surface-sanctuary)] hover:bg-[var(--surface-tint)]/75 p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-colors lg:w-48"
            >
              <div className={saplingPop ? 'animate-sapling-pop' : ''}>
                <SaplingIllustration
                  stage={getStageIndex(state.shellsFed)}
                  equipped={state.equippedWardrobe}
                  mood={tomodachiMood}
                  isBlinking={heroBlinking}
                  size={144}
                />
              </div>
              <div className="mt-1.5 text-sm font-bold text-[var(--ink-main)] leading-none">
                {state.saplingName}
              </div>
              <div className="text-[11px] font-bold text-[var(--accent-mint)] mt-1">
                {SAPLING_STAGES[getStageIndex(state.shellsFed)].en} · {t.tapTomodachi}
              </div>
            </button>
          </div>
        </section>

        <PixelDivider variant="leaf" label="Bang Khun Thian Coastal Cafe" />

        {/* 2-COLUMN GAME WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div>
            {activeSection === 'menus' && (
              <InteractiveMenus
                lang={state.lang}
                dishes={DISHES}
                activeBoard={activeBoard}
                onChangeBoard={setActiveBoard}
                activeRestaurantId={state.activeRestaurantId}
                filterByActiveStop={filterByActiveStop}
                onToggleFilterStop={() => setFilterByActiveStop((v) => !v)}
                onOpenMap={() => setActiveSection('map')}
                cookedCounts={state.cookedCounts}
                readStories={state.readStories}
                solvedQuizzes={state.solvedQuizzes}
                onOpenCook={(dish) => setCookingDish(dish)}
                onReadStory={handleReadStory}
                onSolveQuiz={handleSolveQuiz}
                onMistake={handleMistake}
              />
            )}

            {activeSection === 'map' && (
              <CoastalMapSection
                lang={state.lang}
                shellsFed={state.shellsFed}
                shellsPending={state.shellsPending}
                activeRestaurantId={state.activeRestaurantId}
                cookedCounts={state.cookedCounts}
                solvedQuizzes={state.solvedQuizzes}
                explorer={state.explorer}
                onTravelToRestaurant={handleTravelToRestaurant}
                onCookDish={(dish) => setCookingDish(dish)}
                onOpenStopInMenus={(restaurantId, board) => {
                  const target = getRestaurantById(restaurantId);
                  if (state.shellsFed >= target.shellsRequired) {
                    setState((prev) => ({ ...prev, activeRestaurantId: target.id }));
                  }
                  setActiveBoard(board);
                  setFilterByActiveStop(true);
                  setActiveSection('menus');
                }}
              />
            )}

            {activeSection === 'guide' && (
              <FieldGuideSection
                cookedCounts={state.cookedCounts}
                readStories={state.readStories}
                solvedQuizzes={state.solvedQuizzes}
                onSelectDish={(dish) => {
                  setActiveBoard(dish.board);
                  setFilterByActiveStop(false);
                  setActiveSection('menus');
                  setCookingDish(dish);
                }}
              />
            )}

            {activeSection === 'wardrobe' && (
              <WardrobeSection
                kp={state.kp}
                unlocked={state.unlockedWardrobe}
                equipped={state.equippedWardrobe}
                onUnlock={handleUnlockWardrobe}
                onToggleEquip={handleToggleEquip}
              />
            )}
          </div>

          <SanctuarySidebar
            lang={state.lang}
            shellsPending={state.shellsPending}
            shellsFed={state.shellsFed}
            kp={state.kp}
            mealsCooked={state.mealsCooked}
            equipped={state.equippedWardrobe}
            mood={tomodachiMood}
            saplingName={state.saplingName}
            saplingPop={saplingPop}
            saplingTip={saplingTip}
            dailyClaimed={state.lastDaily === getTodayKey()}
            streak={state.streak}
            quests={quests}
            explorer={state.explorer}
            authUser={authUser}
            authLoading={authLoading}
            signingIn={signingIn}
            authError={authError}
            cloudSyncing={cloudSyncing}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
            onPatTomodachi={handlePatTomodachi}
            onRenameSapling={handleRenameSapling}
            onFeedShell={handleFeedShell}
            onClaimDaily={handleClaimDaily}
            onEditExplorer={() => {
              setDraftExplorer(state.explorer);
              setIsOpeningSetup(false);
              setShowExplorerModal(true);
            }}
            onResetProgress={handleRequestReset}
          />
        </div>

        <PixelDivider variant="stars" />
      </main>

      <footer className="border-t-2 border-[var(--outline)]/25 bg-[var(--surface-card)] py-4 px-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs text-[var(--ink-soft)]">
          <span>Menu That Feeds a Mangrove · Bang Khun Thian Coastal Cafe Game</span>
          <button
            type="button"
            onClick={() => {
              cuteAudio.playPop(520);
              handleRequestReset();
            }}
            className="underline hover:text-[var(--accent-primary)] font-bold"
          >
            {t.resetProgressBtn}
          </button>
        </div>
      </footer>

      {/* Hopping Pixel Mascot Sound & Celebration Cheer Overlay */}
      {cheerMsg && (
        <div
          aria-live="polite"
          className="pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center text-center"
        >
          <div className="px-card bg-[#FFFDF9] px-4 py-2 mb-3 text-base font-bold text-[var(--ink-main)]">
            {cheerMsg}
          </div>
          <div className="mascot-hop">
            <PixelMascotIllustration size={88} />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div
          role="status"
          className="px-card fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[var(--outline)] px-5 py-2.5 text-sm font-bold text-white flex items-center gap-2 max-w-[92vw] text-center"
        >
          <ShellIllustration size={20} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Mini-Kitchen Cooking Modal */}
      {cookingDish && (
        <CookingModal
          dish={cookingDish}
          alreadyCooked={(state.cookedCounts[cookingDish.id] || 0) > 0}
          onClose={() => setCookingDish(null)}
          onComplete={(dish) => handleCompleteCook(dish)}
          onMistake={handleMistake}
        />
      )}

      {/* Cute Loading Screen */}
      {isLoading && <CuteLoadingScreen lang={state.lang} onComplete={handleLoadingComplete} />}

      {/* First Pop-Up: Welcome to Bang Khun Thian + Reading Progress + Okay */}
      {!isLoading && showWelcome && (
        <WelcomeModal
          lang={state.lang}
          onChangeLang={handleChangeLang}
          alreadyRead={welcomeAlreadyRead}
          onConfirmStart={handleConfirmWelcome}
        />
      )}

      {/* Opening & Anytime Chibi Avatar Customization Modal */}
      {!isLoading && showExplorerModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a1230]/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Customize explorer"
          onClick={() => {
            if (!isOpeningSetup) setShowExplorerModal(false);
          }}
        >
          <div
            className="px-card max-w-md w-full bg-[#FFFDF9] p-6 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {isOpeningSetup && (
              <div className="mb-2 inline-block px-box bg-[var(--accent-butter)] px-2.5 py-1 text-[11px] font-bold text-[var(--ink-main)]">
                {t.customOpeningBadge}
              </div>
            )}

            <h2 className="text-2xl font-bold text-[var(--ink-main)]">
              {t.customTitle}
            </h2>

            {/* Language Selector inside Customize Chef */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--outline)]/15">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                Language / ภาษา / ဘာသာစကား
              </span>
              <div className="flex gap-1.5">
                {LANG_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      cuteAudio.playPop(700);
                      handleChangeLang(opt.id);
                    }}
                    className={`px-btn px-2 py-1 text-[11px] font-bold ${
                      state.lang === opt.id
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'bg-white text-[var(--ink-main)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-4 flex justify-center">
              <div className="px-box bg-[var(--surface-tint)]/55 p-3">
                <ExplorerAvatar
                  hair={draftExplorer.hair}
                  skin={draftExplorer.skin}
                  apron={draftExplorer.apron}
                  style={draftExplorer.style}
                  accessory={draftExplorer.accessory}
                  gender={draftExplorer.gender}
                  size={96}
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="text-xs font-bold uppercase tracking-wide text-[var(--ink-soft)] mb-1">
                {t.avatarStyleLabel}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'girl', label: t.girlVersion },
                    { id: 'boy', label: t.boyVersion },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      cuteAudio.playPop(opt.id === 'boy' ? 580 : 680);
                      setDraftExplorer((d) => ({ ...d, gender: opt.id }));
                    }}
                    className={`px-btn py-1.5 text-xs font-bold ${
                      draftExplorer.gender === opt.id
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'bg-white text-[var(--ink-main)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <label
              htmlFor="chef-name-input"
              className="block text-xs font-bold uppercase tracking-wide text-[var(--ink-soft)]"
            >
              {t.whatCallYou}
            </label>
            <input
              id="chef-name-input"
              type="text"
              maxLength={20}
              value={draftExplorer.name}
              onChange={(e) => setDraftExplorer((d) => ({ ...d, name: e.target.value }))}
              className="px-box mt-1 w-full bg-white px-3 py-2 text-sm font-bold text-[var(--ink-main)]"
              placeholder="Coastal Chef"
            />

            {/* Pronouns Selector */}
            <div className="mt-3">
              <div className="text-xs font-bold uppercase tracking-wide text-[var(--ink-soft)] mb-1">
                {t.pronounsLabel}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PRONOUN_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      cuteAudio.playPop(650);
                      setDraftExplorer((d) => ({ ...d, pronouns: opt.id }));
                    }}
                    className={`px-btn px-2.5 py-1.5 text-xs font-bold ${
                      draftExplorer.pronouns === opt.id
                        ? 'bg-[var(--accent-mint)] text-white'
                        : 'bg-white text-[var(--ink-main)]'
                    }`}
                  >
                    {opt.labels[state.lang]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <div className="text-xs font-bold text-[var(--ink-soft)] mb-1">
                  {t.hairstyleLabel}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(draftExplorer.gender === 'boy' ? AVATAR_BOY_STYLES : AVATAR_STYLES).map(
                    (label, idx) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          cuteAudio.playPop(640);
                          setDraftExplorer((d) => ({ ...d, style: idx }));
                        }}
                        className={`px-btn px-2.5 py-1 text-xs font-bold ${
                          draftExplorer.style === idx
                            ? 'bg-[var(--accent-primary)] text-white'
                            : 'bg-white text-[var(--ink-main)]'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-[var(--ink-soft)] mb-1">
                  {t.headpieceLabel}
                </div>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_ACCESSORIES.map((label, idx) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        cuteAudio.playPop(680);
                        setDraftExplorer((d) => ({ ...d, accessory: idx }));
                      }}
                      className={`px-btn px-2.5 py-1 text-xs font-bold ${
                        draftExplorer.accessory === idx
                          ? 'bg-[var(--accent-mint)] text-white'
                          : 'bg-white text-[var(--ink-main)]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-[var(--ink-soft)] mb-1">
                  {t.hairColorLabel}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {AVATAR_COLORS.hair.map((c, idx) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setDraftExplorer((d) => ({ ...d, hair: idx }))}
                      aria-label={`Hair color ${idx + 1}`}
                      className={`px-box h-8 w-8 ${
                        draftExplorer.hair === idx ? 'ring-3 ring-[var(--accent-primary)]' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-[var(--ink-soft)] mb-1">
                  {t.skinToneLabel}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {AVATAR_COLORS.skin.map((c, idx) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setDraftExplorer((d) => ({ ...d, skin: idx }))}
                      aria-label={`Skin tone ${idx + 1}`}
                      className={`px-box h-8 w-8 ${
                        draftExplorer.skin === idx ? 'ring-3 ring-[var(--accent-primary)]' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-[var(--ink-soft)] mb-1">
                  {t.apronColorLabel}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {AVATAR_COLORS.apron.map((c, idx) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setDraftExplorer((d) => ({ ...d, apron: idx }))}
                      aria-label={`Apron color ${idx + 1}`}
                      className={`px-box h-8 w-8 ${
                        draftExplorer.apron === idx ? 'ring-3 ring-[var(--accent-primary)]' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  cuteAudio.playSparkle();
                  try {
                    localStorage.setItem(CHEF_SETUP_KEY, '1');
                  } catch {
                    // Ignore storage errors
                  }
                  setState((prev) => ({
                    ...prev,
                    explorer: {
                      ...draftExplorer,
                      name: draftExplorer.name.trim() || 'Coastal Chef',
                    },
                  }));
                  setShowExplorerModal(false);
                  setIsOpeningSetup(false);
                }}
                className="px-btn flex-1 bg-[var(--accent-mint)] py-2.5 text-base font-bold text-white"
              >
                {isOpeningSetup ? t.startAdventure : t.saveChef}
              </button>
              {!isOpeningSetup && (
                <button
                  type="button"
                  onClick={() => setShowExplorerModal(false)}
                  className="px-btn bg-[var(--surface-tint)] px-4 py-2.5 text-sm font-bold text-[var(--ink-main)]"
                >
                  {t.cancel}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Reset Progress Confirmation Modal */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#18283a]/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
          onClick={() => setShowResetModal(false)}
        >
          <div
            className="px-card max-w-md w-full bg-[#FFFDF9] p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-tape mx-auto w-28 -mt-8 mb-3" aria-hidden="true" />
            <h2 id="reset-modal-title" className="text-2xl font-bold text-[var(--ink-main)]">
              {t.resetModalTitle}
            </h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)] leading-snug">
              {t.resetModalDesc}
            </p>

            <label className="mt-4 px-box bg-[var(--surface-tint)]/45 p-3 flex items-center gap-2.5 cursor-pointer text-xs font-bold text-[var(--ink-main)]">
              <input
                type="checkbox"
                checked={resetIncludeChef}
                onChange={(e) => setResetIncludeChef(e.target.checked)}
                className="h-4 w-4 accent-[var(--accent-primary)]"
              />
              <span>{t.resetKeepChefOption}</span>
            </label>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-btn flex-1 bg-[#C93B68] py-2.5 text-sm font-bold text-white"
              >
                {t.resetConfirmBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  cuteAudio.playPop(640);
                  setShowResetModal(false);
                }}
                className="px-btn bg-[var(--surface-tint)] px-4 py-2.5 text-sm font-bold text-[var(--ink-main)]"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
