const LOGICAL_WIDTH = 1024;
const LOGICAL_HEIGHT = 1600;
const FIXED_DT = 1 / 60;
const MAX_ACTIVE_UNITS = 4;
const FIRE_INTERVAL = 0.02;
const BULLET_SPEED = 3200;
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
const CANNON_SHOT_POP_DURATION = 0.24;

const LAYOUT = {
  fieldX: 220,
  fieldY: 276,
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
    x: 0,
    y: 0,
    w: 1024,
    h: 1600,
    r: 0,
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
  sceneShadow: "rgba(19, 32, 10, 0.2)",
  fieldShadow: "rgba(16, 28, 9, 0.24)",
  blockShadow: "rgba(15, 24, 8, 0.28)",
  ringGreen: "rgba(163, 243, 111, 0.85)",
  ringBlack: "rgba(236, 236, 236, 0.8)",
  slotPulse: "rgba(255, 235, 140, 0.7)",
  textGlow: "rgba(0, 0, 0, 0.45)",
};

const CONFETTI_COLORS = ["#ff5f5f", "#ffd166", "#6ee7b7", "#60a5fa", "#f9a8d4", "#c4b5fd"];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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
    this.shotPop = 0;
    this.alive = true;
  }

  triggerShotPop() {
    this.shotPop = 1;
  }

  update(dt, game) {
    if (!this.alive) {
      return;
    }

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
      this.triggerShotPop();
    }

    const velX = (this.position.x - this.prevPosition.x) / Math.max(dt, 0.0001);
    const velY = (this.position.y - this.prevPosition.y) / Math.max(dt, 0.0001);
    const speed = Math.hypot(velX, velY);
    const movementStress = clamp(speed / 920, 0, 1);
    this.parkBounce = Math.max(0, this.parkBounce - dt * 5.5);
    this.shotPop = Math.max(0, this.shotPop - dt / CANNON_SHOT_POP_DURATION);
    const bouncePulse = this.parkBounce > 0 ? Math.sin((1 - this.parkBounce) * Math.PI * 3) * this.parkBounce : 0;
    const popProgress = 1 - this.shotPop;
    const popMain = Math.sin(popProgress * Math.PI) * this.shotPop;
    const popElastic = Math.sin(popProgress * Math.PI * 3.4) * this.shotPop * 0.42;
    const popScale = popMain * 0.32 + popElastic * 0.12;
    this.scaleX = 1 + movementStress * 0.09 - bouncePulse * 0.12 + popScale;
    this.scaleY = 1 - movementStress * 0.08 + bouncePulse * 0.15 + popScale;
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
    this.impactRings = [];
    this.slotBursts = [];
    this.floatTexts = [];
    this.confetti = [];
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
    this.debugButton = document.getElementById("debug6");

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
        const tileX = Math.floor((x - rect.x) / patch);
        const tileY = Math.floor((y - rect.y) / patch);
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
    this.drawTiledBackdrop(
      ctx,
      rect,
      BOARD_FILL_COLOR,
      ["#6a9f35", "#72aa3a", "#7bb642", "#5f9430", "#89c84b"],
      "rgba(28, 52, 14, 0.16)"
    );
  }

  drawDirtBackdrop(ctx, rect) {
    this.drawTiledBackdrop(
      ctx,
      rect,
      "#b98c5e",
      ["#b18052", "#ba8a5b", "#c89a67", "#a9784a", "#d1a874"],
      "rgba(64, 40, 22, 0.2)"
    );
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
    this.impactRings = [];
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
    unit.shotPop = 0;
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

  findTargetOnLine(sourcePoint, color, direction) {
    const lineHalfWidth = LAYOUT.cellSize * 0.42;
    const activeInnerLayer = this.getActiveInnerLayer();
    if (activeInnerLayer < 0) {
      return null;
    }
    const reservedTargets = new Set(
      this.projectiles
        .filter((projectile) => projectile.target && !projectile.target.alive)
        .map((projectile) => projectile.target.id)
    );
    let best = null;
    let bestLayer = -1;
    let bestSideDepth = Infinity;
    let bestForwardDistance = Infinity;
    for (const block of this.blocks) {
      if (block.alive || block.color !== color || reservedTargets.has(block.id)) {
        continue;
      }
      if (block.layer !== activeInnerLayer) {
        continue;
      }
      const sideDepth =
        direction.side === "left"
          ? block.col
          : direction.side === "right"
            ? LAYOUT.fieldCols - 1 - block.col
            : direction.side === "top"
              ? block.row
              : LAYOUT.fieldRows - 1 - block.row;
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
      const betterLayer = block.layer > bestLayer;
      const sameLayer = block.layer === bestLayer;
      const betterDepth = sameLayer && sideDepth < bestSideDepth;
      const sameDepth = sameLayer && sideDepth === bestSideDepth;
      const betterDistance = sameDepth && forwardDistance < bestForwardDistance;
      if (!betterLayer && !betterDepth && !betterDistance) {
        continue;
      }
      best = block;
      bestLayer = block.layer;
      bestSideDepth = sideDepth;
      bestForwardDistance = forwardDistance;
    }

    return best;
  }

  getActiveInnerLayer() {
    let maxLayer = -1;
    for (const block of this.blocks) {
      if (!block.alive && block.layer > maxLayer) {
        maxLayer = block.layer;
      }
    }
    return maxLayer;
  }

  fireProjectile(unit, block) {
    const target = this.blockCenter(block);
    const dx = target.x - unit.position.x;
    const dy = target.y - unit.position.y;
    const dist = Math.max(1, Math.hypot(dx, dy));
    const life = Math.max(0.03, dist / BULLET_SPEED);
    const nx = -dy / dist;
    const ny = dx / dist;
    const arcStrength = Math.min(52, Math.max(16, dist * 0.14));
    const arcSign = (unit.id + block.id) % 2 === 0 ? 1 : -1;
    const controlX = (unit.position.x + target.x) * 0.5 + nx * arcStrength * arcSign;
    const controlY = (unit.position.y + target.y) * 0.5 + ny * arcStrength * arcSign;

    this.projectiles.push({
      x: unit.position.x,
      y: unit.position.y,
      fromX: unit.position.x,
      fromY: unit.position.y,
      toX: target.x,
      toY: target.y,
      controlX,
      controlY,
      life,
      maxLife: life,
      target: block,
      color: unit.color,
      radius: BULLET_RADIUS * 0.9,
      trailLength: BULLET_TRAIL_LENGTH * 1.05,
      ghostTrailCount: 6,
      trail: [],
      trailEmitCarry: 0,
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
    this.spawnParticles(center.x, center.y, color, 18);
    this.spawnImpactRing(center.x, center.y, color, 1);

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

  hasSpawnablePigs() {
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
    return !this.hasSpawnablePigs();
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

    const nextProjectiles = [];
    for (const projectile of this.projectiles) {
      projectile.life -= dt;
      if (projectile.life > 0) {
        const fade = projectile.maxLife > 0 ? projectile.life / projectile.maxLife : 0;
        const progress = easeOutCubic(1 - fade);
        const head = quadraticBezierPoint(
          { x: projectile.fromX, y: projectile.fromY },
          { x: projectile.controlX, y: projectile.controlY },
          { x: projectile.toX, y: projectile.toY },
          progress
        );
        projectile.x = head.x;
        projectile.y = head.y;
        projectile.trailEmitCarry += dt * 95;
        const emitCount = Math.floor(projectile.trailEmitCarry);
        if (emitCount > 0) {
          projectile.trailEmitCarry -= emitCount;
          for (let i = 0; i < emitCount; i++) {
            projectile.trail.push({
              x: projectile.x + (Math.random() - 0.5) * 4,
              y: projectile.y + (Math.random() - 0.5) * 4,
              life: 1,
            });
          }
        }
        projectile.trail = projectile.trail
          .map((point) => ({
            ...point,
            life: point.life - dt * 6.5,
          }))
          .filter((point) => point.life > 0)
          .slice(-12);
        nextProjectiles.push(projectile);
      } else {
        this.damageBlock(projectile.target, projectile.color);
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

    this.impactRings = this.impactRings
      .map((ring) => ({
        ...ring,
        life: ring.life - dt,
      }))
      .filter((ring) => ring.life > 0);

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
    const label = this.gameState === "error" ? "Ref.png failed to load" : "Loading Ref.png...";
    ctx.fillText(label, this.width / 2, this.height / 2);
  }

  drawBackground(ctx) {
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
    woodGrad.addColorStop(0, "#9f6e34");
    woodGrad.addColorStop(0.5, "#6f451f");
    woodGrad.addColorStop(1, "#a47539");
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

  drawVictoryBackground(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, "#d8f3ff");
    gradient.addColorStop(0.55, "#a8ddff");
    gradient.addColorStop(1, "#8bc9ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.beginPath();
    ctx.arc(this.width * 0.16, this.height * 0.18, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.width * 0.84, this.height * 0.28, 170, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawVictoryArtwork(ctx) {
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
    ctx.fillStyle = "rgba(255, 255, 255, 0.42)";
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

    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.fillStyle = `rgba(10, 14, 10, ${shadowOpacity})`;
    roundedRect(ctx, x + 2, y + 4, size - 1, size - 1, 8);
    ctx.fill();

    if (sprite) {
      ctx.drawImage(sprite, x, y, size, size);
    } else {
      roundedRect(ctx, x, y, size, size, 8);
      ctx.fillStyle = baseColor;
      ctx.fill();
    }

    roundedRect(ctx, x, y, size, size, 8);
    const faceGrad = ctx.createLinearGradient(x, y, x + size, y + size);
    faceGrad.addColorStop(0, `rgba(255, 255, 255, ${0.18 + bevelStrength * 0.18})`);
    faceGrad.addColorStop(0.45, "rgba(255, 255, 255, 0.02)");
    faceGrad.addColorStop(1, `rgba(0, 0, 0, ${0.12 + bevelStrength * 0.2})`);
    ctx.fillStyle = faceGrad;
    ctx.fill();

    ctx.lineWidth = 1;
    roundedRect(ctx, x + 0.5, y + 0.5, size - 1, size - 1, 7.5);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.22 + bevelStrength * 0.2})`;
    ctx.stroke();
    roundedRect(ctx, x + 1.5, y + 1.5, size - 3, size - 3, 6.5);
    ctx.strokeStyle = `rgba(0, 0, 0, ${0.22 + bevelStrength * 0.24})`;
    ctx.stroke();

    ctx.restore();
  }

  drawDestroyedBlocks(ctx) {
    for (const block of this.blocks) {
      if (block.alive) {
        this.drawVolumetricBlock(ctx, block, block.x, block.y, {
          alpha: 0.96,
          shadowOpacity: 0.22,
          bevelStrength: 0.26,
        });
      }
    }

    for (const block of this.blocks) {
      if (!block.alive || block.hitFlash <= 0) {
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

  drawTargetSilhouette(ctx) {
    for (const block of this.blocks) {
      if (block.alive) {
        continue;
      }
      this.drawVolumetricBlock(ctx, block, block.x, block.y, {
        alpha: 0.28,
        shadowOpacity: 0.14,
        bevelStrength: 0.12,
      });
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
      const drawX = unit.position.x;
      const drawY = unit.position.y;
      ctx.save();
      ctx.translate(drawX, drawY);
      ctx.scale(unit.scaleX || 1, unit.scaleY || 1);
      ctx.translate(-drawX, -drawY);
      if (unit.state === "moving") {
        this.drawPig(ctx, drawX, drawY, SHOOTER_PIG_SIZE, unit.color, 1);
        this.drawAmmoBadge(ctx, drawX, drawY + 70, unit.ammo, 30, 20);
      } else {
        this.drawPig(ctx, drawX, drawY, SHOOTER_PIG_SIZE, unit.color, 1);
        this.drawAmmoBadge(ctx, drawX, drawY + 62, unit.ammo, 28, 18);
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

  drawPig(ctx, x, y, size, colorName, alpha = 1) {
    const bodyColor = colorName === "green" ? "#8edf56" : "#3f3f3f";
    const darkColor = colorName === "green" ? "#4f8c2e" : "#1c1c1c";
    const metalColor = colorName === "green" ? "#baf18f" : "#bcbcbc";
    const shineColor = colorName === "green" ? "rgba(255,255,255,0.26)" : "rgba(255,255,255,0.18)";
    const baseW = size * 0.84;
    const baseH = size * 0.44;
    const barrelW = size * 0.26;
    const barrelH = size * 0.58;
    const wheelR = size * 0.2;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(0, 0, 0, 0.26)";
    ctx.beginPath();
    ctx.ellipse(x, y + size * 0.42, size * 0.36, size * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wheels
    ctx.fillStyle = darkColor;
    ctx.beginPath();
    ctx.arc(x - baseW * 0.24, y + baseH * 0.42, wheelR, 0, Math.PI * 2);
    ctx.arc(x + baseW * 0.24, y + baseH * 0.42, wheelR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = metalColor;
    ctx.beginPath();
    ctx.arc(x - baseW * 0.24, y + baseH * 0.42, wheelR * 0.36, 0, Math.PI * 2);
    ctx.arc(x + baseW * 0.24, y + baseH * 0.42, wheelR * 0.36, 0, Math.PI * 2);
    ctx.fill();

    // Carriage
    roundedRect(ctx, x - baseW / 2, y - baseH * 0.2, baseW, baseH, size * 0.12);
    ctx.fillStyle = darkColor;
    ctx.fill();
    roundedRect(ctx, x - baseW / 2, y - baseH * 0.28, baseW, baseH * 0.9, size * 0.12);
    ctx.fillStyle = bodyColor;
    ctx.fill();

    // Barrel
    roundedRect(ctx, x - barrelW / 2, y - barrelH * 0.9, barrelW, barrelH, size * 0.11);
    const barrelGrad = ctx.createLinearGradient(x - barrelW / 2, y - barrelH * 0.9, x + barrelW / 2, y);
    barrelGrad.addColorStop(0, metalColor);
    barrelGrad.addColorStop(1, darkColor);
    ctx.fillStyle = barrelGrad;
    ctx.fill();
    roundedRect(ctx, x - barrelW * 0.34, y - barrelH * 0.98, barrelW * 0.68, barrelH * 0.16, size * 0.08);
    ctx.fillStyle = darkColor;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y - barrelH * 0.9 + 2, barrelW * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = "#0d0d0d";
    ctx.fill();

    roundedRect(ctx, x - baseW * 0.36, y - baseH * 0.22, baseW * 0.72, baseH * 0.26, size * 0.08);
    ctx.fillStyle = shineColor;
    ctx.fill();
    ctx.restore();
  }

  drawWagonLayer(ctx) {
    void ctx;
  }

  drawBottomCleanup(ctx) {
    void ctx;
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
      const fade = projectile.maxLife > 0 ? projectile.life / projectile.maxLife : 0;
      const progress = easeOutCubic(1 - fade);
      const start = { x: projectile.fromX, y: projectile.fromY };
      const control = { x: projectile.controlX, y: projectile.controlY };
      const end = { x: projectile.toX, y: projectile.toY };
      const head = quadraticBezierPoint(start, control, end, progress);
      const prev = quadraticBezierPoint(start, control, end, Math.max(0, progress - 0.035));
      const tangentX = head.x - prev.x;
      const tangentY = head.y - prev.y;
      const dist = Math.max(1, Math.hypot(tangentX, tangentY));
      const dirX = tangentX / dist;
      const dirY = tangentY / dist;
      const headX = head.x;
      const headY = head.y;
      const tailX = headX - dirX * Math.min(projectile.trailLength, dist * 0.5);
      const tailY = headY - dirY * Math.min(projectile.trailLength, dist * 0.5);
      const blockSize = LAYOUT.cellSize * 0.78;
      const blockSprite = projectile.color === "green" ? this.sprites.greenTile : this.sprites.blackTile;
      ctx.save();
      for (const point of projectile.trail) {
        const trailAlpha = point.life * 0.24 * fade;
        const size = blockSize * (0.34 + point.life * 0.26);
        ctx.globalAlpha = trailAlpha;
        if (blockSprite) {
          ctx.drawImage(blockSprite, point.x - size / 2, point.y - size / 2, size, size);
        } else {
          ctx.fillStyle = bulletCoreColor;
          roundedRect(ctx, point.x - size / 2, point.y - size / 2, size, size, 5);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 0.45 * fade;
      ctx.strokeStyle = bulletColor;
      ctx.lineCap = "round";
      ctx.lineWidth = projectile.radius * 1.35;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.stroke();

      ctx.globalAlpha = 0.92 * fade;
      ctx.strokeStyle = bulletCoreColor;
      ctx.lineWidth = projectile.radius * 0.6;
      ctx.beginPath();
      ctx.moveTo(tailX + dirX * projectile.radius * 0.8, tailY + dirY * projectile.radius * 0.8);
      ctx.lineTo(headX, headY);
      ctx.stroke();

      for (let i = projectile.ghostTrailCount; i >= 1; i--) {
        const ghostT = Math.max(0, progress - i * 0.05);
        const ghost = quadraticBezierPoint(start, control, end, ghostT);
        const alpha = (0.22 / i) * fade;
        const scale = 1 - i * 0.055;
        const size = blockSize * scale;
        ctx.globalAlpha = alpha;
        if (blockSprite) {
          ctx.drawImage(blockSprite, ghost.x - size / 2, ghost.y - size / 2, size, size);
        } else {
          ctx.fillStyle = bulletCoreColor;
          roundedRect(ctx, ghost.x - size / 2, ghost.y - size / 2, size, size, 5);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 0.98;
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

  render() {
    const ctx = this.ctx;
    if (this.gameState === "loading") {
      this.drawLoading(ctx);
      return;
    }

    ctx.clearRect(0, 0, this.width, this.height);
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
      this.needsRender = false;
      return;
    }

    const fieldCenter = this.getFieldCenter();
    ctx.save();
    ctx.translate(fieldCenter.x, fieldCenter.y);
    ctx.scale(this.cameraZoom, this.cameraZoom);
    ctx.translate(-fieldCenter.x, -fieldCenter.y);
    this.drawBackground(ctx);
    this.drawTargetSilhouette(ctx);
    this.drawWagonLayer(ctx);
    this.drawBottomCleanup(ctx);
    this.drawDestroyedBlocks(ctx);
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
    const zoomAnimating = Math.abs(this.cameraZoomTarget - this.cameraZoom) > 0.001;
    if (
      (this.gameState === "playing" && hasActiveUnits) ||
      this.projectiles.length > 0 ||
      this.particles.length > 0 ||
      this.impactRings.length > 0 ||
      this.slotBursts.length > 0 ||
      this.floatTexts.length > 0 ||
      this.confetti.length > 0 ||
      this.victoryConfettiTime > 0 ||
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
    if (this.debugButton) {
      this.debugButton.addEventListener("click", (event) => {
        this.triggerDebug6();
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
        green: this.blocks.filter((block) => !block.alive && block.color === "green").length,
        black: this.blocks.filter((block) => !block.alive && block.color === "black").length,
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
window.debug6 = () => game.triggerDebug6();
