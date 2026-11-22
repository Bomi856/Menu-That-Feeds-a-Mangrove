import React, { useEffect, useState } from 'react';
import {
  BANG_KHUN_THIAN_RESTAURANTS,
  BangKhunThianRestaurant,
  DISHES,
  Dish,
  MenuBoardType,
  RestaurantId,
  SAPLING_STAGES,
} from '../data/gameData';
import { AppLang, PronounId, UI_TEXT } from '../data/i18n';
import { cuteAudio } from '../utils/audio';
import {
  DishIllustration,
  ExplorerAvatar,
  OfficialPixelSprite,
  PixelDivider,
  ShellIllustration,
} from './KawaiiIllustrations';

interface CoastalMapSectionProps {
  lang?: AppLang;
  shellsFed: number;
  shellsPending: number;
  activeRestaurantId: RestaurantId;
  cookedCounts: Record<string, number>;
  solvedQuizzes: Record<string, boolean>;
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
  onTravelToRestaurant: (id: RestaurantId) => void;
  onCookDish: (dish: Dish) => void;
  onOpenStopInMenus: (restaurantId: RestaurantId, board: MenuBoardType) => void;
}

const PixelPadlockIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    <rect x="5" y="2" width="6" height="2" fill="#4A2A3B" />
    <rect x="4" y="3" width="2" height="4" fill="#4A2A3B" />
    <rect x="10" y="3" width="2" height="4" fill="#4A2A3B" />
    <rect x="3" y="7" width="10" height="7" fill="#FFE08A" />
    <rect x="3" y="7" width="10" height="1" fill="#4A2A3B" />
    <rect x="3" y="13" width="10" height="1" fill="#4A2A3B" />
    <rect x="2" y="7" width="1" height="7" fill="#4A2A3B" />
    <rect x="13" y="7" width="1" height="7" fill="#4A2A3B" />
    <rect x="4" y="8" width="8" height="1" fill="#FFF3C4" />
    <rect x="7" y="9" width="2" height="2" fill="#4A2A3B" />
    <rect x="7" y="11" width="2" height="1" fill="#8C583A" />
  </svg>
);

export const CoastalMapSection: React.FC<CoastalMapSectionProps> = ({
  lang = 'en',
  shellsFed,
  shellsPending,
  activeRestaurantId,
  cookedCounts,
  solvedQuizzes,
  explorer,
  onTravelToRestaurant,
  onCookDish,
  onOpenStopInMenus,
}) => {
  const t = UI_TEXT[lang];
  const [selectedId, setSelectedId] = useState<RestaurantId>(activeRestaurantId);

  useEffect(() => {
    setSelectedId(activeRestaurantId);
  }, [activeRestaurantId]);

  let currentStageIdx = 0;
  SAPLING_STAGES.forEach((stage, i) => {
    if (shellsFed >= stage.atShells) currentStageIdx = i;
  });

  const isUnlocked = (r: BangKhunThianRestaurant) => shellsFed >= r.shellsRequired;
  const unlockedCount = BANG_KHUN_THIAN_RESTAURANTS.filter(isUnlocked).length;
  const nextLocked = BANG_KHUN_THIAN_RESTAURANTS.find((r) => !isUnlocked(r)) || null;
  const selected =
    BANG_KHUN_THIAN_RESTAURANTS.find((r) => r.id === selectedId) ||
    BANG_KHUN_THIAN_RESTAURANTS[0];
  const selectedUnlocked = isUnlocked(selected);
  const selectedIsActive = activeRestaurantId === selected.id;
  const selectedDishes = selected.signatureDishes
    .map((id) => DISHES.find((d) => d.id === id))
    .filter((d): d is Dish => Boolean(d));

  const getStopProgress = (r: BangKhunThianRestaurant) => {
    const cooked = r.signatureDishes.filter((dId) => (cookedCounts[dId] || 0) > 0).length;
    const quizzes = r.signatureDishes.filter((dId) => !!solvedQuizzes[dId]).length;
    return { cooked, quizzes, total: r.signatureDishes.length };
  };

  const selectedStats = getStopProgress(selected);

  return (
    <section aria-label="Bang Khun Thian Coastal Map" className="space-y-5">
      <div className="px-card bg-[var(--surface-card)] p-4 sm:p-6 relative">
        <div className="px-tape mx-auto w-36 -mt-7 mb-4" aria-hidden="true" />

        {/* Map Header + Trail Progress Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--accent-mint)]">
              <OfficialPixelSprite name="mangrove" size={20} />
              <span>Bang Khun Thian · บางขุนเทียน</span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--ink-main)] mt-0.5">{t.mapTitle}</h2>
            <p className="text-xs sm:text-sm text-[var(--ink-soft)] mt-0.5">{t.mapSubtitle}</p>
          </div>

          <div className="px-box bg-[var(--surface-sanctuary)] px-3.5 py-2.5 shrink-0 text-right tabular-nums">
            <div className="text-xs font-bold text-[var(--accent-mint)]">
              {unlockedCount}/4 {t.mapUnlockedBadge}
            </div>
            <div className="text-xs font-bold text-[var(--ink-main)] mt-0.5">
              {nextLocked ? (
                <span>
                  Next: {nextLocked.en} ({Math.max(0, nextLocked.shellsRequired - shellsFed)}🐚 left)
                </span>
              ) : (
                <span>{t.mapAllUnlocked}</span>
              )}
            </div>
          </div>
        </div>

        {/* 4-Level Quick Stepper Bar */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BANG_KHUN_THIAN_RESTAURANTS.map((r) => {
            const open = isUnlocked(r);
            const active = activeRestaurantId === r.id;
            const focused = selected.id === r.id;
            const stats = getStopProgress(r);

            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  cuteAudio.playPop(open ? 680 : 480);
                  setSelectedId(r.id);
                }}
                className={`px-box px-2.5 py-2 text-left transition-colors ${
                  focused
                    ? 'bg-[var(--accent-butter)]/85 ring-2 ring-[var(--outline)]'
                    : open
                    ? 'bg-white hover:bg-[var(--surface-tint)]/55'
                    : 'bg-[#F2F3F7] text-[var(--ink-soft)] hover:bg-[#E7E9F0]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-[10px] font-bold">
                  <span className="uppercase tracking-wide text-[var(--accent-primary)]">
                    Lv.{r.stageRequired} · #{r.order}
                  </span>
                  {active ? (
                    <span className="text-[#2E8B60]">★ {t.mapActiveBadge}</span>
                  ) : !open ? (
                    <span>🔒 {r.shellsRequired}🐚</span>
                  ) : (
                    <span className="tabular-nums text-[var(--ink-soft)]">
                      {stats.cooked}/{stats.total}
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-[var(--ink-main)] truncate mt-0.5">
                  {r.en}
                </div>
              </button>
            );
          })}
        </div>

        <PixelDivider variant="leaf" label="Bang Khun Thian–Chai Thale Trail" />

        {/* INTERACTIVE 16-BIT PIXEL ART BANG KHUN THIAN MAP */}
        <div className="px-box relative w-full overflow-hidden bg-[#BCE7F9] aspect-[16/10] min-h-[290px]">
          <svg
            viewBox="0 0 320 200"
            preserveAspectRatio="none"
            shapeRendering="crispEdges"
            className="absolute inset-0 h-full w-full block"
            aria-hidden="true"
          >
            {/* Base Coastal Land & Sky Wash */}
            <rect x="0" y="0" width="320" height="128" fill="#BCEBBE" />
            <rect x="0" y="128" width="320" height="24" fill="#D4C29E" />
            <rect x="0" y="152" width="320" height="48" fill="#89CEF2" />

            {/* Subtle Mudflat & Coastal Bank Transition */}
            <rect x="0" y="120" width="180" height="12" fill="#A6DBAC" />
            <rect x="190" y="124" width="130" height="16" fill="#C7B38E" />
            <rect x="150" y="142" width="170" height="14" fill="#9BD8EA" />

            {/* Sparkling Bay of Bangkok Wave Pixels */}
            <rect x="18" y="162" width="14" height="2" fill="#DDF5FF" />
            <rect x="72" y="176" width="18" height="2" fill="#DDF5FF" />
            <rect x="148" y="168" width="16" height="2" fill="#DDF5FF" />
            <rect x="270" y="178" width="18" height="2" fill="#DDF5FF" />
            <rect x="44" y="186" width="12" height="2" fill="#63B8E4" />
            <rect x="196" y="188" width="22" height="2" fill="#63B8E4" />

            {/* Upper Khlong Canal & Winding Estuary Channel */}
            <rect x="0" y="28" width="152" height="10" fill="#77C6EB" />
            <rect x="142" y="28" width="16" height="68" fill="#77C6EB" />
            <rect x="142" y="86" width="96" height="12" fill="#77C6EB" />
            <rect x="224" y="86" width="18" height="68" fill="#77C6EB" />
            {/* Canal Highlight Ripples */}
            <rect x="20" y="32" width="12" height="2" fill="#BAE8FF" />
            <rect x="148" y="54" width="4" height="10" fill="#BAE8FF" />
            <rect x="176" y="90" width="14" height="2" fill="#BAE8FF" />
            <rect x="231" y="114" width="4" height="12" fill="#BAE8FF" />

            {/* Brackish Shrimp & Cockle Aquaculture Ponds (Left Mid) */}
            <rect x="18" y="64" width="52" height="32" fill="#9B8366" />
            <rect x="21" y="67" width="46" height="26" fill="#7EC3DF" />
            <rect x="26" y="72" width="10" height="2" fill="#CBEFFF" />
            <rect x="78" y="68" width="44" height="28" fill="#9B8366" />
            <rect x="81" y="71" width="38" height="22" fill="#74BBD9" />
            <rect x="24" y="102" width="60" height="24" fill="#9B8366" />
            <rect x="27" y="105" width="54" height="18" fill="#7EC3DF" />

            {/* Bang Khun Thian Chai Thale Cream Road */}
            <rect x="44" y="14" width="12" height="38" fill="#FFF3D6" />
            <rect x="44" y="42" width="150" height="10" fill="#FFF3D6" />
            <rect x="184" y="42" width="10" height="38" fill="#FFF3D6" />
            <rect x="104" y="74" width="90" height="10" fill="#FFF3D6" />
            <rect x="104" y="74" width="10" height="58" fill="#FFF3D6" />
            <rect x="104" y="124" width="118" height="10" fill="#FFF3D6" />

            {/* Rak Talay Wooden Coastal Sea Bridge (Lower Right) */}
            <rect x="218" y="142" width="44" height="8" fill="#A96E42" />
            <rect x="220" y="144" width="40" height="4" fill="#D59A62" />
            <rect x="256" y="142" width="8" height="34" fill="#A96E42" />
            <rect x="258" y="144" width="4" height="30" fill="#D59A62" />
            <rect x="246" y="170" width="28" height="10" fill="#A96E42" />
            <rect x="248" y="172" width="24" height="6" fill="#D59A62" />

            {/* Pixel Mangrove Forest Clusters */}
            {[
              [12, 10],
              [96, 12],
              [126, 10],
              [172, 18],
              [248, 22],
              [276, 36],
              [262, 62],
              [288, 86],
              [192, 104],
              [256, 106],
              [162, 128],
              [18, 134],
            ].map(([mx, my], idx) => (
              <g key={idx}>
                <rect x={mx + 4} y={my + 10} width="6" height="4" fill="#6F4C36" />
                <rect x={mx + 1} y={my + 2} width="12" height="9" fill="#3D9963" />
                <rect x={mx + 3} y={my} width="8" height="4" fill="#5FC482" />
                <rect x={mx + 5} y={my + 2} width="3" height="2" fill="#9CE6AF" />
              </g>
            ))}

            {/* Shell Bio-Barriers Protecting the Shoreline */}
            {[172, 186, 200, 286, 298].map((sx, idx) => (
              <g key={idx}>
                <rect x={sx} y={148 + (idx % 2) * 3} width="8" height="4" fill="#F6C8AE" />
                <rect x={sx + 2} y={149 + (idx % 2) * 3} width="4" height="2" fill="#FFF0E5" />
              </g>
            ))}

            {/* Route Connections Between Restaurant Stops */}
            {BANG_KHUN_THIAN_RESTAURANTS.slice(0, -1).map((fromStop, i) => {
              const toStop = BANG_KHUN_THIAN_RESTAURANTS[i + 1];
              const unlockedStretch = isUnlocked(toStop);
              const x1 = fromStop.coords.x * 3.2;
              const y1 = fromStop.coords.y * 2.0;
              const x2 = toStop.coords.x * 3.2;
              const y2 = toStop.coords.y * 2.0;

              return (
                <line
                  key={fromStop.id}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={unlockedStretch ? '#2E8B60' : '#7B7490'}
                  strokeWidth="2.5"
                  strokeDasharray={unlockedStretch ? '5 3' : '3 4'}
                  opacity={unlockedStretch ? 0.95 : 0.65}
                />
              );
            })}
          </svg>

          {/* Zone Labels on Map */}
          <div className="pointer-events-none absolute top-2 left-2 px-box bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#3C8FB8]">
            KHLONG BANG KHUN THIAN
          </div>
          <div className="pointer-events-none absolute bottom-2 left-2 px-box bg-[#FFFDF9]/90 px-2 py-0.5 text-[10px] font-bold text-[#2B435E]">
            BAY OF BANGKOK · อ่าวไทย
          </div>

          {/* 4 Interactive Restaurant Pins */}
          {BANG_KHUN_THIAN_RESTAURANTS.map((r) => {
            const open = isUnlocked(r);
            const active = activeRestaurantId === r.id;
            const focused = selected.id === r.id;
            const firstDishId = r.signatureDishes[0];

            return (
              <div
                key={r.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
                style={{ left: `${r.coords.x}%`, top: `${r.coords.y}%` }}
              >
                {/* Live Player Avatar Marker Standing at Active Restaurant */}
                {active && (
                  <div className="pointer-events-none -mb-2 flex items-center gap-1 animate-bob z-20">
                    <div className="px-box bg-[var(--accent-primary)] px-1.5 py-0.5 text-[9px] font-bold text-white whitespace-nowrap">
                      YOU
                    </div>
                    <div className="drop-shadow-sm">
                      <ExplorerAvatar
                        hair={explorer.hair}
                        skin={explorer.skin}
                        apron={explorer.apron}
                        style={explorer.style}
                        accessory={explorer.accessory}
                        gender={explorer.gender}
                        size={38}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    cuteAudio.playPop(open ? 720 : 460);
                    setSelectedId(r.id);
                  }}
                  aria-label={`Stop ${r.order}: ${r.en} (${open ? 'Unlocked' : 'Locked'})`}
                  className={`px-btn flex items-center gap-1.5 px-2 py-1 transition-transform ${
                    focused ? 'scale-105 ring-2 ring-[var(--outline)]' : 'hover:scale-105'
                  } ${
                    open
                      ? active
                        ? 'bg-[#FFE59A] text-[#4A2A3B]'
                        : 'bg-[#FFFDF9] text-[#4A2A3B]'
                      : 'bg-[#E6E8EF]/95 text-[#646078]'
                  }`}
                >
                  {open ? (
                    <DishIllustration id={firstDishId} size={24} />
                  ) : (
                    <PixelPadlockIcon size={20} />
                  )}
                  <div className="text-left leading-tight">
                    <div className="text-[10px] sm:text-[11px] font-bold whitespace-nowrap">
                      #{r.order} {r.en}
                    </div>
                    <div className="text-[9px] font-semibold opacity-80 whitespace-nowrap">
                      {open ? r.th : `Lv.${r.stageRequired} · ${r.shellsRequired}🐚`}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* SELECTED RESTAURANT DETAIL PANEL */}
        <div
          className="mt-5 px-box p-4 sm:p-5"
          style={{ backgroundColor: selectedUnlocked ? selected.accentBg : '#F4F5F8' }}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="px-box bg-white p-2 shrink-0 flex items-center justify-center">
                {selectedUnlocked ? (
                  <DishIllustration id={selected.signatureDishes[0]} size={56} />
                ) : (
                  <PixelPadlockIcon size={44} />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span style={{ color: selected.accentColor }}>
                    {t.mapStopLabel} #{selected.order} · {selected.zone}
                  </span>
                  <span className="px-box bg-white px-2 py-0.5 text-[11px] text-[var(--ink-main)]">
                    {selectedIsActive
                      ? `★ ${t.mapActiveBadge}`
                      : selectedUnlocked
                      ? `✓ ${t.mapUnlockedBadge}`
                      : `🔒 Lv.${selected.stageRequired} (${selected.shellsRequired}🐚)`}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[var(--ink-main)] mt-1 leading-tight">
                  {selected.en} · {selected.th}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[var(--ink-soft)] mt-0.5">
                  {selected.landmark} — {selected.tagline}
                </p>
              </div>
            </div>

            {/* Stop Action Buttons */}
            <div className="flex flex-wrap gap-2 shrink-0">
              {selectedUnlocked ? (
                <>
                  {!selectedIsActive ? (
                    <button
                      type="button"
                      onClick={() => {
                        cuteAudio.playSparkle();
                        onTravelToRestaurant(selected.id);
                      }}
                      className="px-btn bg-[var(--accent-mint)] px-4 py-2 text-xs sm:text-sm font-bold text-white"
                    >
                      {t.mapTravelHere}
                    </button>
                  ) : (
                    <span className="px-box bg-white px-3 py-2 text-xs sm:text-sm font-bold text-[#2E8B60]">
                      {t.mapCurrentStop}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      cuteAudio.playPop(700);
                      const firstBoard = selectedDishes[0]?.board || 'coastal';
                      onOpenStopInMenus(selected.id, firstBoard);
                    }}
                    className="px-btn bg-[#FFE59A] px-4 py-2 text-xs sm:text-sm font-bold text-[var(--ink-main)]"
                  >
                    {t.mapCookHere}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    cuteAudio.playPop(640);
                    onOpenStopInMenus(activeRestaurantId, 'coastal');
                  }}
                  className="px-btn bg-[var(--accent-primary)] px-4 py-2 text-xs sm:text-sm font-bold text-white flex items-center gap-1.5"
                >
                  <ShellIllustration size={18} />
                  <span>
                    {shellsPending > 0
                      ? `Feed ${Math.max(1, selected.shellsRequired - shellsFed)} Shells in Sanctuary!`
                      : `Cook to Unlock (${selected.shellsRequired - shellsFed}🐚 left)`}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Mangrove Ecology Connection Box */}
          <div className="mt-3 px-box bg-white/90 p-3 text-xs sm:text-sm text-[var(--ink-main)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="leading-snug">{selected.ecoStory}</p>
            <div className="shrink-0 text-xs font-bold tabular-nums text-[var(--accent-mint)] whitespace-nowrap">
              Cooked {selectedStats.cooked}/{selectedStats.total} · Quizzes {selectedStats.quizzes}/
              {selectedStats.total}
            </div>
          </div>

          {!selectedUnlocked && (
            <div className="mt-3 px-box bg-[#FFF7DF] px-3 py-2 text-xs font-bold text-[#7A5410]">
              Unlock Requirement: Reach Level {selected.stageRequired} (
              {SAPLING_STAGES[selected.stageRequired].en}) by feeding {selected.shellsRequired}{' '}
              shells to your Tomodachi. Current stage: Lv.{currentStageIdx} (
              {SAPLING_STAGES[currentStageIdx].en}, {shellsFed} shells fed).
            </div>
          )}

          {/* 5 Signature Dishes for This Restaurant */}
          <div className="mt-4">
            <div className="text-xs font-bold uppercase tracking-wide text-[var(--ink-main)] mb-2.5">
              {t.mapSignatureDishes} ({selectedDishes.length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedDishes.map((dish) => {
                const count = cookedCounts[dish.id] || 0;
                const quizDone = !!solvedQuizzes[dish.id];

                return (
                  <div
                    key={dish.id}
                    className={`px-box p-3 flex items-center gap-3 ${
                      selectedUnlocked ? 'bg-white' : 'bg-white/60 opacity-80'
                    }`}
                  >
                    <div className="px-box bg-[#FFF6FA] p-1.5 shrink-0">
                      <DishIllustration id={dish.id} size={44} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-bold text-[var(--ink-main)] truncate">
                        {dish.en}
                      </div>
                      <div className="text-[11px] font-semibold text-[var(--ink-soft)] truncate">
                        {dish.th}
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-[var(--accent-primary)] tabular-nums">
                          {count > 0 ? `Cooked ${count}×` : dish.priceLabel}
                          {quizDone ? ' · ★' : ''}
                        </span>
                        {selectedUnlocked && (
                          <button
                            type="button"
                            onClick={() => {
                              cuteAudio.playPop(720);
                              onCookDish(dish);
                            }}
                            className="px-btn bg-[var(--accent-mint)] px-2.5 py-1 text-[11px] font-bold text-white"
                          >
                            {t.cookDishBtn}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
