import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { SAPLING_STAGES, WardrobeItem } from '../data/gameData';
import { AppLang, getChefGreeting, PRONOUN_OPTIONS, PronounId, UI_TEXT } from '../data/i18n';
import { cuteAudio } from '../utils/audio';
import {
  ExplorerAvatar,
  PixelDivider,
  SaplingIllustration,
  ShellIllustration,
  TomodachiMood,
} from './KawaiiIllustrations';

interface QuestItem {
  id: string;
  label: string;
  current: number;
  target: number;
  done: boolean;
}

interface SanctuarySidebarProps {
  lang: AppLang;
  shellsPending: number;
  shellsFed: number;
  kp: number;
  mealsCooked: number;
  equipped: WardrobeItem['id'][];
  mood: TomodachiMood;
  saplingName: string;
  saplingPop: boolean;
  saplingTip: string | null;
  dailyClaimed: boolean;
  streak: number;
  quests: QuestItem[];
  explorer: {
    name: string;
    pronouns?: PronounId;
    gender?: 'girl' | 'boy';
    hair: number;
    skin: number;
    apron: number;
    style: number;
    accessory: number;
  };
  authUser: User | null;
  authLoading: boolean;
  signingIn: boolean;
  authError: string | null;
  cloudSyncing: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onPatTomodachi: () => void;
  onRenameSapling: (nextName: string) => void;
  onFeedShell: () => void;
  onClaimDaily: () => void;
  onEditExplorer: () => void;
  onResetProgress: () => void;
}

export const SanctuarySidebar: React.FC<SanctuarySidebarProps> = ({
  lang,
  shellsPending,
  shellsFed,
  kp,
  mealsCooked,
  equipped,
  mood,
  saplingName,
  saplingPop,
  saplingTip,
  dailyClaimed,
  streak,
  quests,
  explorer,
  authUser,
  authLoading,
  signingIn,
  authError,
  cloudSyncing,
  onSignIn,
  onSignOut,
  onPatTomodachi,
  onRenameSapling,
  onFeedShell,
  onClaimDaily,
  onEditExplorer,
  onResetProgress,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [editingSaplingName, setEditingSaplingName] = useState(false);
  const [draftSaplingName, setDraftSaplingName] = useState(saplingName);
  const t = UI_TEXT[lang];

  // Natural Tomodachi blinking every ~3.4s
  useEffect(() => {
    const iv = window.setInterval(() => {
      setIsBlinking(true);
      window.setTimeout(() => setIsBlinking(false), 180);
    }, 3400);
    return () => window.clearInterval(iv);
  }, []);

  let stageIdx = 0;
  SAPLING_STAGES.forEach((s, idx) => {
    if (shellsFed >= s.atShells) stageIdx = idx;
  });
  const currentStage = SAPLING_STAGES[stageIdx];
  const nextStage = SAPLING_STAGES[stageIdx + 1];
  const maxShells = SAPLING_STAGES[SAPLING_STAGES.length - 1].atShells;
  const sedimentPct = Math.min(100, Math.round((shellsFed / maxShells) * 100));

  const moodLabel =
    mood === 'celebrating'
      ? t.moodCelebrating
      : mood === 'happy'
      ? t.moodHappy
      : mood === 'sad'
      ? t.moodSad
      : t.moodContent;

  const pronounBadge =
    explorer.pronouns && explorer.pronouns !== 'none'
      ? PRONOUN_OPTIONS.find((p) => p.id === explorer.pronouns)?.badge[lang] || ''
      : '';

  return (
    <aside className="space-y-5 lg:sticky lg:top-4" aria-label="Mangrove Tomodachi Sanctuary">
      {/* Main Tomodachi Card */}
      <div className="px-card bg-[var(--surface-sanctuary)] p-5 relative">
        <div className="px-tape mx-auto w-28 -mt-7 mb-3" aria-hidden="true" />
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold uppercase tracking-wide text-[var(--accent-mint)]">
              {t.tomodachiTitle} · {moodLabel}
            </div>
            {editingSaplingName ? (
              <form
                className="mt-1 flex items-center gap-1.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  cuteAudio.playPop(720);
                  onRenameSapling(draftSaplingName.trim() || 'Sprouty');
                  setEditingSaplingName(false);
                }}
              >
                <input
                  type="text"
                  maxLength={20}
                  value={draftSaplingName}
                  onChange={(e) => setDraftSaplingName(e.target.value)}
                  aria-label="Sapling nickname"
                  className="px-box w-full bg-white px-2 py-1 text-sm font-bold text-[var(--ink-main)]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-btn shrink-0 bg-[var(--accent-mint)] px-2.5 py-1 text-xs font-bold text-white"
                >
                  {t.saveBtn}
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                <h2 className="text-2xl font-bold text-[var(--ink-main)] leading-tight truncate">
                  {saplingName}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    cuteAudio.playPop(620);
                    setDraftSaplingName(saplingName);
                    setEditingSaplingName(true);
                  }}
                  className="px-btn bg-white px-2 py-0.5 text-[11px] font-bold text-[var(--ink-soft)] hover:text-[var(--ink-main)]"
                >
                  {t.renameBtn}
                </button>
              </div>
            )}
            <div className="text-xs font-semibold text-[var(--ink-soft)] mt-0.5">
              {currentStage.en} · {currentStage.th}
            </div>
          </div>
          <div className="text-right tabular-nums shrink-0">
            <div className="text-lg font-bold text-[var(--accent-mint)]">{kp} KP</div>
            <div className="text-xs text-[var(--ink-soft)]">{mealsCooked} cooked</div>
          </div>
        </div>

        {/* Interactive Alive Tomodachi Stage Box (tap to pet/cheer up!) */}
        <button
          type="button"
          onClick={() => {
            cuteAudio.playPop(820);
            onPatTomodachi();
          }}
          aria-label="Pet your Mangrove Tomodachi"
          className={`mt-3 w-full px-box p-3 flex flex-col items-center cursor-pointer transition-colors ${
            mood === 'sad' ? 'bg-[#F0F4FF]' : 'bg-[#FFFDF9] hover:bg-[#FFF9F2]'
          }`}
        >
          <div className={saplingPop ? 'animate-sapling-pop' : ''}>
            <SaplingIllustration
              stage={stageIdx}
              equipped={equipped}
              mood={mood}
              isBlinking={isBlinking}
              size={196}
            />
          </div>

          <span className="mt-1 text-[11px] font-bold text-[var(--ink-soft)]">
            {mood === 'sad'
              ? 'Tap me to cheer me up or feed a shell!'
              : 'Tap Tomodachi to pat & say hi!'}
          </span>

          {saplingTip && (
            <div className="mt-2 w-full px-box bg-[var(--accent-butter)]/60 px-3 py-2 text-xs font-bold text-[var(--ink-main)] text-center">
              “{saplingTip}”
            </div>
          )}
        </button>

        {/* Pixel Segmented Growth Bar */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--ink-main)] tabular-nums">
            <span>
              {t.sedimentLabel}: {sedimentPct}%
            </span>
            <span>
              {nextStage
                ? `${shellsFed}/${nextStage.atShells} to ${nextStage.en}`
                : `${shellsFed} shells · Bloomed!`}
            </span>
          </div>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: maxShells }).map((_, idx) => (
              <div
                key={idx}
                className={`h-3 flex-1 border border-[var(--outline)] ${
                  idx < shellsFed ? 'bg-[var(--accent-mint)]' : 'bg-white'
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-[var(--ink-main)]/85">{currentStage.rewardText}</p>
        </div>

        <PixelDivider variant="shells" />

        {/* Interactive Pixel Shell Basket */}
        <div className="px-box bg-white p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-[var(--ink-main)]">
              {t.shellBasket} ({shellsPending})
            </span>
            <span className="text-xs font-semibold text-[var(--ink-soft)]">
              {shellsPending > 0 ? t.tapShellFeed : 'Cook or quiz to earn'}
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-2.5 min-h-[50px] items-center">
            {shellsPending > 0 ? (
              Array.from({ length: Math.min(shellsPending, 12) }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    cuteAudio.playSplash();
                    onFeedShell();
                  }}
                  aria-label="Feed shell to mangrove Tomodachi"
                  className="px-btn flex h-12 w-12 items-center justify-center bg-[var(--surface-alt)] hover:bg-[var(--surface-tint)]"
                >
                  <ShellIllustration size={32} />
                </button>
              ))
            ) : (
              <p className="text-xs text-[var(--ink-soft)]">
                Empty basket—cook a dish or solve an eco-quiz to collect shells!
              </p>
            )}
            {shellsPending > 12 && (
              <span className="text-xs font-bold text-[var(--accent-primary)]">
                +{shellsPending - 12} more
              </span>
            )}
          </div>
        </div>

        {/* Daily Check-In */}
        <div className="mt-3.5 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={dailyClaimed}
            onClick={() => {
              cuteAudio.playSparkle();
              onClaimDaily();
            }}
            className="px-btn flex-1 bg-[var(--accent-butter)] px-3.5 py-2.5 text-sm font-bold text-[var(--ink-main)]"
          >
            {dailyClaimed ? t.dailyClaimed : t.dailyCheckIn}
          </button>
          <span className="text-xs font-bold text-[var(--ink-main)] tabular-nums whitespace-nowrap">
            {t.streakLabel}: {streak}d
          </span>
        </div>
      </div>

      {/* Chef Account + Cloud Save + Daily Quests Card */}
      <div className="px-card bg-[#FFFDF9] p-4">
        <div className="flex items-center justify-between gap-3 pb-3 border-b-2 border-dashed border-[var(--outline)]/25">
          <div className="flex items-center gap-3 min-w-0">
            <ExplorerAvatar
              hair={explorer.hair}
              skin={explorer.skin}
              apron={explorer.apron}
              style={explorer.style}
              accessory={explorer.accessory}
              gender={explorer.gender}
              size={64}
            />
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-[var(--accent-primary)] truncate">
                {getChefGreeting(lang, explorer.name)}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="text-base font-bold text-[var(--ink-main)] leading-tight truncate">
                  {explorer.name}
                </div>
                {pronounBadge && (
                  <span className="px-box bg-[var(--surface-tint)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--accent-primary)]">
                    {pronounBadge}
                  </span>
                )}
              </div>
              <div className="text-xs text-[var(--ink-soft)] truncate mt-0.5">
                {authUser
                  ? cloudSyncing
                    ? 'Saving to cloud...'
                    : 'Cloud Save Active'
                  : 'Playing locally'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              cuteAudio.playPop(600);
              onEditExplorer();
            }}
            className="px-btn shrink-0 bg-[var(--surface-tint)] px-3 py-1.5 text-xs font-bold text-[var(--ink-main)]"
          >
            {t.customizeBtn}
          </button>
        </div>

        {/* Google Sign-In for Cloud Progress Saving */}
        <div className="mt-3 pb-3 border-b-2 border-dashed border-[var(--outline)]/25">
          {authLoading ? (
            <div className="text-xs font-semibold text-[var(--ink-soft)]">Checking account...</div>
          ) : authUser ? (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[var(--accent-mint)] truncate">
                Signed in as {authUser.displayName || authUser.email}
              </span>
              <button
                type="button"
                onClick={() => {
                  cuteAudio.playPop(520);
                  onSignOut();
                }}
                className="px-btn shrink-0 bg-white px-2.5 py-1 text-xs font-bold text-[var(--ink-main)]"
              >
                {t.signOutBtn}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-[var(--ink-soft)]">{t.saveAcrossDevices}</span>
                <button
                  type="button"
                  disabled={signingIn}
                  onClick={() => {
                    cuteAudio.playPop(700);
                    onSignIn();
                  }}
                  className="px-btn shrink-0 bg-[var(--accent-primary)] px-3 py-1.5 text-xs font-bold text-white"
                >
                  {signingIn ? 'Signing in...' : t.signInBtn}
                </button>
              </div>
              {authError && (
                <div className="mt-2 px-box bg-[#FFF0F4] px-2.5 py-1.5 text-[11px] font-bold text-[#B83260] leading-snug">
                  {authError}
                </div>
              )}
            </div>
          )}
        </div>

        <h3 className="text-base font-bold text-[var(--ink-main)] mt-3">{t.todaysQuests}</h3>
        <ul className="mt-2 space-y-2">
          {quests.map((q) => (
            <li
              key={q.id}
              className={`px-box flex items-center justify-between px-3 py-2 text-xs font-bold ${
                q.done
                  ? 'bg-[#E6F6EE] text-[var(--accent-mint)]'
                  : 'bg-[var(--surface-tint)]/35 text-[var(--ink-main)]'
              }`}
            >
              <span>
                {q.done ? '★ ' : '□ '}
                {q.label}
              </span>
              <span className="tabular-nums">
                {Math.min(q.current, q.target)}/{q.target}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3 pt-3 border-t-2 border-dashed border-[var(--outline)]/20 flex justify-end">
          <button
            type="button"
            onClick={() => {
              cuteAudio.playPop(500);
              onResetProgress();
            }}
            className="px-btn bg-white hover:bg-[#FFF0F4] px-3 py-1.5 text-xs font-bold text-[#B83260]"
          >
            {t.resetProgressBtn}
          </button>
        </div>
      </div>
    </aside>
  );
};
