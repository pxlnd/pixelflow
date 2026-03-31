const LEVEL_REGISTRY = window.PIXELFLOW_LEVELS || {
  LEVEL_DEFINITIONS: [],
  DEFAULT_LEVEL_ID: "level-1",
  getLevelConfig: () => null,
};
const THEME_REGISTRY = window.PIXELFLOW_THEMES || {
  THEME_DEFINITIONS: [],
  DEFAULT_THEME_ID: "classic",
  getThemeConfig: () => null,
};

const BUILTIN_FALLBACK_LEVEL = {
  id: "level-1",
  name: "Level 1",
  fallbackFieldPattern: [
    "GGGGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGGGG",
    "GGBBBBGGGGGGBBBBGG",
    "GGBBBBGGGGGGBBBBGG",
    "GGBBBBGGGGGGBBBBGG",
    "GGBBBBGGGGGGBBBBGG",
    "GGGGGGBBBBBBGGGGGG",
    "GGGGGGBBBBBBGGGGGG",
    "GGGGBBBBBBBBBBGGGG",
    "GGGGBBBBBBBBBBGGGG",
    "GGGGBBBBBBBBBBGGGG",
    "GGGGBBBBBBBBBBGGGG",
    "GGGGBBGGGGGGBBGGGG",
    "GGGGBBGGGGGGBBGGGG",
    "GGGGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGGGG",
  ],
  referenceGrid: { x: 220, y: 216, step: 32, cellSize: 30 },
  layout: {
    fieldX: 220,
    fieldY: 329,
    fieldStep: 32,
    cellSize: 32,
    fieldCols: 18,
    fieldRows: 18,
    track: { x: 106, y: 189, w: 808, h: 856, r: 50 },
    spawnPoint: { x: 152, y: 979 },
    cards: [
      { lane: 0, row: 0, x: 312, y: 1230, w: 160, h: 200, color: "green", styleKey: "mint", label: 1, ammo: 40 },
      { lane: 1, row: 0, x: 552, y: 1230, w: 160, h: 200, color: "black", styleKey: "coral", label: 2, ammo: 40 },
      { lane: 0, row: 1, x: 312, y: 1432, w: 160, h: 200, color: "green", styleKey: "sky", label: 3, ammo: 40 },
      { lane: 1, row: 1, x: 552, y: 1432, w: 160, h: 200, color: "black", styleKey: "gold", label: 4, ammo: 40 },
    ],
    slots: [
      { x: 98, y: 1130, w: 194, h: 126 },
      { x: 311, y: 1130, w: 194, h: 126 },
      { x: 520, y: 1130, w: 194, h: 126 },
      { x: 729, y: 1130, w: 194, h: 126 },
    ],
    wagonSprite: {
      x: 44,
      y: 840,
      w: 148,
      h: 116,
      anchorX: 52,
      anchorY: 96,
      seatOffsetX: 0,
      seatOffsetY: -52,
    },
    wagonMask: { x: 0, y: 820, w: 260, h: 200 },
    boardMask: { x: 0, y: 0, w: 1024, h: 1600, r: 0 },
  },
};

const BUILTIN_FALLBACK_THEME = {
  id: "classic",
  name: "Classic",
  assets: {
    referenceImage: "Ref.png",
    backButton: "ui/back_button.png",
    timerPanel: "ui/timer_panel.png",
    restartButton: "ui/restart_button.png",
    losePopup: "ui/lose_popup_ref.png",
  },
  board: {
    fill: "#6aa93a",
    grassPalette: ["#6a9f35", "#72aa3a", "#7bb642", "#5f9430", "#89c84b"],
    grassShade: "rgba(28, 52, 14, 0.16)",
    dirtFill: "#b98c5e",
    dirtPalette: ["#b18052", "#ba8a5b", "#c89a67", "#a9784a", "#d1a874"],
    dirtShade: "rgba(64, 40, 22, 0.2)",
  },
  track: {
    woodGradient: ["#9f6e34", "#6f451f", "#a47539"],
    sleeperColor: "#5b3619",
    sleeperHighlight: "rgba(255,255,255,0.12)",
    railMain: "#ded7ca",
    railShadow: "rgba(55,55,55,0.35)",
  },
  victory: {
    gradient: ["#d8f3ff", "#a8ddff", "#8bc9ff"],
    cloudColor: "rgba(255, 255, 255, 0.7)",
    boardGlow: "rgba(255, 255, 255, 0.42)",
  },
  colors: {},
  confettiColors: ["#ff5f5f", "#ffd166", "#6ee7b7", "#60a5fa", "#f9a8d4", "#c4b5fd"],
};

const LEVEL_DEFINITIONS = Array.isArray(LEVEL_REGISTRY.LEVEL_DEFINITIONS) ? LEVEL_REGISTRY.LEVEL_DEFINITIONS : [];
const THEME_DEFINITIONS = Array.isArray(THEME_REGISTRY.THEME_DEFINITIONS) ? THEME_REGISTRY.THEME_DEFINITIONS : [];
const DEFAULT_LEVEL_ID = String(LEVEL_REGISTRY.DEFAULT_LEVEL_ID || BUILTIN_FALLBACK_LEVEL.id);
const DEFAULT_THEME_ID = String(THEME_REGISTRY.DEFAULT_THEME_ID || BUILTIN_FALLBACK_THEME.id);
const getLevelConfigRaw = typeof LEVEL_REGISTRY.getLevelConfig === "function" ? LEVEL_REGISTRY.getLevelConfig : () => null;
const getThemeConfigRaw = typeof THEME_REGISTRY.getThemeConfig === "function" ? THEME_REGISTRY.getThemeConfig : () => null;

function isValidLevelConfig(config) {
  return !!config && !!config.layout && Array.isArray(config.layout.cards) && Array.isArray(config.layout.slots);
}

function isValidThemeConfig(config) {
  return !!config && typeof config === "object";
}

const getLevelConfig = (levelId) => {
  let config = null;
  try {
    config = getLevelConfigRaw(levelId);
  } catch {
    config = null;
  }
  if (isValidLevelConfig(config)) {
    return config;
  }
  const fallbackById = LEVEL_DEFINITIONS.find((level) => level && level.id === DEFAULT_LEVEL_ID);
  if (isValidLevelConfig(fallbackById)) {
    return fallbackById;
  }
  return BUILTIN_FALLBACK_LEVEL;
};

const getThemeConfig = (themeId) => {
  let config = null;
  try {
    config = getThemeConfigRaw(themeId);
  } catch {
    config = null;
  }
  if (isValidThemeConfig(config)) {
    return config;
  }
  const fallbackById = THEME_DEFINITIONS.find((theme) => theme && theme.id === DEFAULT_THEME_ID);
  if (isValidThemeConfig(fallbackById)) {
    return fallbackById;
  }
  return BUILTIN_FALLBACK_THEME;
};

const LOGICAL_WIDTH = 1024;
const LOGICAL_HEIGHT = 1600;
const FIXED_DT = 1 / 60;
const MAX_ACTIVE_UNITS = 5;
const FIRE_INTERVAL = 0.02;
const BULLET_RADIUS = 8;
const SHOT_TRAIL_DURATION = 0.16;
const SHOT_BOUNCE_DURATION = 0.16;
let SHOT_BOUNCE_AMOUNT = 0.2;
let SHOT_BOUNCE_SPEED = 1;
let TRACK_UNIT_SPEED = 980;
let BOTTOM_QUEUE_CARD_COUNT = 7;
let TOP_PANEL_FONT_SIZE = 67;
let TOP_LEVEL_PANEL_SCALE = 1.07;
let TOP_COINS_PANEL_SCALE = 0.8;
let BACK_BUTTON_SCALE = 1.02;
let TRACK_Y_OFFSET = 18;
let FIELD_SCALE = 1.07;
let PLAYFIELD_SCALE = 0.86;
let SLOT_SIZE_SCALE = 1;
let SLOT_Y_OFFSET = -63;
let TOP_UI_Y_OFFSET = 65;
let CARD_Y_OFFSET_ALL = -72;
let CARD_Y_OFFSET_1 = 60;
let CARD_Y_OFFSET_2 = 7;
let CARD_Y_OFFSET_3 = 0;
let CARD_Y_OFFSET_4 = 0;
const UNIT_BLOCK_SIZE = 74;
const SHOOTER_HIT_RADIUS = 88;
const CARD_HITBOX_PADDING_X = 26;
const CARD_HITBOX_PADDING_TOP = 26;
const CARD_HITBOX_PADDING_BOTTOM = 22;
const PARKED_UNIT_TAP_RADIUS = 86;
const SHOW_TAP_DEBUG = false;
const SPAWN_CLEAR_RADIUS = 118;
const SLOT_CLAIM_ORDER = [0, 3, 1, 2];
let REFERENCE_FIELD_X = 220;
let REFERENCE_FIELD_Y = 216;
let REFERENCE_FIELD_STEP = 32;
let REFERENCE_CELL_SIZE = 30;
let BOARD_FILL_COLOR = "#6aa93a";
const VICTORY_ZOOM_TARGET = 1.12;
const VICTORY_ZOOM_SPEED = 3.2;
const VICTORY_CONFETTI_DURATION = 1.8;
const VICTORY_FLOAT_SPEED = 0.85;
const VICTORY_FLOAT_AMPLITUDE = 12;
const VICTORY_ART_OFFSET_Y = 110;
const VICTORY_CONFETTI_RATE = 42;
const LAUNCH_DURATION = 0.24;
const LAND_DURATION = 0.2;
const STREAK_DECAY_TIME = 1.45;
const LOSE_POPUP_ANIM_DURATION = 0.34;
const LEVEL_START_FADE_DURATION = 0.22;
const MIN_QUEUE_CARDS = 2;
const MAX_QUEUE_CARDS = 24;
const BACK_BUTTON_UI = {
  x: 34,
  y: 30,
  w: 108,
  h: 108,
};
const TOP_PANEL_FONT_WEIGHT = 800;
const TOP_PANEL_FONT_FAMILY = "\"Baloo 2\", \"Arial Rounded MT Bold\", \"Trebuchet MS\", Arial, sans-serif";
const TIMER_PANEL_UI = {
  y: 36,
  w: 256,
  h: 95,
  label: "Level",
  textColor: "#335b90",
  textStroke: "rgba(255, 255, 255, 0.92)",
};
const COINS_UI = {
  panelY: 36,
  panelW: 256,
  panelH: 95,
  rightMargin: 30,
  amount: "1375",
  amountColor: "#15479f",
  amountStroke: "rgba(255, 255, 255, 0.86)",
  amountXFactor: 0.67,
  coinW: 96,
  coinH: 95,
  coinOffsetX: -34,
  coinOffsetY: 0,
  plusW: 48,
  plusH: 51,
  plusOffsetX: 54,
  plusOffsetY: 50,
};
const LOSE_POPUP_UI = {
  w: 710,
  h: 728,
  y: 358,
  outerRadius: 26,
  innerPadding: 18,
  closeSize: 40,
};
const BASE_TOP_UI = {
  timerY: TIMER_PANEL_UI.y,
  timerW: TIMER_PANEL_UI.w,
  timerH: TIMER_PANEL_UI.h,
  coinsY: COINS_UI.panelY,
  coinsW: COINS_UI.panelW,
  coinsH: COINS_UI.panelH,
  backY: BACK_BUTTON_UI.y,
  backW: BACK_BUTTON_UI.w,
  backH: BACK_BUTTON_UI.h,
};

const DEBUG_STORAGE_KEY = "pixelflow.debug.settings";
const PLAYFIELD_SCALE_MIGRATION_KEY = "pixelflow.debug.playfieldScale.migrated.v1";
const DEBUG_STORAGE_KEYS_FALLBACK = [
  "pixelflow.debug.settings.v4",
  "pixelflow.debug.settings.v3",
  "pixelflow.debug.settings.v2",
  "pixelflow.debug.settings.v1",
];
const DEBUG_DEFAULTS = {
  shotBounceAmount: 0.2,
  shotBounceSpeed: 1,
  trackUnitSpeed: 980,
  queueCardCount: 7,
  topPanelFontSize: 67,
  topLevelPanelScale: 1.07,
  topCoinsPanelScale: 0.8,
  backButtonScale: 1.02,
  trackYOffset: 18,
  fieldScale: 1.07,
  playfieldScale: 0.86,
  slotSizeScale: 1,
  slotYOffset: -63,
  topUiYOffset: 65,
  cardYOffsetAll: -72,
  cardYOffset1: 60,
  cardYOffset2: 7,
  cardYOffset3: 0,
  cardYOffset4: 0,
  levelId: DEFAULT_LEVEL_ID,
  themeId: DEFAULT_THEME_ID,
};

const DEFAULT_COLORS = {
  white: "#ffffff",
  shadow: "rgba(0, 0, 0, 0.55)",
  usedOverlay: "rgba(13, 15, 16, 0.56)",
  badgeBg: "rgba(17, 20, 26, 0.85)",
  bulletGreen: "#dcffc2",
  bulletGreenCore: "#7ede55",
  bulletBlack: "#d8d8d8",
  bulletBlackCore: "#222222",
  particleGreen: "#8fe266",
  particleBlack: "#161616",
  clearedGround: "#3f3b37",
  sceneShadow: "rgba(19, 32, 10, 0.2)",
  fieldShadow: "rgba(16, 28, 9, 0.24)",
  blockShadow: "rgba(15, 24, 8, 0.28)",
  ringGreen: "rgba(163, 243, 111, 0.85)",
  ringBlack: "rgba(236, 236, 236, 0.8)",
  slotPulse: "rgba(255, 235, 140, 0.7)",
  textGlow: "rgba(0, 0, 0, 0.45)",
};

let CURRENT_LEVEL = getLevelConfig(DEFAULT_LEVEL_ID);
let CURRENT_THEME = getThemeConfig(DEFAULT_THEME_ID);
let LAYOUT = cloneLevelLayout(CURRENT_LEVEL.layout);
let BASE_LAYOUT = createBaseLayout(LAYOUT);
let FALLBACK_FIELD_PATTERN = [...CURRENT_LEVEL.fallbackFieldPattern];
let COLORS = { ...DEFAULT_COLORS, ...(CURRENT_THEME.colors || {}) };
let CONFETTI_COLORS = [...(CURRENT_THEME.confettiColors || ["#ff5f5f", "#ffd166", "#6ee7b7", "#60a5fa", "#f9a8d4", "#c4b5fd"])];

syncLevelGlobals(CURRENT_LEVEL);
syncThemeGlobals(CURRENT_THEME);

function cloneData(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function cloneLevelLayout(layout) {
  return cloneData(layout);
}

function createBaseLayout(layout) {
  return {
    fieldX: layout.fieldX,
    fieldY: layout.fieldY,
    fieldStep: layout.fieldStep,
    cellSize: layout.cellSize,
    fieldCols: layout.fieldCols,
    fieldRows: layout.fieldRows,
    track: { ...layout.track },
    spawnPoint: { ...layout.spawnPoint },
    slots: layout.slots.map((slot) => ({ ...slot })),
    cards: layout.cards.map((card) => ({ ...card })),
  };
}

function syncLevelGlobals(levelConfig) {
  CURRENT_LEVEL = cloneData(levelConfig);
  LAYOUT = cloneLevelLayout(CURRENT_LEVEL.layout);
  BASE_LAYOUT = createBaseLayout(LAYOUT);
  FALLBACK_FIELD_PATTERN = [...(CURRENT_LEVEL.fallbackFieldPattern || [])];
  REFERENCE_FIELD_X = Number(CURRENT_LEVEL.referenceGrid?.x ?? 220);
  REFERENCE_FIELD_Y = Number(CURRENT_LEVEL.referenceGrid?.y ?? 216);
  REFERENCE_FIELD_STEP = Number(CURRENT_LEVEL.referenceGrid?.step ?? 32);
  REFERENCE_CELL_SIZE = Number(CURRENT_LEVEL.referenceGrid?.cellSize ?? 30);
  TIMER_PANEL_UI.label = CURRENT_LEVEL.name || "Level";
  if (typeof document !== "undefined") {
    document.title = `PixelFlow - ${TIMER_PANEL_UI.label}`;
  }
}

function syncThemeGlobals(themeConfig) {
  CURRENT_THEME = cloneData(themeConfig);
  BOARD_FILL_COLOR = String(CURRENT_THEME.board?.fill || "#6aa93a");
  COLORS = { ...DEFAULT_COLORS, ...(CURRENT_THEME.colors || {}) };
  CONFETTI_COLORS = [...(CURRENT_THEME.confettiColors || ["#ff5f5f", "#ffd166", "#6ee7b7", "#60a5fa", "#f9a8d4", "#c4b5fd"])];
}

function getThemeAsset(key, fallbackPath) {
  const value = CURRENT_THEME.assets?.[key];
  return typeof value === "string" && value.length > 0 ? value : fallbackPath;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getTopPanelFont() {
  return `${TOP_PANEL_FONT_WEIGHT} ${Math.round(TOP_PANEL_FONT_SIZE)}px ${TOP_PANEL_FONT_FAMILY}`;
}

function getCardYOffsetByIndex(index) {
  if (index === 0) return CARD_Y_OFFSET_1;
  if (index === 1) return CARD_Y_OFFSET_2;
  if (index === 2) return CARD_Y_OFFSET_3;
  if (index === 3) return CARD_Y_OFFSET_4;
  return 0;
}

function encodeDebugState(state) {
  try {
    return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(state)))));
  } catch {
    return "";
  }
}

function decodeDebugState(encoded) {
  try {
    const json = decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function readDebugStateFromHash() {
  const hash = window.location.hash || "";
  if (!hash.startsWith("#dbg=")) {
    return null;
  }
  const encoded = hash.slice(5);
  return decodeDebugState(encoded);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeOutCubic(t) {
  const u = 1 - clamp(t, 0, 1);
  return 1 - u * u * u;
}

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const u = clamp(t, 0, 1) - 1;
  return 1 + c3 * u * u * u + c1 * u * u;
}

function quadraticBezierPoint(a, b, c, t) {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * b.x + t * t * c.x,
    y: u * u * a.y + 2 * u * t * b.y + t * t * c.y,
  };
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function isInsideRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function roundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function createRoundedRectPath(x, y, w, h, r, samplesPerArc = 18) {
  const points = [];
  const pushPoint = (px, py) => {
    const last = points[points.length - 1];
    if (!last || Math.hypot(last.x - px, last.y - py) > 0.5) {
      points.push({ x: px, y: py });
    }
  };
  const pushLine = (fromX, fromY, toX, toY, steps) => {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      pushPoint(fromX + (toX - fromX) * t, fromY + (toY - fromY) * t);
    }
  };
  const pushArc = (cx, cy, radius, startAngle, endAngle, steps) => {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = startAngle + (endAngle - startAngle) * t;
      pushPoint(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    }
  };

  pushLine(x + r, y, x + w - r, y, 32);
  pushArc(x + w - r, y + r, r, -Math.PI / 2, 0, samplesPerArc);
  pushLine(x + w, y + r, x + w, y + h - r, 32);
  pushArc(x + w - r, y + h - r, r, 0, Math.PI / 2, samplesPerArc);
  pushLine(x + w - r, y + h, x + r, y + h, 32);
  pushArc(x + r, y + h - r, r, Math.PI / 2, Math.PI, samplesPerArc);
  pushLine(x, y + h - r, x, y + r, 32);
  pushArc(x + r, y + r, r, Math.PI, Math.PI * 1.5, samplesPerArc);

  return points;
}

class Block {
  constructor(id, col, row, color) {
    this.id = id;
    this.col = col;
    this.row = row;
    this.color = color;
    this.layer = Math.min(
      col,
      row,
      LAYOUT.fieldCols - 1 - col,
      LAYOUT.fieldRows - 1 - row
    );
    this.alive = false;
    this.spiralIndex = Number.MAX_SAFE_INTEGER;
    this.hitFlash = 0;
    this.x = LAYOUT.fieldX + col * LAYOUT.fieldStep;
    this.y = LAYOUT.fieldY + row * LAYOUT.fieldStep;
    this.size = LAYOUT.cellSize;
  }

  update(dt) {
    this.hitFlash = Math.max(0, this.hitFlash - dt * 5);
  }
}

class Conveyor {
  constructor() {
    this.trackRect = { ...LAYOUT.track };
    this.path = [];
    this.totalLength = 0;
    this.segmentLengths = [];
    this.spawnDistance = 0;
    this.setTrackRect(LAYOUT.track, LAYOUT.spawnPoint);
  }

  setTrackRect(trackRect, spawnPoint = LAYOUT.spawnPoint) {
    this.trackRect = { ...trackRect };
    this.path = createRoundedRectPath(
      this.trackRect.x,
      this.trackRect.y,
      this.trackRect.w,
      this.trackRect.h,
      this.trackRect.r
    );
    this.totalLength = 0;
    this.segmentLengths = [];
    for (let i = 0; i < this.path.length; i++) {
      const a = this.path[i];
      const b = this.path[(i + 1) % this.path.length];
      const segmentLength = distance(a, b);
      this.segmentLengths.push(segmentLength);
      this.totalLength += segmentLength;
    }
    this.spawnDistance = this.closestPathDistance(spawnPoint);
  }

  pointAtDistance(trackDistance) {
    let d = ((trackDistance % this.totalLength) + this.totalLength) % this.totalLength;
    for (let i = 0; i < this.segmentLengths.length; i++) {
      const len = this.segmentLengths[i];
      if (d <= len || i === this.segmentLengths.length - 1) {
        const a = this.path[i];
        const b = this.path[(i + 1) % this.path.length];
        const t = len === 0 ? 0 : d / len;
        return {
          x: a.x + (b.x - a.x) * t,
          y: a.y + (b.y - a.y) * t,
        };
      }
      d -= len;
    }
    return { ...this.path[0] };
  }

  closestPathDistance(point) {
    let bestDistance = 0;
    let bestScore = Infinity;
    let traveled = 0;

    for (let i = 0; i < this.path.length; i++) {
      const p = this.path[i];
      const score = Math.hypot(point.x - p.x, point.y - p.y);
      if (score < bestScore) {
        bestScore = score;
        bestDistance = traveled;
      }
      traveled += this.segmentLengths[i];
    }

    return bestDistance;
  }
}

class Unit {
  constructor(id, color, ammo, launchFrom, conveyor, styleKey, label) {
    this.id = id;
    this.color = color;
    this.ammo = ammo;
    this.maxAmmo = ammo;
    this.styleKey = styleKey || (color === "green" ? "mint" : "gold");
    this.label = label ?? id;
    this.slotIndex = null;
    this.speed = TRACK_UNIT_SPEED;
    this.cooldown = 0;
    this.state = "launching";
    this.launchFrom = { ...launchFrom };
    this.conveyor = conveyor;
    this.launchTo = conveyor.pointAtDistance(conveyor.spawnDistance);
    this.landFrom = { ...this.launchTo };
    this.landTo = null;
    this.launchProgress = 0;
    this.landProgress = 0;
    this.loopDistance = 0;
    this.distanceOnTrack = conveyor.spawnDistance;
    this.position = { ...launchFrom };
    this.prevPosition = { ...launchFrom };
    this.launchArcHeight = 36 + Math.random() * 24;
    this.launchControl = {
      x: (this.launchFrom.x + this.launchTo.x) * 0.5,
      y: Math.min(this.launchFrom.y, this.launchTo.y) - this.launchArcHeight,
    };
    this.landControl = { ...this.landFrom };
    this.scaleX = 1;
    this.scaleY = 1;
    this.parkBounce = 0;
    this.shotBounceTime = SHOT_BOUNCE_DURATION;
    this.alive = true;
  }

  triggerShotBounce() {
    this.shotBounceTime = 0;
  }

  getShotScale() {
    if (this.shotBounceTime >= SHOT_BOUNCE_DURATION) {
      return 1;
    }
    const t = clamp(this.shotBounceTime / SHOT_BOUNCE_DURATION, 0, 1);
    return 1 + SHOT_BOUNCE_AMOUNT * (1 - easeOutCubic(t));
  }

  update(dt, game) {
    if (!this.alive) {
      return;
    }

    this.parkBounce = Math.max(0, this.parkBounce - dt * 5.5);
    const speedMul = Math.max(0.2, SHOT_BOUNCE_SPEED);
    this.shotBounceTime = Math.min(
      SHOT_BOUNCE_DURATION,
      this.shotBounceTime + dt * speedMul,
    );

    if (this.state === "launching") {
      this.launchProgress = Math.min(1, this.launchProgress + dt / LAUNCH_DURATION);
      const launchT = easeOutCubic(this.launchProgress);
      this.position = quadraticBezierPoint(this.launchFrom, this.launchControl, this.launchTo, launchT);
      if (this.launchProgress >= 1) {
        this.state = "moving";
        this.position = this.conveyor.pointAtDistance(this.distanceOnTrack);
        this.prevPosition = { ...this.position };
        game.normalizeShooterQueues(game.cards);
      }
    } else if (this.state === "landing") {
      this.landProgress = Math.min(1, this.landProgress + dt / LAND_DURATION);
      const landingT = easeOutBack(this.landProgress);
      this.position = quadraticBezierPoint(this.landFrom, this.landControl, this.landTo, landingT);
      if (this.landProgress >= 1) {
        this.state = "parked";
        this.position = { ...this.landTo };
        this.prevPosition = { ...this.position };
        this.parkBounce = 1;
        game.triggerParkedUnitFx(this);
      }
    } else {
      this.cooldown = Math.max(0, this.cooldown - dt);
      if (game.gameState !== "playing") {
        this.alive = false;
        if (this.slotIndex !== null) {
          game.freeSlot(this.slotIndex, this.id);
        }
        return;
      }

      if (this.ammo <= 0) {
        this.alive = false;
        if (this.slotIndex !== null) {
          game.freeSlot(this.slotIndex, this.id);
        }
        return;
      }

      if (this.state === "parked") {
        if (this.slotIndex !== null) {
          const slotCenter = game.getSlotCenter(this.slotIndex);
          if (slotCenter) {
            this.position = { ...slotCenter };
          }
        }
      }

      if (this.state === "moving") {
        this.speed = TRACK_UNIT_SPEED;
        const delta = this.speed * dt;
        this.loopDistance += delta;
        this.distanceOnTrack -= delta;
        this.position = this.conveyor.pointAtDistance(this.distanceOnTrack);

        if (this.loopDistance >= game.conveyor.totalLength) {
          if (this.ammo > 0 && game.hasTargetForColor(this.color)) {
            this.loopDistance -= game.conveyor.totalLength;
            return;
          }
          const freeSlotIndex = game.claimFreeSlot(this.id);
          if (freeSlotIndex === null) {
            this.alive = false;
            game.startLoseSequence();
            return;
          }
          this.slotIndex = freeSlotIndex;
          this.landTo = game.getSlotCenter(freeSlotIndex);
          this.landFrom = { ...this.position };
          const dx = this.landTo.x - this.landFrom.x;
          const dy = this.landTo.y - this.landFrom.y;
          const dist = Math.max(1, Math.hypot(dx, dy));
          const nx = -dy / dist;
          const ny = dx / dist;
          const lift = 20 + Math.min(44, dist * 0.14);
          this.landControl = {
            x: (this.landFrom.x + this.landTo.x) * 0.5 + nx * (Math.random() * 8 - 4),
            y: (this.landFrom.y + this.landTo.y) * 0.5 - lift + ny * (Math.random() * 4 - 2),
          };
          this.landProgress = 0;
          this.state = "landing";
          return;
        }
      }

      if (this.state !== "moving") {
        return;
      }

      if (this.cooldown > 0) {
        return;
      }

      const shootDirection = game.getInwardShootDirection(this.position);
      const target = shootDirection ? game.findTargetOnLine(this.position, this.color, shootDirection) : null;
      if (!target) {
        return;
      }

      this.cooldown = FIRE_INTERVAL;
      this.ammo -= 1;
      game.fireProjectile(this, target);
      this.triggerShotBounce();
    }

    this.scaleX = 1;
    this.scaleY = 1;
    this.prevPosition = { ...this.position };
  }
}

class SlotManager {
  constructor(slots, claimOrder = []) {
    this.slots = slots;
    this.claimOrder = claimOrder.length ? [...claimOrder] : slots.map((_, index) => index);
    this.occupants = Array(slots.length).fill(null);
  }

  reset() {
    this.occupants = Array(this.slots.length).fill(null);
  }

  claim(unitId) {
    for (const index of this.claimOrder) {
      if (index < 0 || index >= this.occupants.length) {
        continue;
      }
      if (this.occupants[index] === null) {
        this.occupants[index] = unitId;
        return index;
      }
    }
    return null;
  }

  free(slotIndex, unitId) {
    if (slotIndex === null || slotIndex === undefined) {
      return;
    }
    if (slotIndex < 0 || slotIndex >= this.occupants.length) {
      return;
    }
    if (this.occupants[slotIndex] === unitId) {
      this.occupants[slotIndex] = null;
    }
  }

  getCenter(slotIndex) {
    const slot = this.slots[slotIndex];
    if (!slot) {
      return null;
    }
    return {
      x: slot.x + slot.w * 0.5,
      y: slot.y + slot.h * 0.5 + 10,
    };
  }
}

class CardManager {
  constructor(cardLayouts, queueCardCount = BOTTOM_QUEUE_CARD_COUNT) {
    this.baseLayouts = cardLayouts.map((card) => ({ ...card }));
    this.updateDerivedLayoutValues();
    this.queueCardCount = clamp(Math.round(queueCardCount), MIN_QUEUE_CARDS, MAX_QUEUE_CARDS);
    this.cardLayouts = this.buildLayouts(this.queueCardCount);
    this.cards = [];
  }

  updateDerivedLayoutValues() {
    this.laneOrder = [...new Set(this.baseLayouts.map((card) => card.lane))].sort((a, b) => a - b);
    this.laneCount = Math.max(1, this.laneOrder.length);
    this.defaultSize = {
      w: this.baseLayouts[0]?.w || 160,
      h: this.baseLayouts[0]?.h || 200,
    };
    const topRowLayouts = this.baseLayouts.filter((card) => card.row === 0);
    this.topRowY = topRowLayouts.length > 0 ? Math.min(...topRowLayouts.map((card) => card.y)) : 0;
    const laneXByLane = {};
    for (const lane of this.laneOrder) {
      const front = this.baseLayouts.find((card) => card.lane === lane && card.row === 0);
      if (front) {
        laneXByLane[lane] = front.x;
      }
    }
    const firstLaneX = laneXByLane[this.laneOrder[0]] ?? this.baseLayouts[0]?.x ?? 312;
    const secondLaneX = laneXByLane[this.laneOrder[1]];
    this.defaultLaneSpacing = secondLaneX !== undefined ? secondLaneX - firstLaneX : 240;
    this.laneXByLane = laneXByLane;
    this.rowSpacing = this.deriveRowSpacing();
  }

  setBaseLayouts(cardLayouts) {
    this.baseLayouts = cardLayouts.map((card) => ({ ...card }));
    this.updateDerivedLayoutValues();
    this.cardLayouts = this.buildLayouts(this.queueCardCount);
  }

  deriveRowSpacing() {
    const firstLane = this.laneOrder[0];
    const laneLayouts = this.baseLayouts
      .filter((card) => card.lane === firstLane)
      .sort((a, b) => a.row - b.row);
    if (laneLayouts.length >= 2) {
      return Math.max(1, laneLayouts[1].y - laneLayouts[0].y);
    }
    return 202;
  }

  setQueueCardCount(count) {
    const clamped = clamp(Math.round(count), MIN_QUEUE_CARDS, MAX_QUEUE_CARDS);
    const changed = clamped !== this.queueCardCount;
    this.queueCardCount = clamped;
    this.cardLayouts = this.buildLayouts(this.queueCardCount);
    return changed;
  }

  buildLayouts(count) {
    const layouts = [];
    for (let i = 0; i < count; i++) {
      const laneIndex = i % this.laneCount;
      const lane = this.laneOrder[laneIndex] ?? laneIndex;
      const row = Math.floor(i / this.laneCount);
      const fallbackX = (this.baseLayouts[0]?.x ?? 312) + laneIndex * this.defaultLaneSpacing;
      layouts.push({
        lane,
        row,
        x: this.laneXByLane[lane] ?? fallbackX,
        y: this.topRowY + row * this.rowSpacing,
        w: this.defaultSize.w,
        h: this.defaultSize.h,
      });
    }
    return layouts;
  }

  distributeColors(cards, blocks) {
    const colorCounts = blocks.reduce((acc, block) => {
      acc[block.color] = (acc[block.color] || 0) + 1;
      return acc;
    }, {});
    const colors = Object.keys(colorCounts).filter((color) => colorCounts[color] > 0);
    if (cards.length === 0) {
      return colorCounts;
    }
    if (colors.length === 0) {
      for (const card of cards) {
        card.color = "green";
      }
      return colorCounts;
    }

    const totalBlocks = colors.reduce((sum, color) => sum + colorCounts[color], 0);
    const targets = colors.map((color) => {
      const exact = totalBlocks > 0 ? (colorCounts[color] / totalBlocks) * cards.length : cards.length / colors.length;
      return { color, exact, count: Math.floor(exact), remainder: exact - Math.floor(exact) };
    });

    for (const target of targets) {
      if (target.count === 0) {
        target.count = 1;
      }
    }

    let assigned = targets.reduce((sum, target) => sum + target.count, 0);
    while (assigned > cards.length) {
      targets.sort((a, b) => (a.remainder - b.remainder) || (b.count - a.count));
      const candidate = targets.find((target) => target.count > 1);
      if (!candidate) {
        break;
      }
      candidate.count -= 1;
      assigned -= 1;
    }
    while (assigned < cards.length) {
      targets.sort((a, b) => (b.remainder - a.remainder) || (b.count - a.count));
      targets[0].count += 1;
      assigned += 1;
    }

    const remaining = new Map(targets.map((target) => [target.color, target.count]));
    let previousColor = null;
    for (const card of cards) {
      const candidates = targets
        .filter((target) => (remaining.get(target.color) || 0) > 0)
        .slice()
        .sort((a, b) => {
          const remainA = remaining.get(a.color) || 0;
          const remainB = remaining.get(b.color) || 0;
          if (remainA !== remainB) {
            return remainB - remainA;
          }
          if (a.color === previousColor && b.color !== previousColor) {
            return 1;
          }
          if (b.color === previousColor && a.color !== previousColor) {
            return -1;
          }
          return 0;
        });
      const pick = candidates[0] || targets[0];
      card.color = pick.color;
      remaining.set(pick.color, (remaining.get(pick.color) || 0) - 1);
      previousColor = pick.color;
    }

    return colorCounts;
  }

  resetFromBlocks(blocks) {
    this.cards = this.createFromBlocks(blocks);
    return this.cards;
  }

  createFromBlocks(blocks) {
    const cards = this.cardLayouts.map((card, index) => ({
      ...card,
      index,
      color: "green",
      styleKey: "mint",
      label: card.label ?? index + 1,
      ammo: 0,
      used: false,
    }));
    const colorCounts = this.distributeColors(cards, blocks);
    const styleIndexByColor = {};
    for (const card of cards) {
      styleIndexByColor[card.color] = styleIndexByColor[card.color] || 0;
      if (card.color === "green") {
        card.styleKey = styleIndexByColor[card.color] % 2 === 0 ? "mint" : "sky";
      } else {
        card.styleKey = styleIndexByColor[card.color] % 2 === 0 ? "coral" : "gold";
      }
      styleIndexByColor[card.color] += 1;
    }

    const cardIndexesByColor = cards.reduce((acc, card, index) => {
      if (!acc[card.color]) {
        acc[card.color] = [];
      }
      acc[card.color].push(index);
      return acc;
    }, {});

    for (const [color, indexes] of Object.entries(cardIndexesByColor)) {
      const total = colorCounts[color] || 0;
      if (indexes.length === 0 || total <= 0) {
        continue;
      }
      const base = Math.floor(total / indexes.length);
      const remainder = total % indexes.length;
      indexes.forEach((cardIndex, i) => {
        cards[cardIndex].ammo = base + (i < remainder ? 1 : 0);
      });
    }

    for (const card of cards) {
      if (card.ammo <= 0) {
        card.used = true;
      }
    }

    return this.normalizeQueues(cards);
  }

  getCardLayout(lane, row) {
    return this.cardLayouts.find((card) => card.lane === lane && card.row === row) || null;
  }

  normalizeQueues(cards) {
    const lanes = [...new Set(cards.map((card) => card.lane))];
    for (const lane of lanes) {
      const activeInLane = cards
        .filter((card) => card.lane === lane && !card.used)
        .sort((a, b) => (a.row - b.row) || (a.index - b.index));
      if (activeInLane.length === 0) {
        continue;
      }
      activeInLane.forEach((card, row) => {
        const layout = this.getCardLayout(lane, row) || this.getCardLayout(lane, 0);
        if (!layout) {
          return;
        }
        card.row = row;
        card.x = layout.x;
        card.y = layout.y;
        card.w = layout.w;
        card.h = layout.h;
      });
    }
    this.cards = cards;
    return cards;
  }

  isFrontRowCard(card) {
    return !!card && card.row === 0 && !card.used;
  }

  getFrontLaneIds() {
    return [...new Set(this.cardLayouts.map((card) => card.lane))];
  }

  getActiveFrontCardInLane(lane) {
    return this.cards.find((card) => card.lane === lane && this.isFrontRowCard(card)) || null;
  }

  getCardPigCenter(card) {
    return {
      x: card.x + card.w / 2,
      y: card.y + card.h / 2 + 8,
    };
  }

  getCardBadgeRect(card) {
    const center = this.getCardPigCenter(card);
    const badgeY = card.y + card.h - 16;
    return {
      x: center.x - 38,
      y: badgeY - 13,
      w: 76,
      h: 24,
    };
  }

  isPointOnCard(card, x, y) {
    const center = this.getCardPigCenter(card);
    const onPig = Math.hypot(x - center.x, y - center.y) <= SHOOTER_HIT_RADIUS;
    return onPig;
  }

  findTapTarget(x, y) {
    let best = null;
    let bestDistance = Infinity;
    for (const lane of this.getFrontLaneIds()) {
      const activeCard = this.getActiveFrontCardInLane(lane);
      if (!activeCard || !this.isPointOnCard(activeCard, x, y)) {
        continue;
      }
      const center = this.getCardPigCenter(activeCard);
      const score = Math.hypot(x - center.x, y - center.y);
      if (score < bestDistance) {
        bestDistance = score;
        best = activeCard;
      }
    }
    return best;
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.width = LOGICAL_WIDTH;
    this.height = LOGICAL_HEIGHT;
    this.screenWidth = LOGICAL_WIDTH;
    this.screenHeight = LOGICAL_HEIGHT;
    this.viewportScale = 1;
    this.viewportOffsetX = 0;
    this.viewportOffsetY = 0;
    this.dpr = 1;
    this.currentLevelId = CURRENT_LEVEL.id;
    this.currentThemeId = CURRENT_THEME.id;
    this.availableLevels = LEVEL_DEFINITIONS.map((level) => ({ id: level.id, name: level.name }));
    this.availableThemes = THEME_DEFINITIONS.map((theme) => ({ id: theme.id, name: theme.name }));

    this.referenceImage = new Image();
    this.referenceImage.src = getThemeAsset("referenceImage", "Ref.png");
    this.referenceImage.decoding = "sync";
    this.backButtonImage = new Image();
    this.backButtonImage.src = getThemeAsset("backButton", "ui/back_button.png");
    this.backButtonImage.decoding = "sync";
    this.timerPanelImage = new Image();
    this.timerPanelImage.src = getThemeAsset("timerPanel", "ui/timer_panel.png");
    this.timerPanelImage.decoding = "sync";
    this.restartButtonImage = new Image();
    this.restartButtonImage.src = getThemeAsset("restartButton", "ui/restart_button.png");
    this.restartButtonImage.decoding = "sync";
    this.losePopupImage = new Image();
    this.losePopupImage.src = getThemeAsset("losePopup", "ui/lose_popup_ref.png");
    this.losePopupImage.decoding = "sync";

    this.referenceLayer = document.createElement("canvas");
    this.referenceLayer.width = this.width;
    this.referenceLayer.height = this.height;
    this.referenceCtx = this.referenceLayer.getContext("2d", { alpha: false });

    this.referencePixels = null;
    this.sprites = {
      holeTile: null,
      greenTile: null,
      blackTile: null,
      fieldGround: null,
      wagon: null,
      wagonMask: null,
      grassTile: null,
    };

    this.conveyor = new Conveyor();
    this.spiralOrderByCell = this.buildSpiralOrderMap(LAYOUT.fieldCols, LAYOUT.fieldRows);
    this.blocks = [];
    this.blocksBySpiral = [];
    this.units = [];
    this.projectiles = [];
    this.particles = [];
    this.impactRings = [];
    this.blockWaves = [];
    this.slotBursts = [];
    this.floatTexts = [];
    this.confetti = [];
    this.cardManager = new CardManager(LAYOUT.cards, BOTTOM_QUEUE_CARD_COUNT);
    this.slotManager = new SlotManager(LAYOUT.slots, SLOT_CLAIM_ORDER);
    this.backButtonRect = { ...BACK_BUTTON_UI };
    this.restartButtonRect = { x: 0, y: 0, w: COINS_UI.panelW, h: COINS_UI.panelH };
    this.loseCloseRect = { x: 0, y: 0, w: 0, h: 0 };
    this.cards = [];
    this.wagon = {
      x: LAYOUT.spawnPoint.x,
      y: LAYOUT.spawnPoint.y,
      distance: 0,
      color: null,
      moving: false,
    };

    this.gameState = "loading";
    this.remainingBlocks = 0;
    this.hoverHotspot = null;
    this.lastTimestamp = 0;
    this.needsRender = true;
    this.isLoopRunning = false;
    this.unitIdCounter = 0;
    this.cameraZoom = 1;
    this.cameraZoomTarget = 1;
    this.cameraShakeTime = 0;
    this.cameraShakeDuration = 0;
    this.cameraShakeAmp = 0;
    this.cameraShakeX = 0;
    this.cameraShakeY = 0;
    this.successStreak = 0;
    this.streakTimer = 0;
    this.victoryConfettiTime = 0;
    this.victoryFloatTime = 0;
    this.victoryConfettiSpawnCarry = 0;
    this.levelStartFade = 0;
    this.losePopupAppear = 1;
    this.debugPanel = document.getElementById("debugPanel");
    this.debugToggleFab = document.getElementById("debugToggleFab");
    this.debugButton = document.getElementById("debug6");
    this.debugResetButton = document.getElementById("debugReset");
    this.debugLevelSelect = document.getElementById("debugLevelSelect");
    this.debugThemeSelect = document.getElementById("debugThemeSelect");
    this.shotBounceSizeInput = document.getElementById("shotBounceSize");
    this.shotBounceSizeValue = document.getElementById("shotBounceSizeValue");
    this.shotBounceSpeedInput = document.getElementById("shotBounceSpeed");
    this.shotBounceSpeedValue = document.getElementById("shotBounceSpeedValue");
    this.railSpeedInput = document.getElementById("railSpeed");
    this.railSpeedValue = document.getElementById("railSpeedValue");
    this.queueCardsInput = document.getElementById("queueCards");
    this.queueCardsValue = document.getElementById("queueCardsValue");
    this.topPanelFontSizeInput = document.getElementById("topPanelFontSize");
    this.topPanelFontSizeValue = document.getElementById("topPanelFontSizeValue");
    this.levelPanelScaleInput = document.getElementById("levelPanelScale");
    this.levelPanelScaleValue = document.getElementById("levelPanelScaleValue");
    this.coinsPanelScaleInput = document.getElementById("coinsPanelScale");
    this.coinsPanelScaleValue = document.getElementById("coinsPanelScaleValue");
    this.backButtonScaleInput = document.getElementById("backButtonScale");
    this.backButtonScaleValue = document.getElementById("backButtonScaleValue");
    this.trackYOffsetInput = document.getElementById("trackYOffset");
    this.trackYOffsetValue = document.getElementById("trackYOffsetValue");
    this.fieldScaleInput = document.getElementById("fieldScale");
    this.fieldScaleValue = document.getElementById("fieldScaleValue");
    this.playfieldScaleInput = document.getElementById("playfieldScale");
    this.playfieldScaleValue = document.getElementById("playfieldScaleValue");
    this.slotSizeScaleInput = document.getElementById("slotSizeScale");
    this.slotSizeScaleValue = document.getElementById("slotSizeScaleValue");
    this.slotYOffsetInput = document.getElementById("slotYOffset");
    this.slotYOffsetValue = document.getElementById("slotYOffsetValue");
    this.topUiYOffsetInput = document.getElementById("topUiYOffset");
    this.topUiYOffsetValue = document.getElementById("topUiYOffsetValue");
    this.cardAllYOffsetInput = document.getElementById("cardAllYOffset");
    this.cardAllYOffsetValue = document.getElementById("cardAllYOffsetValue");
    this.card1YOffsetInput = document.getElementById("card1YOffset");
    this.card1YOffsetValue = document.getElementById("card1YOffsetValue");
    this.card2YOffsetInput = document.getElementById("card2YOffset");
    this.card2YOffsetValue = document.getElementById("card2YOffsetValue");
    this.card3YOffsetInput = document.getElementById("card3YOffset");
    this.card3YOffsetValue = document.getElementById("card3YOffsetValue");
    this.card4YOffsetInput = document.getElementById("card4YOffset");
    this.card4YOffsetValue = document.getElementById("card4YOffsetValue");
    this.debugPanelVisible = false;
    this.suppressDebugSave = false;

    this.loadDebugSettings();
    this.initDebugControls();

    this.bindEvents();
    this.resize();

    this.referenceImage.onload = () => {
      this.buildReferenceAssets();
      this.restart();
    };

    this.referenceImage.onerror = () => {
      this.gameState = "error";
      this.invalidate(false);
    };

    this.backButtonImage.onload = () => {
      this.invalidate(false);
    };
    this.timerPanelImage.onload = () => {
      this.invalidate(false);
    };
    this.restartButtonImage.onload = () => {
      this.invalidate(false);
    };
    this.losePopupImage.onload = () => {
      this.invalidate(false);
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this.invalidate(false));
    }

    if (this.referenceImage.complete) {
      this.buildReferenceAssets();
      this.restart();
    }
  }

  buildReferenceAssets() {
    this.referenceCtx.imageSmoothingEnabled = false;
    this.referenceCtx.clearRect(0, 0, this.width, this.height);
    this.referenceCtx.drawImage(this.referenceImage, 0, 0, this.width, this.height);
    try {
      this.referencePixels = this.referenceCtx.getImageData(0, 0, this.width, this.height).data;
    } catch {
      // file:// loads can taint canvas and block getImageData; use fallback field pattern.
      this.referencePixels = null;
    }

    const colorGrid = [];
    for (let row = 0; row < LAYOUT.fieldRows; row++) {
      colorGrid[row] = [];
      for (let col = 0; col < LAYOUT.fieldCols; col++) {
        colorGrid[row][col] = this.getCellColor(col, row);
      }
    }

    const findSample = (targetColor, fallback) => {
      const isInside = (col, row) =>
        col > 0 && row > 0 && col < LAYOUT.fieldCols - 1 && row < LAYOUT.fieldRows - 1;

      for (let row = 0; row < LAYOUT.fieldRows; row++) {
        for (let col = 0; col < LAYOUT.fieldCols; col++) {
          if (colorGrid[row][col] !== targetColor || !isInside(col, row)) {
            continue;
          }
          if (
            colorGrid[row - 1][col] === targetColor &&
            colorGrid[row + 1][col] === targetColor &&
            colorGrid[row][col - 1] === targetColor &&
            colorGrid[row][col + 1] === targetColor
          ) {
            return { col, row };
          }
        }
      }

      for (let row = 0; row < LAYOUT.fieldRows; row++) {
        for (let col = 0; col < LAYOUT.fieldCols; col++) {
          if (colorGrid[row][col] === targetColor) {
            return { col, row };
          }
        }
      }

      return fallback;
    };

    const greenSample = findSample("green", { col: 0, row: 0 });
    const blackSample = findSample("black", { col: 1, row: 2 });

    this.sprites.greenTile = this.sliceSprite(
      REFERENCE_FIELD_X + greenSample.col * REFERENCE_FIELD_STEP + 1,
      REFERENCE_FIELD_Y + greenSample.row * REFERENCE_FIELD_STEP + 1,
      REFERENCE_CELL_SIZE,
      REFERENCE_CELL_SIZE
    );
    this.sprites.blackTile = this.suppressGreenTint(this.sliceSprite(
      REFERENCE_FIELD_X + blackSample.col * REFERENCE_FIELD_STEP + 1,
      REFERENCE_FIELD_Y + blackSample.row * REFERENCE_FIELD_STEP + 1,
      REFERENCE_CELL_SIZE,
      REFERENCE_CELL_SIZE
    ));
    this.sprites.holeTile = this.sliceSprite(
      REFERENCE_FIELD_X + REFERENCE_FIELD_STEP * 3 + 1,
      REFERENCE_FIELD_Y + REFERENCE_FIELD_STEP * LAYOUT.fieldRows + 24,
      REFERENCE_CELL_SIZE,
      REFERENCE_CELL_SIZE
    );
    this.sprites.fieldGround = this.makeTileSeamless(this.suppressGreenTint(this.sliceSprite(
      REFERENCE_FIELD_X + REFERENCE_FIELD_STEP * 3 + 1,
      REFERENCE_FIELD_Y + REFERENCE_FIELD_STEP * LAYOUT.fieldRows + 24,
      96,
      96
    ), { minGreen: 30, deltaR: 3, deltaB: 3 }));
    this.sprites.wagon = this.sliceSprite(
      LAYOUT.wagonSprite.x,
      LAYOUT.wagonSprite.y,
      LAYOUT.wagonSprite.w,
      LAYOUT.wagonSprite.h
    );
    this.sprites.wagonMask = this.buildMirroredPatch(
      LAYOUT.wagonMask.x,
      LAYOUT.wagonMask.y,
      LAYOUT.wagonMask.w,
      LAYOUT.wagonMask.h
    );
    this.sprites.grassTile = this.makeTileSeamless(this.sliceSprite(12, 12, 96, 96));
  }

  sliceSprite(x, y, w, h) {
    const sprite = document.createElement("canvas");
    sprite.width = w;
    sprite.height = h;
    const spriteCtx = sprite.getContext("2d", { alpha: true });
    spriteCtx.imageSmoothingEnabled = false;
    spriteCtx.drawImage(this.referenceLayer, x, y, w, h, 0, 0, w, h);
    return sprite;
  }

  suppressGreenTint(sprite, options = {}) {
    if (!sprite) {
      return sprite;
    }
    const minGreen = options.minGreen ?? 80;
    const deltaR = options.deltaR ?? 16;
    const deltaB = options.deltaB ?? 12;
    const spriteCtx = sprite.getContext("2d", { alpha: true });
    if (!spriteCtx) {
      return sprite;
    }
    let imageData;
    try {
      imageData = spriteCtx.getImageData(0, 0, sprite.width, sprite.height);
    } catch {
      return sprite;
    }
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a === 0) {
        continue;
      }
      if (g > minGreen && g - r > deltaR && g - b > deltaB) {
        const dark = Math.max(18, Math.min(92, Math.round((r + b) * 0.45)));
        data[i] = dark;
        data[i + 1] = dark;
        data[i + 2] = dark;
      }
    }
    spriteCtx.putImageData(imageData, 0, 0);
    return sprite;
  }

  makeTileSeamless(sprite) {
    if (!sprite) {
      return sprite;
    }
    const spriteCtx = sprite.getContext("2d", { alpha: true });
    if (!spriteCtx || sprite.width < 2 || sprite.height < 2) {
      return sprite;
    }
    let imageData;
    try {
      imageData = spriteCtx.getImageData(0, 0, sprite.width, sprite.height);
    } catch {
      return sprite;
    }

    const data = imageData.data;
    const w = sprite.width;
    const h = sprite.height;
    const copyPixel = (srcX, srcY, dstX, dstY) => {
      const src = (srcY * w + srcX) * 4;
      const dst = (dstY * w + dstX) * 4;
      data[dst] = data[src];
      data[dst + 1] = data[src + 1];
      data[dst + 2] = data[src + 2];
      data[dst + 3] = data[src + 3];
    };

    for (let y = 0; y < h; y++) {
      copyPixel(0, y, w - 1, y);
    }
    for (let x = 0; x < w; x++) {
      copyPixel(x, 0, x, h - 1);
    }
    copyPixel(0, 0, w - 1, h - 1);

    spriteCtx.putImageData(imageData, 0, 0);
    return sprite;
  }

  buildMirroredPatch(destX, destY, w, h) {
    const patch = document.createElement("canvas");
    patch.width = w;
    patch.height = h;
    const patchCtx = patch.getContext("2d", { alpha: true });
    patchCtx.imageSmoothingEnabled = false;
    const sourceX = this.width - destX - w;
    patchCtx.save();
    patchCtx.translate(w, 0);
    patchCtx.scale(-1, 1);
    patchCtx.drawImage(this.referenceLayer, sourceX, destY, w, h, 0, 0, w, h);
    patchCtx.restore();
    return patch;
  }

  drawTiledBackdrop(ctx, rect, fillColor, palette, shadeDark) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
    ctx.clip();

    ctx.fillStyle = fillColor;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

    const patch = 64;
    const sub = 16;
    for (let y = rect.y; y < rect.y + rect.h; y += patch) {
      for (let x = rect.x; x < rect.x + rect.w; x += patch) {
        const tileX = Math.floor(x / patch);
        const tileY = Math.floor(y / patch);
        const seed = tileX * 17 + tileY * 31;
        ctx.fillStyle = palette[Math.abs(seed) % palette.length];
        ctx.fillRect(x, y, patch, patch);

        for (let sy = 0; sy < patch; sy += sub) {
          for (let sx = 0; sx < patch; sx += sub) {
            const tone = Math.abs(seed + sx / sub + (sy / sub) * 3) % palette.length;
            ctx.fillStyle = palette[tone];
            ctx.fillRect(x + sx, y + sy, sub, sub);
          }
        }

        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillRect(x, y, patch, 4);
        ctx.fillRect(x, y, 4, patch);
        ctx.fillStyle = shadeDark;
        ctx.fillRect(x, y + patch - 4, patch, 4);
        ctx.fillRect(x + patch - 4, y, 4, patch);
      }
    }

    ctx.restore();
  }

  drawGrassBackdrop(ctx, rect) {
    const boardTheme = CURRENT_THEME.board || {};
    this.drawTiledBackdrop(
      ctx,
      rect,
      boardTheme.fill || BOARD_FILL_COLOR,
      boardTheme.grassPalette || ["#6a9f35", "#72aa3a", "#7bb642", "#5f9430", "#89c84b"],
      boardTheme.grassShade || "rgba(28, 52, 14, 0.16)"
    );
  }

  drawDirtBackdrop(ctx, rect) {
    const boardTheme = CURRENT_THEME.board || {};
    this.drawTiledBackdrop(
      ctx,
      rect,
      boardTheme.dirtFill || "#b98c5e",
      boardTheme.dirtPalette || ["#b18052", "#ba8a5b", "#c89a67", "#a9784a", "#d1a874"],
      boardTheme.dirtShade || "rgba(64, 40, 22, 0.2)"
    );
  }

  drawViewportBackdrop(ctx) {
    const worldRect = {
      x: -this.viewportOffsetX / this.viewportScale,
      y: -this.viewportOffsetY / this.viewportScale,
      w: this.screenWidth / this.viewportScale,
      h: this.screenHeight / this.viewportScale,
    };
    this.drawGrassBackdrop(ctx, worldRect);
  }

  updateViewportTransform() {
    const scaleX = this.screenWidth / this.width;
    const scaleY = this.screenHeight / this.height;
    this.viewportScale = Math.max(0.0001, Math.min(scaleX, scaleY));
    this.viewportOffsetX = Math.round((this.screenWidth - this.width * this.viewportScale) * 0.5);
    this.viewportOffsetY = Math.round((this.screenHeight - this.height * this.viewportScale) * 0.5);
  }

  restart() {
    if (!this.referenceImage.complete) {
      this.gameState = "loading";
      this.invalidate(false);
      return;
    }

    this.blocks = this.createBlocksFromReference();
    this.blocksBySpiral = this.blocks.slice().sort((a, b) => a.spiralIndex - b.spiralIndex);
    this.units = [];
    this.projectiles = [];
    this.particles = [];
    this.impactRings = [];
    this.blockWaves = [];
    this.slotBursts = [];
    this.floatTexts = [];
    this.confetti = [];
    this.cards = this.cardManager.resetFromBlocks(this.blocks);
    this.slotManager.reset();
    this.setWagonIdle();
    this.cameraZoom = 1;
    this.cameraZoomTarget = 1;
    this.cameraShakeTime = 0;
    this.cameraShakeDuration = 0;
    this.cameraShakeAmp = 0;
    this.cameraShakeX = 0;
    this.cameraShakeY = 0;
    this.successStreak = 0;
    this.streakTimer = 0;
    this.victoryConfettiTime = 0;
    this.victoryFloatTime = 0;
    this.victoryConfettiSpawnCarry = 0;
    this.levelStartFade = 1;
    this.losePopupAppear = 1;

    this.gameState = "playing";
    this.remainingBlocks = this.blocks.length;
    this.loseCloseRect = this.getLoseCloseRect();
    this.lastTimestamp = performance.now();
    this.invalidate(true);
  }

  createBlocksFromReference() {
    const blocks = [];
    let id = 0;

    for (let row = 0; row < LAYOUT.fieldRows; row++) {
      for (let col = 0; col < LAYOUT.fieldCols; col++) {
        id += 1;
        const blockColor = this.getCellColor(col, row);
        const block = new Block(id, col, row, blockColor);
        const key = `${col},${row}`;
        if (this.spiralOrderByCell.has(key)) {
          block.spiralIndex = this.spiralOrderByCell.get(key);
        }
        blocks.push(block);
      }
    }

    return blocks;
  }

  buildSpiralOrderMap(cols, rows) {
    const orderByCell = new Map();
    const total = cols * rows;
    let order = 0;
    let x = Math.floor((cols - 1) / 2);
    let y = Math.floor((rows - 1) / 2);
    const dirs = [
      [1, 0],
      [0, -1],
      [-1, 0],
      [0, 1],
    ];

    const pushCell = (col, row) => {
      if (col < 0 || row < 0 || col >= cols || row >= rows) {
        return;
      }
      const key = `${col},${row}`;
      if (orderByCell.has(key)) {
        return;
      }
      orderByCell.set(key, order);
      order += 1;
    };

    pushCell(x, y);
    let stepLength = 1;
    let dirIndex = 0;
    while (order < total) {
      for (let turn = 0; turn < 2; turn++) {
        const [dx, dy] = dirs[dirIndex % dirs.length];
        for (let step = 0; step < stepLength; step++) {
          x += dx;
          y += dy;
          pushCell(x, y);
          if (order >= total) {
            break;
          }
        }
        dirIndex += 1;
        if (order >= total) {
          break;
        }
      }
      stepLength += 1;
    }

    return orderByCell;
  }

  createCardsFromBlocks() {
    this.cards = this.cardManager.createFromBlocks(this.blocks);
    return this.cards;
  }

  setQueueCardCount(count) {
    const nextCount = clamp(Math.round(Number(count) || BOTTOM_QUEUE_CARD_COUNT), MIN_QUEUE_CARDS, MAX_QUEUE_CARDS);
    BOTTOM_QUEUE_CARD_COUNT = nextCount;
    const changed = this.cardManager.setQueueCardCount(nextCount);
    if (changed && this.referenceImage.complete) {
      this.restart();
    }
    return changed;
  }

  getViewportAdaptiveTuning() {
    const vw = Math.max(1, window.innerWidth || this.canvas.clientWidth || LOGICAL_WIDTH);
    const vh = Math.max(1, window.innerHeight || this.canvas.clientHeight || LOGICAL_HEIGHT);
    const isPortrait = vh >= vw;
    const isMobileLike = vw <= 920 || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches && vw <= 1100);
    if (!isMobileLike) {
      return {
        playfieldScaleMul: 1,
        topUiYOffsetAdd: 0,
        trackYOffsetAdd: 0,
        slotYOffsetAdd: 0,
        cardYOffsetAllAdd: 0,
        cardOffsetMul: 1,
        backButtonScaleMul: 1,
        topLevelPanelScaleMul: 1,
        topCoinsPanelScaleMul: 1,
      };
    }

    const shortSide = Math.min(vw, vh);
    const compactness = clamp((430 - shortSide) / 210, 0, 1);
    if (isPortrait) {
      return {
        playfieldScaleMul: 1.1 + compactness * 0.1,
        topUiYOffsetAdd: -26 - compactness * 18,
        trackYOffsetAdd: -24 - compactness * 22,
        slotYOffsetAdd: -24 - compactness * 22,
        cardYOffsetAllAdd: -132 - compactness * 68,
        cardOffsetMul: 0.34,
        backButtonScaleMul: 1.08,
        topLevelPanelScaleMul: 0.94,
        topCoinsPanelScaleMul: 0.98,
      };
    }

    return {
      playfieldScaleMul: 1.03,
      topUiYOffsetAdd: -12,
      trackYOffsetAdd: -10,
      slotYOffsetAdd: -10,
      cardYOffsetAllAdd: -48,
      cardOffsetMul: 0.7,
      backButtonScaleMul: 1.04,
      topLevelPanelScaleMul: 0.96,
      topCoinsPanelScaleMul: 0.98,
    };
  }

  applyDebugLayout() {
    const tuning = this.getViewportAdaptiveTuning();
    const effectiveTopUiYOffset = TOP_UI_Y_OFFSET + tuning.topUiYOffsetAdd;
    const effectiveTrackYOffset = TRACK_Y_OFFSET + tuning.trackYOffsetAdd;
    const effectiveSlotYOffset = SLOT_Y_OFFSET + tuning.slotYOffsetAdd;
    const effectiveCardYOffsetAll = CARD_Y_OFFSET_ALL + tuning.cardYOffsetAllAdd;
    const effectiveCardOffsetMul = tuning.cardOffsetMul;
    const effectivePlayfieldScale = PLAYFIELD_SCALE * tuning.playfieldScaleMul;
    const effectiveBackButtonScale = BACK_BUTTON_SCALE * tuning.backButtonScaleMul;
    const effectiveTopLevelPanelScale = TOP_LEVEL_PANEL_SCALE * tuning.topLevelPanelScaleMul;
    const effectiveTopCoinsPanelScale = TOP_COINS_PANEL_SCALE * tuning.topCoinsPanelScaleMul;

    BACK_BUTTON_UI.y = Math.round(BASE_TOP_UI.backY + effectiveTopUiYOffset);
    TIMER_PANEL_UI.y = Math.round(BASE_TOP_UI.timerY + effectiveTopUiYOffset);
    COINS_UI.panelY = Math.round(BASE_TOP_UI.coinsY + effectiveTopUiYOffset);

    TIMER_PANEL_UI.w = Math.round(BASE_TOP_UI.timerW * effectiveTopLevelPanelScale);
    TIMER_PANEL_UI.h = Math.round(BASE_TOP_UI.timerH * effectiveTopLevelPanelScale);
    COINS_UI.panelW = Math.round(BASE_TOP_UI.coinsW * effectiveTopCoinsPanelScale);
    COINS_UI.panelH = Math.round(BASE_TOP_UI.coinsH * effectiveTopCoinsPanelScale);
    this.backButtonRect.y = BACK_BUTTON_UI.y;
    this.backButtonRect.w = Math.round(BASE_TOP_UI.backW * effectiveBackButtonScale);
    this.backButtonRect.h = Math.round(BASE_TOP_UI.backH * effectiveBackButtonScale);
    this.restartButtonRect = this.getRestartButtonRect();

    const baseTrackCenterX = BASE_LAYOUT.track.x + BASE_LAYOUT.track.w * 0.5;
    const baseTrackCenterY = BASE_LAYOUT.track.y + BASE_LAYOUT.track.h * 0.5 + effectiveTrackYOffset;
    LAYOUT.track.w = Math.max(120, Math.round(BASE_LAYOUT.track.w * effectivePlayfieldScale));
    LAYOUT.track.h = Math.max(120, Math.round(BASE_LAYOUT.track.h * effectivePlayfieldScale));
    LAYOUT.track.r = Math.max(10, Math.round(BASE_LAYOUT.track.r * effectivePlayfieldScale));
    LAYOUT.track.x = Math.round(baseTrackCenterX - LAYOUT.track.w * 0.5);
    LAYOUT.track.y = Math.round(baseTrackCenterY - LAYOUT.track.h * 0.5);
    const baseSpawnOffsetX = BASE_LAYOUT.spawnPoint.x - baseTrackCenterX;
    const baseSpawnOffsetY = BASE_LAYOUT.spawnPoint.y - (BASE_LAYOUT.track.y + BASE_LAYOUT.track.h * 0.5);
    LAYOUT.spawnPoint.x = Math.round(baseTrackCenterX + baseSpawnOffsetX * effectivePlayfieldScale);
    LAYOUT.spawnPoint.y = Math.round(baseTrackCenterY + baseSpawnOffsetY * effectivePlayfieldScale);
    this.conveyor.setTrackRect(LAYOUT.track, LAYOUT.spawnPoint);

    const totalFieldScale = effectivePlayfieldScale * FIELD_SCALE;
    LAYOUT.fieldStep = Math.max(12, Math.round(BASE_LAYOUT.fieldStep * totalFieldScale));
    LAYOUT.cellSize = Math.max(10, Math.round(BASE_LAYOUT.cellSize * totalFieldScale));
    const baseFieldCenterX = BASE_LAYOUT.fieldX + (BASE_LAYOUT.fieldCols * BASE_LAYOUT.fieldStep) * 0.5;
    const baseFieldCenterY = BASE_LAYOUT.fieldY + (BASE_LAYOUT.fieldRows * BASE_LAYOUT.fieldStep) * 0.5;
    const shiftedFieldCenterY = baseFieldCenterY + effectiveTrackYOffset;
    const fieldW = BASE_LAYOUT.fieldCols * LAYOUT.fieldStep;
    const fieldH = BASE_LAYOUT.fieldRows * LAYOUT.fieldStep;
    LAYOUT.fieldX = Math.round(baseFieldCenterX - fieldW * 0.5);
    LAYOUT.fieldY = Math.round(shiftedFieldCenterY - fieldH * 0.5);

    for (const block of this.blocks) {
      block.x = LAYOUT.fieldX + block.col * LAYOUT.fieldStep;
      block.y = LAYOUT.fieldY + block.row * LAYOUT.fieldStep;
      block.size = LAYOUT.cellSize;
    }

    for (let i = 0; i < LAYOUT.slots.length; i++) {
      const baseSlot = BASE_LAYOUT.slots[i];
      const slot = LAYOUT.slots[i];
      if (!baseSlot || !slot) {
        continue;
      }
      const w = Math.max(90, Math.round(baseSlot.w * SLOT_SIZE_SCALE));
      const h = Math.max(72, Math.round(baseSlot.h * SLOT_SIZE_SCALE));
      const centerX = baseSlot.x + baseSlot.w * 0.5;
      const centerY = baseSlot.y + baseSlot.h * 0.5 + effectiveSlotYOffset;
      slot.w = w;
      slot.h = h;
      slot.x = Math.round(centerX - w * 0.5);
      slot.y = Math.round(centerY - h * 0.5);
    }

    const dynamicCardLayouts = BASE_LAYOUT.cards.map((baseCard, index) => ({
      ...baseCard,
      y: Math.round(baseCard.y + effectiveCardYOffsetAll + getCardYOffsetByIndex(index) * effectiveCardOffsetMul),
    }));
    this.cardManager.setBaseLayouts(dynamicCardLayouts);
    this.cardManager.setQueueCardCount(this.cardManager.queueCardCount);
    this.cards = this.cardManager.normalizeQueues(this.cards);

    this.invalidate(false);
  }

  getValidLevelId(levelId) {
    const normalized = String(levelId || "");
    return this.availableLevels.some((level) => level.id === normalized) ? normalized : DEFAULT_LEVEL_ID;
  }

  getValidThemeId(themeId) {
    const normalized = String(themeId || "");
    return this.availableThemes.some((theme) => theme.id === normalized) ? normalized : DEFAULT_THEME_ID;
  }

  setImageSource(image, nextSrc) {
    if (!image || !nextSrc || image.src.endsWith(nextSrc)) {
      return false;
    }
    image.src = nextSrc;
    return true;
  }

  applyLevelConfig(levelId, options = {}) {
    const { restart = true } = options;
    const nextLevelId = this.getValidLevelId(levelId);
    syncLevelGlobals(getLevelConfig(nextLevelId));
    this.currentLevelId = nextLevelId;
    this.spiralOrderByCell = this.buildSpiralOrderMap(LAYOUT.fieldCols, LAYOUT.fieldRows);
    this.conveyor.setTrackRect(LAYOUT.track, LAYOUT.spawnPoint);
    this.cardManager = new CardManager(LAYOUT.cards, BOTTOM_QUEUE_CARD_COUNT);
    this.slotManager = new SlotManager(LAYOUT.slots, SLOT_CLAIM_ORDER);
    this.cards = [];
    this.blocks = [];
    this.blocksBySpiral = [];
    this.setWagonIdle();
    this.applyDebugLayout();
    if (restart && this.referenceImage.complete) {
      this.restart();
    }
    this.invalidate(false);
  }

  applyThemeConfig(themeId, options = {}) {
    const { restart = true } = options;
    const nextThemeId = this.getValidThemeId(themeId);
    syncThemeGlobals(getThemeConfig(nextThemeId));
    this.currentThemeId = nextThemeId;

    const nextReference = getThemeAsset("referenceImage", "Ref.png");
    const referenceChanged = this.setImageSource(this.referenceImage, nextReference);
    this.setImageSource(this.backButtonImage, getThemeAsset("backButton", "ui/back_button.png"));
    this.setImageSource(this.timerPanelImage, getThemeAsset("timerPanel", "ui/timer_panel.png"));
    this.setImageSource(this.restartButtonImage, getThemeAsset("restartButton", "ui/restart_button.png"));
    this.setImageSource(this.losePopupImage, getThemeAsset("losePopup", "ui/lose_popup_ref.png"));

    if (referenceChanged) {
      this.gameState = "loading";
      this.invalidate(false);
      return;
    }

    if (!referenceChanged) {
      if (this.referenceImage.complete) {
        this.buildReferenceAssets();
      }
      if (restart && this.referenceImage.complete) {
        this.restart();
      }
      this.invalidate(false);
    }
  }

  applyContentConfig(levelId, themeId, options = {}) {
    const { restart = true } = options;
    this.applyThemeConfig(themeId, { restart: false });
    this.applyLevelConfig(levelId, { restart });
  }

  getDebugSettingsState() {
    return {
      shotBounceAmount: SHOT_BOUNCE_AMOUNT,
      shotBounceSpeed: SHOT_BOUNCE_SPEED,
      trackUnitSpeed: TRACK_UNIT_SPEED,
      queueCardCount: BOTTOM_QUEUE_CARD_COUNT,
      topPanelFontSize: TOP_PANEL_FONT_SIZE,
      topLevelPanelScale: TOP_LEVEL_PANEL_SCALE,
      topCoinsPanelScale: TOP_COINS_PANEL_SCALE,
      backButtonScale: BACK_BUTTON_SCALE,
      trackYOffset: TRACK_Y_OFFSET,
      fieldScale: FIELD_SCALE,
      playfieldScale: PLAYFIELD_SCALE,
      slotSizeScale: SLOT_SIZE_SCALE,
      slotYOffset: SLOT_Y_OFFSET,
      topUiYOffset: TOP_UI_Y_OFFSET,
      cardYOffsetAll: CARD_Y_OFFSET_ALL,
      cardYOffset1: CARD_Y_OFFSET_1,
      cardYOffset2: CARD_Y_OFFSET_2,
      cardYOffset3: CARD_Y_OFFSET_3,
      cardYOffset4: CARD_Y_OFFSET_4,
      levelId: this.getValidLevelId(this.currentLevelId),
      themeId: this.getValidThemeId(this.currentThemeId),
    };
  }

  applyDebugSettings(settings) {
    SHOT_BOUNCE_AMOUNT = clamp(Number(settings.shotBounceAmount ?? DEBUG_DEFAULTS.shotBounceAmount), 0.05, 0.7);
    SHOT_BOUNCE_SPEED = clamp(Number(settings.shotBounceSpeed ?? DEBUG_DEFAULTS.shotBounceSpeed), 0.4, 2.6);
    TRACK_UNIT_SPEED = clamp(Number(settings.trackUnitSpeed ?? DEBUG_DEFAULTS.trackUnitSpeed), 420, 1400);
    BOTTOM_QUEUE_CARD_COUNT = clamp(
      Math.round(Number(settings.queueCardCount ?? DEBUG_DEFAULTS.queueCardCount)),
      MIN_QUEUE_CARDS,
      MAX_QUEUE_CARDS
    );
    TOP_PANEL_FONT_SIZE = clamp(Number(settings.topPanelFontSize ?? DEBUG_DEFAULTS.topPanelFontSize), 24, 80);
    TOP_LEVEL_PANEL_SCALE = clamp(Number(settings.topLevelPanelScale ?? DEBUG_DEFAULTS.topLevelPanelScale), 0.6, 1.8);
    TOP_COINS_PANEL_SCALE = clamp(Number(settings.topCoinsPanelScale ?? DEBUG_DEFAULTS.topCoinsPanelScale), 0.6, 1.8);
    BACK_BUTTON_SCALE = clamp(Number(settings.backButtonScale ?? DEBUG_DEFAULTS.backButtonScale), 0.6, 1.8);
    TRACK_Y_OFFSET = clamp(Number(settings.trackYOffset ?? DEBUG_DEFAULTS.trackYOffset), -220, 260);
    FIELD_SCALE = clamp(Number(settings.fieldScale ?? DEBUG_DEFAULTS.fieldScale), 0.65, 1.5);
    PLAYFIELD_SCALE = clamp(Number(settings.playfieldScale ?? DEBUG_DEFAULTS.playfieldScale), 0.7, 1.5);
    SLOT_SIZE_SCALE = clamp(Number(settings.slotSizeScale ?? DEBUG_DEFAULTS.slotSizeScale), 0.6, 1.7);
    SLOT_Y_OFFSET = clamp(Number(settings.slotYOffset ?? DEBUG_DEFAULTS.slotYOffset), -220, 260);
    TOP_UI_Y_OFFSET = clamp(Number(settings.topUiYOffset ?? DEBUG_DEFAULTS.topUiYOffset), -60, 220);
    CARD_Y_OFFSET_ALL = clamp(Number(settings.cardYOffsetAll ?? DEBUG_DEFAULTS.cardYOffsetAll), -260, 260);
    CARD_Y_OFFSET_1 = clamp(Number(settings.cardYOffset1 ?? DEBUG_DEFAULTS.cardYOffset1), -260, 260);
    CARD_Y_OFFSET_2 = clamp(Number(settings.cardYOffset2 ?? DEBUG_DEFAULTS.cardYOffset2), -260, 260);
    CARD_Y_OFFSET_3 = clamp(Number(settings.cardYOffset3 ?? DEBUG_DEFAULTS.cardYOffset3), -260, 260);
    CARD_Y_OFFSET_4 = clamp(Number(settings.cardYOffset4 ?? DEBUG_DEFAULTS.cardYOffset4), -260, 260);
    this.currentLevelId = this.getValidLevelId(settings.levelId ?? DEBUG_DEFAULTS.levelId);
    this.currentThemeId = this.getValidThemeId(settings.themeId ?? DEBUG_DEFAULTS.themeId);
  }

  loadDebugSettings() {
    try {
      let raw = window.localStorage.getItem(DEBUG_STORAGE_KEY);
      if (!raw) {
        for (const key of DEBUG_STORAGE_KEYS_FALLBACK) {
          raw = window.localStorage.getItem(key);
          if (raw) {
            break;
          }
        }
      }
      if (!raw) {
        const fromHash = readDebugStateFromHash();
        if (fromHash) {
          this.applyDebugSettings({
            ...DEBUG_DEFAULTS,
            ...fromHash,
          });
          this.applyContentConfig(this.currentLevelId, this.currentThemeId, { restart: false });
          this.saveDebugSettings();
          return;
        }

        this.applyDebugSettings(DEBUG_DEFAULTS);
        this.applyContentConfig(this.currentLevelId, this.currentThemeId, { restart: false });
        return;
      }
      const parsed = JSON.parse(raw);
      this.applyDebugSettings({
        ...DEBUG_DEFAULTS,
        ...(parsed || {}),
      });
      this.applyContentConfig(this.currentLevelId, this.currentThemeId, { restart: false });
      this.ensurePlayfieldScaleMigration();
      this.saveDebugSettings();
    } catch {
      this.applyDebugSettings(DEBUG_DEFAULTS);
      this.applyContentConfig(this.currentLevelId, this.currentThemeId, { restart: false });
      this.ensurePlayfieldScaleMigration();
    }
  }

  ensurePlayfieldScaleMigration() {
    try {
      const migrated = window.localStorage.getItem(PLAYFIELD_SCALE_MIGRATION_KEY);
      if (migrated === "1") {
        return;
      }
      PLAYFIELD_SCALE = DEBUG_DEFAULTS.playfieldScale;
      this.applyDebugLayout();
      window.localStorage.setItem(PLAYFIELD_SCALE_MIGRATION_KEY, "1");
    } catch {
      // Ignore storage errors.
    }
  }

  saveDebugSettings() {
    if (this.suppressDebugSave) {
      return;
    }
    const state = this.getDebugSettingsState();
    const encoded = encodeDebugState(state);
    if (encoded) {
      const nextHash = `#dbg=${encoded}`;
      if (window.location.hash !== nextHash) {
        try {
          history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
        } catch {
          try {
            window.location.hash = nextHash;
          } catch {
            // Ignore hash update errors; localStorage save below is still authoritative.
          }
        }
      }
    }
    try {
      window.localStorage.setItem(DEBUG_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors in private/file-restricted contexts.
    }
  }

  clearDebugSettings() {
    try {
      if (window.location.hash.startsWith("#dbg=")) {
        try {
          history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
        } catch {
          try {
            window.location.hash = "";
          } catch {
            // Ignore hash cleanup errors.
          }
        }
      }
      window.localStorage.removeItem(DEBUG_STORAGE_KEY);
      for (const key of DEBUG_STORAGE_KEYS_FALLBACK) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignore storage errors in private/file-restricted contexts.
    }
  }

  syncDebugInputsFromState() {
    const pairs = [
      [this.shotBounceSizeInput, SHOT_BOUNCE_AMOUNT],
      [this.shotBounceSpeedInput, SHOT_BOUNCE_SPEED],
      [this.railSpeedInput, TRACK_UNIT_SPEED],
      [this.queueCardsInput, BOTTOM_QUEUE_CARD_COUNT],
      [this.topPanelFontSizeInput, TOP_PANEL_FONT_SIZE],
      [this.levelPanelScaleInput, TOP_LEVEL_PANEL_SCALE],
      [this.coinsPanelScaleInput, TOP_COINS_PANEL_SCALE],
      [this.backButtonScaleInput, BACK_BUTTON_SCALE],
      [this.trackYOffsetInput, TRACK_Y_OFFSET],
      [this.fieldScaleInput, FIELD_SCALE],
      [this.playfieldScaleInput, PLAYFIELD_SCALE],
      [this.slotSizeScaleInput, SLOT_SIZE_SCALE],
      [this.slotYOffsetInput, SLOT_Y_OFFSET],
      [this.topUiYOffsetInput, TOP_UI_Y_OFFSET],
      [this.cardAllYOffsetInput, CARD_Y_OFFSET_ALL],
      [this.card1YOffsetInput, CARD_Y_OFFSET_1],
      [this.card2YOffsetInput, CARD_Y_OFFSET_2],
      [this.card3YOffsetInput, CARD_Y_OFFSET_3],
      [this.card4YOffsetInput, CARD_Y_OFFSET_4],
    ];
    for (const [input, value] of pairs) {
      if (!input) {
        continue;
      }
      input.value = String(value);
      input.dispatchEvent(new Event("input"));
    }
  }

  resetDebugSettings() {
    this.suppressDebugSave = true;
    this.applyDebugSettings(DEBUG_DEFAULTS);
    this.applyContentConfig(this.currentLevelId, this.currentThemeId, { restart: false });
    this.syncDebugInputsFromState();
    this.syncDebugContentSelectors();
    this.suppressDebugSave = false;
    this.clearDebugSettings();
    this.applyDebugLayout();
    this.invalidate(false);
  }

  normalizeShooterQueues(cards) {
    this.cards = this.cardManager.normalizeQueues(cards);
    return this.cards;
  }

  isFrontRowCard(card) {
    return this.cardManager.isFrontRowCard(card);
  }

  getFrontLaneIds() {
    return this.cardManager.getFrontLaneIds();
  }

  getActiveFrontCardInLane(lane) {
    return this.cardManager.getActiveFrontCardInLane(lane);
  }

  getCardPigCenter(card) {
    return this.cardManager.getCardPigCenter(card);
  }

  sampleReferenceCellColor(col, row) {
    const x = Math.floor(REFERENCE_FIELD_X + col * REFERENCE_FIELD_STEP + REFERENCE_FIELD_STEP * 0.5);
    const y = Math.floor(REFERENCE_FIELD_Y + row * REFERENCE_FIELD_STEP + REFERENCE_FIELD_STEP * 0.5);
    const i = (y * this.width + x) * 4;
    const r = this.referencePixels[i];
    const g = this.referencePixels[i + 1];
    const b = this.referencePixels[i + 2];
    return g > 90 && g - r > 26 && g - b > 22 ? "green" : "black";
  }

  getCellColor(col, row) {
    const fallbackRow = FALLBACK_FIELD_PATTERN[row] || "";
    const fallbackCell = fallbackRow[col];
    if (fallbackCell === "G") {
      return "green";
    }
    if (fallbackCell === "B") {
      return "black";
    }
    if (!this.referencePixels) {
      return "black";
    }
    return this.sampleReferenceCellColor(col, row);
  }

  spawnUnit(cardIndex) {
    if (this.gameState !== "playing") {
      return false;
    }

    const activeUnitCount = this.units.reduce((count, unit) => count + (unit.alive ? 1 : 0), 0);
    if (activeUnitCount >= MAX_ACTIVE_UNITS) {
      return false;
    }
    const card = this.cards[cardIndex];
    if (!card) {
      return false;
    }
    if (!this.isSpawnAreaClear()) {
      return false;
    }
    if (!this.isFrontRowCard(card)) {
      return false;
    }
    if (card.used) {
      return false;
    }
    if (card.ammo <= 0) {
      card.used = true;
      this.normalizeShooterQueues(this.cards);
      return false;
    }

    this.unitIdCounter += 1;
    const launchFrom = {
      x: card.x + card.w * 0.5,
      y: card.y + card.h * 0.56,
    };
    const unit = new Unit(
      this.unitIdCounter,
      card.color,
      card.ammo,
      launchFrom,
      this.conveyor,
      card.styleKey,
      card.label
    );
    this.units.push(unit);
    card.used = true;
    this.invalidate(true);
    return true;
  }

  isSpawnAreaClear() {
    const spawn = this.conveyor.pointAtDistance(this.conveyor.spawnDistance);
    for (const unit of this.units) {
      if (!unit.alive) {
        continue;
      }
      if (unit.state === "launching") {
        return false;
      }
      if (unit.state !== "moving") {
        continue;
      }
      if (Math.hypot(unit.position.x - spawn.x, unit.position.y - spawn.y) < SPAWN_CLEAR_RADIUS) {
        return false;
      }
    }
    return true;
  }

  relaunchParkedUnit(unit) {
    if (!unit || !unit.alive || unit.state !== "parked" || unit.ammo <= 0 || this.gameState !== "playing") {
      return false;
    }
    if (unit.slotIndex !== null) {
      this.freeSlot(unit.slotIndex, unit.id);
      unit.slotIndex = null;
    }
    unit.state = "launching";
    unit.launchFrom = { ...unit.position };
    unit.launchTo = this.conveyor.pointAtDistance(this.conveyor.spawnDistance);
    unit.launchControl = {
      x: (unit.launchFrom.x + unit.launchTo.x) * 0.5,
      y: Math.min(unit.launchFrom.y, unit.launchTo.y) - (30 + Math.random() * 20),
    };
    unit.launchProgress = 0;
    unit.landProgress = 0;
    unit.landTo = null;
    unit.landFrom = { ...unit.launchTo };
    unit.landControl = { ...unit.landFrom };
    unit.loopDistance = 0;
    unit.distanceOnTrack = this.conveyor.spawnDistance;
    unit.cooldown = 0;
    unit.parkBounce = 0;
    unit.prevPosition = { ...unit.position };
    this.invalidate(true);
    return true;
  }

  tryRelaunchParkedUnitAt(x, y) {
    const hitRadius = PARKED_UNIT_TAP_RADIUS;
    let bestUnit = null;
    let bestDistance = Infinity;
    let bestY = -Infinity;
    for (let i = this.units.length - 1; i >= 0; i--) {
      const unit = this.units[i];
      if (!unit.alive || unit.state !== "parked" || unit.ammo <= 0) {
        continue;
      }
      const d = Math.hypot(x - unit.position.x, y - unit.position.y);
      if (d > hitRadius) {
        continue;
      }
      if (d < bestDistance || (Math.abs(d - bestDistance) < 0.0001 && unit.position.y > bestY)) {
        bestDistance = d;
        bestY = unit.position.y;
        bestUnit = unit;
      }
    }
    if (bestUnit) {
      return this.relaunchParkedUnit(bestUnit);
    }
    return false;
  }

  claimFreeSlot(unitId) {
    return this.slotManager.claim(unitId);
  }

  freeSlot(slotIndex, unitId) {
    this.slotManager.free(slotIndex, unitId);
  }

  getSlotCenter(slotIndex) {
    return this.slotManager.getCenter(slotIndex);
  }

  handleUnitReturned(unit) {
    void unit;
  }

  spawnImpactRing(x, y, color, size = 1) {
    this.impactRings.push({
      x,
      y,
      life: 0.24,
      maxLife: 0.24,
      startR: 8,
      endR: 30 + size * 18,
      color: color === "green" ? COLORS.ringGreen : COLORS.ringBlack,
      lineWidth: 3.2 - Math.min(1.6, size * 0.6),
    });
  }

  spawnSlotBurst(x, y, color) {
    this.slotBursts.push({
      x,
      y,
      life: 0.32,
      maxLife: 0.32,
      r: 10,
      maxR: 56,
      color: color === "green" ? "rgba(155, 244, 111, 0.72)" : COLORS.slotPulse,
    });
  }

  spawnFloatText(x, y, text, color = "#ffffff", scale = 1) {
    this.floatTexts.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 18,
      vy: -34,
      life: 0.58,
      maxLife: 0.58,
      text,
      color,
      scale,
    });
  }

  triggerParkedUnitFx(unit) {
    this.spawnSlotBurst(unit.position.x, unit.position.y, unit.color);
    this.spawnImpactRing(unit.position.x, unit.position.y, unit.color, 0.55);
    this.spawnParticles(unit.position.x, unit.position.y, unit.color, 11);
  }

  setWagonIdle() {
    this.wagon.distance = this.conveyor.spawnDistance;
    this.wagon.moving = false;
    this.wagon.color = null;
    const point = this.conveyor.pointAtDistance(this.wagon.distance);
    this.wagon.x = point.x;
    this.wagon.y = point.y;
  }

  startWagonRide(color, distance) {
    this.wagon.moving = true;
    this.wagon.color = color;
    this.setWagonRideDistance(distance, color);
  }

  setWagonRideDistance(distance, color) {
    this.wagon.distance = distance;
    this.wagon.moving = true;
    this.wagon.color = color;
    const point = this.conveyor.pointAtDistance(distance);
    this.wagon.x = point.x;
    this.wagon.y = point.y;
  }

  getWagonSeatPoint() {
    return {
      x: this.wagon.x + LAYOUT.wagonSprite.seatOffsetX,
      y: this.wagon.y + LAYOUT.wagonSprite.seatOffsetY,
    };
  }

  getFieldCenter() {
    return {
      x: LAYOUT.fieldX + (LAYOUT.fieldCols * LAYOUT.fieldStep) / 2,
      y: LAYOUT.fieldY + (LAYOUT.fieldRows * LAYOUT.fieldStep) / 2,
    };
  }

  getInwardShootDirection(sourcePoint) {
    const fieldWidth = LAYOUT.fieldCols * LAYOUT.fieldStep;
    const fieldHeight = LAYOUT.fieldRows * LAYOUT.fieldStep;
    const left = LAYOUT.fieldX;
    const right = left + fieldWidth;
    const top = LAYOUT.fieldY;
    const bottom = top + fieldHeight;
    const laneTolerance = LAYOUT.cellSize * 0.65;
    const alignedX = sourcePoint.x >= left - laneTolerance && sourcePoint.x <= right + laneTolerance;
    const alignedY = sourcePoint.y >= top - laneTolerance && sourcePoint.y <= bottom + laneTolerance;

    if (sourcePoint.y < top && alignedX) {
      return { x: 0, y: 1, side: "top" };
    }
    if (sourcePoint.y > bottom && alignedX) {
      return { x: 0, y: -1, side: "bottom" };
    }
    if (sourcePoint.x < left && alignedY) {
      return { x: 1, y: 0, side: "left" };
    }
    if (sourcePoint.x > right && alignedY) {
      return { x: -1, y: 0, side: "right" };
    }

    return null;
  }

  getLineHitForBlock(sourcePoint, direction, block, lineHalfWidth) {
    const center = this.blockCenter(block);
    const dx = center.x - sourcePoint.x;
    const dy = center.y - sourcePoint.y;
    const forwardDistance = dx * direction.x + dy * direction.y;
    if (forwardDistance <= 0) {
      return null;
    }
    const sideDistance = Math.abs(dx * direction.y - dy * direction.x);
    if (sideDistance > lineHalfWidth) {
      return null;
    }
    return { forwardDistance, sideDistance };
  }

  isPathBlockedByPlacedBlocks(sourcePoint, direction, targetForwardDistance, lineHalfWidth) {
    for (const block of this.blocks) {
      if (!block.alive) {
        continue;
      }
      const hit = this.getLineHitForBlock(sourcePoint, direction, block, lineHalfWidth);
      if (!hit) {
        continue;
      }
      if (hit.forwardDistance < targetForwardDistance - 0.0001) {
        return true;
      }
    }
    return false;
  }

  getNextSpiralTarget() {
    for (const block of this.blocksBySpiral) {
      if (!block.alive) {
        return block;
      }
    }
    return null;
  }

  getNextSpiralTargetForColor(color) {
    const nextTarget = this.getNextSpiralTarget();
    if (!nextTarget || nextTarget.color !== color) {
      return null;
    }
    return nextTarget;
  }

  canColorShootNextSpiralTarget(color) {
    const target = this.getNextSpiralTargetForColor(color);
    if (!target) {
      return false;
    }
    const targetCenter = this.blockCenter(target);
    const lineHalfWidth = LAYOUT.cellSize * 0.65;
    const probes = [
      {
        sourcePoint: { x: LAYOUT.fieldX - LAYOUT.cellSize, y: targetCenter.y },
        direction: { x: 1, y: 0 },
      },
      {
        sourcePoint: { x: LAYOUT.fieldX + LAYOUT.fieldCols * LAYOUT.fieldStep + LAYOUT.cellSize, y: targetCenter.y },
        direction: { x: -1, y: 0 },
      },
      {
        sourcePoint: { x: targetCenter.x, y: LAYOUT.fieldY - LAYOUT.cellSize },
        direction: { x: 0, y: 1 },
      },
      {
        sourcePoint: { x: targetCenter.x, y: LAYOUT.fieldY + LAYOUT.fieldRows * LAYOUT.fieldStep + LAYOUT.cellSize },
        direction: { x: 0, y: -1 },
      },
    ];

    for (const probe of probes) {
      const hit = this.getLineHitForBlock(probe.sourcePoint, probe.direction, target, lineHalfWidth);
      if (!hit) {
        continue;
      }
      if (this.isPathBlockedByPlacedBlocks(probe.sourcePoint, probe.direction, hit.forwardDistance, lineHalfWidth * 0.9)) {
        continue;
      }
      return true;
    }

    return false;
  }

  findTargetOnLine(sourcePoint, color, direction) {
    const lineHalfWidth = LAYOUT.cellSize * 0.65;
    const nextSpiralTarget = this.getNextSpiralTargetForColor(color);
    if (!nextSpiralTarget) {
      return null;
    }
    const targetHit = this.getLineHitForBlock(sourcePoint, direction, nextSpiralTarget, lineHalfWidth);
    if (!targetHit) {
      return null;
    }
    if (this.isPathBlockedByPlacedBlocks(sourcePoint, direction, targetHit.forwardDistance, lineHalfWidth * 0.9)) {
      return null;
    }
    return nextSpiralTarget;
  }

  hasTargetForColor(color) {
    if (!color) {
      return false;
    }
    return this.canColorShootNextSpiralTarget(color);
  }

  fireProjectile(unit, block) {
    const target = this.blockCenter(block);
    this.damageBlock(block, unit.color);

    this.projectiles.push({
      fromX: unit.position.x,
      fromY: unit.position.y,
      toX: target.x,
      toY: target.y,
      life: SHOT_TRAIL_DURATION,
      maxLife: SHOT_TRAIL_DURATION,
      color: unit.color,
    });
  }

  damageBlock(block, color) {
    if (!block || block.alive) {
      return;
    }

    block.alive = true;
    block.hitFlash = 1;
    this.remainingBlocks -= 1;

    const center = this.blockCenter(block);
    this.spawnParticles(center.x, center.y, color, 28);
    this.spawnImpactRing(center.x, center.y, color, 1.1);
    this.spawnImpactRing(center.x, center.y, color, 1.65);
    this.spawnBlockWave(center.x, center.y);

    this.successStreak += 1;
    this.streakTimer = STREAK_DECAY_TIME;
    if (this.successStreak === 3) {
      this.spawnFloatText(center.x, center.y - 18, "Nice", "#fff8c2", 1.22);
    } else if (this.successStreak === 5) {
      this.spawnFloatText(center.x, center.y - 20, "Great", "#ffe7a8", 1.34);
    } else if (this.successStreak >= 8) {
      this.spawnFloatText(center.x, center.y - 22, "Perfect", "#ffda7f", 1.48);
      this.successStreak = 4;
    }

  }

  spawnBlockWave(x, y) {
    this.blockWaves.push({
      x,
      y,
      life: 0.42,
      maxLife: 0.42,
      startR: 8,
      endR: 300,
      bandWidth: 34,
      jumpHeight: 13,
    });
    this.blockWaves.push({
      x,
      y,
      life: 0.34,
      maxLife: 0.34,
      startR: 24,
      endR: 340,
      bandWidth: 46,
      jumpHeight: 7,
    });
  }

  blockCenter(block) {
    return {
      x: block.x + block.size * 0.5,
      y: block.y + block.size * 0.5,
    };
  }

  spawnParticles(x, y, color, amount) {
    const particleColor = color === "green" ? COLORS.particleGreen : COLORS.particleBlack;
    for (let i = 0; i < amount; i++) {
      const angle = (Math.PI * 2 * i) / amount + Math.random() * 0.3;
      const speed = 36 + Math.random() * 80;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.22 + Math.random() * 0.2,
        maxLife: 0.38,
        size: 3 + Math.random() * 3,
        color: particleColor,
      });
    }
  }

  hasSpawnableSlimes() {
    if (this.units.some((unit) => unit.alive)) {
      return true;
    }
    return this.cards.some((card) => !card.used && card.ammo > 0);
  }

  checkVictoryReady() {
    if (this.gameState !== "playing") {
      return false;
    }
    if (this.remainingBlocks > 0) {
      return false;
    }
    if (this.projectiles.length > 0) {
      return false;
    }
    return !this.hasSpawnableSlimes();
  }

  startVictorySequence() {
    if (this.gameState === "victory") {
      return;
    }
    this.gameState = "victory";
    this.cameraZoomTarget = VICTORY_ZOOM_TARGET;
    this.victoryConfettiTime = VICTORY_CONFETTI_DURATION;
    this.victoryFloatTime = 0;
    this.victoryConfettiSpawnCarry = 0;
    this.units = [];
    this.projectiles = [];
    this.particles = [];
    this.impactRings = [];
    this.slotBursts = [];
    this.floatTexts = [];
    this.cameraShakeTime = 0;
    this.cameraShakeDuration = 0;
    this.cameraShakeAmp = 0;
    this.cameraShakeX = 0;
    this.cameraShakeY = 0;
    this.spawnConfettiBurst(64);
  }

  startLoseSequence() {
    if (this.gameState !== "playing") {
      return;
    }
    this.gameState = "lose";
    this.units = [];
    this.projectiles = [];
    this.particles = [];
    this.impactRings = [];
    this.blockWaves = [];
    this.slotBursts = [];
    this.floatTexts = [];
    this.slotManager.reset();
    for (const block of this.blocks) {
      block.hitFlash = 0;
    }
    this.successStreak = 0;
    this.streakTimer = 0;
    this.losePopupAppear = 0;
    this.loseCloseRect = this.getLoseCloseRect();
    this.invalidate(true);
  }

  triggerDebug6() {
    if (!this.referenceImage.complete || this.blocks.length === 0) {
      return false;
    }

    for (const block of this.blocks) {
      block.alive = true;
      block.hitFlash = 0;
    }
    for (const card of this.cards) {
      card.used = true;
      card.ammo = 0;
    }

    this.remainingBlocks = 0;
    this.units = [];
    this.projectiles = [];
    this.particles = [];
    this.impactRings = [];
    this.slotBursts = [];
    this.floatTexts = [];
    this.successStreak = 0;
    this.streakTimer = 0;

    if (this.gameState !== "victory") {
      this.startVictorySequence();
    } else {
      this.victoryConfettiTime = VICTORY_CONFETTI_DURATION;
      this.victoryConfettiSpawnCarry = 0;
      this.spawnConfettiBurst(64);
    }
    this.invalidate(true);
    return true;
  }

  spawnConfettiBurst(amount) {
    for (let i = 0; i < amount; i++) {
      const x = Math.random() * this.width;
      const y = -16 - Math.random() * 74;
      const angle = Math.PI / 2 + (Math.random() - 0.5) * 1.4;
      const speed = 90 + Math.random() * 180;
      this.confetti.push({
        x,
        y,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 50,
        vy: Math.sin(angle) * speed + 40 + Math.random() * 90,
        size: 16 + Math.random() * 18,
        color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 6,
        life: 6 + Math.random() * 2.5,
        maxLife: 8.5,
      });
    }
  }

  updateConfetti(dt) {
    this.confetti = this.confetti
      .map((piece) => ({
        ...piece,
        x: piece.x + piece.vx * dt,
        y: piece.y + piece.vy * dt,
        vx: piece.vx * 0.997,
        vy: piece.vy + 280 * dt,
        rotation: piece.rotation + piece.spin * dt,
        life: piece.life - dt,
      }))
      .filter((piece) => piece.life > 0 && piece.y < this.height + 80);
  }

  update(dt) {
    if (this.levelStartFade > 0) {
      this.levelStartFade = Math.max(0, this.levelStartFade - dt / LEVEL_START_FADE_DURATION);
    }

    if (this.gameState === "victory") {
      this.victoryConfettiTime = Math.max(0, this.victoryConfettiTime - dt);
      this.victoryConfettiSpawnCarry += dt * VICTORY_CONFETTI_RATE;
      const spawnNow = Math.floor(this.victoryConfettiSpawnCarry);
      if (spawnNow > 0) {
        this.victoryConfettiSpawnCarry -= spawnNow;
        this.spawnConfettiBurst(spawnNow);
      }
      this.victoryFloatTime += dt;
      this.updateConfetti(dt);
      this.cameraZoom += (this.cameraZoomTarget - this.cameraZoom) * Math.min(1, dt * VICTORY_ZOOM_SPEED);
      this.cameraShakeTime = 0;
      this.cameraShakeX = 0;
      this.cameraShakeY = 0;
      return;
    }
    if (this.gameState === "lose") {
      this.losePopupAppear = Math.min(1, this.losePopupAppear + dt / LOSE_POPUP_ANIM_DURATION);
      return;
    }

    if (this.streakTimer > 0) {
      this.streakTimer = Math.max(0, this.streakTimer - dt);
      if (this.streakTimer <= 0) {
        this.successStreak = 0;
      }
    }

    for (const block of this.blocks) {
      block.update(dt);
    }

    for (const unit of this.units) {
      unit.update(dt, this);
    }
    this.units = this.units.filter((unit) => unit.alive);

    this.projectiles = this.projectiles
      .map((projectile) => ({
        ...projectile,
        life: projectile.life - dt,
      }))
      .filter((projectile) => projectile.life > 0);

    this.particles = this.particles
      .map((particle) => ({
        ...particle,
        x: particle.x + particle.vx * dt,
        y: particle.y + particle.vy * dt,
        vx: particle.vx * 0.95,
        vy: particle.vy * 0.95 + 22 * dt,
        life: particle.life - dt,
      }))
      .filter((particle) => particle.life > 0);

    this.impactRings = this.impactRings
      .map((ring) => ({
        ...ring,
        life: ring.life - dt,
      }))
      .filter((ring) => ring.life > 0);

    this.blockWaves = this.blockWaves
      .map((wave) => ({
        ...wave,
        life: wave.life - dt,
      }))
      .filter((wave) => wave.life > 0);

    this.slotBursts = this.slotBursts
      .map((burst) => ({
        ...burst,
        life: burst.life - dt,
      }))
      .filter((burst) => burst.life > 0);

    this.floatTexts = this.floatTexts
      .map((text) => ({
        ...text,
        x: text.x + text.vx * dt,
        y: text.y + text.vy * dt,
        vy: text.vy * 0.96,
        life: text.life - dt,
      }))
      .filter((text) => text.life > 0);

    if (this.checkVictoryReady()) {
      this.startVictorySequence();
    }

    this.updateConfetti(dt);
    this.cameraZoom += (this.cameraZoomTarget - this.cameraZoom) * Math.min(1, dt * VICTORY_ZOOM_SPEED);
  }

  drawLoading(ctx) {
    ctx.fillStyle = "#214113";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = COLORS.white;
    ctx.font = "700 42px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const source = getThemeAsset("referenceImage", "Ref.png").split("/").pop() || "Ref.png";
    const label = this.gameState === "error" ? `${source} failed to load` : `Loading ${source}...`;
    ctx.fillText(label, this.width / 2, this.height / 2);
  }

  drawBackground(ctx) {
    const trackTheme = CURRENT_THEME.track || {};
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, this.width, this.height);
    const board = LAYOUT.boardMask;

    this.drawGrassBackdrop(ctx, board);

    // Wood ring around track.
    const outerWood = {
      x: LAYOUT.track.x - 40,
      y: LAYOUT.track.y - 40,
      w: LAYOUT.track.w + 80,
      h: LAYOUT.track.h + 80,
      r: LAYOUT.track.r + 36,
    };
    const innerWood = {
      x: LAYOUT.track.x + 40,
      y: LAYOUT.track.y + 40,
      w: LAYOUT.track.w - 80,
      h: LAYOUT.track.h - 80,
      r: Math.max(8, LAYOUT.track.r - 34),
    };
    ctx.save();
    ctx.shadowColor = COLORS.sceneShadow;
    ctx.shadowBlur = 36;
    ctx.shadowOffsetY = 14;
    ctx.beginPath();
    roundedRect(ctx, outerWood.x, outerWood.y, outerWood.w, outerWood.h, outerWood.r);
    roundedRect(ctx, innerWood.x, innerWood.y, innerWood.w, innerWood.h, innerWood.r);
    const woodGrad = ctx.createLinearGradient(0, outerWood.y, 0, outerWood.y + outerWood.h);
    const woodStops = trackTheme.woodGradient || ["#9f6e34", "#6f451f", "#a47539"];
    woodGrad.addColorStop(0, woodStops[0] || "#9f6e34");
    woodGrad.addColorStop(0.5, woodStops[1] || woodStops[0] || "#6f451f");
    woodGrad.addColorStop(1, woodStops[2] || woodStops[1] || "#a47539");
    ctx.fillStyle = woodGrad;
    // roundedRect() starts a new path internally, so fill the outer wood first...
    ctx.fill();
    ctx.restore();

    // Fill inside the rails using the same tiled style as the outer backdrop, but brown.
    ctx.save();
    roundedRect(ctx, innerWood.x, innerWood.y, innerWood.w, innerWood.h, innerWood.r);
    ctx.clip();
    this.drawDirtBackdrop(ctx, innerWood);
    ctx.restore();

    // Sleepers along the path.
    for (let d = 0; d < this.conveyor.totalLength; d += 26) {
      const p = this.conveyor.pointAtDistance(d);
      const p2 = this.conveyor.pointAtDistance(d + 2);
      const tangent = Math.atan2(p2.y - p.y, p2.x - p.x);
      const angle = tangent + Math.PI * 0.5;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(angle);
      ctx.fillStyle = trackTheme.sleeperColor || "#5b3619";
      ctx.fillRect(-19, -6, 38, 12);
      ctx.fillStyle = trackTheme.sleeperHighlight || "rgba(255,255,255,0.12)";
      ctx.fillRect(-19, -6, 38, 3);
      ctx.restore();
    }

    // Metal rails.
    const outerRail = {
      x: LAYOUT.track.x - 24,
      y: LAYOUT.track.y - 24,
      w: LAYOUT.track.w + 48,
      h: LAYOUT.track.h + 48,
      r: LAYOUT.track.r + 22,
    };
    const innerRail = {
      x: LAYOUT.track.x + 24,
      y: LAYOUT.track.y + 24,
      w: LAYOUT.track.w - 48,
      h: LAYOUT.track.h - 48,
      r: Math.max(8, LAYOUT.track.r - 22),
    };
    const strokeRail = (rect) => {
      roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, rect.r);
      ctx.strokeStyle = trackTheme.railMain || "#ded7ca";
      ctx.lineWidth = 6;
      ctx.stroke();
      roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, rect.r);
      ctx.strokeStyle = trackTheme.railShadow || "rgba(55,55,55,0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    ctx.save();
    strokeRail(outerRail);
    strokeRail(innerRail);
    ctx.restore();

  }

  drawVictoryBackground(ctx) {
    const victoryTheme = CURRENT_THEME.victory || {};
    const gradientStops = victoryTheme.gradient || ["#d8f3ff", "#a8ddff", "#8bc9ff"];
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, gradientStops[0] || "#d8f3ff");
    gradient.addColorStop(0.55, gradientStops[1] || gradientStops[0] || "#a8ddff");
    gradient.addColorStop(1, gradientStops[2] || gradientStops[1] || "#8bc9ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = victoryTheme.cloudColor || "rgba(255, 255, 255, 0.7)";
    ctx.beginPath();
    ctx.arc(this.width * 0.16, this.height * 0.18, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.width * 0.84, this.height * 0.28, 170, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawVictoryArtwork(ctx) {
    const victoryTheme = CURRENT_THEME.victory || {};
    const floatOffset = Math.sin(this.victoryFloatTime * Math.PI * VICTORY_FLOAT_SPEED) * VICTORY_FLOAT_AMPLITUDE;
    const boardX = LAYOUT.fieldX;
    const boardY = LAYOUT.fieldY + VICTORY_ART_OFFSET_Y;
    const boardW = LAYOUT.fieldCols * LAYOUT.fieldStep;
    const boardH = LAYOUT.fieldRows * LAYOUT.fieldStep;

    ctx.save();
    ctx.translate(0, floatOffset);
    ctx.shadowColor = "rgba(16, 56, 104, 0.32)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 18;
    roundedRect(ctx, boardX - 12, boardY - 12, boardW + 24, boardH + 24, 18);
    ctx.fillStyle = victoryTheme.boardGlow || "rgba(255, 255, 255, 0.42)";
    ctx.fill();
    ctx.restore();

    for (const block of this.blocks) {
      const x = block.x;
      const y = block.y + VICTORY_ART_OFFSET_Y + floatOffset;
      this.drawVolumetricBlock(ctx, block, x, y, {
        alpha: 1,
        shadowOpacity: 0.32,
        bevelStrength: 0.34,
      });
    }
  }

  drawVolumetricBlock(ctx, block, x, y, options = {}) {
    const size = block.size;
    const sprite = block.color === "green" ? this.sprites.greenTile : this.sprites.blackTile;
    const baseColor = block.color === "green" ? "#81c341" : "#2a2a2a";
    const alpha = options.alpha ?? 1;
    const shadowOpacity = options.shadowOpacity ?? 0.24;
    const bevelStrength = options.bevelStrength ?? 0.28;
    const offsetY = options.offsetY ?? 0;
    const drawY = y + offsetY;
    const depth = Math.max(3, Math.round(size * 0.14));
    const innerInset = Math.max(2, Math.round(size * 0.1));
    const corner = Math.max(6, Math.round(size * 0.24));

    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.fillStyle = `rgba(10, 14, 10, ${shadowOpacity + 0.04})`;
    roundedRect(ctx, x + 1, drawY + depth + 3, size - 2, size - 1, corner);
    ctx.fill();

    // Bottom face only (no right shift), to keep the block aligned.
    roundedRect(ctx, x, drawY + depth, size, size - depth, corner);
    const sideGrad = ctx.createLinearGradient(x, drawY + depth, x, drawY + size);
    sideGrad.addColorStop(0, "rgba(0, 0, 0, 0.12)");
    sideGrad.addColorStop(1, "rgba(0, 0, 0, 0.32)");
    ctx.fillStyle = sideGrad;
    ctx.fill();

    // Main top face.
    if (sprite) {
      ctx.drawImage(sprite, x, drawY, size, size);
    } else {
      roundedRect(ctx, x, drawY, size, size, corner);
      ctx.fillStyle = baseColor;
      ctx.fill();
    }

    roundedRect(ctx, x, drawY, size, size, corner);
    const faceGrad = ctx.createLinearGradient(x, drawY, x + size, drawY + size);
    faceGrad.addColorStop(0, `rgba(255, 255, 255, ${0.24 + bevelStrength * 0.2})`);
    faceGrad.addColorStop(0.48, "rgba(255, 255, 255, 0.06)");
    faceGrad.addColorStop(1, `rgba(0, 0, 0, ${0.2 + bevelStrength * 0.22})`);
    ctx.fillStyle = faceGrad;
    ctx.fill();

    // Inner cap for "puffy" 3D tile look like in your reference.
    roundedRect(
      ctx,
      x + innerInset,
      drawY + innerInset,
      size - innerInset * 2,
      size - innerInset * 2,
      Math.max(4, corner - 3)
    );
    const capGrad = ctx.createLinearGradient(x, drawY, x + size, drawY + size);
    capGrad.addColorStop(0, "rgba(255, 255, 255, 0.22)");
    capGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.08)");
    capGrad.addColorStop(1, "rgba(0, 0, 0, 0.18)");
    ctx.fillStyle = capGrad;
    ctx.fill();

    ctx.lineWidth = 1;
    roundedRect(ctx, x + 0.5, drawY + 0.5, size - 1, size - 1, corner - 0.5);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.26 + bevelStrength * 0.2})`;
    ctx.stroke();
    roundedRect(ctx, x + 1.5, drawY + 1.5, size - 3, size - 3, corner - 1.5);
    ctx.strokeStyle = `rgba(0, 0, 0, ${0.28 + bevelStrength * 0.24})`;
    ctx.stroke();

    ctx.restore();
  }

  drawDestroyedBlocks(ctx) {
    for (const block of this.blocks) {
      const isPlaced = block.alive;
      const waveOffsetY = isPlaced ? this.getBlockWaveOffsetY(block) : 0;
      this.drawVolumetricBlock(ctx, block, block.x, block.y, {
        alpha: isPlaced ? 0.96 : 0.24,
        shadowOpacity: isPlaced ? 0.22 : 0.12,
        bevelStrength: isPlaced ? 0.26 : 0.14,
        offsetY: waveOffsetY,
      });
    }

    for (const block of this.blocks) {
      if (!block.alive || block.hitFlash <= 0) {
        continue;
      }
      ctx.save();
      ctx.globalAlpha = block.hitFlash * 0.25;
      ctx.fillStyle = "#ffffff";
      const waveOffsetY = this.getBlockWaveOffsetY(block);
      roundedRect(ctx, block.x, block.y + waveOffsetY, block.size, block.size, 8);
      ctx.fill();
      ctx.restore();
    }
  }

  getBlockWaveOffsetY(block) {
    if (!block || !block.alive || this.blockWaves.length === 0) {
      return 0;
    }
    const center = this.blockCenter(block);
    let offset = 0;
    for (const wave of this.blockWaves) {
      const t = 1 - wave.life / wave.maxLife;
      const waveRadius = lerp(wave.startR, wave.endR, easeOutCubic(t));
      const d = Math.hypot(center.x - wave.x, center.y - wave.y);
      const influence = 1 - Math.abs(d - waveRadius) / wave.bandWidth;
      if (influence <= 0) {
        continue;
      }
      offset += -wave.jumpHeight * influence * (1 - t);
    }
    return offset;
  }

  drawTargetSilhouette(ctx) {
    const nextBlock = this.getNextSpiralTarget();
    if (!nextBlock) {
      return;
    }

    const now = performance.now();
    const pulseFast = 0.5 + 0.5 * Math.sin(now * 0.018);
    const pulseSlow = 0.5 + 0.5 * Math.sin(now * 0.009 + 1.3);
    const accentColor = nextBlock.color === "green" ? "160, 255, 105" : "255, 255, 255";

    ctx.save();
    ctx.globalAlpha = 0.2 + pulseSlow * 0.24;
    ctx.shadowColor = `rgba(${accentColor}, 0.95)`;
    ctx.shadowBlur = 20 + pulseFast * 14;
    ctx.fillStyle = `rgba(${accentColor}, 0.28)`;
    roundedRect(
      ctx,
      nextBlock.x - 4,
      nextBlock.y - 4,
      nextBlock.size + 8,
      nextBlock.size + 8,
      11
    );
    ctx.fill();
    ctx.restore();

    this.drawVolumetricBlock(ctx, nextBlock, nextBlock.x, nextBlock.y, {
      alpha: 0.62,
      shadowOpacity: 0.28,
      bevelStrength: 0.24,
    });

    ctx.save();
    ctx.globalAlpha = 0.62 + pulseFast * 0.35;
    ctx.lineWidth = 3;
    ctx.strokeStyle = `rgba(${accentColor}, 0.98)`;
    roundedRect(ctx, nextBlock.x + 2, nextBlock.y + 2, nextBlock.size - 4, nextBlock.size - 4, 7);
    ctx.stroke();

    ctx.globalAlpha = 0.4 + pulseSlow * 0.4;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(20, 40, 70, 0.88)";
    roundedRect(ctx, nextBlock.x - 2, nextBlock.y - 2, nextBlock.size + 4, nextBlock.size + 4, 9);
    ctx.stroke();
    ctx.restore();
  }

  drawLevelStartFade(ctx) {
    if (this.levelStartFade <= 0.001) {
      return;
    }
    const t = clamp(this.levelStartFade, 0, 1);
    const alpha = t * t * 0.78;
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha.toFixed(3)})`;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  }

  drawUnitsOnTrack(ctx) {
    const unitsByDepth = this.units
      .filter((unit) => unit.alive)
      .slice()
      .sort((a, b) => {
        if (a.position.y !== b.position.y) {
          return a.position.y - b.position.y;
        }
        return a.id - b.id;
      });
    for (const unit of unitsByDepth) {
      const drawX = unit.position.x;
      const drawY = unit.position.y;
      const shotScale = unit.getShotScale();
      ctx.save();
      ctx.translate(drawX, drawY);
      ctx.scale(shotScale, shotScale);
      ctx.translate(-drawX, -drawY);
      if (unit.state === "moving") {
        this.drawUnitBlock(ctx, drawX, drawY, UNIT_BLOCK_SIZE, unit.color, 1);
        this.drawAmmoOnBlock(ctx, drawX, drawY, unit.ammo, 30);
      } else {
        this.drawUnitBlock(ctx, drawX, drawY, UNIT_BLOCK_SIZE, unit.color, 1);
        this.drawAmmoOnBlock(ctx, drawX, drawY, unit.ammo, 30);
      }
      ctx.restore();
    }
  }

  drawSlotState(ctx) {
    for (const slot of LAYOUT.slots) {
      const size = Math.min(slot.w, slot.h);
      const x = slot.x + (slot.w - size) * 0.5;
      const y = slot.y + (slot.h - size) * 0.5;
      ctx.save();
      ctx.fillStyle = "rgba(17, 24, 14, 0.22)";
      roundedRect(ctx, x + 2, y + 5, size, size, 14);
      ctx.fill();
      roundedRect(ctx, x, y, size, size, 14);
      ctx.fillStyle = "rgba(20, 26, 32, 0.62)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }

  drawUnitBlock(ctx, x, y, size, color, alpha = 1) {
    const drawX = x - size * 0.5;
    const drawY = y - size * 0.5;
    const proxyBlock = { color, size };
    this.drawVolumetricBlock(ctx, proxyBlock, drawX, drawY, {
      alpha,
      shadowOpacity: 0.28,
      bevelStrength: 0.32,
    });
  }

  drawWagonLayer(ctx) {
    void ctx;
  }

  drawBottomCleanup(ctx) {
    void ctx;
  }

  drawAmmoOnBlock(ctx, x, y, value, baseFontSize = 30) {
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = COLORS.white;
    const text = String(value);
    const digits = text.length;
    const fontSize = digits >= 4 ? Math.round(baseFontSize * 0.68) : digits === 3 ? Math.round(baseFontSize * 0.82) : baseFontSize;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.82)";
    ctx.lineWidth = Math.max(4, Math.round(fontSize * 0.22));
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.font = `900 ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText(text, x, y + 1);
    ctx.fillText(text, x, y + 1);
    ctx.restore();
  }

  drawCardState(ctx) {
    const cardsToDraw = [...this.cards].sort((a, b) => a.row - b.row);
    for (const card of cardsToDraw) {
      if (card.used) {
        continue;
      }
      const center = this.getCardPigCenter(card);
      this.drawUnitBlock(ctx, center.x, center.y, UNIT_BLOCK_SIZE, card.color, 1);
      this.drawAmmoOnBlock(ctx, center.x, center.y, card.ammo, 30);
    }
  }

  drawTapDebug(ctx) {
    if (!SHOW_TAP_DEBUG) {
      return;
    }

    ctx.save();
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 8]);

    for (const lane of this.getFrontLaneIds()) {
      const card = this.getActiveFrontCardInLane(lane);
      if (!card) {
        continue;
      }

      const center = this.getCardPigCenter(card);
      ctx.strokeStyle = "rgba(255, 80, 80, 0.95)";
      ctx.beginPath();
      ctx.arc(center.x, center.y, SHOOTER_HIT_RADIUS, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(255, 80, 80, 0.95)";
    for (const unit of this.units) {
      if (!unit.alive || unit.state !== "parked" || unit.ammo <= 0) {
        continue;
      }
      ctx.beginPath();
      ctx.arc(unit.position.x, unit.position.y, PARKED_UNIT_TAP_RADIUS, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    ctx.restore();
  }

  drawProjectiles(ctx) {
    for (const projectile of this.projectiles) {
      const bulletCoreColor = projectile.color === "green" ? COLORS.bulletGreenCore : COLORS.bulletBlackCore;
      const bulletLightColor = projectile.color === "green" ? COLORS.bulletGreen : "#f2f2f2";
      const fade = projectile.maxLife > 0 ? projectile.life / projectile.maxLife : 0;
      const progress = easeOutCubic(1 - fade);
      const blockSize = LAYOUT.cellSize * 0.78;
      const blockSprite = projectile.color === "green" ? this.sprites.greenTile : this.sprites.blackTile;
      const dx = projectile.toX - projectile.fromX;
      const dy = projectile.toY - projectile.fromY;
      const dist = Math.max(1, Math.hypot(dx, dy));
      const headX = projectile.fromX + dx * progress;
      const headY = projectile.fromY + dy * progress;
      const trailLengthPx = Math.min(dist * 0.84, 220);
      const trailBackProgress = Math.max(0, progress - trailLengthPx / dist);
      ctx.save();
      const tailX = projectile.fromX + dx * trailBackProgress;
      const tailY = projectile.fromY + dy * trailBackProgress;

      const glow = ctx.createLinearGradient(tailX, tailY, headX, headY);
      glow.addColorStop(0, "rgba(255,255,255,0)");
      glow.addColorStop(0.55, projectile.color === "green" ? "rgba(164,255,128,0.22)" : "rgba(255,255,255,0.24)");
      glow.addColorStop(1, projectile.color === "green" ? "rgba(190,255,160,0.55)" : "rgba(255,255,255,0.62)");
      ctx.globalAlpha = 0.9 * fade;
      ctx.strokeStyle = glow;
      ctx.lineCap = "round";
      ctx.lineWidth = BULLET_RADIUS * 2.7;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.stroke();

      ctx.globalAlpha = 0.95 * fade;
      ctx.strokeStyle = bulletLightColor;
      ctx.lineWidth = BULLET_RADIUS * 1.25;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.stroke();

      const trailSamples = 16;
      for (let i = 0; i < trailSamples; i++) {
        const t = i / Math.max(1, trailSamples - 1);
        const segT = lerp(trailBackProgress, progress, t);
        const px = projectile.fromX + dx * segT;
        const py = projectile.fromY + dy * segT;
        const tailToHead = t;
        const size = blockSize * (0.22 + tailToHead * 0.62);
        ctx.globalAlpha = (0.05 + tailToHead * 0.48) * fade;
        if (blockSprite) {
          ctx.drawImage(blockSprite, px - size * 0.5, py - size * 0.5, size, size);
        } else {
          ctx.fillStyle = bulletCoreColor;
          roundedRect(ctx, px - size * 0.5, py - size * 0.5, size, size, 5);
          ctx.fill();
        }
      }

      const auraR = blockSize * (1.35 + (1 - fade) * 0.42);
      const aura = ctx.createRadialGradient(headX, headY, 0, headX, headY, auraR);
      aura.addColorStop(0, projectile.color === "green" ? "rgba(212,255,184,0.75)" : "rgba(255,255,255,0.78)");
      aura.addColorStop(0.4, projectile.color === "green" ? "rgba(160,244,105,0.34)" : "rgba(245,245,245,0.30)");
      aura.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalAlpha = 0.95 * fade;
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(headX, headY, auraR, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.96 * fade;
      ctx.fillStyle = COLORS.blockShadow;
      roundedRect(ctx, headX - blockSize / 2 + 2, headY - blockSize / 2 + 3, blockSize, blockSize, 6);
      ctx.fill();
      if (blockSprite) {
        ctx.drawImage(blockSprite, headX - blockSize / 2, headY - blockSize / 2, blockSize, blockSize);
      } else {
        ctx.fillStyle = bulletCoreColor;
        roundedRect(ctx, headX - blockSize / 2, headY - blockSize / 2, blockSize, blockSize, 6);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  drawParticles(ctx) {
    for (const particle of this.particles) {
      ctx.save();
      ctx.globalAlpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
      ctx.restore();
    }
  }

  drawImpactFx(ctx) {
    for (const ring of this.impactRings) {
      const t = 1 - ring.life / ring.maxLife;
      const radius = lerp(ring.startR, ring.endR, easeOutCubic(t));
      ctx.save();
      ctx.globalAlpha = (1 - t) * 0.95;
      ctx.lineWidth = ring.lineWidth;
      ctx.strokeStyle = ring.color;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    for (const burst of this.slotBursts) {
      const t = 1 - burst.life / burst.maxLife;
      const radius = lerp(burst.r, burst.maxR, easeOutCubic(t));
      ctx.save();
      ctx.globalAlpha = (1 - t) * 0.58;
      const gradient = ctx.createRadialGradient(burst.x, burst.y, 0, burst.x, burst.y, radius);
      gradient.addColorStop(0, burst.color);
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(burst.x, burst.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawFloatingTexts(ctx) {
    for (const item of this.floatTexts) {
      const t = item.maxLife > 0 ? item.life / item.maxLife : 0;
      ctx.save();
      ctx.globalAlpha = t;
      ctx.font = `900 ${Math.round(46 * item.scale)}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeStyle = COLORS.textGlow;
      ctx.lineWidth = 6;
      ctx.strokeText(item.text, item.x, item.y);
      ctx.fillStyle = item.color;
      ctx.fillText(item.text, item.x, item.y);
      ctx.restore();
    }
  }

  drawConfetti(ctx) {
    for (const piece of this.confetti) {
      const alpha = Math.max(0, piece.life / piece.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size * 0.5, -piece.size * 0.25, piece.size, piece.size * 0.5);
      ctx.restore();
    }
  }

  drawBackButton(ctx) {
    if (!this.backButtonImage.complete || this.backButtonImage.naturalWidth === 0) {
      return;
    }

    const { x, y, w, h } = this.backButtonRect;
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    if ("imageSmoothingQuality" in ctx) {
      ctx.imageSmoothingQuality = "high";
    }
    ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    ctx.drawImage(this.backButtonImage, x, y, w, h);
    ctx.restore();
  }

  drawTopTimerPanel(ctx) {
    if (!this.timerPanelImage.complete || this.timerPanelImage.naturalWidth === 0) {
      return;
    }

    const panelW = TIMER_PANEL_UI.w;
    const panelH = TIMER_PANEL_UI.h;
    const panelX = (this.width - panelW) * 0.5;
    const panelY = TIMER_PANEL_UI.y;
    const textX = panelX + panelW * 0.5;
    const textY = panelY + panelH * 0.5 + 4;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    if ("imageSmoothingQuality" in ctx) {
      ctx.imageSmoothingQuality = "high";
    }
    ctx.shadowColor = "rgba(0, 0, 0, 0.24)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.drawImage(this.timerPanelImage, panelX, panelY, panelW, panelH);
    ctx.restore();

    ctx.save();
    ctx.font = getTopPanelFont();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 6;
    ctx.strokeStyle = TIMER_PANEL_UI.textStroke;
    ctx.fillStyle = TIMER_PANEL_UI.textColor;
    ctx.strokeText(TIMER_PANEL_UI.label, textX, textY);
    ctx.fillText(TIMER_PANEL_UI.label, textX, textY);
    ctx.restore();
  }

  drawTopCoinsPanel(ctx) {
    if (!this.restartButtonImage.complete || this.restartButtonImage.naturalWidth === 0) {
      return;
    }

    const panel = this.getRestartButtonRect();
    this.restartButtonRect = panel;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    if ("imageSmoothingQuality" in ctx) {
      ctx.imageSmoothingQuality = "high";
    }
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;
    ctx.drawImage(this.restartButtonImage, panel.x, panel.y, panel.w, panel.h);
    ctx.restore();
  }

  getRestartButtonRect() {
    const panelW = this.backButtonRect.w;
    const panelH = this.backButtonRect.h;
    const panelCenterX = this.width - COINS_UI.rightMargin - panelW * 0.5;
    const panelCenterY = this.backButtonRect.y + panelH * 0.5;
    return {
      x: panelCenterX - panelW * 0.5,
      y: panelCenterY - panelH * 0.5,
      w: panelW,
      h: panelH,
    };
  }

  getLosePopupRect() {
    const w = LOSE_POPUP_UI.w;
    const h = LOSE_POPUP_UI.h;
    return {
      x: (this.width - w) * 0.5,
      y: LOSE_POPUP_UI.y,
      w,
      h,
    };
  }

  getLoseCloseRect(popupRect = null) {
    const popup = popupRect || this.getLosePopupRect();
    return {
      x: popup.x + popup.w * 0.84,
      y: popup.y + popup.h * 0.02,
      w: popup.w * 0.13,
      h: popup.h * 0.13,
    };
  }

  drawLoseClock(ctx, centerX, centerY, radius) {
    ctx.save();
    ctx.shadowColor = "rgba(18, 46, 120, 0.28)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 5;
    const ringGrad = ctx.createLinearGradient(centerX, centerY - radius, centerX, centerY + radius);
    ringGrad.addColorStop(0, "#3ac6ff");
    ringGrad.addColorStop(1, "#1f60e8");
    ctx.fillStyle = ringGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#6ecdf8";
    ctx.beginPath();
    ctx.arc(centerX - radius * 0.7, centerY - radius * 0.66, radius * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#f9b11b";
    ctx.strokeStyle = "#eb7f19";
    ctx.lineWidth = 2;
    roundedRect(ctx, centerX - radius * 0.92, centerY - radius * 1.07, radius * 0.36, radius * 0.2, radius * 0.1);
    ctx.fill();
    ctx.stroke();
    roundedRect(ctx, centerX + radius * 0.56, centerY - radius * 1.07, radius * 0.36, radius * 0.2, radius * 0.1);
    ctx.fill();
    ctx.stroke();
    roundedRect(ctx, centerX - radius * 0.24, centerY - radius * 1.36, radius * 0.48, radius * 0.2, radius * 0.1);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#e9f4ff";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.79, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(17, 68, 170, 0.33)";
    ctx.lineWidth = radius * 0.06;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#003895";
    ctx.font = "900 58px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "rgba(255,255,255,0.76)";
    ctx.lineWidth = 5;
    ctx.strokeText("+60s", centerX, centerY + 2);
    ctx.fillText("+60s", centerX, centerY + 2);
    ctx.restore();
  }

  drawLoseButtons(ctx, popupX, popupY, popupW, popupH) {
    const buttonY = popupY + popupH - 126;
    const leftX = popupX + 40;
    const leftW = 184;
    const leftH = 68;
    const rightW = 184;
    const rightH = 68;
    const rightX = popupX + popupW - rightW - 40;

    ctx.save();
    ctx.shadowColor = "rgba(20, 38, 87, 0.24)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    const leftGrad = ctx.createLinearGradient(0, buttonY, 0, buttonY + leftH);
    leftGrad.addColorStop(0, "#9ce53f");
    leftGrad.addColorStop(1, "#53ca1c");
    roundedRect(ctx, leftX, buttonY, leftW, leftH, 24);
    ctx.fillStyle = leftGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.34)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    const coinX = leftX + 22;
    const coinY = buttonY + 12;
    const coinR = 22;
    ctx.save();
    const coinGrad = ctx.createLinearGradient(coinX, coinY, coinX, coinY + coinR * 2);
    coinGrad.addColorStop(0, "#ffea55");
    coinGrad.addColorStop(1, "#f0980f");
    ctx.fillStyle = coinGrad;
    ctx.beginPath();
    ctx.arc(coinX + coinR, coinY + coinR, coinR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffbe2b";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#ffef65";
    ctx.beginPath();
    ctx.arc(coinX + coinR, coinY + coinR, coinR * 0.66, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#f0a300";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#ffc700";
    ctx.strokeStyle = "#ed8f00";
    ctx.lineWidth = 1.5;
    const sx = coinX + coinR;
    const sy = coinY + coinR;
    const rOuter = coinR * 0.42;
    const rInner = coinR * 0.2;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = -Math.PI / 2 + (Math.PI * 2 * i) / 10;
      const r = i % 2 === 0 ? rOuter : rInner;
      const px = sx + Math.cos(angle) * r;
      const py = sy + Math.sin(angle) * r;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.font = "900 56px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "rgba(0, 74, 10, 0.42)";
    ctx.lineWidth = 5;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.strokeText("50", leftX + 92, buttonY + leftH * 0.53);
    ctx.fillText("50", leftX + 92, buttonY + leftH * 0.53);
    ctx.restore();

    ctx.save();
    ctx.shadowColor = "rgba(20, 38, 87, 0.24)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    const rightGrad = ctx.createLinearGradient(0, buttonY, 0, buttonY + rightH);
    rightGrad.addColorStop(0, "#7bcfff");
    rightGrad.addColorStop(1, "#4a95ef");
    roundedRect(ctx, rightX, buttonY, rightW, rightH, 24);
    ctx.fillStyle = rightGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.38)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    const filmX = rightX + 20;
    const filmY = buttonY + 12;
    const filmW = 52;
    const filmH = 44;
    ctx.save();
    const filmGrad = ctx.createLinearGradient(filmX, filmY, filmX, filmY + filmH);
    filmGrad.addColorStop(0, "#d7f0ff");
    filmGrad.addColorStop(1, "#75b6ff");
    roundedRect(ctx, filmX, filmY, filmW, filmH, 12);
    ctx.fillStyle = filmGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(31, 95, 184, 0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#4f8fe0";
    ctx.beginPath();
    ctx.moveTo(filmX + 21, filmY + 12);
    ctx.lineTo(filmX + 21, filmY + 32);
    ctx.lineTo(filmX + 38, filmY + 22);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 54px Arial";
    ctx.strokeStyle = "rgba(15, 63, 143, 0.72)";
    ctx.lineWidth = 5;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.strokeText("FREE", rightX + 84, buttonY + rightH * 0.53);
    ctx.fillText("FREE", rightX + 84, buttonY + rightH * 0.53);
    ctx.restore();
  }

  drawLosePopup(ctx) {
    const popup = this.getLosePopupRect();
    const animT = clamp(this.losePopupAppear, 0, 1);
    const fade = easeOutCubic(animT);
    const scale = 0.86 + 0.14 * easeOutBack(animT);
    const lift = (1 - fade) * 26;
    const centerX = popup.x + popup.w * 0.5;
    const centerY = popup.y + popup.h * 0.5 + lift;
    const drawRect = {
      x: centerX - (popup.w * scale) * 0.5,
      y: centerY - (popup.h * scale) * 0.5,
      w: popup.w * scale,
      h: popup.h * scale,
    };
    this.loseCloseRect = this.getLoseCloseRect(drawRect);

    ctx.save();
    ctx.fillStyle = `rgba(7, 14, 28, ${0.52 * fade})`;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.42 * fade;
    ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
    ctx.shadowBlur = 34;
    ctx.shadowOffsetY = 12;
    roundedRect(ctx, drawRect.x, drawRect.y, drawRect.w, drawRect.h, Math.max(20, drawRect.w * 0.05));
    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
    ctx.fill();
    ctx.restore();

    if (this.losePopupImage.complete && this.losePopupImage.naturalWidth > 0) {
      const cropInset = 6;
      const sx = cropInset;
      const sy = cropInset;
      const sw = Math.max(1, this.losePopupImage.naturalWidth - cropInset * 2);
      const sh = Math.max(1, this.losePopupImage.naturalHeight - cropInset * 2);
      ctx.save();
      ctx.globalAlpha = fade;
      roundedRect(ctx, drawRect.x, drawRect.y, drawRect.w, drawRect.h, Math.max(20, drawRect.w * 0.05));
      ctx.clip();
      ctx.imageSmoothingEnabled = true;
      if ("imageSmoothingQuality" in ctx) {
        ctx.imageSmoothingQuality = "high";
      }
      ctx.drawImage(this.losePopupImage, sx, sy, sw, sh, drawRect.x, drawRect.y, drawRect.w, drawRect.h);
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.globalAlpha = fade;
    ctx.shadowColor = "rgba(19, 52, 110, 0.3)";
    ctx.shadowBlur = 26;
    ctx.shadowOffsetY = 10;
    roundedRect(ctx, drawRect.x, drawRect.y, drawRect.w, drawRect.h, LOSE_POPUP_UI.outerRadius);
    ctx.fillStyle = "#eef0f5";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = fade;
    roundedRect(ctx, drawRect.x + 3, drawRect.y + 3, drawRect.w - 6, drawRect.h - 6, LOSE_POPUP_UI.outerRadius - 2);
    ctx.strokeStyle = "#7ea4e5";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();

    const innerX = drawRect.x + LOSE_POPUP_UI.innerPadding;
    const innerY = drawRect.y + 136;
    const innerW = drawRect.w - LOSE_POPUP_UI.innerPadding * 2;
    const innerH = drawRect.h - 160;
    ctx.save();
    ctx.globalAlpha = fade;
    roundedRect(ctx, innerX, innerY, innerW, innerH, 22);
    ctx.fillStyle = "#c7d0e3";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = fade;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#474a7a";
    ctx.font = "900 62px Arial";
    ctx.fillText("OUT OF TIME!", drawRect.x + drawRect.w * 0.5, drawRect.y + 62);
    ctx.font = "700 47px Arial";
    ctx.fillStyle = "#2dac28";
    ctx.fillText("Revive", drawRect.x + drawRect.w * 0.36, drawRect.y + 111);
    ctx.fillStyle = "#474a7a";
    ctx.fillText("to keep playing", drawRect.x + drawRect.w * 0.6, drawRect.y + 111);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "#8ca3d1";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    const close = this.loseCloseRect;
    ctx.beginPath();
    ctx.moveTo(close.x + 12, close.y + 12);
    ctx.lineTo(close.x + close.w - 12, close.y + close.h - 12);
    ctx.moveTo(close.x + close.w - 12, close.y + 12);
    ctx.lineTo(close.x + 12, close.y + close.h - 12);
    ctx.stroke();
    ctx.restore();

    this.drawLoseClock(ctx, drawRect.x + drawRect.w * 0.5, drawRect.y + 255, 80);
    this.drawLoseButtons(ctx, drawRect.x, drawRect.y, drawRect.w, drawRect.h);
  }

  render() {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    ctx.save();
    ctx.translate(this.viewportOffsetX, this.viewportOffsetY);
    ctx.scale(this.viewportScale, this.viewportScale);
    this.drawViewportBackdrop(ctx);

    if (this.gameState === "loading") {
      this.drawLoading(ctx);
      this.drawTopTimerPanel(ctx);
      this.drawTopCoinsPanel(ctx);
      this.drawBackButton(ctx);
      ctx.restore();
      this.needsRender = false;
      return;
    }

    if (this.gameState === "victory") {
      this.drawVictoryBackground(ctx);
      const fieldCenter = this.getFieldCenter();
      ctx.save();
      ctx.translate(fieldCenter.x, fieldCenter.y);
      ctx.scale(this.cameraZoom, this.cameraZoom);
      ctx.translate(-fieldCenter.x, -fieldCenter.y);
      this.drawVictoryArtwork(ctx);
      ctx.restore();
      this.drawConfetti(ctx);
      this.drawTopTimerPanel(ctx);
      this.drawTopCoinsPanel(ctx);
      this.drawBackButton(ctx);
      this.drawLevelStartFade(ctx);
      ctx.restore();
      this.needsRender = false;
      return;
    }

    const fieldCenter = this.getFieldCenter();
    ctx.save();
    ctx.translate(fieldCenter.x, fieldCenter.y);
    ctx.scale(this.cameraZoom, this.cameraZoom);
    ctx.translate(-fieldCenter.x, -fieldCenter.y);
    this.drawBackground(ctx);
    this.drawWagonLayer(ctx);
    this.drawBottomCleanup(ctx);
    this.drawDestroyedBlocks(ctx);
    this.drawTargetSilhouette(ctx);
    this.drawSlotState(ctx);
    this.drawProjectiles(ctx);
    this.drawImpactFx(ctx);
    this.drawParticles(ctx);
    this.drawFloatingTexts(ctx);
    this.drawCardState(ctx);
    this.drawUnitsOnTrack(ctx);
    this.drawTapDebug(ctx);
    ctx.restore();
    this.drawConfetti(ctx);
    this.drawTopTimerPanel(ctx);
    this.drawTopCoinsPanel(ctx);
    this.drawBackButton(ctx);
    this.drawLevelStartFade(ctx);
    if (this.gameState === "lose") {
      this.drawLosePopup(ctx);
    }
    ctx.restore();
    this.needsRender = false;
  }

  frame(timestamp) {
    if (!this.isLoopRunning) {
      return;
    }

    const dt = clamp((timestamp - this.lastTimestamp) / 1000, 0, 0.05);
    this.lastTimestamp = timestamp;
    const animating = this.hasActiveAnimations();

    if (animating) {
      this.update(dt);
    }

    if (this.needsRender || animating) {
      this.render();
    }

    if (this.hasActiveAnimations()) {
      requestAnimationFrame((t) => this.frame(t));
    } else {
      this.isLoopRunning = false;
    }
  }

  hasActiveAnimations() {
    if (this.gameState === "lose") {
      return this.losePopupAppear < 0.999 || this.levelStartFade > 0.001;
    }
    const hasActiveUnits = this.units.some((unit) => unit.alive && unit.state !== "parked");
    const zoomAnimating = Math.abs(this.cameraZoomTarget - this.cameraZoom) > 0.001;
    if (
      (this.gameState === "playing" && hasActiveUnits) ||
      this.projectiles.length > 0 ||
      this.particles.length > 0 ||
      this.impactRings.length > 0 ||
      this.blockWaves.length > 0 ||
      this.slotBursts.length > 0 ||
      this.floatTexts.length > 0 ||
      this.confetti.length > 0 ||
      this.victoryConfettiTime > 0 ||
      this.levelStartFade > 0.001 ||
      zoomAnimating
    ) {
      return true;
    }

    return this.blocks.some((block) => block.hitFlash > 0);
  }

  invalidate(animate = false) {
    this.needsRender = true;
    if (animate || this.hasActiveAnimations()) {
      if (!this.isLoopRunning) {
        this.isLoopRunning = true;
        this.lastTimestamp = performance.now();
        requestAnimationFrame((t) => this.frame(t));
      }
    } else {
      this.render();
    }
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.screenWidth = Math.max(1, Math.round(rect.width || window.innerWidth || this.width));
    this.screenHeight = Math.max(1, Math.round(rect.height || window.innerHeight || this.height));
    this.dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    this.canvas.width = this.screenWidth * this.dpr;
    this.canvas.height = this.screenHeight * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.updateViewportTransform();
    this.applyDebugLayout();
  }

  hitTest(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
  }

  handlePointerMove(x, y) {
    if (this.gameState === "lose") {
      this.canvas.style.cursor = isInsideRect(x, y, this.loseCloseRect) ? "pointer" : "default";
      return;
    }
    const overBack = isInsideRect(x, y, this.backButtonRect);
    const overRestart = isInsideRect(x, y, this.restartButtonRect);
    this.canvas.style.cursor = overBack || overRestart ? "pointer" : "default";
  }

  handlePointerDown(x, y) {
    if (this.gameState === "lose") {
      if (isInsideRect(x, y, this.loseCloseRect)) {
        this.restart();
      }
      return;
    }
    if (isInsideRect(x, y, this.backButtonRect)) {
      return;
    }
    if (isInsideRect(x, y, this.restartButtonRect)) {
      this.restart();
      return;
    }
    if (this.gameState !== "playing") {
      return;
    }
    if (this.tryRelaunchParkedUnitAt(x, y)) {
      return;
    }
    const tapCard = this.cardManager.findTapTarget(x, y);
    if (tapCard) {
      this.spawnUnit(tapCard.index);
    }
  }

  getPointerPosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const worldX = (px - this.viewportOffsetX) / this.viewportScale;
    const worldY = (py - this.viewportOffsetY) / this.viewportScale;
    if (worldX < 0 || worldY < 0 || worldX > this.width || worldY > this.height) {
      return null;
    }
    return {
      x: worldX,
      y: worldY,
    };
  }

  syncDebugContentSelectors() {
    if (this.debugLevelSelect) {
      this.debugLevelSelect.value = this.getValidLevelId(this.currentLevelId);
    }
    if (this.debugThemeSelect) {
      this.debugThemeSelect.value = this.getValidThemeId(this.currentThemeId);
    }
  }

  initDebugContentSelectors() {
    const fillSelect = (select, options, selectedId) => {
      if (!select) {
        return;
      }
      select.innerHTML = "";
      for (const optionData of options) {
        const option = document.createElement("option");
        option.value = optionData.id;
        option.textContent = optionData.name;
        select.appendChild(option);
      }
      select.value = selectedId;
    };

    fillSelect(this.debugLevelSelect, this.availableLevels, this.getValidLevelId(this.currentLevelId));
    fillSelect(this.debugThemeSelect, this.availableThemes, this.getValidThemeId(this.currentThemeId));

    if (this.debugLevelSelect) {
      this.debugLevelSelect.addEventListener("change", () => {
        this.applyLevelConfig(this.debugLevelSelect.value, { restart: true });
        this.syncDebugContentSelectors();
        this.saveDebugSettings();
      });
    }

    if (this.debugThemeSelect) {
      this.debugThemeSelect.addEventListener("change", () => {
        this.applyThemeConfig(this.debugThemeSelect.value, { restart: true });
        this.syncDebugContentSelectors();
        this.saveDebugSettings();
      });
    }
  }

  initDebugControls() {
    if (this.debugPanel) {
      this.debugPanel.classList.remove("is-visible");
    }
    this.initDebugContentSelectors();
    this.syncDebugContentSelectors();
    const bindRange = (input, output, currentValue, parseValue, formatValue, onApply) => {
      if (!input) {
        return;
      }
      input.value = formatValue(currentValue);
      input.addEventListener("input", () => {
        const parsed = parseValue(input.value);
        const nextValue = onApply(parsed);
        if (output) {
          const text = formatValue(nextValue);
          output.value = text;
          output.textContent = text;
        }
        this.saveDebugSettings();
      });
      input.dispatchEvent(new Event("input"));
    };

    if (this.shotBounceSizeInput) {
      this.shotBounceSizeInput.value = SHOT_BOUNCE_AMOUNT.toFixed(2);
      this.shotBounceSizeInput.addEventListener("input", () => {
        const value = Number(this.shotBounceSizeInput.value);
        SHOT_BOUNCE_AMOUNT = clamp(value, 0.05, 0.7);
        if (this.shotBounceSizeValue) {
          this.shotBounceSizeValue.value = SHOT_BOUNCE_AMOUNT.toFixed(2);
          this.shotBounceSizeValue.textContent = SHOT_BOUNCE_AMOUNT.toFixed(2);
        }
        this.saveDebugSettings();
      });
      this.shotBounceSizeInput.dispatchEvent(new Event("input"));
    }
    if (this.shotBounceSpeedInput) {
      this.shotBounceSpeedInput.value = SHOT_BOUNCE_SPEED.toFixed(2);
      this.shotBounceSpeedInput.addEventListener("input", () => {
        const value = Number(this.shotBounceSpeedInput.value);
        SHOT_BOUNCE_SPEED = clamp(value, 0.4, 2.6);
        if (this.shotBounceSpeedValue) {
          const text = `${SHOT_BOUNCE_SPEED.toFixed(2)}x`;
          this.shotBounceSpeedValue.value = text;
          this.shotBounceSpeedValue.textContent = text;
        }
        this.saveDebugSettings();
      });
      this.shotBounceSpeedInput.dispatchEvent(new Event("input"));
    }
    if (this.railSpeedInput) {
      this.railSpeedInput.value = String(Math.round(TRACK_UNIT_SPEED));
      this.railSpeedInput.addEventListener("input", () => {
        const value = Number(this.railSpeedInput.value);
        TRACK_UNIT_SPEED = clamp(value, 420, 1400);
        if (this.railSpeedValue) {
          const text = String(Math.round(TRACK_UNIT_SPEED));
          this.railSpeedValue.value = text;
          this.railSpeedValue.textContent = text;
        }
        this.saveDebugSettings();
      });
      this.railSpeedInput.dispatchEvent(new Event("input"));
    }
    if (this.queueCardsInput) {
      this.queueCardsInput.value = String(BOTTOM_QUEUE_CARD_COUNT);
      this.queueCardsInput.addEventListener("input", () => {
        const value = clamp(Math.round(Number(this.queueCardsInput.value)), MIN_QUEUE_CARDS, MAX_QUEUE_CARDS);
        if (String(value) !== this.queueCardsInput.value) {
          this.queueCardsInput.value = String(value);
        }
        if (this.queueCardsValue) {
          const text = String(value);
          this.queueCardsValue.value = text;
          this.queueCardsValue.textContent = text;
        }
        this.setQueueCardCount(value);
        this.saveDebugSettings();
      });
      this.queueCardsInput.dispatchEvent(new Event("input"));
    }

    bindRange(
      this.topPanelFontSizeInput,
      this.topPanelFontSizeValue,
      TOP_PANEL_FONT_SIZE,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        TOP_PANEL_FONT_SIZE = clamp(value, 24, 80);
        this.invalidate(false);
        return TOP_PANEL_FONT_SIZE;
      }
    );

    bindRange(
      this.levelPanelScaleInput,
      this.levelPanelScaleValue,
      TOP_LEVEL_PANEL_SCALE,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        TOP_LEVEL_PANEL_SCALE = clamp(value, 0.6, 1.8);
        this.applyDebugLayout();
        return TOP_LEVEL_PANEL_SCALE;
      }
    );
    bindRange(
      this.coinsPanelScaleInput,
      this.coinsPanelScaleValue,
      TOP_COINS_PANEL_SCALE,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        TOP_COINS_PANEL_SCALE = clamp(value, 0.6, 1.8);
        this.applyDebugLayout();
        return TOP_COINS_PANEL_SCALE;
      }
    );
    bindRange(
      this.backButtonScaleInput,
      this.backButtonScaleValue,
      BACK_BUTTON_SCALE,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        BACK_BUTTON_SCALE = clamp(value, 0.6, 1.8);
        this.applyDebugLayout();
        return BACK_BUTTON_SCALE;
      }
    );
    bindRange(
      this.trackYOffsetInput,
      this.trackYOffsetValue,
      TRACK_Y_OFFSET,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        TRACK_Y_OFFSET = clamp(value, -220, 260);
        this.applyDebugLayout();
        return TRACK_Y_OFFSET;
      }
    );
    bindRange(
      this.fieldScaleInput,
      this.fieldScaleValue,
      FIELD_SCALE,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        FIELD_SCALE = clamp(value, 0.65, 1.5);
        this.applyDebugLayout();
        return FIELD_SCALE;
      }
    );
    bindRange(
      this.playfieldScaleInput,
      this.playfieldScaleValue,
      PLAYFIELD_SCALE,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        PLAYFIELD_SCALE = clamp(value, 0.7, 1.5);
        this.applyDebugLayout();
        return PLAYFIELD_SCALE;
      }
    );
    bindRange(
      this.slotSizeScaleInput,
      this.slotSizeScaleValue,
      SLOT_SIZE_SCALE,
      (value) => Number(value),
      (value) => `${value.toFixed(2)}x`,
      (value) => {
        SLOT_SIZE_SCALE = clamp(value, 0.6, 1.7);
        this.applyDebugLayout();
        return SLOT_SIZE_SCALE;
      }
    );
    bindRange(
      this.slotYOffsetInput,
      this.slotYOffsetValue,
      SLOT_Y_OFFSET,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        SLOT_Y_OFFSET = clamp(value, -220, 260);
        this.applyDebugLayout();
        return SLOT_Y_OFFSET;
      }
    );
    bindRange(
      this.topUiYOffsetInput,
      this.topUiYOffsetValue,
      TOP_UI_Y_OFFSET,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        TOP_UI_Y_OFFSET = clamp(value, -60, 220);
        this.applyDebugLayout();
        return TOP_UI_Y_OFFSET;
      }
    );
    bindRange(
      this.cardAllYOffsetInput,
      this.cardAllYOffsetValue,
      CARD_Y_OFFSET_ALL,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        CARD_Y_OFFSET_ALL = clamp(value, -260, 260);
        this.applyDebugLayout();
        return CARD_Y_OFFSET_ALL;
      }
    );
    bindRange(
      this.card1YOffsetInput,
      this.card1YOffsetValue,
      CARD_Y_OFFSET_1,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        CARD_Y_OFFSET_1 = clamp(value, -260, 260);
        this.applyDebugLayout();
        return CARD_Y_OFFSET_1;
      }
    );
    bindRange(
      this.card2YOffsetInput,
      this.card2YOffsetValue,
      CARD_Y_OFFSET_2,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        CARD_Y_OFFSET_2 = clamp(value, -260, 260);
        this.applyDebugLayout();
        return CARD_Y_OFFSET_2;
      }
    );
    bindRange(
      this.card3YOffsetInput,
      this.card3YOffsetValue,
      CARD_Y_OFFSET_3,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        CARD_Y_OFFSET_3 = clamp(value, -260, 260);
        this.applyDebugLayout();
        return CARD_Y_OFFSET_3;
      }
    );
    bindRange(
      this.card4YOffsetInput,
      this.card4YOffsetValue,
      CARD_Y_OFFSET_4,
      (value) => Number(value),
      (value) => String(Math.round(value)),
      (value) => {
        CARD_Y_OFFSET_4 = clamp(value, -260, 260);
        this.applyDebugLayout();
        return CARD_Y_OFFSET_4;
      }
    );
  }

  setDebugPanelVisible(visible) {
    this.debugPanelVisible = visible;
    if (this.debugPanel) {
      this.debugPanel.classList.toggle("is-visible", visible);
    }
    if (this.debugToggleFab) {
      this.debugToggleFab.textContent = visible ? "CLOSE" : "DBG";
    }
  }

  toggleDebugPanel() {
    this.setDebugPanelVisible(!this.debugPanelVisible);
  }

  bindEvents() {
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("keydown", (event) => {
      if (event.code !== "Space" || event.repeat) {
        return;
      }
      const tag = event.target && event.target.tagName ? String(event.target.tagName).toLowerCase() : "";
      if (tag === "input" || tag === "textarea" || tag === "select") {
        return;
      }
      this.toggleDebugPanel();
      event.preventDefault();
    });
    this.canvas.addEventListener("pointermove", (event) => {
      const point = this.getPointerPosition(event);
      if (!point) {
        this.canvas.style.cursor = "default";
        return;
      }
      this.handlePointerMove(point.x, point.y);
    });
    this.canvas.addEventListener("pointerdown", (event) => {
      const point = this.getPointerPosition(event);
      if (!point) {
        return;
      }
      this.handlePointerDown(point.x, point.y);
      event.preventDefault();
    });
    if (this.debugButton) {
      this.debugButton.addEventListener("click", (event) => {
        this.triggerDebug6();
        event.preventDefault();
      });
    }
    if (this.debugResetButton) {
      this.debugResetButton.addEventListener("click", (event) => {
        this.resetDebugSettings();
        event.preventDefault();
      });
    }
    if (this.debugToggleFab) {
      this.debugToggleFab.addEventListener("click", (event) => {
        this.toggleDebugPanel();
        event.preventDefault();
      });
    }
  }

  advanceTime(ms) {
    const steps = Math.max(1, Math.round(ms / (FIXED_DT * 1000)));
    for (let i = 0; i < steps; i++) {
      this.update(FIXED_DT);
    }
    this.lastTimestamp = performance.now();
    this.invalidate(false);
  }

  renderGameToText() {
    return JSON.stringify({
      mode: this.gameState,
      scene: "reference_reskin",
      source: getThemeAsset("referenceImage", "Ref.png"),
      levelId: this.currentLevelId,
      themeId: this.currentThemeId,
      unitTheme: "numbered_slimes",
      coordinateSystem: {
        origin: "top-left",
        xDirection: "right",
        yDirection: "down",
        units: "canvas pixels",
      },
      remainingBlocks: this.remainingBlocks,
      blocksTotal: this.blocks.length,
      queueCards: this.cardManager.queueCardCount,
      blocksByColor: {
        green: this.blocks.filter((block) => !block.alive && block.color === "green").length,
        black: this.blocks.filter((block) => !block.alive && block.color === "black").length,
      },
      units: this.units.map((unit) => ({
        id: unit.id,
        color: unit.color,
        styleKey: unit.styleKey,
        label: unit.label,
        ammo: unit.ammo,
        slotIndex: unit.slotIndex,
        x: Number(unit.position.x.toFixed(1)),
        y: Number(unit.position.y.toFixed(1)),
      })),
      slimeCards: this.cards.map((card) => ({
        index: card.index,
        lane: card.lane,
        row: card.row,
        color: card.color,
        styleKey: card.styleKey,
        label: card.label,
        ammo: card.ammo,
        used: card.used,
        x: card.x,
        y: card.y,
        w: card.w,
        h: card.h,
      })),
    });
  }
}

const canvas = document.getElementById("gameCanvas");
const game = new Game(canvas);

window.game = game;
window.advanceTime = (ms) => game.advanceTime(ms);
window.render_game_to_text = () => game.renderGameToText();
window.debug6 = () => game.triggerDebug6();
