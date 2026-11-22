import React from 'react';
import { DISHES, Dish, WARDROBE_ITEMS, WardrobeItem } from '../data/gameData';
import { cuteAudio } from '../utils/audio';
import { DishIllustration, PixelDivider, WardrobeIllustration } from './KawaiiIllustrations';

interface FieldGuideProps {
  cookedCounts: Record<string, number>;
  readStories: Record<string, boolean>;
  solvedQuizzes: Record<string, boolean>;
  onSelectDish: (dish: Dish) => void;
}

export const FieldGuideSection: React.FC<FieldGuideProps> = ({
  cookedCounts,
  readStories,
  solvedQuizzes,
  onSelectDish,
}) => {
  const discoveredCount = DISHES.filter((d) => (cookedCounts[d.id] || 0) > 0 || readStories[d.id]).length;
  const quizStars = DISHES.filter((d) => solvedQuizzes[d.id]).length;

  return (
    <section className="px-card bg-[#FFFDF9] p-5 sm:p-6 relative" aria-label="Field Guide">
      <div className="px-tape mx-auto w-32 -mt-7 mb-3" aria-hidden="true" />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-[var(--ink-main)]">
            Coastal Field Guide · สมุดภาคสนาม
          </h2>
          <p className="text-sm text-[var(--ink-soft)]">
            Cook dishes and solve eco-quizzes to collect all {DISHES.length} Bang Khun Thian entries.
          </p>
        </div>
        <div className="text-sm font-bold text-[var(--accent-mint)] tabular-nums">
          {discoveredCount}/{DISHES.length} met · {quizStars}/{DISHES.length} stars ★
        </div>
      </div>

      <PixelDivider variant="stars" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
        {DISHES.map((dish) => {
          const met = (cookedCounts[dish.id] || 0) > 0 || !!readStories[dish.id];
          const starred = !!solvedQuizzes[dish.id];
          return (
            <button
              key={dish.id}
              type="button"
              onClick={() => {
                cuteAudio.playPop(640);
                onSelectDish(dish);
              }}
              className={`px-btn flex flex-col items-center p-3 text-center ${
                met ? 'bg-[var(--surface-tint)]/45' : 'bg-[#F3EEF0] opacity-80'
              }`}
            >
              <div className={met ? '' : 'grayscale opacity-50'}>
                <DishIllustration id={dish.id} size={56} />
              </div>
              <div className="mt-2 text-xs font-bold text-[var(--ink-main)] leading-tight">
                {met ? dish.en : '???'}
              </div>
              <div className="mt-1 text-[11px] font-semibold text-[var(--ink-soft)]">
                {starred ? '★ Quiz Done' : met ? 'Discovered' : 'Cook to meet'}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

interface WardrobeProps {
  kp: number;
  unlocked: WardrobeItem['id'][];
  equipped: WardrobeItem['id'][];
  onUnlock: (item: WardrobeItem) => void;
  onToggleEquip: (id: WardrobeItem['id']) => void;
}

export const WardrobeSection: React.FC<WardrobeProps> = ({
  kp,
  unlocked,
  equipped,
  onUnlock,
  onToggleEquip,
}) => {
  return (
    <section className="px-card bg-[#FFFDF9] p-5 sm:p-6 relative" aria-label="Sapling Wardrobe">
      <div className="px-tape mx-auto w-32 -mt-7 mb-3" aria-hidden="true" />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-[var(--ink-main)]">
            Sapling Wardrobe · ตู้เสื้อผ้าต้นกล้า
          </h2>
          <p className="text-sm text-[var(--ink-soft)]">
            Spend Knowledge Points (KP) to unlock pixel accessories for your mangrove!
          </p>
        </div>
        <div className="text-lg font-bold text-[var(--accent-mint)] tabular-nums">
          Available: {kp} KP
        </div>
      </div>

      <PixelDivider variant="stars" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {WARDROBE_ITEMS.map((item) => {
          const isUnlocked = unlocked.includes(item.id);
          const isEquipped = equipped.includes(item.id);
          const canAfford = kp >= item.kpCost;

          return (
            <div
              key={item.id}
              className={`px-box p-4 flex flex-col justify-between ${
                isEquipped ? 'bg-[#E9F9F1]' : 'bg-[var(--surface-tint)]/35'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="px-box flex h-14 w-14 shrink-0 items-center justify-center bg-white">
                  <WardrobeIllustration id={item.id} size={42} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--ink-main)] leading-tight">
                    {item.en}
                  </h3>
                  <div className="text-xs text-[var(--ink-soft)]">{item.th}</div>
                  <p className="mt-1 text-xs text-[var(--ink-main)]/85">{item.desc}</p>
                </div>
              </div>

              <div className="mt-3">
                {isUnlocked ? (
                  <button
                    type="button"
                    onClick={() => {
                      cuteAudio.playPop(isEquipped ? 520 : 760);
                      onToggleEquip(item.id);
                    }}
                    className={`px-btn w-full py-2 text-xs font-bold ${
                      isEquipped
                        ? 'bg-[var(--accent-butter)] text-[var(--ink-main)]'
                        : 'bg-[var(--accent-mint)] text-white'
                    }`}
                  >
                    {isEquipped ? 'Equipped (Remove)' : 'Wear on Sapling'}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!canAfford}
                    onClick={() => {
                      cuteAudio.playSparkle();
                      onUnlock(item);
                    }}
                    className="px-btn w-full bg-[var(--accent-primary)] py-2 text-xs font-bold text-white"
                  >
                    Unlock · {item.kpCost} KP
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
