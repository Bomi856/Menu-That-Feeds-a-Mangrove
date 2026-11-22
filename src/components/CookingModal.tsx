import React, { useState } from 'react';
import { Dish, INGREDIENTS, IngredientId } from '../data/gameData';
import { cuteAudio } from '../utils/audio';
import { DishIllustration, IngredientIllustration, ShellIllustration } from './KawaiiIllustrations';

interface CookingModalProps {
  dish: Dish;
  alreadyCooked: boolean;
  onClose: () => void;
  onComplete: (dish: Dish, stars: number) => void;
  onMistake: (reason: string) => void;
}

export const CookingModal: React.FC<CookingModalProps> = ({
  dish,
  alreadyCooked,
  onClose,
  onComplete,
  onMistake,
}) => {
  const [selected, setSelected] = useState<IngredientId[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [wobbleId, setWobbleId] = useState<IngredientId | null>(null);
  const [hint, setHint] = useState<string>('Pick the 2 fresh ingredients for this recipe!');
  const [step, setStep] = useState<'pick' | 'stir' | 'done'>('pick');
  const [stirCount, setStirCount] = useState(0);
  const [panBounce, setPanBounce] = useState(false);

  const STIR_TARGET = 6;
  const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;

  const handlePick = (id: IngredientId) => {
    if (selected.includes(id)) return;
    if (dish.recipe.includes(id)) {
      const next = [...selected, id];
      setSelected(next);
      cuteAudio.playPop(next.length === 1 ? 660 : 880);
      if (next.length >= 2) {
        setStep('stir');
        setHint('Great combo! Now stir to finish!');
      } else {
        setHint('Yum! Pick 1 more matching ingredient.');
      }
    } else {
      setMistakes((m) => m + 1);
      setWobbleId(id);
      cuteAudio.playOops();
      onMistake(`Oops! ${dish.en} doesn't use that ingredient!`);
      setHint('Hmm, that ingredient belongs in a different dish—try another!');
      window.setTimeout(() => setWobbleId(null), 350);
    }
  };

  const handleStir = () => {
    if (step !== 'stir') return;
    const next = stirCount + 1;
    setStirCount(next);
    setPanBounce(true);
    cuteAudio.playStir(next - 1);
    window.setTimeout(() => setPanBounce(false), 200);

    if (next >= STIR_TARGET) {
      cuteAudio.playSparkle();
      setStep('done');
      onComplete(dish, stars);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a1230]/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Cook ${dish.en}`}
    >
      <div className="px-card w-full max-w-xl bg-[#FFFDF9] p-5 sm:p-6 relative max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={() => {
            cuteAudio.playPop(480);
            onClose();
          }}
          className="px-btn absolute top-4 right-4 bg-[var(--surface-tint)] px-3 py-1.5 text-sm font-bold text-[var(--ink-main)]"
          aria-label="Close kitchen"
        >
          Close
        </button>

        {step !== 'done' ? (
          <div>
            <div className="text-xs font-bold tracking-wide text-[var(--ink-soft)]">
              Bang Khun Thian Mini-Kitchen · {dish.th}
            </div>
            <h3 className="text-2xl font-bold text-[var(--ink-main)] mt-0.5 pr-16">
              {dish.en}
            </h3>

            <div
              className={`mt-4 flex items-center justify-center gap-4 px-box bg-[var(--surface-tint)]/55 px-4 py-3.5 transition-transform ${
                panBounce ? 'scale-[1.03]' : ''
              }`}
            >
              <DishIllustration id={dish.id} size={68} />
              <div className="flex items-center gap-2.5">
                {[0, 1].map((slot) => {
                  const ingId = selected[slot];
                  return (
                    <div
                      key={slot}
                      className="px-box flex h-14 w-14 items-center justify-center bg-white"
                    >
                      {ingId ? (
                        <IngredientIllustration id={ingId} size={36} />
                      ) : (
                        <span className="text-xs font-bold text-[var(--ink-soft)]">+{slot + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {step === 'pick' ? (
              <>
                <p className="mt-3 text-sm font-bold text-[var(--ink-soft)]">{hint}</p>
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {INGREDIENTS.map((ing) => {
                    const isUsed = selected.includes(ing.id);
                    const isWobble = wobbleId === ing.id;
                    return (
                      <button
                        key={ing.id}
                        type="button"
                        disabled={isUsed}
                        onClick={() => handlePick(ing.id)}
                        className={`px-btn flex flex-col items-center justify-center px-2 py-2 text-center ${
                          isUsed ? 'bg-[#E2F5E9] opacity-55' : 'bg-white hover:bg-[var(--surface-tint)]/45'
                        } ${isWobble ? 'animate-wobble bg-[#FFE2E6]' : ''}`}
                      >
                        <IngredientIllustration id={ing.id} size={34} />
                        <span className="mt-1 text-xs font-bold text-[var(--ink-main)] leading-tight">
                          {ing.en}
                        </span>
                        <span className="text-[11px] text-[var(--ink-soft)]">{ing.th}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="mt-5 text-center">
                <p className="text-sm font-bold text-[var(--ink-main)]">
                  Tap <strong>{dish.prepVerb}</strong> {STIR_TARGET} times to finish! ({stirCount}/{STIR_TARGET})
                </p>
                <div className="mt-3 flex gap-2">
                  {Array.from({ length: STIR_TARGET }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`px-box h-4 flex-1 transition-colors ${
                        idx < stirCount ? 'bg-[var(--accent-primary)]' : 'bg-[var(--surface-tint)]'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleStir}
                  className="px-btn mt-5 w-full bg-[var(--accent-primary)] py-3.5 text-lg font-bold text-white hover:bg-[var(--accent-primary-hover)]"
                >
                  {dish.prepVerb} · {dish.prepVerbTh}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent-mint)]">
              Fresh from the Mangrove Cafe
            </div>
            <div className="my-3 flex justify-center">
              <div className="animate-sapling-pop px-box bg-[var(--surface-tint)]/60 p-4">
                <DishIllustration id={dish.id} size={96} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[var(--ink-main)]">{dish.en} Ready!</h3>
            <p className="text-sm text-[var(--ink-soft)] mt-0.5">{dish.th}</p>
            <div className="my-3 text-2xl tracking-widest text-[#F5A623]" aria-label={`${stars} out of 3 stars`}>
              {'★'.repeat(stars)}
              {'☆'.repeat(3 - stars)}
            </div>

            <div className="mx-auto inline-flex items-center gap-3 px-box bg-[var(--surface-tint)]/55 px-4 py-2 text-sm font-bold text-[var(--ink-main)]">
              <span className="inline-flex items-center gap-1.5">
                <ShellIllustration size={22} /> +{dish.shellsReward} {dish.shellsReward === 1 ? 'Shell' : 'Shells'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[var(--accent-mint)]">
                +{alreadyCooked ? 4 : dish.kpReward} KP
              </span>
            </div>

            <p className="mt-3 text-xs text-[var(--ink-soft)]">
              Tap the shells in your Mangrove Tomodachi basket to feed your sapling!
            </p>

            <button
              type="button"
              onClick={() => {
                cuteAudio.playPop(784);
                onClose();
              }}
              className="px-btn mt-5 w-full bg-[var(--accent-mint)] py-3 text-lg font-bold text-white"
            >
              Collect &amp; Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
