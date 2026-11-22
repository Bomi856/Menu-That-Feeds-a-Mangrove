import React from 'react';
import { AVATAR_COLORS, DishId, IngredientId, WardrobeItem } from '../data/gameData';

export type TomodachiMood = 'idle' | 'happy' | 'celebrating' | 'sad';

const STROKE = '#5B2A4A';

// Rich pastel pixel-art palette for food icons, dividers, and UI sprites
const PAL: Record<string, string> = {
  o: '#5B2A4A',
  w: '#FFFFFF',
  c: '#FFF6E3',
  k: '#FFE1CE',
  p: '#FF9EC2',
  P: '#E05A8D',
  r: '#FF7B7B',
  R: '#D94A5A',
  y: '#FFE68F',
  Y: '#E8B243',
  g: '#95DF9E',
  G: '#409B68',
  l: '#C8F08F',
  b: '#8ED8F8',
  B: '#499CD1',
  v: '#CDBDF7',
  n: '#D49A6E',
  N: '#8F593C',
  s: '#F5E4C3',
  d: '#6F728C',
  D: '#4E516B',
};

function renderPixelGrid(
  rows: string[],
  size: number,
  extraPal?: Record<string, string>,
  className = ''
) {
  const height = rows.length;
  const width = rows[0]?.length || 16;
  const map = extraPal ? { ...PAL, ...extraPal } : PAL;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={size}
      height={Math.round((size * height) / width)}
      shapeRendering="crispEdges"
      className={`pixel-art ${className}`}
      aria-hidden="true"
    >
      {rows.map((row, y) =>
        row.split('').map((ch, x) => {
          const fill = map[ch];
          if (!fill) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />;
        })
      )}
    </svg>
  );
}

// === MENU SWITCHER PIXEL ART THUMBNAILS (Pink for Coastal Kitchen, Blue for Mangrove Sweets & Drinks) ===
export const PinkMenuArt: React.FC<{ size?: number }> = ({ size = 60 }) =>
  renderPixelGrid(
    [
      '..oooooooooo..',
      '.oppppppppppo.',
      '.opccccccccpo.',
      '.opcPPPPPPcpo.',
      '.opccccccccpo.',
      '.opcrrcYYrcpo.',
      '.opccccccccpo.',
      '.opcpprrppcpo.',
      '.opccccccccpo.',
      '.opcggggggcpo.',
      '.opccccccccpo.',
      '.oppppppppppo.',
      '..oooooooooo..',
    ],
    size
  );

export const BlueMenuArt: React.FC<{ size?: number }> = ({ size = 60 }) =>
  renderPixelGrid(
    [
      '..oooooooooo..',
      '.obbbbbbbbbbo.',
      '.obwwwwwwwwbo.',
      '.obwBBBBBBwbo.',
      '.obwwwwwwwwbo.',
      '.obwppwyywwbo.',
      '.obwppwBBwwbo.',
      '.obwwwwwwwwbo.',
      '.obwggwppwwbo.',
      '.obwBBwyywwbo.',
      '.obwwwwwwwwbo.',
      '.obbbbbbbbbbo.',
      '..oooooooooo..',
    ],
    size
  );

// === CUTE PIXEL MUSIC PLAYER ICON (with dancing equalizer + floating note) ===
export const PixelMusicPlayerIcon: React.FC<{ playing: boolean; size?: number }> = ({
  playing,
  size = 28,
}) => (
  <div className="relative inline-flex items-center justify-center" aria-hidden="true">
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className="pixel-art"
    >
      <rect x="2" y="2" width="12" height="12" fill="#5B2A4A" />
      <rect x="3" y="3" width="10" height="10" fill={playing ? '#FFE68F' : '#FFFFFF'} />
      <rect x="4" y="4" width="8" height="4" fill="#5B2A4A" />
      <rect x="5" y="5" width="6" height="2" fill={playing ? '#8ED8F8' : '#CDBDF7'} />
      {playing ? (
        <>
          <rect x="5" y="5" width="1" height="2" fill="#E05A8D" className="eq-bar" />
          <rect x="7" y="5" width="2" height="2" fill="#409B68" className="eq-bar eq-bar-2" />
          <rect x="10" y="5" width="1" height="2" fill="#E05A8D" className="eq-bar eq-bar-3" />
        </>
      ) : (
        <>
          <rect x="6" y="5" width="1" height="2" fill="#5B2A4A" />
          <rect x="9" y="5" width="1" height="2" fill="#5B2A4A" />
        </>
      )}
      <rect x="4" y="9" width="2" height="2" fill="#FF9EC2" />
      <rect x="7" y="9" width="2" height="2" fill="#8ED8F8" />
      <rect x="10" y="9" width="2" height="2" fill="#95DF9E" />
      <rect x="5" y="11" width="6" height="1" fill="#5B2A4A" opacity="0.25" />
    </svg>
    {playing && (
      <span
        className="note-float pointer-events-none absolute -top-2 -right-1.5 text-xs font-bold text-[#d94f84]"
        aria-hidden="true"
      >
        ♪
      </span>
    )}
  </div>
);

// === PIXEL DIVIDERS ===
export const PixelDivider: React.FC<{
  variant?: 'hearts' | 'shells' | 'stars' | 'crab' | 'leaf';
  label?: string;
}> = ({ variant = 'shells', label }) => {
  const heartGrid = ['.oo.oo.', 'opppppo', 'opwpppo', '.oppPo.', '..opo..', '...o...'];
  const starGrid = ['...o...', '..oyo..', 'ooyyyoo', '.oyyyo.', 'ooy.yoo', 'o.....o'];
  const shellGrid = ['..ooo..', '.oykyo.', 'oskkkyo', 'osskssy', '.ooyoo.'];
  const crabGrid = ['o.....o', '.o.oo.o', '.orrrro', 'orrwrrro', '.oorroo'];
  const leafGrid = ['...oo..', '..ogGo.', '.ogGGGo', 'ogGggo.', 'o..oo..'];

  const sprite =
    variant === 'stars'
      ? starGrid
      : variant === 'shells'
      ? shellGrid
      : variant === 'crab'
      ? crabGrid
      : variant === 'leaf'
      ? leafGrid
      : heartGrid;

  return (
    <div className="my-5 flex items-center justify-center gap-3 select-none" aria-hidden="true">
      <div className="h-[3px] flex-1 bg-[repeating-linear-gradient(90deg,var(--outline)_0_5px,transparent_5px_10px)] opacity-35" />
      <div className="flex items-center gap-2 px-1">
        {renderPixelGrid(sprite, 16)}
        {label ? (
          <span className="text-xs font-bold tracking-wider uppercase text-[var(--ink-soft)]">
            {label}
          </span>
        ) : (
          renderPixelGrid(starGrid, 14)
        )}
        {renderPixelGrid(sprite, 16)}
      </div>
      <div className="h-[3px] flex-1 bg-[repeating-linear-gradient(90deg,var(--outline)_0_5px,transparent_5px_10px)] opacity-35" />
    </div>
  );
};

// === HOPPING COASTAL PIXEL MASCOT WITH MANGROVE LEAF CAP ===
export const PixelMascotIllustration: React.FC<{ size?: number }> = ({ size = 84 }) => (
  <svg
    viewBox="0 0 24 22"
    width={size}
    height={Math.round((size * 22) / 24)}
    shapeRendering="crispEdges"
    className="pixel-art"
    aria-hidden="true"
  >
    {/* Soft floor shadow */}
    <rect x="6" y="19" width="12" height="2" fill="#243F59" opacity="0.16" />
    {/* Little mangrove leaf sprout on cap */}
    <rect x="11" y="1" width="2" height="1" fill="#2F9473" />
    <rect x="10" y="2" width="4" height="2" fill="#88DF92" />
    {/* Cozy coastal explorer cap (sky blue & golden trim) */}
    <rect x="8" y="4" width="8" height="1" fill="#243F59" />
    <rect x="7" y="5" width="10" height="3" fill="#68BEE8" />
    <rect x="8" y="6" width="3" height="1" fill="#B8E8FF" />
    <rect x="6" y="5" width="1" height="3" fill="#243F59" />
    <rect x="17" y="5" width="1" height="3" fill="#243F59" />
    <rect x="10" y="7" width="4" height="1" fill="#FFE38A" />
    {/* Fluffy cream-white round buddy */}
    <rect x="7" y="8" width="10" height="1" fill="#243F59" />
    <rect x="5" y="9" width="2" height="1" fill="#243F59" />
    <rect x="7" y="9" width="10" height="9" fill="#FFFFFF" />
    <rect x="17" y="9" width="2" height="1" fill="#243F59" />
    <rect x="4" y="10" width="1" height="6" fill="#243F59" />
    <rect x="5" y="10" width="2" height="7" fill="#FFFFFF" />
    <rect x="17" y="10" width="2" height="7" fill="#FFFFFF" />
    <rect x="19" y="10" width="1" height="6" fill="#243F59" />
    {/* Little fluffy tail */}
    <rect x="20" y="12" width="1" height="3" fill="#DCEAF5" />
    <rect x="21" y="12" width="1" height="2" fill="#243F59" />
    {/* Glossy pixel eyes & cozy mint scarf */}
    <rect x="8" y="12" width="2" height="2" fill="#243F59" />
    <rect x="8" y="12" width="1" height="1" fill="#FFFFFF" />
    <rect x="14" y="12" width="2" height="2" fill="#243F59" />
    <rect x="14" y="12" width="1" height="1" fill="#FFFFFF" />
    <rect x="6" y="14" width="2" height="1" fill="#FFD1B8" />
    <rect x="16" y="14" width="2" height="1" fill="#FFD1B8" />
    <rect x="11" y="14" width="2" height="1" fill="#E69B78" />
    <rect x="7" y="16" width="10" height="1" fill="#77D484" />
    <rect x="11" y="16" width="2" height="2" fill="#409B68" />
    {/* Paws & soft shading */}
    <rect x="6" y="17" width="12" height="1" fill="#E8F2FA" />
    <rect x="5" y="16" width="1" height="2" fill="#243F59" />
    <rect x="18" y="16" width="1" height="2" fill="#243F59" />
    <rect x="6" y="18" width="3" height="1" fill="#243F59" />
    <rect x="9" y="17" width="6" height="1" fill="#243F59" />
    <rect x="15" y="18" width="3" height="1" fill="#243F59" />
    {/* Floating golden & aqua sparkles */}
    <rect x="2" y="5" width="1" height="1" fill="#FFE282" />
    <rect x="1" y="6" width="3" height="1" fill="#FFE282" />
    <rect x="2" y="7" width="1" height="1" fill="#FFE282" />
    <rect x="21" y="4" width="1" height="1" fill="#68BEE8" />
    <rect x="20" y="5" width="3" height="1" fill="#68BEE8" />
    <rect x="21" y="6" width="1" height="1" fill="#68BEE8" />
  </svg>
);

// === PIXEL SEASHELL TOKEN (Pearlescent Coastal Ivory & Sand-Gold) ===
export const ShellIllustration: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = '',
}) =>
  renderPixelGrid(
    [
      '....oooooo....',
      '..oossssssoo..',
      '.osyswsyswsyo.',
      'osyswskskswsyo',
      'osysookookysyo',
      'osyswskskswsyo',
      '.ossyswsyssso.',
      '..oossYYssoo..',
      '....oooooo....',
      '.....oYYo.....',
    ],
    size,
    undefined,
    className
  );

// === CUTE PIXEL FOOD SPRITES FOR ALL BANG KHUN THIAN DISHES & TREATS ===
const DISH_GRIDS: Record<DishId, string[]> = {
  cockleSalad: [
    '....gg....oo....',
    '...gGGg..orro...',
    '..oossssoossso..',
    '.osnnsnnsnnsnso.',
    'osnnsnnsnnsnnsno',
    '.osnoonoonsnsso.',
    '..olllooooosso..',
    '.oppppppppppppo.',
    '..oooooooooooo..',
  ],
  blanchedCockles: [
    '......oooo......',
    '...ooossssooo...',
    '..osnsnsnsnsso..',
    '.osnsnsnsnsnsso.',
    '.osnoonoonsnsso.',
    '..osssssssssso..',
    '.occccccccccccwo',
    '..oooorrrroooo..',
    '....oooooooo....',
  ],
  steamedMussels: [
    '....gg....gg....',
    '...gGGg..gGGg...',
    '..ooDDDo.oDDDoo.',
    '.oDDDDDDoDDDDDdo',
    'oDDyDDDDDDDDyDDo',
    'oDDyDooonooDyDDo',
    '.oDDDDDDDDDDDDo.',
    '..onnnnnnnnnno..',
    '...oooooooooo...',
  ],
  oysterOmelette: [
    '...gg......gg...',
    '..oYYooooooYYo..',
    '.oYYYYyyyyYYYYo.',
    'oYYysssysssyYYYo',
    'oYYysooooosyYYYo',
    'oYYYYssssssYYYYo',
    '.oYYYYyyyyYYYYo.',
    '..oPPPPPPPPPPo..',
    '...oooooooooo...',
  ],
  papayaOyster: [
    '.....oo..rr.....',
    '...oorrooroo....',
    '..okkkssskkko...',
    '.okksssoooskko..',
    '.okkkssssskkko..',
    '..okggggggggko..',
    '.obbbbbbbbbbbbo.',
    '..oooooooooooo..',
  ],
  oysterSalad: [
    '....ll....gg....',
    '...olll..gGGg...',
    '..oossssoossso..',
    '.osssssssosssso.',
    'osssoooosssoosso',
    '.osssssssssssso.',
    '..obbbbbbbbbbbo.',
    '...ooooooooooo..',
  ],
  crabRoeDip: [
    '...gg......gg...',
    '..oYYooooooYYo..',
    '.occcYYYYYYccco.',
    'occcYYoYYoYYccco',
    'occcYYYYYYYYccco',
    '.onnnnnnnnnnnno.',
    '.oGGGGGGGGGGGGo.',
    '..oooooooooooo..',
  ],
  steamedMudCrab: [
    '.oo..........oo.',
    'orro........orro',
    '.oo...oooo...oo.',
    '...ooorrrrooo...',
    '..orrwrrrrwrro..',
    '.orrrrrrrrrrrro.',
    '.orrprrrrrrprro.',
    '..ooorrrrrrooo..',
    '.oo..o.oo.o..oo.',
    'o....o....o....o',
  ],
  pickledCrabSomTum: [
    '....oo....rr....',
    '..oorro..oroo...',
    '.orrrroookkkko..',
    '.orwrokkrrkkkko.',
    '..oookkggggggko.',
    '..oobbbbbbbbbbbo',
    '...oooooooooooo.',
  ],
  riverPrawns: [
    '.....oooooo.....',
    '...ooppppppo....',
    '..opppwppppko...',
    '..opppooopppo...',
    '..oppo...oppo...',
    '...oo.....ppo...',
    '.......oooppo...',
    '..ollloppppppo..',
    '..ooo..okk.ooo..',
  ],
  shrimpBlite: [
    '....gg....gg....',
    '..ogGGg..gGggo..',
    '.ogGoppppppoGgo.',
    '.oggopppwppoggo.',
    '..ogopppoopoggo.',
    '...oppppppppo...',
    '..oppppppppppo..',
    '...oooooooooo...',
  ],
  sourCurryBlite: [
    '....gg....pp....',
    '...gGGg..oppo...',
    '..oRRRRRRRRRRo..',
    '.oRRgRRppRRgRRo.',
    '.oRRRRRRRRRRRRo.',
    '..obbbbbbbbbbo..',
    '...oooooooooo...',
  ],
  sourCurryChaOm: [
    '....yy....pp....',
    '...oyyo..oppo...',
    '..oRRRRRRRRRRo..',
    '.oRyyRRppRRyyRo.',
    '.oRRRRRRRRRRRRo.',
    '..onnnnnnnnnno..',
    '...oooooooooo...',
  ],
  waterMimosa: [
    '.....rr..gg.....',
    '...oorroggGgo...',
    '..ogGGgggGGGgo..',
    '.ogGggggggggGgo.',
    '..ogGgrrrrgGgo..',
    '.occccccccccccwo',
    '..oooooooooooo..',
  ],
  nipaGelato: [
    '....oooooo....',
    '...occccccwo..',
    '..occbbccbbco.',
    '.ogggggggggggo',
    '.occcooccoocco',
    '..ooooooooooo.',
    '..obbbbbbbbbo.',
    '...obbbbbbbo..',
    '....ooooooo...',
    '......ooo.....',
    '....ooooooo...',
  ],
  honeyFizz: [
    '........oo....',
    '.......obbo...',
    '..ooo..ob.....',
    '.oyyyoobbbboo.',
    '.oylyooyyyybo.',
    '..ooooyyyyyyo.',
    '..obyyyyyyyyo.',
    '..obyyooyyyyo.',
    '..obyyyyyyyyo.',
    '..obbbbbbbbbo.',
    '...ooooooooo..',
  ],
  crepeCake: [
    '......oo......',
    '.....orrro....',
    '....occccco...',
    '...onnnnnnno..',
    '..occccccccco.',
    '..oYYYYYYYYYo.',
    '..occccccccco.',
    '..oYYYYYYYYYo.',
    '.obbbbbbbbbbbo',
    '..ooooooooooo.',
  ],
  berryFloat: [
    '.......oo.....',
    '......obbo....',
    '....oooooooo..',
    '...occcrrccco.',
    '..occcccccccco',
    '..obbbbbbbbbbo',
    '..obbbwbbwbbbo',
    '..obbbbbbbbbbo',
    '...obbbbbbbbo.',
    '....oooooooo..',
  ],
  matchaBottle: [
    '.....oooo.....',
    '....ogggggo...',
    '.....ooooo....',
    '....obbbbbo...',
    '...obwwwwwbo..',
    '...obwoowwbo..',
    '...obwwwwwbo..',
    '...oyyyyyyyo..',
    '...oyyyyyyyo..',
    '....ooooooo...',
  ],
  palmTart: [
    '......oo......',
    '.....orrrro...',
    '....occcccco..',
    '...occcbbccco.',
    '..occcccccccco',
    '.onnnnnnnnnnno',
    '.onYYnYYnYYnno',
    '..onnnnnnnnno.',
    '...ooooooooo..',
  ],
};

export const DishIllustration: React.FC<{ id: DishId; size?: number; className?: string }> = ({
  id,
  size = 64,
  className = '',
}) => renderPixelGrid(DISH_GRIDS[id], size, undefined, className);

// === PIXEL INGREDIENT SPRITES ===
const INGREDIENT_GRIDS: Record<IngredientId, string[]> = {
  garlic: [
    '.....oo.....',
    '.....co.....',
    '....occo....',
    '...occcco...',
    '..occcccco..',
    '..occwccco..',
    '..occwccco..',
    '...occcco...',
    '....oooo....',
  ],
  chili: [
    '........oo..',
    '.......ogGo.',
    '......orrro.',
    '.....orrro..',
    '....orrro...',
    '...orrro....',
    '..orrro.....',
    '.orro.......',
    '..oo........',
  ],
  lime: [
    '...oooooo...',
    '..ollllllo..',
    '.ollwlllllo.',
    '.ollllllllo.',
    '.ollllwlllo.',
    '.ollllllllo.',
    '..ollllllo..',
    '...oooooo...',
  ],
  herbs: [
    '......oo....',
    '....ogGGgo..',
    '...ogGggo...',
    '..ogGggo....',
    '.ogGggo.....',
    '.occco......',
    '..ooo.......',
  ],
  seablite: [
    '...oo..oo...',
    '..oggooggo..',
    '.ogGggggGgo.',
    '.oGGGGGGGGo.',
    '..ogGggGgo..',
    '....oGGo....',
    '.....GG.....',
  ],
  tamarind: [
    '....ooooo...',
    '...oNNNNNo..',
    '..oNnNNnNNo.',
    '..oNNNNNNNo.',
    '...oNnNNNo..',
    '....ooooo...',
  ],
  basil: [
    '...oo..oo...',
    '..oggooggo..',
    '.oggggggggo.',
    '.ogGggggGgo.',
    '..oggggggo..',
    '....oGGo....',
    '.....GG.....',
    '.....GG.....',
  ],
  coconut: [
    '...oooooo...',
    '..onnnnnno..',
    '.onwwwwwwno.',
    '.onwwwwwwno.',
    '.onwwwwwwno.',
    '.onnwwwwnno.',
    '..onnnnnno..',
    '...oooooo...',
  ],
  sugar: [
    '...oooooo...',
    '..oYyyyyYo..',
    '.oYyyyyyyYo.',
    '.oYyyyyyyYo.',
    '.oYYyyyyYYo.',
    '..oYYYYYYo..',
    '...oooooo...',
  ],
  nipa: [
    '..ooo..ooo..',
    '.obbboobbbo.',
    'obwbboobwbbo',
    'obbbboobbbbo',
    '.obbboobbbo.',
    '..ooo..ooo..',
  ],
  honey: [
    '...oooooo...',
    '..occcccco..',
    '..oooooooo..',
    '.oYYYYYYYYo.',
    '.oYyyyyyyYo.',
    '.oYYYYYYYYo.',
    '..oooooooo..',
  ],
  strawberry: [
    '...oo..oo...',
    '..oGGGGGGGo.',
    '.orrrrrrrro.',
    '.orrwrrwrro.',
    '..orrrrrro..',
    '...orrro....',
    '....ooo.....',
  ],
};

export const IngredientIllustration: React.FC<{ id: IngredientId; size?: number }> = ({
  id,
  size = 40,
}) => renderPixelGrid(INGREDIENT_GRIDS[id], size);

// === CUTE WARDROBE ACCESSORY ICONS ===
export const WardrobeIllustration: React.FC<{ id: WardrobeItem['id']; size?: number }> = ({
  id,
  size = 44,
}) => {
  switch (id) {
    case 'hat':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
          <ellipse cx="24" cy="31" rx="18" ry="6" fill="#FFE49C" stroke={STROKE} strokeWidth="2.4" />
          <path d="M15 30 C15 17, 33 17, 33 30 Z" fill="#FFD673" stroke={STROKE} strokeWidth="2.4" />
          <path d="M16 26 L32 26" stroke="#F08A9B" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    case 'crab':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
          <path d="M12 22 C8 16, 15 13, 18 19 Z" fill="#FF927B" stroke={STROKE} strokeWidth="2.2" />
          <path d="M36 22 C40 16, 33 13, 30 19 Z" fill="#FF927B" stroke={STROKE} strokeWidth="2.2" />
          <ellipse cx="24" cy="29" rx="11" ry="8" fill="#FF9D87" stroke={STROKE} strokeWidth="2.4" />
          <circle cx="20.5" cy="28" r="1.5" fill={STROKE} />
          <circle cx="27.5" cy="28" r="1.5" fill={STROKE} />
          <circle cx="20" cy="27.3" r="0.6" fill="#FFFFFF" />
          <circle cx="27" cy="27.3" r="0.6" fill="#FFFFFF" />
          <path d="M22.5 30.5 Q24 32 25.5 30.5" fill="none" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'can':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
          <path d="M16 22 L10 15" stroke={STROKE} strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="9" cy="14" r="3" fill="#B5E8FA" stroke={STROKE} strokeWidth="2" />
          <rect x="16" y="19" width="17" height="16" rx="4" fill="#FFABC0" stroke={STROKE} strokeWidth="2.4" />
          <path d="M33 21 C39 21, 39 32, 33 32" fill="none" stroke={STROKE} strokeWidth="2.5" />
        </svg>
      );
    case 'chime':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
          <path d="M12 16 L36 16" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
          <path d="M17 16 L17 26 M24 16 L24 30 M31 16 L31 25" stroke={STROKE} strokeWidth="1.8" />
          <circle cx="17" cy="28" r="3.5" fill="#FFDDE6" stroke={STROKE} strokeWidth="2" />
          <circle cx="24" cy="32" r="4" fill="#D5F4FF" stroke={STROKE} strokeWidth="2" />
          <circle cx="31" cy="27" r="3.5" fill="#FFF0AE" stroke={STROKE} strokeWidth="2" />
        </svg>
      );
    case 'crown':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
          <path d="M12 28 Q24 21 36 28" fill="none" stroke="#68B979" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="15" cy="25" r="4.5" fill="#FFD1DE" stroke={STROKE} strokeWidth="2" />
          <circle cx="24" cy="22" r="5" fill="#FFF3A8" stroke={STROKE} strokeWidth="2" />
          <circle cx="33" cy="25" r="4.5" fill="#CBEFFF" stroke={STROKE} strokeWidth="2" />
        </svg>
      );
  }
};

function adjustHex(hex: string, delta: number): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return hex;
  const num = parseInt(clean, 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp(((num >> 16) & 255) + delta);
  const g = clamp(((num >> 8) & 255) + delta);
  const b = clamp((num & 255) + delta);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// === FINE PASTEL PIXEL-ART LIVING MANGROVE TOMODACHI (inspired by reference aesthetic) ===
export const SaplingIllustration: React.FC<{
  stage: number;
  equipped: WardrobeItem['id'][];
  mood?: TomodachiMood;
  isBlinking?: boolean;
  size?: number;
}> = ({ stage, equipped, mood = 'idle', isBlinking = false, size = 200 }) => {
  const safeStage = Math.max(0, Math.min(3, stage));
  const has = (id: WardrobeItem['id']) => equipped.includes(id);

  const animClass =
    mood === 'celebrating' || mood === 'happy'
      ? 'tomodachi-celebrate'
      : mood === 'sad'
      ? 'tomodachi-sad'
      : 'tomodachi-idle';

  // Pixel face coordinates inside 56x48 canvas (x center = 28)
  const faceY = safeStage === 0 ? 31 : safeStage === 1 ? 26 : safeStage === 2 ? 18 : 17;

  const renderPixelFace = (cx: number, cy: number) => {
    const lx = cx - 5;
    const rx = cx + 3;
    return (
      <g>
        {/* Soft pastel pixel cheek blush */}
        <rect x={lx - 2} y={cy + 3} width="2" height="1" fill="#FFA6C2" />
        <rect x={rx + 2} y={cy + 3} width="2" height="1" fill="#FFA6C2" />

        {mood === 'celebrating' || mood === 'happy' ? (
          <>
            {/* Joyful ^ ^ pixel eyes */}
            <rect x={lx - 1} y={cy + 1} width="1" height="1" fill="#422636" />
            <rect x={lx} y={cy} width="2" height="1" fill="#422636" />
            <rect x={lx + 2} y={cy + 1} width="1" height="1" fill="#422636" />
            <rect x={rx - 1} y={cy + 1} width="1" height="1" fill="#422636" />
            <rect x={rx} y={cy} width="2" height="1" fill="#422636" />
            <rect x={rx + 2} y={cy + 1} width="1" height="1" fill="#422636" />
            {/* Happy rosy smile */}
            <rect x={cx - 1} y={cy + 3} width="2" height="1" fill="#FF7CA8" />
            <rect x={cx - 2} y={cy + 2} width="1" height="1" fill="#422636" />
            <rect x={cx + 1} y={cy + 2} width="1" height="1" fill="#422636" />
          </>
        ) : mood === 'sad' ? (
          <>
            {/* Droopy worried pixel brows */}
            <rect x={lx - 1} y={cy - 1} width="2" height="1" fill="#5B3647" />
            <rect x={rx + 1} y={cy - 1} width="2" height="1" fill="#5B3647" />
            {/* Glossy watery eyes */}
            <rect x={lx} y={cy} width="2" height="2" fill="#3F2433" />
            <rect x={lx} y={cy} width="1" height="1" fill="#FFFFFF" />
            <rect x={lx + 1} y={cy + 1} width="1" height="1" fill="#9DE3FA" />
            <rect x={rx} y={cy} width="2" height="2" fill="#3F2433" />
            <rect x={rx} y={cy} width="1" height="1" fill="#FFFFFF" />
            <rect x={rx + 1} y={cy + 1} width="1" height="1" fill="#9DE3FA" />
            {/* Cute blue pixel teardrop */}
            <rect x={lx - 1} y={cy + 2} width="1" height="2" fill="#77D4FA" />
            <rect x={lx - 1} y={cy + 4} width="1" height="1" fill="#499CD1" />
            {/* Tiny sad pout */}
            <rect x={cx - 1} y={cy + 3} width="2" height="1" fill="#422636" />
            <rect x={cx - 2} y={cy + 4} width="1" height="1" fill="#422636" />
            <rect x={cx + 1} y={cy + 4} width="1" height="1" fill="#422636" />
          </>
        ) : isBlinking ? (
          <>
            {/* Soft closed pixel eyelashes */}
            <rect x={lx - 1} y={cy + 1} width="3" height="1" fill="#422636" />
            <rect x={rx} y={cy + 1} width="3" height="1" fill="#422636" />
            <rect x={cx - 1} y={cy + 3} width="2" height="1" fill="#E884A4" />
          </>
        ) : (
          <>
            {/* Dreamy glossy anime-pixel eyes matching reference! */}
            <rect x={lx - 1} y={cy} width="3" height="1" fill="#3D222E" />
            <rect x={lx} y={cy + 1} width="1" height="1" fill="#FFFFFF" />
            <rect x={lx + 1} y={cy + 1} width="1" height="1" fill="#C95986" />
            <rect x={lx} y={cy + 2} width="2" height="1" fill="#FF9FC2" />

            <rect x={rx} y={cy} width="3" height="1" fill="#3D222E" />
            <rect x={rx} y={cy + 1} width="1" height="1" fill="#FFFFFF" />
            <rect x={rx + 1} y={cy + 1} width="1" height="1" fill="#C95986" />
            <rect x={rx} y={cy + 2} width="2" height="1" fill="#FF9FC2" />

            {/* Sweet tiny rose mouth */}
            <rect x={cx - 1} y={cy + 3} width="2" height="1" fill="#E884A4" />
          </>
        )}
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 56 48"
      width={size}
      height={Math.round((size * 48) / 56)}
      shapeRendering="crispEdges"
      className="pixel-art"
      aria-hidden="true"
    >
      {/* Pastel Pixel Sky & Clouds */}
      <rect x="1" y="1" width="54" height="31" fill="#E9F8FF" />
      {/* Pixel Sun */}
      <rect x="44" y="4" width="6" height="6" fill="#FFE896" />
      <rect x="45" y="5" width="4" height="4" fill="#FFF7CC" />
      {/* Fluffy Pixel Clouds */}
      <rect x="5" y="6" width="8" height="2" fill="#FFFFFF" />
      <rect x="7" y="5" width="4" height="1" fill="#FFFFFF" />
      <rect x="33" y="9" width="7" height="2" fill="#FFFFFF" />
      <rect x="35" y="8" width="3" height="1" fill="#FFFFFF" />

      {/* Shimmering Aqua Coastal Water */}
      <rect x="1" y="31" width="54" height="16" fill="#BCEBFB" />
      <rect x="4" y="33" width="6" height="1" fill="#FFFFFF" />
      <rect x="42" y="35" width="7" height="1" fill="#FFFFFF" />
      <rect x="9" y="39" width="4" height="1" fill="#E8FAFF" />

      {/* Warm Sandy Mudflat Island */}
      <rect x="10" y="36" width="36" height="2" fill="#EED2B5" />
      <rect x="8" y="38" width="40" height="5" fill="#E8C6A4" />
      <rect x="11" y="43" width="34" height="2" fill="#D5AE89" />
      <rect x="10" y="35" width="36" height="1" fill="#5B2A4A" opacity="0.25" />

      {/* Protective Pastel Shell Bio-Barrier */}
      <rect x="14" y="40" width="4" height="2" fill="#FFD1E1" />
      <rect x="15" y="39" width="2" height="1" fill="#FFF3F7" />
      <rect x="20" y="41" width="4" height="2" fill="#FFF3D4" />
      <rect x="21" y="40" width="2" height="1" fill="#FFFFFF" />
      <rect x="26" y="41" width="4" height="2" fill="#FFD1E1" />
      <rect x="27" y="40" width="2" height="1" fill="#FFF3F7" />
      <rect x="32" y="41" width="4" height="2" fill="#FFF3D4" />
      <rect x="33" y="40" width="2" height="1" fill="#FFFFFF" />
      <rect x="38" y="40" width="4" height="2" fill="#FFD1E1" />
      <rect x="39" y="39" width="2" height="1" fill="#FFF3F7" />

      {/* Pixel Frame Outline */}
      <rect x="0" y="0" width="56" height="1" fill="#5B2A4A" />
      <rect x="0" y="47" width="56" height="1" fill="#5B2A4A" />
      <rect x="0" y="0" width="1" height="48" fill="#5B2A4A" />
      <rect x="55" y="0" width="1" height="48" fill="#5B2A4A" />

      {/* Alive Animated Pastel Pixel Tomodachi */}
      <g className={animClass} style={{ transformOrigin: '28px 36px' }}>
        {safeStage === 0 && (
          <g>
            {/* Stage 0: Plump Pastel Coastal Seed */}
            <rect x="26" y="21" width="4" height="1" fill="#482A3B" />
            <rect x="28" y="22" width="3" height="2" fill="#77D484" />
            <rect x="24" y="24" width="8" height="1" fill="#482A3B" />
            <rect x="22" y="25" width="1" height="2" fill="#482A3B" />
            <rect x="23" y="25" width="10" height="12" fill="#A5EA9F" />
            <rect x="33" y="25" width="1" height="2" fill="#482A3B" />
            <rect x="21" y="27" width="1" height="10" fill="#482A3B" />
            <rect x="22" y="27" width="12" height="10" fill="#A5EA9F" />
            <rect x="34" y="27" width="1" height="10" fill="#482A3B" />
            {/* Cute highlight & soft bottom shade */}
            <rect x="24" y="26" width="3" height="2" fill="#D2F9CB" />
            <rect x="22" y="35" width="12" height="2" fill="#7ED485" />
            <rect x="22" y="37" width="12" height="1" fill="#482A3B" />
            {renderPixelFace(28, faceY)}
          </g>
        )}

        {safeStage === 1 && (
          <g>
            {/* Stage 1: Plush Tide Sprout Buddy */}
            {/* Stem */}
            <rect x="27" y="31" width="2" height="6" fill="#9E6E54" />
            <rect x="26" y="31" width="1" height="6" fill="#482A3B" />
            <rect x="29" y="31" width="1" height="6" fill="#482A3B" />
            {/* Twin perky side leaves */}
            <rect x="17" y="18" width="5" height="1" fill="#482A3B" />
            <rect x="16" y="19" width="7" height="3" fill="#95E493" />
            <rect x="18" y="19" width="3" height="1" fill="#C9F8C2" />
            <rect x="17" y="22" width="5" height="1" fill="#482A3B" />

            <rect x="34" y="18" width="5" height="1" fill="#482A3B" />
            <rect x="33" y="19" width="7" height="3" fill="#75CD7D" />
            <rect x="35" y="19" width="3" height="1" fill="#A5EBA2" />
            <rect x="34" y="22" width="5" height="1" fill="#482A3B" />

            {/* Plump Sprout Head */}
            <rect x="24" y="21" width="8" height="1" fill="#482A3B" />
            <rect x="22" y="22" width="12" height="1" fill="#A6EB9F" />
            <rect x="21" y="22" width="1" height="2" fill="#482A3B" />
            <rect x="34" y="22" width="1" height="2" fill="#482A3B" />
            <rect x="20" y="24" width="1" height="6" fill="#482A3B" />
            <rect x="21" y="23" width="14" height="8" fill="#A6EB9F" />
            <rect x="35" y="24" width="1" height="6" fill="#482A3B" />
            <rect x="23" y="23" width="4" height="1" fill="#D5FACD" />
            <rect x="22" y="30" width="12" height="1" fill="#7DD382" />
            <rect x="22" y="31" width="12" height="1" fill="#482A3B" />
            {renderPixelFace(28, faceY)}
          </g>
        )}

        {safeStage === 2 && (
          <g>
            {/* Stage 2: Rooted Sapling Buddy with Prop Roots */}
            <rect x="27" y="25" width="2" height="12" fill="#9E6E54" />
            <rect x="26" y="25" width="1" height="6" fill="#482A3B" />
            <rect x="29" y="25" width="1" height="6" fill="#482A3B" />
            {/* Arching mangrove prop roots */}
            <rect x="23" y="29" width="3" height="2" fill="#8B5C44" />
            <rect x="21" y="31" width="2" height="6" fill="#8B5C44" />
            <rect x="30" y="29" width="3" height="2" fill="#8B5C44" />
            <rect x="33" y="31" width="2" height="6" fill="#8B5C44" />
            {/* Side leaves */}
            <rect x="16" y="17" width="4" height="3" fill="#81D886" />
            <rect x="36" y="17" width="4" height="3" fill="#6EC676" />
            {/* Fluffy Canopy Head */}
            <rect x="23" y="12" width="10" height="1" fill="#482A3B" />
            <rect x="20" y="13" width="16" height="12" fill="#A4E89E" />
            <rect x="19" y="15" width="1" height="8" fill="#482A3B" />
            <rect x="36" y="15" width="1" height="8" fill="#482A3B" />
            <rect x="20" y="13" width="3" height="1" fill="#482A3B" />
            <rect x="33" y="13" width="3" height="1" fill="#482A3B" />
            <rect x="22" y="14" width="4" height="2" fill="#D5FACD" />
            <rect x="20" y="23" width="16" height="2" fill="#7AD180" />
            <rect x="21" y="25" width="14" height="1" fill="#482A3B" />
            {renderPixelFace(28, faceY)}
          </g>
        )}

        {safeStage >= 3 && (
          <g>
            {/* Stage 3: Lush Blooming Mangrove Buddy */}
            <rect x="26" y="23" width="4" height="14" fill="#9E6E54" />
            <rect x="25" y="24" width="1" height="7" fill="#482A3B" />
            <rect x="30" y="24" width="1" height="7" fill="#482A3B" />
            {/* Dense prop roots */}
            <rect x="22" y="28" width="3" height="2" fill="#8B5C44" />
            <rect x="19" y="30" width="2" height="7" fill="#8B5C44" />
            <rect x="23" y="31" width="2" height="6" fill="#7D4F38" />
            <rect x="31" y="28" width="3" height="2" fill="#8B5C44" />
            <rect x="35" y="30" width="2" height="7" fill="#8B5C44" />
            <rect x="31" y="31" width="2" height="6" fill="#7D4F38" />

            {/* Side Canopy Clouds */}
            <rect x="14" y="14" width="8" height="10" fill="#7CCF81" />
            <rect x="13" y="16" width="1" height="6" fill="#482A3B" />
            <rect x="34" y="14" width="8" height="10" fill="#7CCF81" />
            <rect x="42" y="16" width="1" height="6" fill="#482A3B" />

            {/* Center Canopy Crown */}
            <rect x="22" y="10" width="12" height="1" fill="#482A3B" />
            <rect x="19" y="11" width="18" height="13" fill="#A4E89E" />
            <rect x="21" y="12" width="5" height="2" fill="#D5FACD" />
            <rect x="19" y="22" width="18" height="2" fill="#79CE7F" />
            <rect x="20" y="24" width="16" height="1" fill="#482A3B" />
            {/* Pastel blossoms */}
            <rect x="16" y="16" width="2" height="2" fill="#FFF3A8" />
            <rect x="38" y="17" width="2" height="2" fill="#FFB8CF" />
            <rect x="22" y="12" width="2" height="2" fill="#FFD2E2" />
            {renderPixelFace(28, faceY)}
          </g>
        )}

        {/* Floating Pixel Sparkles & Sprout Star when Happy/Celebrating */}
        {(mood === 'celebrating' || mood === 'happy') && (
          <g>
            {/* Aqua coastal music/sparkle burst */}
            <rect x="12" y="10" width="1" height="3" fill="#68BEE8" />
            <rect x="11" y="11" width="3" height="1" fill="#68BEE8" />
            <rect x="12" y="11" width="1" height="1" fill="#FFFFFF" />
            {/* Golden pixel sparkle */}
            <rect x="42" y="12" width="1" height="3" fill="#FFE27A" />
            <rect x="41" y="13" width="3" height="1" fill="#FFE27A" />
          </g>
        )}

        {/* Wardrobe Accessories in matching Pastel Pixel Art */}
        {has('hat') && (
          <g transform={`translate(19, ${safeStage === 0 ? 18 : safeStage === 1 ? 15 : 5})`}>
            <rect x="4" y="0" width="10" height="1" fill="#482A3B" />
            <rect x="3" y="1" width="12" height="3" fill="#FFE08B" />
            <rect x="3" y="3" width="12" height="1" fill="#FF92B3" />
            <rect x="0" y="4" width="18" height="2" fill="#FFE8A8" />
            <rect x="1" y="6" width="16" height="1" fill="#482A3B" />
          </g>
        )}
        {has('crown') && (
          <g transform={`translate(21, ${safeStage === 0 ? 20 : safeStage === 1 ? 17 : 7})`}>
            <rect x="1" y="1" width="3" height="3" fill="#FFD1E1" />
            <rect x="5" y="0" width="4" height="3" fill="#FFF3A8" />
            <rect x="10" y="1" width="3" height="3" fill="#CBEFFF" />
            <rect x="2" y="3" width="10" height="1" fill="#59BA7C" />
          </g>
        )}
        {has('chime') && (
          <g transform="translate(8, 12)">
            <rect x="0" y="0" width="9" height="1" fill="#482A3B" />
            <rect x="1" y="1" width="1" height="3" fill="#482A3B" />
            <rect x="4" y="1" width="1" height="4" fill="#482A3B" />
            <rect x="7" y="1" width="1" height="3" fill="#482A3B" />
            <rect x="0" y="4" width="3" height="2" fill="#FFD2E2" />
            <rect x="3" y="5" width="3" height="2" fill="#C9F2FF" />
            <rect x="6" y="4" width="3" height="2" fill="#FFF0A8" />
          </g>
        )}
      </g>

      {/* Mudflat Pals (Crab & Watering Can) */}
      {has('crab') && (
        <g transform="translate(38, 30)">
          <rect x="1" y="0" width="2" height="2" fill="#FF8C75" />
          <rect x="7" y="0" width="2" height="2" fill="#FF8C75" />
          <rect x="2" y="2" width="6" height="4" fill="#FF9B85" />
          <rect x="1" y="3" width="1" height="2" fill="#482A3B" />
          <rect x="8" y="3" width="1" height="2" fill="#482A3B" />
          <rect x="3" y="3" width="1" height="1" fill="#482A3B" />
          <rect x="6" y="3" width="1" height="1" fill="#482A3B" />
          <rect x="2" y="6" width="6" height="1" fill="#482A3B" />
        </g>
      )}
      {has('can') && (
        <g transform="translate(8, 30)">
          <rect x="0" y="1" width="2" height="1" fill="#FFE38A" />
          <rect x="2" y="2" width="1" height="2" fill="#243F59" />
          <rect x="3" y="2" width="5" height="5" fill="#7AC6F0" />
          <rect x="8" y="3" width="2" height="3" fill="#243F59" />
          <rect x="3" y="7" width="5" height="1" fill="#243F59" />
        </g>
      )}
    </svg>
  );
};

// === FINE PASTEL PIXEL-ART CHIBI AVATAR (Girl & Boy versions) ===
export const ExplorerAvatar: React.FC<{
  hair: number;
  skin: number;
  apron: number;
  style?: number;
  accessory?: number;
  gender?: 'girl' | 'boy';
  size?: number;
}> = ({ hair, skin, apron, style = 0, accessory = 0, gender = 'girl', size = 56 }) => {
  const hairBase = AVATAR_COLORS.hair[hair] ?? AVATAR_COLORS.hair[0];
  const skinBase = AVATAR_COLORS.skin[skin] ?? AVATAR_COLORS.skin[0];
  const jacketBase = AVATAR_COLORS.apron[apron] ?? AVATAR_COLORS.apron[0];
  const isBoy = gender === 'boy';

  const pal: Record<string, string> = {
    o: '#2D3148', // Clean dark slate-cocoa pixel outline
    h: hairBase,
    H: adjustHex(hairBase, 26), // Glossy hair highlight
    d: adjustHex(hairBase, -28), // Deep hair shadow
    s: skinBase,
    S: adjustHex(skinBase, -18), // Soft chin/neck shadow
    a: jacketBase, // Cozy pastel jacket/cardigan
    A: adjustHex(jacketBase, 34), // Light collar/placket/pocket trim
    z: adjustHex(jacketBase, -26), // Jacket/shoe shadow
    w: '#FFFFFF',
    g: '#E4DCE8', // White pleated skirt shadow
    b: '#7F9BBF', // Boy pastel denim-slate shorts
    e: '#2D2430', // Dark eyelash
    i: isBoy ? '#3F6BB0' : '#CC5E88', // Boy ocean-indigo iris / Girl rose iris
    I: isBoy ? '#8AC0FF' : '#FFA8C6', // Glowing lower iris
    k: isBoy ? '#F3BFA8' : '#FFB4CB', // Natural peach blush for boy / soft blush for girl
    m: isBoy ? '#D98C78' : '#EC8FA8', // Natural mouth tone
    p: '#FF9CC0', // Ribbon bow pink (girl)
    P: '#DF6490', // Bow accent shadow
    q: '#FFE0EC', // Pale pastel pink highlight
    t: '#68BEE8', // Coastal teal bandana (boy)
    T: '#2B82C2', // Bandana shadow
    l: '#D8D6E4', // Headphone soft silver-gray shade
    y: '#FFE384', // Golden pixel sparkle
    G: '#58BA78', // Sprout / turtle shell green
    L: '#9AE69C', // Sprout light green
  };

  // 28x31 fine pastel pixel-art character grids (every row strictly 28 chars, center = 13 & 14)
  const girlRows: string[] = [
    '............................', // 0
    '.........oooooooooo.........', // 1
    '........ohHHHHHHHHho........', // 2
    '.......ohhHHhhhhHHhho.......', // 3
    '......ohhhhHhhhhHhhhho......', // 4
    '......ohhhhsssssshhhho......', // 5
    '.....ohhhssssshsssshhho.....', // 6
    '.....ohhhsssssssssshhho.....', // 7
    '.....ohhhsssssssssshhho.....', // 8
    '.....ohhhseeesseeeshhho.....', // 9
    '.....ohhhswiisswiishhho.....', // 10
    '.....ohhhswIIsswIIshhho.....', // 11
    '.....ohhhksssmmssskhhho.....', // 12
    '......ohddssssssssddho......', // 13
    '......ohdhoSSSSSSohdho......', // 14
    '.....ohdhowwsssswwohdho.....', // 15
    '.....ohdhoaaaAAaaaoohoo.....', // 16
    '....ohdhoaaaawAaaaaoohho....', // 17
    '....ohdhoaaaaAAaaaaoohho....', // 18
    '....ohdhoaAAawAaAAaoohho....', // 19
    '....ohdhoaaaaAAaaaaoohho....', // 20
    '.....ohdowaAaAAaAawohdo.....', // 21
    '.....ohdoswwwwwwwwsohoo.....', // 22
    '......o..owwgwwgwwo..o......', // 23
    '..........oss..sso..........', // 24
    '..........oww..wwo..........', // 25
    '..........owp..pwo..........', // 26
    '.........owaa..aawo.........', // 27
    '.........ozzz..zzzo.........', // 28
    '............................', // 29
    '............................', // 30
  ];

  const boyRows: string[] = [
    '............................', // 0
    '.........oooooooooo.........', // 1
    '........ohHHHHHHHHho........', // 2
    '.......ohhHHhhhhHHhho.......', // 3
    '......ohhhhHhhhhHhhhho......', // 4
    '......ohhhshshhshshhho......', // 5  (airy boy bangs)
    '.....ohhhssshssshsshhho.....', // 6
    '.....ohhhsssssssssshhho.....', // 7
    '.....ohhhsssssssssshhho.....', // 8
    '.....ohhhseeesseeeshhho.....', // 9
    '.....ohhhswiisswiishhho.....', // 10
    '.....ohhhswIIsswIIshhho.....', // 11
    '.....ohhhksssmmssskhhho.....', // 12
    '......ohddssssssssddho......', // 13
    '.......oo.oSSSSSSo.oo.......', // 14 (neat short hair above neck)
    '........oowwsssswwoo........', // 15 (crisp white collar)
    '........ooaaaAAaaaoo........', // 16 (varsity/cardigan shoulders)
    '.......ooaaaawAaaaaoo.......', // 17
    '.......ooaaaaAAaaaaoo.......', // 18
    '.......ooaAAawAaAAaoo.......', // 19
    '.......ooaaaaAAaaaaoo.......', // 20
    '........owaAaAAaAawo........', // 21
    '........osbbbbbbbbso........', // 22 (pastel denim shorts)
    '.........obbboobbbo.........', // 23
    '..........oss..sso..........', // 24
    '..........oww..wwo..........', // 25 (white socks)
    '..........owb..bwo..........', // 26 (blue sock trim)
    '.........owaa..aawo.........', // 27 (pastel sneakers)
    '.........ozzz..zzzo.........', // 28
    '............................', // 29
    '............................', // 30
  ];

  const grid = (isBoy ? boyRows : girlRows).map((r) => r.split(''));

  const setPx = (x: number, y: number, ch: string) => {
    if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
      grid[y][x] = ch;
    }
  };

  if (!isBoy) {
    // Girl hairstyles: 0 Long Waves, 1 Twin Buns, 2 Fluffy Curls, 3 Sweet Bob
    if (style === 1) {
      for (let y = 16; y <= 22; y++) {
        for (let x = 4; x <= 8; x++) if (grid[y][x] !== 'o' || x < 8) setPx(x, y, '.');
        for (let x = 19; x <= 23; x++) if (grid[y][x] !== 'o' || x > 19) setPx(x, y, '.');
      }
      setPx(5, 1, 'o'); setPx(6, 1, 'o'); setPx(7, 1, 'o');
      setPx(4, 2, 'o'); setPx(5, 2, 'H'); setPx(6, 2, 'h'); setPx(7, 2, 'h'); setPx(8, 2, 'o');
      setPx(4, 3, 'o'); setPx(5, 3, 'h'); setPx(6, 3, 'h'); setPx(7, 3, 'd'); setPx(8, 3, 'o');
      setPx(5, 4, 'o'); setPx(6, 4, 'o');

      setPx(20, 1, 'o'); setPx(21, 1, 'o'); setPx(22, 1, 'o');
      setPx(19, 2, 'o'); setPx(20, 2, 'h'); setPx(21, 2, 'h'); setPx(22, 2, 'H'); setPx(23, 2, 'o');
      setPx(19, 3, 'o'); setPx(20, 3, 'd'); setPx(21, 3, 'h'); setPx(22, 3, 'h'); setPx(23, 3, 'o');
      setPx(21, 4, 'o'); setPx(22, 4, 'o');
    } else if (style === 2) {
      for (let y = 13; y <= 21; y++) {
        setPx(3, y, 'o');
        setPx(4, y, y % 2 === 0 ? 'H' : 'h');
        setPx(5, y, 'h');
        setPx(22, y, 'h');
        setPx(23, y, y % 2 === 0 ? 'H' : 'h');
        setPx(24, y, 'o');
      }
      setPx(4, 22, 'o'); setPx(5, 22, 'o');
      setPx(22, 22, 'o'); setPx(23, 22, 'o');
    } else if (style === 3) {
      for (let y = 16; y <= 23; y++) {
        for (let x = 4; x <= 8; x++) setPx(x, y, '.');
        for (let x = 19; x <= 23; x++) setPx(x, y, '.');
      }
      setPx(7, 15, 'o'); setPx(8, 15, 'o');
      setPx(19, 15, 'o'); setPx(20, 15, 'o');
    }
  } else {
    // Boy hairstyles: 0 Soft Swoop, 1 Curtain Part, 2 Fluffy Curls, 3 Spiky Crop
    if (style === 1) {
      // Curtain Part (open middle part down forehead)
      setPx(13, 4, 's'); setPx(14, 4, 's');
      setPx(12, 5, 's'); setPx(13, 5, 's'); setPx(14, 5, 's'); setPx(15, 5, 's');
      setPx(11, 6, 's'); setPx(12, 6, 's'); setPx(13, 6, 's'); setPx(14, 6, 's'); setPx(15, 6, 's'); setPx(16, 6, 's');
    } else if (style === 2) {
      // Fluffy Curls around temples
      for (let y = 5; y <= 12; y++) {
        setPx(4, y, 'o');
        setPx(5, y, y % 2 === 0 ? 'H' : 'h');
        setPx(22, y, y % 2 === 0 ? 'H' : 'h');
        setPx(23, y, 'o');
      }
    } else if (style === 3) {
      // Spiky Crop along crown
      setPx(10, 0, 'o'); setPx(11, 0, 'o'); setPx(14, 0, 'o'); setPx(17, 0, 'o');
      setPx(10, 1, 'H'); setPx(11, 1, 'h'); setPx(14, 1, 'H'); setPx(17, 1, 'h');
    }
  }

  // Cute Accessories layered on top!
  if (accessory === 1) {
    // Pastel White & Silver Headphones + cute clip
    for (let x = 9; x <= 18; x++) setPx(x, 0, 'o');
    for (let x = 9; x <= 18; x++) setPx(x, 1, 'w');
    setPx(8, 1, 'o'); setPx(19, 1, 'o');
    setPx(7, 2, 'o'); setPx(8, 2, 'w'); setPx(19, 2, 'w'); setPx(20, 2, 'o');
    for (let y = 3; y <= 7; y++) {
      setPx(6, y, 'o'); setPx(7, y, 'w');
      setPx(20, y, 'w'); setPx(21, y, 'o');
    }
    for (let y = 8; y <= 12; y++) {
      setPx(5, y, 'o'); setPx(6, y, 'w'); setPx(7, y, 'l');
      setPx(20, y, 'l'); setPx(21, y, 'w'); setPx(22, y, 'o');
    }
    setPx(6, 13, 'o'); setPx(7, 13, 'o');
    setPx(20, 13, 'o'); setPx(21, 13, 'o');
    if (isBoy) {
      // Tiny golden star pin on bangs for boy
      setPx(9, 5, 'y'); setPx(8, 6, 'y'); setPx(9, 6, 'w'); setPx(10, 6, 'y'); setPx(9, 7, 'y');
    } else {
      // Tiny pink heart hairclip on bangs for girl
      setPx(8, 5, 'p'); setPx(10, 5, 'p');
      setPx(8, 6, 'p'); setPx(9, 6, 'P'); setPx(10, 6, 'p');
      setPx(9, 7, 'p');
    }
  } else if (accessory === 2) {
    if (isBoy) {
      // Cool coastal bandana headband across forehead for boy
      for (let x = 7; x <= 20; x++) setPx(x, 3, 'T');
      for (let x = 7; x <= 20; x++) setPx(x, 4, 't');
      setPx(19, 3, 'w'); setPx(20, 4, 'y');
      setPx(21, 4, 't'); setPx(22, 5, 'T');
    } else {
      // Ribbon bow for girl
      setPx(17, 2, 'o'); setPx(18, 2, 'o'); setPx(20, 2, 'o'); setPx(21, 2, 'o');
      setPx(16, 3, 'o'); setPx(17, 3, 'p'); setPx(18, 3, 'q'); setPx(19, 3, 'P'); setPx(20, 3, 'q'); setPx(21, 3, 'p'); setPx(22, 3, 'o');
      setPx(17, 4, 'o'); setPx(18, 4, 'p'); setPx(19, 4, 'p'); setPx(20, 4, 'p'); setPx(21, 4, 'o');
      setPx(8, 5, 'p'); setPx(10, 5, 'p'); setPx(9, 6, 'p');
    }
  } else if (accessory === 3) {
    setPx(13, 0, 'o'); setPx(14, 0, 'G'); setPx(15, 0, 'L');
    setPx(12, 1, 'L'); setPx(13, 1, 'G'); setPx(14, 1, 'G');
  } else if (accessory === 4) {
    for (let x = 9; x <= 18; x++) setPx(x, 0, 'o');
    for (let x = 8; x <= 19; x++) setPx(x, 1, 'a');
    for (let x = 8; x <= 19; x++) setPx(x, 2, 'A');
    setPx(13, 0, 'A');
  }

  // Coastal sparkles & tiny pixel crab/leaf buddy beside feet (balanced, no pink heart spam)
  setPx(2, 4, 'y'); setPx(1, 5, 'y'); setPx(2, 5, 'w'); setPx(3, 5, 'y'); setPx(2, 6, 'y');
  setPx(25, 4, 't'); setPx(24, 5, 't'); setPx(25, 5, 'w'); setPx(26, 5, 't'); setPx(25, 6, 't');
  // Tiny cute coastal turtle/crab pal beside feet
  setPx(23, 25, 'G'); setPx(24, 25, 'L'); setPx(25, 25, 'G');
  setPx(22, 26, 'G'); setPx(23, 26, 'L'); setPx(24, 26, 'G'); setPx(25, 26, 'G'); setPx(26, 26, 'L');
  setPx(22, 27, 's'); setPx(23, 27, 'o'); setPx(24, 27, 's'); setPx(25, 27, 'o'); setPx(26, 27, 's');
  setPx(22, 28, 'G'); setPx(24, 28, 'G'); setPx(26, 28, 'G');

  return (
    <svg
      viewBox="0 0 28 31"
      width={size}
      height={Math.round((size * 31) / 28)}
      shapeRendering="crispEdges"
      className="pixel-art"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="28" height="31" rx="3" fill={isBoy ? '#EBF6FF' : '#FFF8F2'} />
      {grid.map((row, y) =>
        row.map((ch, x) => {
          const fill = pal[ch];
          if (!fill) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />;
        })
      )}
    </svg>
  );
};

