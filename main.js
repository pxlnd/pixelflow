const LOGICAL_WIDTH = 1024;
const LOGICAL_HEIGHT = 1600;
const FIXED_DT = 1 / 60;
const MAX_ACTIVE_UNITS = 4;
const FIRE_INTERVAL = 0.07;
const BULLET_SPEED = 1860;
const BULLET_RADIUS = 8;
const BULLET_TRAIL_LENGTH = 32;
const SHOOTER_PIG_SIZE = 117;
const SHOOTER_HIT_RADIUS = 74;
const CARD_HITBOX_PADDING_X = 26;
const CARD_HITBOX_PADDING_TOP = 26;
const CARD_HITBOX_PADDING_BOTTOM = 22;
const PARKED_UNIT_TAP_RADIUS = 70;
const SHOW_TAP_DEBUG = false;
const SPAWN_CLEAR_RADIUS = 118;
const SLOT_CLAIM_ORDER = [0, 3, 1, 2];
const REFERENCE_FIELD_X = 220;
const REFERENCE_FIELD_Y = 216;
const REFERENCE_FIELD_STEP = 32;
const REFERENCE_CELL_SIZE = 30;
const BOARD_FILL_COLOR = "#6aa93a";
const FIELD_UNDERLAY_COLOR = "#6fb53f";
const SHOOTER_CARD_Y_OFFSET = 132;
const SHOOTER_SLOT_Y_OFFSET = 28;

const LAYOUT = {
  fieldX: 220,
  fieldY: 196,
  fieldStep: 32,
  cellSize: 32,
  fieldCols: 18,
  fieldRows: 18,
  track: {
    x: 96,
    y: 126,
    w: 828,
    h: 876,
    r: 52,
  },
  spawnPoint: { x: 152, y: 936 },
  cards: [
    { lane: 0, row: 0, x: 320, y: 1070 + SHOOTER_CARD_Y_OFFSET, w: 144, h: 184, color: "green", ammo: 40 },
    { lane: 1, row: 0, x: 560, y: 1070 + SHOOTER_CARD_Y_OFFSET, w: 144, h: 184, color: "black", ammo: 40 },
    { lane: 0, row: 1, x: 320, y: 1272 + SHOOTER_CARD_Y_OFFSET, w: 144, h: 184, color: "green", ammo: 40 },
    { lane: 1, row: 1, x: 560, y: 1272 + SHOOTER_CARD_Y_OFFSET, w: 144, h: 184, color: "black", ammo: 40 },
  ],
  slots: [
    { x: 107, y: 1074 + SHOOTER_SLOT_Y_OFFSET, w: 177, h: 105 },
    { x: 320, y: 1074 + SHOOTER_SLOT_Y_OFFSET, w: 176, h: 105 },
    { x: 529, y: 1074 + SHOOTER_SLOT_Y_OFFSET, w: 176, h: 105 },
    { x: 738, y: 1074 + SHOOTER_SLOT_Y_OFFSET, w: 177, h: 105 },
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
  wagonMask: {
    x: 0,
    y: 820,
    w: 260,
    h: 200,
  },
  boardMask: {
    x: 30,
    y: 44,
    w: 964,
    h: 968,
    r: 78,
  },
};

const FALLBACK_FIELD_PATTERN = [
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
];

const COLORS = {
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
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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
    this.alive = true;
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
    this.spawnDistance = this.closestPathDistance(LAYOUT.spawnPoint);
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
  constructor(id, color, ammo, launchFrom, conveyor) {
    this.id = id;
    this.color = color;
    this.ammo = ammo;
    this.maxAmmo = ammo;
    this.slotIndex = null;
    this.speed = 1260;
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
    this.alive = true;
  }

  update(dt, game) {
    if (!this.alive) {
      return;
    }

    if (this.state === "launching") {
      this.launchProgress = Math.min(1, this.launchProgress + dt / 0.22);
      this.position = {
        x: this.launchFrom.x + (this.launchTo.x - this.launchFrom.x) * this.launchProgress,
        y: this.launchFrom.y + (this.launchTo.y - this.launchFrom.y) * this.launchProgress,
      };
      if (this.launchProgress >= 1) {
        this.state = "moving";
        this.position = this.conveyor.pointAtDistance(this.distanceOnTrack);
        game.normalizeShooterQueues(game.cards);
      }
      return;
    }

    if (this.state === "landing") {
      this.landProgress = Math.min(1, this.landProgress + dt / 0.2);
      this.position = {
        x: this.landFrom.x + (this.landTo.x - this.landFrom.x) * this.landProgress,
        y: this.landFrom.y + (this.landTo.y - this.landFrom.y) * this.landProgress,
      };
      if (this.landProgress >= 1) {
        this.state = "parked";
        this.position = { ...this.landTo };
      }
      return;
    }

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

    if (this.state === "moving") {
      const delta = this.speed * dt;
      this.loopDistance += delta;
      this.distanceOnTrack -= delta;
      this.position = this.conveyor.pointAtDistance(this.distanceOnTrack);

      if (this.loopDistance >= game.conveyor.totalLength) {
        const freeSlotIndex = game.claimFreeSlot(this.id);
        if (freeSlotIndex === null) {
          this.alive = false;
          return;
        }
        this.slotIndex = freeSlotIndex;
        this.landTo = game.getSlotCenter(freeSlotIndex);
        this.landFrom = { ...this.position };
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
  constructor(cardLayouts) {
    this.cardLayouts = cardLayouts.map((card) => ({ ...card }));
    this.cards = [];
  }

  resetFromBlocks(blocks) {
    this.cards = this.createFromBlocks(blocks);
    return this.cards;
  }

  createFromBlocks(blocks) {
    const colorCounts = blocks.reduce((acc, block) => {
      acc[block.color] = (acc[block.color] || 0) + 1;
      return acc;
    }, {});

    const cards = this.cardLayouts.map((card, index) => ({
      ...card,
      index,
      ammo: 0,
      used: false,
    }));

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
      const frontLayout = this.getCardLayout(lane, 0);
      if (!frontLayout) {
        continue;
      }
      const frontCard = cards.find((card) => card.lane === lane && card.row === 0 && !card.used);
      if (frontCard) {
        frontCard.x = frontLayout.x;
        frontCard.y = frontLayout.y;
        frontCard.w = frontLayout.w;
        frontCard.h = frontLayout.h;
        continue;
      }
      const rearCard = cards.find((card) => card.lane === lane && card.row === 1 && !card.used);
      if (!rearCard) {
        continue;
      }
      rearCard.row = 0;
      rearCard.x = frontLayout.x;
      rearCard.y = frontLayout.y;
      rearCard.w = frontLayout.w;
      rearCard.h = frontLayout.h;
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
    this.dpr = 1;

    this.referenceImage = new Image();
    this.referenceImage.src = "Ref.png";
    this.referenceImage.decoding = "sync";

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
    this.blocks = [];
    this.units = [];
    this.projectiles = [];
    this.particles = [];
    this.cardManager = new CardManager(LAYOUT.cards);
    this.slotManager = new SlotManager(LAYOUT.slots, SLOT_CLAIM_ORDER);
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

  restart() {
    if (!this.referenceImage.complete) {
      this.gameState = "loading";
      this.invalidate(false);
      return;
    }

    this.blocks = this.createBlocksFromReference();
    this.units = [];
    this.projectiles = [];
    this.particles = [];
    this.cards = this.cardManager.resetFromBlocks(this.blocks);
    this.slotManager.reset();
    this.setWagonIdle();

    this.gameState = "playing";
    this.remainingBlocks = this.blocks.length;
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
        blocks.push(new Block(id, col, row, blockColor));
      }
    }

    return blocks;
  }

  createCardsFromBlocks() {
    this.cards = this.cardManager.createFromBlocks(this.blocks);
    return this.cards;
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
    if (!this.referencePixels) {
      const fallbackRow = FALLBACK_FIELD_PATTERN[row] || "";
      return fallbackRow[col] === "G" ? "green" : "black";
    }
    return this.sampleReferenceCellColor(col, row);
  }

  spawnUnit(cardIndex) {
    if (this.gameState !== "playing") {
      return false;
    }

    if (this.units.length >= MAX_ACTIVE_UNITS) {
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
      this.conveyor
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
    unit.launchProgress = 0;
    unit.landProgress = 0;
    unit.landTo = null;
    unit.landFrom = { ...unit.launchTo };
    unit.loopDistance = 0;
    unit.distanceOnTrack = this.conveyor.spawnDistance;
    unit.cooldown = 0;
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
    const center = this.getFieldCenter();
    const dx = center.x - sourcePoint.x;
    const dy = center.y - sourcePoint.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1e-6) {
      return null;
    }
    return {
      x: dx / dist,
      y: dy / dist,
    };
  }

  findTargetOnLine(sourcePoint, color, direction) {
    let best = null;
    let bestDistance = Infinity;
    const lineHalfWidth = LAYOUT.cellSize * 0.45;
    const reservedTargets = new Set(
      this.projectiles
        .filter((projectile) => projectile.target && projectile.target.alive)
        .map((projectile) => projectile.target.id)
    );

    for (const block of this.blocks) {
      if (!block.alive || block.color !== color || reservedTargets.has(block.id)) {
        continue;
      }
      const center = this.blockCenter(block);
      const dx = center.x - sourcePoint.x;
      const dy = center.y - sourcePoint.y;
      const forwardDistance = dx * direction.x + dy * direction.y;
      if (forwardDistance <= 0) {
        continue;
      }
      const sideDistance = Math.abs(dx * direction.y - dy * direction.x);
      if (sideDistance > lineHalfWidth) {
        continue;
      }
      if (forwardDistance < bestDistance) {
        bestDistance = forwardDistance;
        best = block;
      }
    }

    return best;
  }

  fireProjectile(unit, block) {
    const target = this.blockCenter(block);
    const dx = target.x - unit.position.x;
    const dy = target.y - unit.position.y;
    const dist = Math.max(1, Math.hypot(dx, dy));

    this.projectiles.push({
      x: unit.position.x,
      y: unit.position.y,
      toX: target.x,
      toY: target.y,
      vx: (dx / dist) * BULLET_SPEED,
      vy: (dy / dist) * BULLET_SPEED,
      life: Math.max(0.06, dist / BULLET_SPEED),
      target: block,
      color: unit.color,
      radius: BULLET_RADIUS,
      trailLength: BULLET_TRAIL_LENGTH,
    });
  }

  damageBlock(block, color) {
    if (!block || !block.alive) {
      return;
    }

    block.alive = false;
    block.hitFlash = 1;
    this.remainingBlocks -= 1;

    const center = this.blockCenter(block);
    this.spawnParticles(center.x, center.y, color, 10);

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

  update(dt) {
    for (const block of this.blocks) {
      block.update(dt);
    }

    for (const unit of this.units) {
      unit.update(dt, this);
    }
    this.units = this.units.filter((unit) => unit.alive);

    const nextProjectiles = [];
    for (const projectile of this.projectiles) {
      projectile.life -= dt;
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;

      const reachedTarget =
        projectile.life <= 0 ||
        Math.hypot(projectile.x - projectile.toX, projectile.y - projectile.toY) <= projectile.radius + 2;
      if (reachedTarget) {
        this.damageBlock(projectile.target, projectile.color);
      } else {
        nextProjectiles.push(projectile);
      }
    }
    this.projectiles = nextProjectiles;

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
  }

  drawLoading(ctx) {
    ctx.fillStyle = "#214113";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = COLORS.white;
    ctx.font = "700 42px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const label = this.gameState === "error" ? "Ref.png failed to load" : "Loading Ref.png...";
    ctx.fillText(label, this.width / 2, this.height / 2);
  }

  drawBackground(ctx) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, this.width, this.height);
    const board = LAYOUT.boardMask;

    // Base board area (grass).
    ctx.save();
    roundedRect(ctx, board.x, board.y, board.w, board.h, board.r);
    ctx.fillStyle = BOARD_FILL_COLOR;
    ctx.fill();
    ctx.restore();

    // Guaranteed non-brown underlay under the 9x9 image field.
    ctx.save();
    ctx.fillStyle = FIELD_UNDERLAY_COLOR;
    ctx.fillRect(
      LAYOUT.fieldX - 2,
      LAYOUT.fieldY - 2,
      LAYOUT.fieldCols * LAYOUT.fieldStep + 4,
      LAYOUT.fieldRows * LAYOUT.fieldStep + 4
    );
    ctx.restore();

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
    ctx.beginPath();
    roundedRect(ctx, outerWood.x, outerWood.y, outerWood.w, outerWood.h, outerWood.r);
    roundedRect(ctx, innerWood.x, innerWood.y, innerWood.w, innerWood.h, innerWood.r);
    const woodGrad = ctx.createLinearGradient(0, outerWood.y, 0, outerWood.y + outerWood.h);
    woodGrad.addColorStop(0, "#9f6e34");
    woodGrad.addColorStop(0.5, "#6f451f");
    woodGrad.addColorStop(1, "#a47539");
    ctx.fillStyle = woodGrad;
    // roundedRect() starts a new path internally, so fill the outer wood first...
    ctx.fill();
    // ...then paint the center back to board color to avoid a solid brown square in the field.
    roundedRect(ctx, innerWood.x, innerWood.y, innerWood.w, innerWood.h, innerWood.r);
    ctx.fillStyle = BOARD_FILL_COLOR;
    ctx.fill();
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
      ctx.fillStyle = "#5b3619";
      ctx.fillRect(-19, -6, 38, 12);
      ctx.fillStyle = "rgba(255,255,255,0.12)";
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
      ctx.strokeStyle = "#ded7ca";
      ctx.lineWidth = 6;
      ctx.stroke();
      roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, rect.r);
      ctx.strokeStyle = "rgba(55,55,55,0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    ctx.save();
    strokeRail(outerRail);
    strokeRail(innerRail);
    ctx.restore();

  }

  drawDestroyedBlocks(ctx) {
    for (const block of this.blocks) {
      if (!block.alive) {
        continue;
      }
      const sprite = block.color === "green" ? this.sprites.greenTile : this.sprites.blackTile;
      if (sprite) {
        ctx.drawImage(sprite, block.x, block.y, block.size, block.size);
      } else {
        ctx.fillStyle = block.color === "green" ? "#81c341" : "#2a2a2a";
        roundedRect(ctx, block.x, block.y, block.size, block.size, 8);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    for (const block of this.blocks) {
      if (block.alive || block.hitFlash <= 0) {
        continue;
      }
      ctx.save();
      ctx.globalAlpha = block.hitFlash * 0.25;
      ctx.fillStyle = "#ffffff";
      roundedRect(ctx, block.x, block.y, block.size, block.size, 8);
      ctx.fill();
      ctx.restore();
    }

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
      if (unit.state === "moving") {
        this.drawPig(ctx, unit.position.x, unit.position.y, SHOOTER_PIG_SIZE, unit.color, 1);
        this.drawAmmoBadge(ctx, unit.position.x, unit.position.y + 70, unit.ammo, 30, 20);
      } else {
        this.drawPig(ctx, unit.position.x, unit.position.y, SHOOTER_PIG_SIZE, unit.color, 1);
        this.drawAmmoBadge(ctx, unit.position.x, unit.position.y + 62, unit.ammo, 28, 18);
      }
    }
  }

  drawSlotState(ctx) {
    for (const slot of LAYOUT.slots) {
      const size = Math.min(slot.w, slot.h);
      const x = slot.x + (slot.w - size) * 0.5;
      const y = slot.y + (slot.h - size) * 0.5;
      ctx.save();
      roundedRect(ctx, x, y, size, size, 14);
      ctx.fillStyle = "rgba(20, 26, 32, 0.62)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }

  drawPig(ctx, x, y, size, colorName, alpha = 1) {
    const bodyColor = colorName === "green" ? "#8edf56" : "#2b2b2b";
    const darkColor = colorName === "green" ? "#63a536" : "#111111";
    const shineColor = colorName === "green" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)";
    const earW = size * 0.2;
    const earH = size * 0.24;
    const bodyW = size;
    const bodyH = size * 0.92;
    const bodyX = x - bodyW / 2;
    const bodyY = y - bodyH / 2 + earH * 0.6;

    ctx.save();
    ctx.globalAlpha = alpha;
    roundedRect(ctx, bodyX + 1.5, bodyY + 3, bodyW, bodyH, size * 0.26);
    ctx.fillStyle = darkColor;
    ctx.fill();

    roundedRect(ctx, bodyX, bodyY, bodyW, bodyH - 2, size * 0.26);
    ctx.fillStyle = bodyColor;
    ctx.fill();

    roundedRect(ctx, bodyX + bodyW * 0.18, bodyY - earH * 0.85, earW, earH, 5);
    ctx.fillStyle = darkColor;
    ctx.fill();
    roundedRect(ctx, bodyX + bodyW * 0.62, bodyY - earH * 0.85, earW, earH, 5);
    ctx.fill();

    roundedRect(ctx, bodyX + 6, bodyY + 6, bodyW - 12, bodyH * 0.34, size * 0.18);
    ctx.fillStyle = shineColor;
    ctx.fill();
    ctx.restore();
  }

  drawWagonLayer(ctx) {
    void ctx;
  }

  drawBottomCleanup(ctx) {
    const slotsBottom = Math.max(...LAYOUT.slots.map((slot) => slot.y + slot.h));
    const y = Math.floor(slotsBottom);
    const h = this.height - y;
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, y, this.width, h);
    ctx.restore();
  }

  drawAmmoBadge(ctx, x, y, value, width, fontSize) {
    ctx.save();
    roundedRect(ctx, x - width, y - 13, width * 2, 24, 8);
    ctx.fillStyle = COLORS.badgeBg;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = COLORS.white;
    ctx.strokeStyle = COLORS.shadow;
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.font = `900 ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText(String(value), x, y + 0.5);
    ctx.fillText(String(value), x, y + 0.5);
    ctx.restore();
  }

  drawCardState(ctx) {
    const cardsToDraw = [...this.cards].sort((a, b) => a.row - b.row);
    for (const card of cardsToDraw) {
      if (card.used) {
        continue;
      }
      const center = this.getCardPigCenter(card);
      this.drawPig(ctx, center.x, center.y, SHOOTER_PIG_SIZE, card.color, 1);
      this.drawAmmoBadge(ctx, center.x, card.y + card.h - 16, card.ammo, 38, 32);
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
      const bulletColor = projectile.color === "green" ? COLORS.bulletGreen : COLORS.bulletBlack;
      const bulletCoreColor = projectile.color === "green" ? COLORS.bulletGreenCore : COLORS.bulletBlackCore;
      const speed = Math.hypot(projectile.vx, projectile.vy) || 1;
      const dirX = projectile.vx / speed;
      const dirY = projectile.vy / speed;
      const tailX = projectile.x - dirX * projectile.trailLength;
      const tailY = projectile.y - dirY * projectile.trailLength;
      ctx.save();
      ctx.globalAlpha = 0.75;
      ctx.strokeStyle = bulletColor;
      ctx.lineCap = "round";
      ctx.lineWidth = projectile.radius * 1.35;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(projectile.x, projectile.y);
      ctx.stroke();

      ctx.globalAlpha = 0.92;
      ctx.strokeStyle = bulletCoreColor;
      ctx.lineWidth = projectile.radius * 0.6;
      ctx.beginPath();
      ctx.moveTo(tailX + dirX * projectile.radius * 0.8, tailY + dirY * projectile.radius * 0.8);
      ctx.lineTo(projectile.x, projectile.y);
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.fillStyle = bulletColor;
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = bulletCoreColor;
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();
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

  render() {
    const ctx = this.ctx;
    if (this.gameState === "loading") {
      this.drawLoading(ctx);
      return;
    }

    ctx.clearRect(0, 0, this.width, this.height);
    this.drawBackground(ctx);
    this.drawWagonLayer(ctx);
    this.drawBottomCleanup(ctx);
    this.drawDestroyedBlocks(ctx);
    this.drawSlotState(ctx);
    this.drawProjectiles(ctx);
    this.drawParticles(ctx);
    this.drawCardState(ctx);
    this.drawUnitsOnTrack(ctx);
    this.drawTapDebug(ctx);
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
    const hasActiveUnits = this.units.some((unit) => unit.alive && unit.state !== "parked");
    if (
      (this.gameState === "playing" && hasActiveUnits) ||
      this.projectiles.length > 0 ||
      this.particles.length > 0
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
    this.dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.invalidate(false);
  }

  hitTest(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
  }

  handlePointerMove(x, y) {
    void x;
    void y;
  }

  handlePointerDown(x, y) {
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
    return {
      x: (event.clientX - rect.left) * (this.width / rect.width),
      y: (event.clientY - rect.top) * (this.height / rect.height),
    };
  }

  bindEvents() {
    window.addEventListener("resize", () => this.resize());
    this.canvas.addEventListener("pointermove", (event) => {
      const point = this.getPointerPosition(event);
      this.handlePointerMove(point.x, point.y);
    });
    this.canvas.addEventListener("pointerdown", (event) => {
      const point = this.getPointerPosition(event);
      this.handlePointerDown(point.x, point.y);
      event.preventDefault();
    });
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
      source: "Ref.png",
      coordinateSystem: {
        origin: "top-left",
        xDirection: "right",
        yDirection: "down",
        units: "canvas pixels",
      },
      remainingBlocks: this.remainingBlocks,
      blocksTotal: this.blocks.length,
      blocksByColor: {
        green: this.blocks.filter((block) => block.alive && block.color === "green").length,
        black: this.blocks.filter((block) => block.alive && block.color === "black").length,
      },
      units: this.units.map((unit) => ({
        id: unit.id,
        color: unit.color,
        ammo: unit.ammo,
        slotIndex: unit.slotIndex,
        x: Number(unit.position.x.toFixed(1)),
        y: Number(unit.position.y.toFixed(1)),
      })),
      shooterCards: this.cards.map((card) => ({
        index: card.index,
        lane: card.lane,
        row: card.row,
        color: card.color,
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
