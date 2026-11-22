import React, { useEffect, useState } from 'react';
import { AVATAR_COLORS, DishId, IngredientId, WardrobeItem } from '../data/gameData';

export type OfficialSpriteId =
  | 'cockle1'
  | 'cockle2'
  | 'shell'
  | 'squid'
  | 'mussel'
  | 'bun'
  | 'shrimp'
  | 'octopus'
  | 'seaweed'
  | 'mangrove'
  | 'drink'
  | 'crab'
  | 'oyster'
  | 'dessert'
  | 'fish'
  | 'jellyfish'
  | 'cockleSalad'
  | 'oysterOmelette'
  | 'papayaOyster'
  | 'crabRoeDip'
  | 'pickledCrabSomTum'
  | 'shrimpBlite'
  | 'sourCurryBlite'
  | 'sourCurryChaOm'
  | 'nipaGelato'
  | 'crepeCake'
  | 'cloudMilk'
  | 'tomodachiStage0'
  | 'tomodachiStage1'
  | 'tomodachiStage2'
  | 'wardrobeHat'
  | 'wardrobeCan'
  | 'wardrobeChime'
  | 'wardrobeCrown';

export const OFFICIAL_SPRITE_FILES: Record<OfficialSpriteId, string> = {
  cockle1: '1000052768_c252a4e9.jpg',
  cockle2: '1000052768__1__c252a4e9.jpg',
  shell: '1000052769_448ac2a9.jpg',
  squid: 'SAVE_20261122_173533_9b645919.jpg',
  mussel: 'SAVE_20261122_173543_220733bb.jpg',
  bun: '1000052771_f95ff58f.jpg',
  shrimp: 'SAVE_20261122_173641_2811c5ec.jpg',
  octopus: 'SAVE_20261122_173650_847402cf.jpg',
  seaweed: 'SAVE_20261122_173524_42782de7.jpg',
  mangrove: '1000052770_eab569f4.jpg',
  drink: 'SAVE_20261122_173455_2890910b.jpg',
  crab: 'SAVE_20261122_173516_310d7836.jpg',
  oyster: 'SAVE_20261122_173600_41dd6840.jpg',
  dessert: 'SAVE_20261122_173551_31e8e2f6.jpg',
  fish: 'SAVE_20261122_173608_94bc6fca.jpg',
  jellyfish: 'SAVE_20261122_173616_26929a4e.jpg',
  cockleSalad: 'pixel_cockle_salad_1795345894570.jpg',
  oysterOmelette: 'pixel_oyster_omelette_1795345894882.jpg',
  papayaOyster: 'pixel_papaya_oyster_1795345893972.jpg',
  crabRoeDip: 'pixel_crab_roe_dip_1795345894531.jpg',
  pickledCrabSomTum: 'pixel_pickled_crab_somtum_1795345894908.jpg',
  shrimpBlite: 'pixel_shrimp_blite_1795345894314.jpg',
  sourCurryBlite: 'pixel_sour_curry_blite_1795345911186.jpg',
  sourCurryChaOm: 'pixel_sour_curry_chaom_1795345914292.jpg',
  nipaGelato: 'pixel_nipa_gelato_1795345914357.jpg',
  crepeCake: 'pixel_crepe_cake_1795345914530.jpg',
  cloudMilk: 'pixel_cloud_milk_1795345914853.jpg',
  tomodachiStage0: 'tomodachi_stage0_green_seed_1795349453099.jpg',
  tomodachiStage1: 'tomodachi_stage1_sprout_1795346317657.jpg',
  tomodachiStage2: 'tomodachi_stage2_green_sapling_1795349453966.jpg',
  wardrobeHat: 'wardrobe_straw_hat_1795346318050.jpg',
  wardrobeCan: 'wardrobe_watering_can_1795346318115.jpg',
  wardrobeChime: 'wardrobe_shell_chime_1795346318675.jpg',
  wardrobeCrown: 'wardrobe_blossom_crown_1795346316827.jpg',
};

const SPRITE_EXTRA_SEEDS: Partial<Record<OfficialSpriteId, Array<[number, number]>>> = {
  wardrobeCrown: [[0.5, 0.5]],
  wardrobeChime: [[0.5, 0.12]],
};

const spriteDataCache = new Map<string, string>();
const spritePromiseCache = new Map<string, Promise<string>>();

function getOfficialSpriteUrl(name: OfficialSpriteId): string {
  return `${import.meta.env.BASE_URL}assets/aistudio/${OFFICIAL_SPRITE_FILES[name]}`;
}

function makeTransparentPixelSprite(
  rawUrl: string,
  extraSeeds?: Array<[number, number]>
): Promise<string> {
  const cached = spriteDataCache.get(rawUrl);
  if (cached) return Promise.resolve(cached);
  const existing = spritePromiseCache.get(rawUrl);
  if (existing) return existing;

  const promise = new Promise<string>((resolve) => {
    if (typeof window === 'undefined') {
      resolve(rawUrl);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(rawUrl);
          return;
        }
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        const isNearBlack = (idx: number) => {
          const p = idx * 4;
          return data[p] <= 34 && data[p + 1] <= 34 && data[p + 2] <= 34;
        };

        // Flood-fill from all 4 borders so inner dark eyes/outlines stay intact
        const total = w * h;
        const visited = new Uint8Array(total);
        const queue = new Int32Array(total);
        let head = 0;
        let tail = 0;

        const enqueue = (idx: number) => {
          if (visited[idx]) return;
          if (!isNearBlack(idx)) return;
          visited[idx] = 1;
          queue[tail++] = idx;
        };

        for (let x = 0; x < w; x++) {
          enqueue(x);
          enqueue((h - 1) * w + x);
        }
        for (let y = 0; y < h; y++) {
          enqueue(y * w);
          enqueue(y * w + (w - 1));
        }
        if (extraSeeds) {
          for (const [nx, ny] of extraSeeds) {
            const sx = Math.max(0, Math.min(w - 1, Math.floor(nx * w)));
            const sy = Math.max(0, Math.min(h - 1, Math.floor(ny * h)));
            enqueue(sy * w + sx);
          }
        }

        while (head < tail) {
          const idx = queue[head++];
          data[idx * 4 + 3] = 0;
          const x = idx % w;
          const y = (idx - x) / w;
          if (x > 0) enqueue(idx - 1);
          if (x < w - 1) enqueue(idx + 1);
          if (y > 0) enqueue(idx - w);
          if (y < h - 1) enqueue(idx + w);
        }

        // Crop tightly around opaque pixels & center inside a crisp square canvas
        let minX = w;
        let minY = h;
        let maxX = -1;
        let maxY = -1;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const a = data[(y * w + x) * 4 + 3];
            if (a > 0) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        if (maxX < minX || maxY < minY) {
          resolve(rawUrl);
          return;
        }

        ctx.putImageData(imgData, 0, 0);
        const cropW = maxX - minX + 1;
        const cropH = maxY - minY + 1;
        const box = Math.max(cropW, cropH) + 6;
        const out = document.createElement('canvas');
        out.width = box;
        out.height = box;
        const octx = out.getContext('2d');
        if (!octx) {
          resolve(rawUrl);
          return;
        }
        octx.imageSmoothingEnabled = false;
        const dx = Math.floor((box - cropW) / 2);
        const dy = Math.floor((box - cropH) / 2);
        octx.drawImage(canvas, minX, minY, cropW, cropH, dx, dy, cropW, cropH);

        const pngUrl = out.toDataURL('image/png');
        spriteDataCache.set(rawUrl, pngUrl);
        resolve(pngUrl);
      } catch {
        resolve(rawUrl);
      }
    };
    img.onerror = () => resolve(rawUrl);
    img.src = rawUrl;
  });

  spritePromiseCache.set(rawUrl, promise);
  return promise;
}

export const OfficialPixelSprite: React.FC<{
  name: OfficialSpriteId;
  size?: number;
  alt?: string;
  className?: string;
}> = ({ name, size = 48, alt = '', className = '' }) => {
  const rawUrl = getOfficialSpriteUrl(name);
  const extraSeeds = SPRITE_EXTRA_SEEDS[name];
  const [src, setSrc] = useState<string>(() => spriteDataCache.get(rawUrl) || '');

  useEffect(() => {
    let active = true;
    const cached = spriteDataCache.get(rawUrl);
    if (cached) {
      setSrc(cached);
      return;
    }
    void makeTransparentPixelSprite(rawUrl, extraSeeds).then((png) => {
      if (active) setSrc(png);
    });
    return () => {
      active = false;
    };
  }, [rawUrl, extraSeeds]);

  if (!src) {
    return (
      <span
        style={{ width: size, height: size }}
        className={`inline-block shrink-0 ${className}`}
        aria-hidden={!alt}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`pixel-art inline-block shrink-0 object-contain select-none ${className}`}
      aria-hidden={!alt}
      draggable={false}
    />
  );
};

export type TomodachiMood = 'idle' | 'happy' | 'celebrating' | 'sad';

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

// === PIXEL DIVIDERS (featuring official pixel art sprites) ===
export const PixelDivider: React.FC<{
  variant?: 'hearts' | 'shells' | 'stars' | 'crab' | 'leaf' | 'ocean' | 'seafood';
  label?: string;
}> = ({ variant = 'shells', label }) => {
  const leftSprite: OfficialSpriteId =
    variant === 'crab'
      ? 'crab'
      : variant === 'leaf'
      ? 'mangrove'
      : variant === 'ocean'
      ? 'jellyfish'
      : variant === 'seafood'
      ? 'squid'
      : variant === 'stars'
      ? 'jellyfish'
      : 'shell';

  const rightSprite: OfficialSpriteId =
    variant === 'crab'
      ? 'shrimp'
      : variant === 'leaf'
      ? 'seaweed'
      : variant === 'ocean'
      ? 'octopus'
      : variant === 'seafood'
      ? 'fish'
      : variant === 'stars'
      ? 'shell'
      : 'cockle2';

  return (
    <div className="my-5 flex items-center justify-center gap-3 select-none" aria-hidden="true">
      <div className="h-[3px] flex-1 bg-[repeating-linear-gradient(90deg,var(--outline)_0_5px,transparent_5px_10px)] opacity-35" />
      <div className="flex items-center gap-2 px-1">
        <OfficialPixelSprite name={leftSprite} size={22} />
        {label ? (
          <span className="text-xs font-bold tracking-wider uppercase text-[var(--ink-soft)]">
            {label}
          </span>
        ) : (
          <OfficialPixelSprite name="shell" size={18} />
        )}
        <OfficialPixelSprite name={rightSprite} size={22} />
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

// === OFFICIAL PIXEL SEASHELL TOKEN ===
export const ShellIllustration: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = '',
}) => <OfficialPixelSprite name="shell" size={size} className={className} />;

// === OFFICIAL PIXEL FOOD SPRITES FOR ALL BANG KHUN THIAN DISHES & TREATS ===
const DISH_SPRITE_MAP: Record<DishId, OfficialSpriteId> = {
  cockleSalad: 'cockleSalad',
  blanchedCockles: 'cockle1',
  steamedMussels: 'mussel',
  oysterOmelette: 'oysterOmelette',
  papayaOyster: 'papayaOyster',
  oysterSalad: 'oyster',
  crabRoeDip: 'crabRoeDip',
  steamedMudCrab: 'crab',
  pickledCrabSomTum: 'pickledCrabSomTum',
  riverPrawns: 'shrimp',
  shrimpBlite: 'shrimpBlite',
  sourCurryChaOm: 'sourCurryChaOm',
  sourCurryBlite: 'sourCurryBlite',
  waterMimosa: 'seaweed',
  nipaGelato: 'nipaGelato',
  berryFloat: 'dessert',
  honeyFizz: 'drink',
  matchaBottle: 'cloudMilk',
  crepeCake: 'crepeCake',
  palmTart: 'bun',
};

export const DishIllustration: React.FC<{ id: DishId; size?: number; className?: string }> = ({
  id,
  size = 64,
  className = '',
}) => <OfficialPixelSprite name={DISH_SPRITE_MAP[id]} size={size} className={className} />;

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
}) => {
  if (id === 'seablite' || id === 'herbs') {
    return <OfficialPixelSprite name="seaweed" size={size} />;
  }
  if (id === 'honey') {
    return <OfficialPixelSprite name="drink" size={size} />;
  }
  if (id === 'nipa') {
    return <OfficialPixelSprite name="bun" size={size} />;
  }
  return renderPixelGrid(INGREDIENT_GRIDS[id], size);
};

// === OFFICIAL 16-BIT PIXEL WARDROBE ACCESSORY SPRITES ===
export const WardrobeIllustration: React.FC<{ id: WardrobeItem['id']; size?: number }> = ({
  id,
  size = 44,
}) => {
  switch (id) {
    case 'hat':
      return <OfficialPixelSprite name="wardrobeHat" size={size} />;
    case 'crab':
      return <OfficialPixelSprite name="crab" size={size} />;
    case 'can':
      return <OfficialPixelSprite name="wardrobeCan" size={size} />;
    case 'chime':
      return <OfficialPixelSprite name="wardrobeChime" size={size} />;
    case 'crown':
      return <OfficialPixelSprite name="wardrobeCrown" size={size} />;
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

// === 16-BIT RETRO PIXEL-ART LIVING MANGROVE TOMODACHI ===
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

  const stageSprite: OfficialSpriteId =
    safeStage === 0
      ? 'tomodachiStage0'
      : safeStage === 1
      ? 'tomodachiStage1'
      : safeStage === 2
      ? 'tomodachiStage2'
      : 'mangrove';

  const stageSpriteSize =
    safeStage === 0
      ? Math.round(size * 0.46)
      : safeStage === 1
      ? Math.round(size * 0.56)
      : safeStage === 2
      ? Math.round(size * 0.62)
      : Math.round(size * 0.66);

  const stageBottomClass =
    safeStage === 0
      ? 'bottom-[19%]'
      : safeStage === 1
      ? 'bottom-[18%]'
      : safeStage === 2
      ? 'bottom-[16%]'
      : 'bottom-[15%]';

  // Position animated 16-bit pixel face cleanly on the green seed belly (stage 0) or green canopy (stages 1–3)
  const faceBottomClass =
    safeStage === 0
      ? 'bottom-[29%]'
      : safeStage === 1
      ? 'bottom-[48%]'
      : safeStage === 2
      ? 'bottom-[44%]'
      : 'bottom-[50%]';

  const hatBottomClass =
    safeStage === 0
      ? 'bottom-[49%]'
      : safeStage === 1
      ? 'bottom-[60%]'
      : safeStage === 2
      ? 'bottom-[66%]'
      : 'bottom-[68%]';

  const crownBottomClass =
    safeStage === 0
      ? 'bottom-[47%]'
      : safeStage === 1
      ? 'bottom-[57%]'
      : safeStage === 2
      ? 'bottom-[63%]'
      : 'bottom-[65%]';

  const boxHeight = Math.round((size * 48) / 56);
  const faceWidth = Math.max(12, Math.round(size * 0.18));

  return (
    <div
      className="relative inline-block overflow-hidden select-none"
      style={{ width: size, height: boxHeight }}
      aria-hidden="true"
    >
      {/* Clean Simplified Pixel Coastal Sky, Water & Mudflat Island (earlier minimal backdrop) */}
      <svg
        viewBox="0 0 56 48"
        width={size}
        height={boxHeight}
        shapeRendering="crispEdges"
        className="pixel-art block"
      >
        {/* Pastel Pixel Sky & Clouds */}
        <rect x="1" y="1" width="54" height="31" fill={mood === 'sad' ? '#DCEBFA' : '#E9F8FF'} />
        {/* Pixel Sun */}
        <rect x="44" y="4" width="6" height="6" fill="#FFE896" />
        <rect x="45" y="5" width="4" height="4" fill="#FFF7CC" />
        {/* Fluffy Pixel Clouds */}
        <rect x="5" y="6" width="8" height="2" fill="#FFFFFF" />
        <rect x="7" y="5" width="4" height="1" fill="#FFFFFF" />
        <rect x="33" y="9" width="7" height="2" fill="#FFFFFF" />
        <rect x="35" y="8" width="3" height="1" fill="#FFFFFF" />

        {/* Shimmering Aqua Coastal Water */}
        <rect x="1" y="31" width="54" height="16" fill={mood === 'sad' ? '#A8D8EE' : '#BCEBFB'} />
        <rect x="4" y="33" width="6" height="1" fill="#FFFFFF" />
        <rect x="42" y="35" width="7" height="1" fill="#FFFFFF" />
        <rect x="9" y="39" width="4" height="1" fill="#E8FAFF" />

        {/* Warm Sandy Mudflat Island */}
        <rect x="10" y="36" width="36" height="2" fill="#EED2B5" />
        <rect x="8" y="38" width="40" height="5" fill="#E8C6A4" />
        <rect x="11" y="43" width="34" height="2" fill="#D5AE89" />
        <rect x="10" y="35" width="36" height="1" fill="#5B2A4A" opacity="0.2" />

        {/* Protective Simple Shell Bio-Barrier */}
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

        {/* Crisp Pixel Frame Outline */}
        <rect x="0" y="0" width="56" height="1" fill="#5B2A4A" />
        <rect x="0" y="47" width="56" height="1" fill="#5B2A4A" />
        <rect x="0" y="0" width="1" height="48" fill="#5B2A4A" />
        <rect x="55" y="0" width="1" height="48" fill="#5B2A4A" />
      </svg>

      {/* Chime Accessory hanging from upper-left sky corner */}
      {has('chime') && (
        <div className="pointer-events-none absolute top-[5%] left-[5%] z-20 animate-float-slow">
          <OfficialPixelSprite name="wardrobeChime" size={Math.max(12, Math.round(size * 0.19))} />
        </div>
      )}

      {/* Watering Can resting beside mudflat */}
      {has('can') && (
        <div className="pointer-events-none absolute bottom-[16%] left-[8%] z-20">
          <OfficialPixelSprite name="wardrobeCan" size={Math.max(12, Math.round(size * 0.19))} />
        </div>
      )}

      {/* Living Animated 16-Bit Tomodachi Sprite + Crisp Pixel Face */}
      <div
        className={`pointer-events-none absolute inset-x-0 ${stageBottomClass} z-10 flex justify-center ${animClass}`}
      >
        <OfficialPixelSprite name={stageSprite} size={stageSpriteSize} />
      </div>

      {/* Expressive Animated 16-Bit Pixel Face Overlay (synced with Tomodachi animation) */}
      <div
        className={`pointer-events-none absolute inset-x-0 ${faceBottomClass} z-20 flex justify-center ${animClass}`}
      >
        <svg
          viewBox="0 0 18 9"
          width={faceWidth}
          height={Math.round(faceWidth * 0.5)}
          shapeRendering="crispEdges"
          className="pixel-art drop-shadow-[0_1px_0_rgba(255,255,255,0.28)]"
        >
          {/* Warm coral-peach pixel cheek blush */}
          <rect x="2" y="5" width="2" height="1" fill="#FF9E80" />
          <rect x="14" y="5" width="2" height="1" fill="#FF9E80" />

          {mood === 'celebrating' || mood === 'happy' ? (
            <>
              {/* Joyful ^ ^ pixel eyes */}
              <rect x="4" y="3" width="1" height="1" fill="#23140E" />
              <rect x="5" y="2" width="1" height="1" fill="#23140E" />
              <rect x="6" y="3" width="1" height="1" fill="#23140E" />

              <rect x="11" y="3" width="1" height="1" fill="#23140E" />
              <rect x="12" y="2" width="1" height="1" fill="#23140E" />
              <rect x="13" y="3" width="1" height="1" fill="#23140E" />

              {/* Happy little smile */}
              <rect x="7" y="5" width="1" height="1" fill="#23140E" />
              <rect x="8" y="6" width="2" height="1" fill="#FF7B6B" />
              <rect x="10" y="5" width="1" height="1" fill="#23140E" />
            </>
          ) : mood === 'sad' ? (
            <>
              {/* Worried brows */}
              <rect x="4" y="1" width="2" height="1" fill="#23140E" />
              <rect x="12" y="1" width="2" height="1" fill="#23140E" />
              {/* Glossy watery eyes */}
              <rect x="4" y="2" width="2" height="3" fill="#23140E" />
              <rect x="4" y="2" width="1" height="1" fill="#FFFFFF" />
              <rect x="5" y="4" width="1" height="1" fill="#7CE0FF" />
              <rect x="12" y="2" width="2" height="3" fill="#23140E" />
              <rect x="12" y="2" width="1" height="1" fill="#FFFFFF" />
              <rect x="13" y="4" width="1" height="1" fill="#7CE0FF" />
              {/* Pixel teardrop */}
              <rect x="3" y="5" width="1" height="2" fill="#63D2FF" />
              {/* Tiny sad pout */}
              <rect x="8" y="6" width="2" height="1" fill="#23140E" />
              <rect x="7" y="7" width="1" height="1" fill="#23140E" />
              <rect x="10" y="7" width="1" height="1" fill="#23140E" />
            </>
          ) : isBlinking ? (
            <>
              {/* Crisp pixel blink */}
              <rect x="4" y="4" width="3" height="1" fill="#23140E" />
              <rect x="11" y="4" width="3" height="1" fill="#23140E" />
              <rect x="8" y="6" width="2" height="1" fill="#23140E" />
            </>
          ) : (
            <>
              {/* Crisp 16-bit glossy dark eyes with white pixel highlight */}
              <rect x="4" y="2" width="2" height="3" fill="#23140E" />
              <rect x="4" y="2" width="1" height="1" fill="#FFFFFF" />
              <rect x="12" y="2" width="2" height="3" fill="#23140E" />
              <rect x="12" y="2" width="1" height="1" fill="#FFFFFF" />
              {/* Cozy pixel smile */}
              <rect x="8" y="5" width="2" height="1" fill="#23140E" />
            </>
          )}
        </svg>
      </div>

      {/* Head Accessories (Hat & Blossom Crown) worn cleanly over the canopy */}
      {has('crown') && (
        <div
          className={`pointer-events-none absolute inset-x-0 ${crownBottomClass} z-30 flex justify-center ${animClass}`}
        >
          <OfficialPixelSprite name="wardrobeCrown" size={Math.max(15, Math.round(size * 0.25))} />
        </div>
      )}
      {has('hat') && (
        <div
          className={`pointer-events-none absolute inset-x-0 ${hatBottomClass} z-30 flex justify-center ${animClass}`}
        >
          <OfficialPixelSprite name="wardrobeHat" size={Math.max(16, Math.round(size * 0.27))} />
        </div>
      )}

      {/* Happy / Celebrating 16-bit Pixel Sparkles */}
      {(mood === 'celebrating' || mood === 'happy') && (
        <svg
          viewBox="0 0 56 48"
          width={size}
          height={boxHeight}
          shapeRendering="crispEdges"
          className="pixel-art pointer-events-none absolute inset-0 z-30"
        >
          <rect x="12" y="11" width="1" height="3" fill="#FFF39A" />
          <rect x="11" y="12" width="3" height="1" fill="#FFF39A" />
          <rect x="12" y="12" width="1" height="1" fill="#FFFFFF" />
          <rect x="43" y="13" width="1" height="3" fill="#FFE066" />
          <rect x="42" y="14" width="3" height="1" fill="#FFE066" />
          <rect x="43" y="14" width="1" height="1" fill="#FFFFFF" />
        </svg>
      )}

      {/* Official Mud Crab Pal resting on right edge of mudflat */}
      {has('crab') && (
        <div className="pointer-events-none absolute right-[8%] bottom-[16%] z-20">
          <OfficialPixelSprite name="crab" size={Math.max(12, Math.round(size * 0.21))} />
        </div>
      )}
    </div>
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

