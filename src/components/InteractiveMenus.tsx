import React, { useState } from 'react';
import { Dish, DishId, MenuBoardType } from '../data/gameData';
import { AppLang, UI_TEXT } from '../data/i18n';
import { cuteAudio } from '../utils/audio';
import {
  BlueMenuArt,
  DishIllustration,
  PinkMenuArt,
  PixelDivider,
  ShellIllustration,
} from './KawaiiIllustrations';

interface InteractiveMenusProps {
  lang?: AppLang;
  dishes: Dish[];
  activeBoard: MenuBoardType;
  onChangeBoard: (board: MenuBoardType) => void;
  cookedCounts: Record<string, number>;
  readStories: Record<string, boolean>;
  solvedQuizzes: Record<string, boolean>;
  onOpenCook: (dish: Dish) => void;
  onReadStory: (dish: Dish) => void;
  onSolveQuiz: (dish: Dish, selectedIdx: number) => boolean;
  onMistake: (reason: string) => void;
}

const COASTAL_FILTERS = [
  'All',
  'Shell & Bio-Barrier',
  'Biostructure Anchors',
  'Mangrove Fauna',
  'Coastal Flora & Greens',
];

export const InteractiveMenus: React.FC<InteractiveMenusProps> = ({
  lang = 'en',
  dishes,
  activeBoard,
  onChangeBoard,
  cookedCounts,
  readStories,
  solvedQuizzes,
  onOpenCook,
  onReadStory,
  onSolveQuiz,
  onMistake,
}) => {
  const t = UI_TEXT[lang];
  const [expandedStoryId, setExpandedStoryId] = useState<DishId | null>('cockleSalad');
  const [treatModalDishId, setTreatModalDishId] = useState<DishId | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<Record<string, string>>({});
  const [coastalFilter, setCoastalFilter] = useState<string>('All');

  const coastalDishes = dishes.filter(
    (d) =>
      d.board === 'coastal' &&
      (coastalFilter === 'All' ||
        d.category === coastalFilter ||
        (coastalFilter === 'Mangrove Fauna' && d.category === 'Estuary Nursery'))
  );
  const treatDishes = dishes.filter((d) => d.board === 'treats');
  const activeTreatModal = treatDishes.find((d) => d.id === treatModalDishId) || null;

  const toggleStory = (dish: Dish) => {
    cuteAudio.playPop(580);
    if (dish.board === 'treats') {
      setTreatModalDishId(dish.id);
      onReadStory(dish);
      return;
    }
    if (expandedStoryId === dish.id) {
      setExpandedStoryId(null);
    } else {
      setExpandedStoryId(dish.id);
      onReadStory(dish);
    }
  };

  const handleQuizClick = (dish: Dish, idx: number) => {
    const isCorrect = onSolveQuiz(dish, idx);
    if (isCorrect) {
      cuteAudio.playSparkle();
      setQuizFeedback((prev) => ({
        ...prev,
        [dish.id]: 'Correct! You earned +1 Bonus Shell & +10 KP.',
      }));
    } else {
      cuteAudio.playOops();
      onMistake('Oops! Check the mangrove story for the right clue!');
      setQuizFeedback((prev) => ({
        ...prev,
        [dish.id]: 'Not quite—check step 2 of the mangrove story above!',
      }));
    }
  };

  return (
    <section aria-label="Interactive Cafe Menus">
      {/* Menu Board Switcher: Pink for Coastal Kitchen, Blue for Mangrove Sweets & Drinks */}
      <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => {
            cuteAudio.playPop(640);
            onChangeBoard('coastal');
          }}
          className={`px-card flex items-center gap-3.5 p-3 text-left transition-transform ${
            activeBoard === 'coastal'
              ? 'bg-[#FFE0EC] -translate-y-0.5'
              : 'bg-[#FFF5F9] hover:bg-[#FFE8F1]'
          }`}
        >
          <div className="px-box bg-white p-1.5 shrink-0">
            <PinkMenuArt size={52} />
          </div>
          <div className="min-w-0">
            <div className="text-lg font-bold text-[#54233B] leading-tight">
              {t.coastalMenuTitle}
            </div>
            <div className="text-xs text-[#78485F] mt-0.5">
              {t.coastalMenuSub}
            </div>
            <span className="mt-1 inline-block text-xs font-bold text-[#D84B7F]">
              {activeBoard === 'coastal' ? '★ Active Pink Menu' : 'Open Pink Menu'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            cuteAudio.playPop(720);
            onChangeBoard('treats');
          }}
          className={`px-card flex items-center gap-3.5 p-3 text-left transition-transform ${
            activeBoard === 'treats'
              ? 'bg-[#D7F1FF] -translate-y-0.5'
              : 'bg-[#F2FAFF] hover:bg-[#E1F4FF]'
          }`}
        >
          <div className="px-box bg-white p-1.5 shrink-0">
            <BlueMenuArt size={52} />
          </div>
          <div className="min-w-0">
            <div className="text-lg font-bold text-[#2B435E] leading-tight">
              {t.sweetsMenuTitle}
            </div>
            <div className="text-xs text-[#4C6B8A] mt-0.5">
              {t.sweetsMenuSub}
            </div>
            <span className="mt-1 inline-block text-xs font-bold text-[#3C8FB8]">
              {activeBoard === 'treats' ? '★ Active Blue Menu' : 'Open Blue Menu'}
            </span>
          </div>
        </button>
      </div>

      {/* BOARD 1: PINK COASTAL KITCHEN MENU (Real Bang Khun Thian Restaurant Dishes) */}
      {activeBoard === 'coastal' && (
        <div className="px-card bg-[#FFDCE8] p-4 sm:p-6 relative">
          <div className="px-tape mx-auto w-36 -mt-7 mb-4" aria-hidden="true" />

          <div className="px-box bg-[#FFF9FB] p-4 sm:p-6">
            <div className="mx-auto mb-3 max-w-sm px-box bg-[#F082A8] px-4 py-2.5 text-center">
              <h2 className="text-2xl font-bold text-white tracking-wide">
                {t.coastalMenuTitle}
              </h2>
              <p className="text-xs font-semibold text-[#FFF2F6]">
                {t.coastalMenuSub}
              </p>
            </div>

            <PixelDivider variant="crab" label="Bang Khun Thian Dishes" />

            {/* Category Filter Buttons */}
            <div className="mb-4 flex flex-wrap gap-2 justify-center" role="group" aria-label="Filter dishes">
              {COASTAL_FILTERS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    cuteAudio.playPop(600);
                    setCoastalFilter(cat);
                  }}
                  className={`px-btn px-3 py-1.5 text-xs font-bold whitespace-nowrap ${
                    coastalFilter === cat
                      ? 'bg-[#D84B7F] text-white'
                      : 'bg-white text-[#54233B] hover:bg-[#FFEBF2]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {coastalDishes.map((dish, idx) => {
                const count = cookedCounts[dish.id] || 0;
                const isOpen = expandedStoryId === dish.id;
                const quizDone = !!solvedQuizzes[dish.id];
                const storyRead = !!readStories[dish.id];

                return (
                  <React.Fragment key={dish.id}>
                    {idx > 0 && idx % 3 === 0 && <PixelDivider variant="shells" />}
                    <article className="px-box bg-white p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="px-box flex h-20 w-20 shrink-0 items-center justify-center bg-[#FFF0F6]">
                          <DishIllustration id={dish.id} size={64} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h3 className="text-xl font-bold text-[#54233B]">
                              {dish.th} · {dish.en}
                            </h3>
                            <span className="text-base font-bold text-[#D84B7F] tabular-nums">
                              {dish.priceLabel}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-[#78485F]">
                            {dish.ecoRole}
                            {count > 0 && ` · Cooked ${count}×`}
                            {quizDone && ' · Quiz ★'}
                          </div>
                          <p className="mt-1 text-sm text-[#54233B]/90">{dish.shortDesc}</p>

                          <div className="mt-3 flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                cuteAudio.playPop(700);
                                onOpenCook(dish);
                              }}
                              className="px-btn bg-[#D84B7F] px-4 py-2 text-sm font-bold text-white hover:bg-[#BE3869] whitespace-nowrap"
                            >
                              {t.cookDishBtn}
                            </button>
                            <button
                              type="button"
                              aria-expanded={isOpen}
                              onClick={() => toggleStory(dish)}
                              className="px-btn bg-[#FFE59A] px-4 py-2 text-sm font-bold text-[#54233B] whitespace-nowrap"
                            >
                              {isOpen
                                ? 'Hide'
                                : storyRead || quizDone
                                ? `${t.storyBtn} & ${t.quizBtn}`
                                : `${t.storyBtn} (+KP)`}
                            </button>
                          </div>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="mt-4 border-t-2 border-dashed border-[#5B2A4A]/30 pt-4 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div className="px-box bg-[#FFF2F7] p-3">
                              <div className="font-bold text-[#D84B7F] text-xs uppercase tracking-wide">
                                1. Restaurant Dish
                              </div>
                              <p className="mt-1 text-[#54233B]">{dish.story.local}</p>
                            </div>
                            <div className="px-box bg-[#EFFBF3] p-3">
                              <div className="font-bold text-[#2E8B60] text-xs uppercase tracking-wide">
                                2. Mangrove Ecosystem
                              </div>
                              <p className="mt-1 text-[#294737]">{dish.story.mangrove}</p>
                            </div>
                            <div className="px-box bg-[#EEF8FF] p-3">
                              <div className="font-bold text-[#3C8FB8] text-xs uppercase tracking-wide">
                                3. Coastal Bio-Barrier
                              </div>
                              <p className="mt-1 text-[#2B435E]">{dish.story.shell}</p>
                            </div>
                          </div>

                          <div className="px-box bg-[#F3FBF6] p-3.5">
                            {quizDone ? (
                              <div className="flex items-center gap-2 text-sm font-bold text-[#2E8B60]">
                                <span>★ Quiz mastered!</span>
                                <span className="font-normal text-[#294737]">
                                  Bonus shell &amp; KP already collected.
                                </span>
                              </div>
                            ) : (
                              <div>
                                <div className="text-xs font-bold text-[#2E8B60] uppercase tracking-wide">
                                  Quick Eco-Quiz · +1 Shell &amp; +10 KP
                                </div>
                                <p className="mt-1 text-sm font-bold text-[#294737]">
                                  {dish.quiz.question}
                                </p>
                                <div className="mt-2.5 flex flex-wrap gap-2.5">
                                  {dish.quiz.options.map((opt, oIdx) => (
                                    <button
                                      key={opt}
                                      type="button"
                                      onClick={() => handleQuizClick(dish, oIdx)}
                                      className="px-btn bg-white px-3.5 py-1.5 text-xs font-bold text-[#54233B] hover:bg-[#FFEBF2]"
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                                {quizFeedback[dish.id] && (
                                  <p className="mt-2 text-xs font-bold text-[#D84B7F]">
                                    {quizFeedback[dish.id]}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </article>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* BOARD 2: BLUE MANGROVE SWEETS & DRINKS MENU */}
      {activeBoard === 'treats' && (
        <div className="px-card bg-[#D4F0FF] p-4 sm:p-6 relative">
          <div className="px-tape mx-auto w-36 -mt-7 mb-4" aria-hidden="true" />

          <div className="px-box bg-[#F5FBFF] p-4 sm:p-6">
            <div className="mx-auto mb-3 max-w-sm px-box bg-[#6BBEE8] px-4 py-2.5 text-center">
              <h2 className="text-2xl font-bold text-white tracking-wide">
                {t.sweetsMenuTitle}
              </h2>
              <p className="text-xs font-semibold text-[#F0FAFF]">
                {t.sweetsMenuSub}
              </p>
            </div>

            <PixelDivider variant="stars" label="Blue Cafe Treats" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {treatDishes.map((dish) => {
                const count = cookedCounts[dish.id] || 0;
                const quizDone = !!solvedQuizzes[dish.id];
                const storyRead = !!readStories[dish.id];
                const isSelected = treatModalDishId === dish.id;

                return (
                  <div
                    key={dish.id}
                    className={`px-card flex flex-col justify-between p-3.5 text-center ${
                      isSelected ? 'bg-[#E9F7FF]' : 'bg-white'
                    }`}
                  >
                    <div>
                      <div className="px-box mx-auto flex h-24 w-24 items-center justify-center bg-[#E4F6FF] animate-bob">
                        <DishIllustration id={dish.id} size={70} />
                      </div>
                      <h3 className="text-base font-bold text-[#2B435E] mt-2.5 leading-snug">
                        {dish.en}
                      </h3>
                      <div className="text-xs font-semibold text-[#4C6B8A]">{dish.th}</div>
                      <div className="mt-1 text-xs font-bold text-[#3C8FB8]">
                        {dish.priceLabel}
                        {count > 0 && ` · Made ${count}×`}
                        {storyRead && ' · Story ✓'}
                        {quizDone && ' · ★'}
                      </div>
                      <p className="mt-1.5 text-xs text-[#2B435E]/85 leading-relaxed">
                        {dish.shortDesc}
                      </p>
                    </div>

                    <div className="mt-3 flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          cuteAudio.playPop(720);
                          onOpenCook(dish);
                        }}
                        className="px-btn flex-1 bg-[#499CD1] py-2 text-xs font-bold text-white hover:bg-[#3A84B5]"
                      >
                        {t.cookDishBtn}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStory(dish)}
                        className="px-btn bg-[#FFE59A] px-3 py-2 text-xs font-bold text-[#2B435E]"
                      >
                        {t.storyBtn}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Treat Story & Eco-Quiz Modal (opens immediately right on screen) */}
      {activeTreatModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a1230]/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeTreatModal.en} Mangrove Story`}
          onClick={() => setTreatModalDishId(null)}
        >
          <div
            className="px-card max-w-2xl w-full bg-[#FFFDF9] p-5 sm:p-6 max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b-2 border-dashed border-[var(--outline)]/25">
              <div className="flex items-center gap-3">
                <div className="px-box bg-[#E4F6FF] p-2 shrink-0">
                  <DishIllustration id={activeTreatModal.id} size={56} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-[#3C8FB8]">
                    {activeTreatModal.ecoRole}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#2B435E] leading-tight">
                    {activeTreatModal.en}
                  </h3>
                  <div className="text-xs font-semibold text-[#4C6B8A]">{activeTreatModal.th}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  cuteAudio.playPop(500);
                  setTreatModalDishId(null);
                }}
                className="px-btn bg-[#D7F1FF] px-3 py-1.5 text-xs font-bold text-[#2B435E] shrink-0"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="px-box bg-[#EDF8FF] p-3">
                <div className="text-xs font-bold text-[#3C8FB8] uppercase">
                  1. Local Craft
                </div>
                <p className="mt-1 text-[#2B435E]">{activeTreatModal.story.local}</p>
              </div>
              <div className="px-box bg-[#EFFBF3] p-3">
                <div className="text-xs font-bold text-[#2E8B60] uppercase">
                  2. Mangrove Link
                </div>
                <p className="mt-1 text-[#294737]">{activeTreatModal.story.mangrove}</p>
              </div>
              <div className="px-box bg-[#FFF2F7] p-3">
                <div className="text-xs font-bold text-[#D84B7F] uppercase">
                  3. Shell Impact
                </div>
                <p className="mt-1 text-[#54233B]">{activeTreatModal.story.shell}</p>
              </div>
            </div>

            <div className="mt-4 px-box bg-[#F3FBF6] p-4">
              {solvedQuizzes[activeTreatModal.id] ? (
                <div className="flex items-center gap-2 text-sm font-bold text-[#2E8B60]">
                  <span>★ Quiz mastered!</span>
                  <span className="font-normal text-[#294737]">
                    Bonus shell &amp; KP already collected.
                  </span>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-bold text-[#2E8B60] uppercase tracking-wide flex items-center gap-1.5">
                    <ShellIllustration size={18} /> Quick Eco-Quiz · +1 Shell &amp; +10 KP
                  </div>
                  <p className="mt-1.5 text-sm font-bold text-[#294737]">
                    {activeTreatModal.quiz.question}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {activeTreatModal.quiz.options.map((opt, idx) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleQuizClick(activeTreatModal, idx)}
                        className="px-btn bg-white px-3.5 py-2 text-xs font-bold text-[#2B435E] hover:bg-[#E1F4FF]"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {quizFeedback[activeTreatModal.id] && (
                    <p className="mt-2.5 text-xs font-bold text-[#D84B7F]">
                      {quizFeedback[activeTreatModal.id]}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
