import React, { useEffect, useState } from 'react';
import { AppLang, LANG_OPTIONS, UI_TEXT } from '../data/i18n';
import {
  ExplorerAvatar,
  PixelDivider,
  PixelMascotIllustration,
  SaplingIllustration,
} from './KawaiiIllustrations';
import { cuteAudio } from '../utils/audio';

interface CuteLoadingScreenProps {
  lang?: AppLang;
  onComplete: () => void;
}

export const CuteLoadingScreen: React.FC<CuteLoadingScreenProps> = ({
  lang = 'en',
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [factIdx, setFactIdx] = useState(0);
  const t = UI_TEXT[lang];

  useEffect(() => {
    const start = performance.now();
    const duration = 10000;
    let rafId = 0;
    let doneTimeout: number | null = null;
    let completed = false;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        rafId = window.requestAnimationFrame(tick);
      } else if (!completed) {
        completed = true;
        doneTimeout = window.setTimeout(onComplete, 260);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    const factIv = window.setInterval(() => {
      setFactIdx((prev) => (prev + 1) % 4);
    }, 2500);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearInterval(factIv);
      if (doneTimeout !== null) window.clearTimeout(doneTimeout);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[var(--bg-main)]"
      style={{
        backgroundImage:
          'linear-gradient(90deg, var(--bg-check) 50%, transparent 50%), linear-gradient(var(--bg-check) 50%, transparent 50%)',
        backgroundSize: '48px 48px',
      }}
      role="status"
      aria-live="polite"
      aria-label="Loading Bang Khun Thian Mangrove Cafe"
    >
      <div className="px-card max-w-md w-full bg-[#FFFDF9] p-6 sm:p-7 text-center relative">
        <div className="px-tape mx-auto w-36 -mt-9 mb-4" aria-hidden="true" />

        <div className="text-xs font-bold tracking-wider text-[var(--accent-mint)]">
          + BANG KHUN THIAN COASTAL CAFE +
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--ink-main)] mt-1">
          {t.appTitle}
        </h1>
        <div className="text-xs font-bold text-[var(--ink-soft)] mt-0.5">
          เมนูที่เลี้ยงป่าชายเลน · ဒီရေတောကို ကျွေးမွေးတဲ့ မီနူး
        </div>

        {/* Single bouncing mascot */}
        <div className="my-5 flex items-center justify-center">
          <div className="mascot-hop">
            <PixelMascotIllustration size={124} />
          </div>
        </div>

        {/* Rotating eco-fact */}
        <div className="px-box bg-[var(--surface-tint)]/70 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-[var(--ink-main)] min-h-[54px] flex items-center justify-center">
          {t.loadingFacts[factIdx % t.loadingFacts.length]}
        </div>

        {/* Pixel Loading Bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--ink-main)] mb-1.5">
            <span>{t.loadingLabel}</span>
            <span className="text-[var(--accent-primary)]">{progress}%</span>
          </div>
          <div className="px-box h-5 w-full bg-white p-0.5 overflow-hidden">
            <div
              className="h-full bg-[var(--accent-mint)] transition-[width] duration-75"
              style={{
                width: `${progress}%`,
                backgroundImage:
                  'repeating-linear-gradient(90deg, rgba(255,255,255,0.22) 0 8px, transparent 8px 16px)',
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            cuteAudio.playPop(700);
            onComplete();
          }}
          className="mt-4 text-xs font-bold text-[var(--ink-soft)] underline hover:text-[var(--accent-primary)]"
        >
          {t.skipLoading}
        </button>
      </div>
    </div>
  );
};

interface WelcomeModalProps {
  lang: AppLang;
  onChangeLang: (lang: AppLang) => void;
  alreadyRead?: boolean;
  onConfirmStart: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  lang,
  onChangeLang,
  alreadyRead = false,
  onConfirmStart,
}) => {
  const t = UI_TEXT[lang];
  const [readSteps, setReadSteps] = useState<boolean[]>(() =>
    t.welcomeSteps.map(() => alreadyRead)
  );

  const readCount = readSteps.filter(Boolean).length;
  const totalSteps = t.welcomeSteps.length;
  const pct = Math.round((readCount / totalSteps) * 100);
  const allRead = readCount === totalSteps;

  const markStepRead = (idx: number) => {
    setReadSteps((prev) => {
      if (prev[idx]) return prev;
      cuteAudio.playPop(640 + idx * 55);
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  const handleReadNext = () => {
    const nextIdx = readSteps.findIndex((done) => !done);
    if (nextIdx !== -1) {
      markStepRead(nextIdx);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a1230]/55 p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      <div className="px-card max-w-xl w-full bg-[#FFFDF9] p-5 sm:p-6 max-h-[92vh] overflow-y-auto relative">
        <div className="px-tape mx-auto w-44 -mt-8 mb-4" aria-hidden="true" />

        {/* Language Picker right on opening */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--outline)]/15">
          <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
            Language / ภาษา / ဘာသာစကား
          </span>
          <div className="flex gap-1.5" role="group" aria-label="Choose language">
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  cuteAudio.playPop(700);
                  onChangeLang(opt.id);
                }}
                className={`px-btn px-2.5 py-1 text-xs font-bold ${
                  lang === opt.id
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'bg-white text-[var(--ink-main)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cute Greeting Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pb-3 border-b-2 border-[var(--outline)]/20">
          <div className="flex items-end gap-2 shrink-0 px-box bg-[var(--surface-tint)]/65 px-3 py-2">
            <SaplingIllustration stage={1} equipped={[]} mood={allRead ? 'celebrating' : 'happy'} size={68} />
            <ExplorerAvatar hair={0} skin={0} apron={0} style={0} accessory={1} size={64} />
          </div>
          <div className="text-center sm:text-left">
            <div className="text-xs font-bold uppercase tracking-wide text-[var(--accent-mint)]">
              {t.welcomeSub}
            </div>
            <h2
              id="welcome-modal-title"
              className="text-xl sm:text-2xl font-bold text-[var(--ink-main)] leading-snug mt-0.5"
            >
              {t.welcomeTitle}
            </h2>
          </div>
        </div>

        {/* Reading Progress Bar */}
        <div className="mt-4 px-box bg-[var(--surface-alt)]/55 p-3">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--ink-main)] mb-1.5">
            <span>{allRead ? t.welcomeReadAll : t.welcomeTapCards}</span>
            <span className="text-[var(--accent-primary)]">
              {readCount}/{totalSteps} ({pct}%)
            </span>
          </div>
          <div className="px-box h-4 w-full bg-white p-0.5 overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${pct}%`,
                backgroundColor: allRead ? 'var(--accent-mint)' : 'var(--accent-primary)',
              }}
            />
          </div>
        </div>

        {/* Interactive Instruction Cards */}
        <div className="mt-4 space-y-2.5">
          {t.welcomeSteps.map((step, idx) => {
            const isRead = readSteps[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => markStepRead(idx)}
                className={`px-box w-full text-left p-3 transition-colors cursor-pointer ${
                  isRead
                    ? 'bg-[var(--surface-sanctuary)]'
                    : 'bg-white hover:bg-[var(--surface-tint)]/55'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold tracking-wide text-[var(--accent-primary)]">
                    {step.tag}
                  </span>
                  <span
                    className={`px-box px-2 py-0.5 text-[11px] font-bold ${
                      isRead
                        ? 'bg-[var(--accent-mint)] text-white'
                        : 'bg-[var(--accent-butter)] text-[var(--ink-main)]'
                    }`}
                  >
                    {isRead ? t.stepRead : t.stepUnread}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-bold text-[var(--ink-main)] mt-0.5">
                  {step.title}
                </div>
                <p className="text-xs sm:text-sm text-[var(--ink-soft)] mt-1 leading-snug">
                  {step.body}
                </p>
              </button>
            );
          })}
        </div>

        <PixelDivider variant="shells" />

        {/* Action Buttons ("Okay" unlocked once read through) */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {!allRead && (
            <button
              type="button"
              onClick={handleReadNext}
              className="px-btn bg-[var(--accent-butter)] px-4 py-3 text-sm font-bold text-[var(--ink-main)] sm:w-48"
            >
              {t.welcomeReadNext} ({readCount}/{totalSteps}) →
            </button>
          )}
          <button
            type="button"
            disabled={!allRead}
            onClick={() => {
              cuteAudio.playSparkle();
              onConfirmStart();
            }}
            className={`px-btn flex-1 py-3 text-base font-bold ${
              allRead
                ? 'bg-[var(--accent-mint)] text-white'
                : 'bg-[var(--surface-tint)] text-[var(--ink-soft)]'
            }`}
          >
            {allRead ? t.welcomeOkay : t.welcomeLocked}
          </button>
        </div>
      </div>
    </div>
  );
};
