const LOGICAL_WIDTH = 390;
const LOGICAL_HEIGHT = 844;
const FIXED_DT = 1 / 60;

const COLORS = {
  bgTop: "#6d7096",
  bgBottom: "#4c506d",
  frame: "#686d92",
  frameEdge: "#ddeaff",
  panel: "#5f6489",
  panelInner: "#555978",
  track: "#767ca2",
  trackShadow: "#5a607f",
  trackArrow: "rgba(255,255,255,0.11)",
  text: "#ffffff",
  subtext: "#dde4ff",
  darkText: "#272942",
  pink: "#ff74cd",
  pinkDark: "#d84db0",
  cyan: "#85efff",
  cyanDark: "#58d5ee",
  slot: "#414564",
  slotEdge: "#2f3350",
  cardShadow: "rgba(14, 17, 30, 0.35)",
  gold: "#ffcb52",
  goldDark: "#e4a52f",
  shadow: "rgba(18, 20, 38, 0.35)",
  overlay: "rgba(12, 14, 27, 0.52)",
  blast: "#fff5c5",
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
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

function drawGlossyPill(ctx, x, y, w, h, colors, text, textSize) {
  const gradient = ctx.createLinearGradient(x, y, x, y + h);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);

  ctx.save();
  roundedRect(ctx, x, y, w, h, h / 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(31, 39, 62, 0.65)";
  ctx.stroke();

  const shine = ctx.createLinearGradient(x, y, x, y + h * 0.6);
  shine.addColorStop(0, "rgba(255,255,255,0.34)");
  shine.addColorStop(1, "rgba(255,255,255,0)");
  roundedRect(ctx, x + 2, y + 2, w - 4, h * 0.48, h / 2);
  ctx.fillStyle = shine;
  ctx.fill();

  ctx.fillStyle = COLORS.text;
  ctx.strokeStyle = "rgba(28, 31, 49, 0.9)";
  ctx.lineWidth = 5;
  ctx.lineJoin = "round";
  ctx.font = `800 ${textSize}px Trebuchet MS, Verdana, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText(text, x + w / 2, y + h / 2 + 1);
  ctx.fillText(text, x + w / 2, y + h / 2 + 1);
  ctx.restore();
}

function createRoundedRectPath(x, y, w, h, r, spawnYOffset = 66, samplesPerArc = 14) {
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

  const spawnY = y + h - r - spawnYOffset;
  pushLine(x, spawnY, x, y + h - r, 8);
  pushArc(x + r, y + h - r, r, Math.PI, Math.PI / 2, samplesPerArc);
  pushLine(x + r, y + h, x + w - r, y + h, 24);
  pushArc(x + w - r, y + h - r, r, Math.PI / 2, 0, samplesPerArc);
  pushLine(x + w, y + h - r, x + w, y + r, 20);
  pushArc(x + w - r, y + r, r, 0, -Math.PI / 2, samplesPerArc);
  pushLine(x + w - r, y, x + r, y, 24);
  pushArc(x + r, y + r, r, -Math.PI / 2, -Math.PI, samplesPerArc);
  pushLine(x, y + r, x, spawnY, 18);
  return points;
}

class Block {
  constructor(id, gridX, gridY, color, metrics) {
    this.id = id;
    this.gridX = gridX;
    this.gridY = gridY;
    this.color = color;
    this.hp = 1;
    this.alive = true;
    this.hitFlash = 0;
    const step = metrics.cellSize + metrics.cellGap;
    this.x = metrics.fieldX + this.gridX * step;
    this.y = metrics.fieldY + this.gridY * step;
  }

  update(dt) {
    this.hitFlash = Math.max(0, this.hitFlash - dt * 5);
  }

  draw(ctx, metrics) {
    if (!this.alive) {
      return;
    }

    const sprite = metrics.blockSprites[this.color];
    ctx.drawImage(sprite, this.x, this.y - 2);

    if (this.hitFlash > 0) {
      const size = metrics.cellSize;
      ctx.save();
      ctx.fillStyle = `rgba(255,255,255,${this.hitFlash * 0.55})`;
      roundedRect(ctx, this.x, this.y - 2, size, size - 2, 4);
      ctx.fill();
      ctx.restore();
    }
  }
}

class Conveyor {
  constructor(layout) {
    this.layout = layout;
    this.trackRect = {
      x: layout.trackX,
      y: layout.trackY,
      w: layout.trackW,
      h: layout.trackH,
      r: 34,
    };
    this.path = createRoundedRectPath(
      this.trackRect.x,
      this.trackRect.y,
      this.trackRect.w,
      this.trackRect.h,
      this.trackRect.r
    );
    this.totalLength = 0;
    this.segmentLengths = [];
    this.cumulativeLengths = [0];

    for (let i = 0; i < this.path.length - 1; i++) {
      const segLength = distance(this.path[i], this.path[i + 1]);
      this.segmentLengths.push(segLength);
      this.totalLength += segLength;
      this.cumulativeLengths.push(this.totalLength);
    }
    const closingLength = distance(this.path[this.path.length - 1], this.path[0]);
    this.segmentLengths.push(closingLength);
    this.totalLength += closingLength;
    this.cumulativeLengths.push(this.totalLength);

    this.spawnDistance = 0;
    this.slotCount = 5;
    this.slots = [];
    const slotY = layout.slotY + layout.slotH / 2 + 2;

    for (let i = 0; i < this.slotCount; i++) {
      const x = layout.slotX + i * (layout.slotW + layout.slotGap) + layout.slotW / 2;
      const y = slotY;
      this.slots.push({
        x,
        y,
        occupiedBy: null,
        dockDistance: 0,
      });
    }

    for (const slot of this.slots) {
      slot.dockDistance = this.closestPathDistance({
        x: slot.x,
        y: this.trackRect.y + this.trackRect.h,
      });
    }
  }

  pointAtDistance(distanceOnTrack) {
    let distanceLeft = ((distanceOnTrack % this.totalLength) + this.totalLength) % this.totalLength;

    for (let i = 0; i < this.segmentLengths.length; i++) {
      const segLength = this.segmentLengths[i];
      if (distanceLeft <= segLength || i === this.segmentLengths.length - 1) {
        const a = this.path[i];
        const b = this.path[(i + 1) % this.path.length];
        const t = segLength === 0 ? 0 : distanceLeft / segLength;
        return {
          x: a.x + (b.x - a.x) * t,
          y: a.y + (b.y - a.y) * t,
        };
      }
      distanceLeft -= segLength;
    }

    return { ...this.path[0] };
  }

  firstFreeSlot() {
    return this.slots.find((slot) => slot.occupiedBy === null) || null;
  }

  closestPathDistance(point) {
    let bestDistance = 0;
    let bestScore = Infinity;

    for (let i = 0; i < this.path.length; i++) {
      const pathPoint = this.path[i];
      const score = Math.hypot(point.x - pathPoint.x, point.y - pathPoint.y);
      if (score < bestScore) {
        bestScore = score;
        bestDistance = this.cumulativeLengths[i] || 0;
      }
    }

    return bestDistance;
  }

  hasPassedDock(prevDistance, currentDistance, dockDistance) {
    const baseLap = Math.floor(prevDistance / this.totalLength);
    let targetDistance = dockDistance + baseLap * this.totalLength;
    if (targetDistance <= prevDistance) {
      targetDistance += this.totalLength;
    }
    return currentDistance >= targetDistance;
  }
}

class Unit {
  constructor(id, color, ammo, conveyor) {
    this.id = id;
    this.color = color;
    this.ammo = ammo;
    this.maxAmmo = ammo;
    this.speed = 310;
    this.cooldown = 0;
    this.loopDistance = 0;
    this.distanceOnTrack = conveyor.spawnDistance;
    this.state = "moving";
    this.slotIndex = -1;
    this.position = conveyor.pointAtDistance(this.distanceOnTrack);
    this.alive = true;
  }

  update(dt, game) {
    if (!this.alive) {
      return;
    }

    if (this.state === "moving") {
      const previousDistance = this.distanceOnTrack;
      const delta = this.speed * dt;
      this.loopDistance += delta;
      this.distanceOnTrack += delta;
      this.position = game.conveyor.pointAtDistance(this.distanceOnTrack);

      if (this.loopDistance >= game.conveyor.totalLength) {
        const slot = game.conveyor.firstFreeSlot();
        if (slot && game.conveyor.hasPassedDock(previousDistance, this.distanceOnTrack, slot.dockDistance)) {
          slot.occupiedBy = this.id;
          this.state = "slotted";
          this.slotIndex = game.conveyor.slots.indexOf(slot);
          this.position = { x: slot.x, y: slot.y };
        }
      }
    } else if (this.state === "slotted") {
      const slot = game.conveyor.slots[this.slotIndex];
      if (slot) {
        this.position = { x: slot.x, y: slot.y };
      }
    }

    this.cooldown = Math.max(0, this.cooldown - dt);

    if (this.state === "moving" && this.ammo > 0 && this.cooldown <= 0) {
      const target = game.findTarget(this);
      if (target) {
        this.cooldown = 0.2;
        this.ammo -= 1;
        game.fireProjectile(target, this);
        if (this.ammo <= 0) {
          this.destroy(game);
        }
      }
    } else if (this.ammo <= 0) {
      this.destroy(game);
    }
  }

  destroy(game) {
    if (!this.alive) {
      return;
    }

    this.alive = false;
    if (this.slotIndex >= 0) {
      const slot = game.conveyor.slots[this.slotIndex];
      if (slot && slot.occupiedBy === this.id) {
        slot.occupiedBy = null;
      }
    }
  }
}

class Level {
  constructor(blocks, metrics) {
    this.blocks = blocks;
    this.metrics = metrics;
  }

  aliveBlocks() {
    return this.blocks.filter((block) => block.alive);
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    this.width = LOGICAL_WIDTH;
    this.height = LOGICAL_HEIGHT;
    this.lastTimestamp = 0;
    this.unitIdCounter = 0;
    this.projectiles = [];
    this.particles = [];
    this.pointer = { x: 0, y: 0 };
    this.hoverHotspot = null;
    this.needsRender = true;
    this.isLoopRunning = false;
    this.staticLayer = document.createElement("canvas");
    this.staticCtx = this.staticLayer.getContext("2d");
    this.spriteCache = new Map();

    this.layout = this.createLayout();
    this.restart();
    this.resize();
    this.bindEvents();
  }

  createLayout() {
    return {
      topBarY: 24,
      boardPanel: { x: 18, y: 74, w: 354, h: 520, r: 30 },
      boardInner: { x: 40, y: 110, w: 312, h: 366, r: 24 },
      trackX: 28,
      trackY: 104,
      trackW: 334,
      trackH: 462,
      fieldX: 82,
      fieldY: 174,
      fieldSize: 224,
      cellSize: 20,
      cellGap: 2,
      slotX: 44,
      slotY: 602,
      slotW: 54,
      slotH: 50,
      slotGap: 10,
      trayY: 684,
      trayCardW: 60,
      trayCardH: 60,
      trayGapX: 20,
      trayGapY: 10,
      trayStartX: 115,
      restartRect: { x: 272, y: 502, w: 74, h: 30 },
      spawnDecor: { x: 2, y: 420, w: 30, h: 52 },
    };
  }

  createLevel() {
    const pattern = [
      "PPPPPCCCCC",
      "PPPPPCCCCC",
      "PPPPPCCCCC",
      "PPP....CCC",
      "PPP....CCC",
      "PPP....CCC",
      "PPP....CCC",
      "PPPPPCCCCC",
      "PPPPPCCCCC",
      "PPPPPCCCCC",
    ];
    const blocks = [];
    let blockId = 0;

    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        const token = pattern[row][col];
        if (token === ".") {
          continue;
        }
        blockId += 1;
        blocks.push(new Block(blockId, col, row, token === "P" ? "pink" : "cyan", {
          fieldX: this.layout.fieldX,
          fieldY: this.layout.fieldY,
          cellSize: this.layout.cellSize,
          cellGap: this.layout.cellGap,
        }));
      }
    }

    return new Level(blocks, {
      fieldX: this.layout.fieldX,
      fieldY: this.layout.fieldY,
      cellSize: this.layout.cellSize,
      cellGap: this.layout.cellGap,
      blockSprites: {
        pink: this.getBlockSprite("pink"),
        cyan: this.getBlockSprite("cyan"),
      },
    });
  }

  createConveyor() {
    return new Conveyor(this.layout);
  }

  createShooterCards() {
    const cards = [
      { color: "pink", ammo: 40, used: false },
      { color: "cyan", ammo: 40, used: false },
      { color: "pink", ammo: 10, used: false },
      { color: "cyan", ammo: 10, used: false },
      { color: "pink", ammo: 10, used: false },
      { color: "cyan", ammo: 10, used: false },
    ];

    return cards.map((card, index) => {
      const customPositions = [
        { x: 126, y: 652 },
        { x: 204, y: 652 },
        { x: 126, y: 718 },
        { x: 204, y: 718 },
        { x: 126, y: 784 },
        { x: 204, y: 784 },
      ];
      const position = customPositions[index];
      return {
        ...card,
        x: position.x,
        y: position.y,
        w: this.layout.trayCardW,
        h: this.layout.trayCardH,
      };
    });
  }

  restart() {
    this.level = this.createLevel();
    this.conveyor = this.createConveyor();
    this.units = [];
    this.projectiles = [];
    this.particles = [];
    this.shooterCards = this.createShooterCards();
    this.gameState = "playing";
    this.remainingBlocks = this.level.aliveBlocks().length;
    this.lastTimestamp = performance.now();
    this.buildStaticLayer();
    this.invalidate(true);
  }

  spawnUnit(cardIndex) {
    if (this.gameState !== "playing") {
      return;
    }

    const card = this.shooterCards[cardIndex];
    if (!card || card.used) {
      return;
    }

    card.used = true;
    this.unitIdCounter += 1;
    this.units.push(new Unit(this.unitIdCounter, card.color, card.ammo, this.conveyor));
    this.invalidate(true);
  }

  updateUnits(dt) {
    for (const unit of this.units) {
      unit.update(dt, this);
    }
    this.units = this.units.filter((unit) => unit.alive);
  }

  findTarget(unit) {
    let bestTarget = null;
    let bestDistance = Infinity;
    const reservedTargets = new Set(
      this.projectiles
        .filter((projectile) => projectile.target && projectile.target.alive && projectile.color === unit.color)
        .map((projectile) => projectile.target.id)
    );

    for (const block of this.level.blocks) {
      if (!block.alive || block.color !== unit.color || reservedTargets.has(block.id)) {
        continue;
      }
      const point = this.blockCenter(block);
      const dist = distance(point, unit.position);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestTarget = block;
      }
    }

    return bestTarget;
  }

  fireProjectile(block, unit) {
    const targetPoint = this.blockCenter(block);
    const dx = targetPoint.x - unit.position.x;
    const dy = targetPoint.y - unit.position.y;
    const distanceToTarget = Math.max(1, Math.hypot(dx, dy));

    this.projectiles.push({
      x: unit.position.x,
      y: unit.position.y,
      toX: targetPoint.x,
      toY: targetPoint.y,
      vx: (dx / distanceToTarget) * 540,
      vy: (dy / distanceToTarget) * 540,
      radius: 4,
      target: block,
      color: unit.color,
      life: Math.max(0.12, distanceToTarget / 540),
    });
  }

  damageBlock(block, colorName) {
    if (!block || !block.alive) {
      return;
    }

    block.hp -= 1;
    block.hitFlash = 1;
    const targetPoint = this.blockCenter(block);
    this.spawnParticles(targetPoint.x, targetPoint.y, colorName, block.hp <= 0 ? 10 : 4);

    if (block.hp <= 0) {
      block.alive = false;
    }

    this.remainingBlocks = this.level.aliveBlocks().length;
    this.checkWin();
  }

  checkWin() {
    if (this.remainingBlocks === 0) {
      this.gameState = "won";
      this.invalidate(true);
    }
  }

  blockCenter(block) {
    const step = this.layout.cellSize + this.layout.cellGap;
    return {
      x: this.layout.fieldX + block.gridX * step + this.layout.cellSize / 2,
      y: this.layout.fieldY + block.gridY * step + this.layout.cellSize / 2 - 1,
    };
  }

  update(dt) {
    for (const block of this.level.blocks) {
      block.update(dt);
    }

    if (this.gameState === "playing") {
      this.updateUnits(dt);
    }

    const nextProjectiles = [];
    for (const projectile of this.projectiles) {
      projectile.life -= dt;
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;

      const reachedTarget =
        projectile.life <= 0 ||
        Math.hypot(projectile.x - projectile.toX, projectile.y - projectile.toY) <= 8;

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
        vx: particle.vx * 0.96,
        vy: particle.vy * 0.96 + 6 * dt,
        life: particle.life - dt,
      }))
      .filter((particle) => particle.life > 0);
  }

  drawBackground(ctx) {
    const bg = ctx.createLinearGradient(0, 0, 0, this.height);
    bg.addColorStop(0, COLORS.bgTop);
    bg.addColorStop(1, COLORS.bgBottom);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, this.width, this.height);

    for (let i = 0; i < 18; i++) {
      const alpha = 0.05 + (i % 4) * 0.015;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      roundedRect(
        ctx,
        28 + (i % 6) * 58,
        92 + Math.floor(i / 6) * 146,
        12,
        24,
        6
      );
      ctx.fill();
    }
  }

  drawTopBarBase(ctx) {
    const gearX = 46;
    const gearY = 44;

    ctx.save();
    ctx.shadowColor = COLORS.shadow;
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    ctx.beginPath();
    ctx.arc(gearX, gearY, 24, 0, Math.PI * 2);
    ctx.fillStyle = "#6fb6ff";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#2e3452";
    ctx.stroke();

    ctx.fillStyle = "#f2f7ff";
    ctx.font = "900 24px Trebuchet MS, Verdana, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("\u2699", gearX, gearY + 1);

    drawGlossyPill(ctx, 128, 26, 134, 36, ["#6fc0ff", "#4d8fe9"], "Level 1", 18);
    drawGlossyPill(ctx, 264, 26, 82, 36, ["#ffd669", "#ffb53d"], "1000", 18);
    drawGlossyPill(ctx, 346, 28, 30, 32, ["#ffce6f", "#ffad37"], "+", 20);

    ctx.restore();
  }

  drawRestartButton(ctx) {
    const button = this.layout.restartRect;
    const hover = this.hoverHotspot === "restart";
    drawGlossyPill(
      ctx,
      button.x,
      button.y,
      button.w,
      button.h,
      hover ? ["#ffd27c", "#ffba4d"] : ["#ffc75d", "#f1a730"],
      "Restart",
      13
    );
  }

  drawPanelsBase(ctx) {
    const outer = this.layout.boardPanel;
    const inner = this.layout.boardInner;

    ctx.save();
    ctx.shadowColor = "rgba(8, 9, 19, 0.28)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    roundedRect(ctx, outer.x, outer.y, outer.w, outer.h, outer.r);
    ctx.fillStyle = COLORS.panel;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(236,246,255,0.84)";
    ctx.stroke();

    roundedRect(ctx, inner.x, inner.y, inner.w, inner.h, inner.r);
    ctx.fillStyle = COLORS.panelInner;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(221, 234, 255, 0.72)";
    ctx.stroke();
    ctx.restore();

  }

  drawPanelsDynamic(ctx) {
    const instruction = this.getInstructionLines();
    ctx.fillStyle = COLORS.text;
    ctx.strokeStyle = "rgba(32, 36, 57, 0.95)";
    ctx.lineWidth = 8;
    ctx.font = "900 18px Trebuchet MS, Verdana, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < instruction.length; i++) {
      const y = 132 + i * 26;
      ctx.strokeText(instruction[i], this.width / 2, y);
      ctx.fillText(instruction[i], this.width / 2, y);
    }

    ctx.fillStyle = COLORS.text;
    ctx.strokeStyle = "rgba(32, 36, 57, 0.95)";
    ctx.font = "800 15px Trebuchet MS, Verdana, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 5;
    const remaining = `Remaining blocks: ${this.remainingBlocks}`;
    ctx.strokeText(remaining, this.width / 2, 510);
    ctx.fillText(remaining, this.width / 2, 510);
  }

  drawFieldBase(ctx) {
    roundedRect(ctx, this.layout.fieldX - 10, this.layout.fieldY - 10, this.layout.fieldSize + 20, this.layout.fieldSize + 20, 14);
    ctx.fillStyle = "#515674";
    ctx.fill();
  }

  drawBlocks(ctx) {
    for (const block of this.level.blocks) {
      block.draw(ctx, this.level.metrics);
    }
  }

  drawConveyorBase(ctx) {
    const trackRect = this.conveyor.trackRect;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = COLORS.trackShadow;
    ctx.lineWidth = 34;
    ctx.beginPath();
    this.tracePath(ctx, this.conveyor.path);
    ctx.stroke();

    ctx.strokeStyle = COLORS.frameEdge;
    ctx.lineWidth = 28;
    ctx.beginPath();
    this.tracePath(ctx, this.conveyor.path);
    ctx.stroke();

    ctx.strokeStyle = COLORS.track;
    ctx.lineWidth = 22;
    ctx.beginPath();
    this.tracePath(ctx, this.conveyor.path);
    ctx.stroke();

    for (let i = 0; i < 24; i++) {
      const point = this.conveyor.pointAtDistance((i / 24) * this.conveyor.totalLength);
      ctx.save();
      ctx.translate(point.x, point.y);
      ctx.fillStyle = COLORS.trackArrow;
      ctx.beginPath();
      ctx.moveTo(-6, -4);
      ctx.lineTo(4, 0);
      ctx.lineTo(-6, 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(224,236,255,0.8)";
    ctx.lineWidth = 6;
    roundedRect(ctx, trackRect.x, trackRect.y, trackRect.w, trackRect.h, trackRect.r);
    ctx.stroke();
    ctx.restore();
  }

  drawConveyorDynamic(ctx) {
    ctx.save();
    const feeder = this.layout.spawnDecor;
    roundedRect(ctx, feeder.x, feeder.y, feeder.w, feeder.h, 4);
    ctx.fillStyle = "#edf5ff";
    ctx.fill();
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 === 0 ? "#a5b6d2" : "#d8e3f8";
      ctx.fillRect(feeder.x + 2, feeder.y + 4 + i * 7, feeder.w - 4, 4);
    }

    ctx.font = "900 14px Trebuchet MS, Verdana, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = COLORS.text;
    ctx.strokeStyle = "rgba(32, 36, 57, 0.95)";
    ctx.lineWidth = 5;
    const slotUsage = `${this.conveyor.slots.filter((slot) => slot.occupiedBy === null).length}/${this.conveyor.slotCount}`;
    ctx.strokeText(slotUsage, 16, 532);
    ctx.fillText(slotUsage, 16, 532);
    ctx.restore();

    for (let i = 0; i < this.conveyor.slots.length; i++) {
      const slot = this.conveyor.slots[i];
      const x = slot.x - this.layout.slotW / 2;
      const y = this.layout.slotY;
      roundedRect(ctx, x, y, this.layout.slotW, this.layout.slotH, 10);
      ctx.fillStyle = slot.occupiedBy === null ? COLORS.slot : "#50567a";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = COLORS.slotEdge;
      ctx.stroke();
    }
  }

  drawProjectiles(ctx) {
    for (const projectile of this.projectiles) {
      const color = projectile.color === "pink" ? COLORS.pink : COLORS.cyan;
      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.beginPath();
      ctx.arc(projectile.x - 1, projectile.y - 1, Math.max(1.2, projectile.radius * 0.42), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawParticles(ctx) {
    for (const particle of this.particles) {
      ctx.save();
      ctx.globalAlpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color;
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      ctx.restore();
    }
  }

  drawUnits(ctx) {
    for (const unit of this.units) {
      this.drawShooterShape(
        ctx,
        unit.position.x,
        unit.position.y,
        16,
        unit.color,
        unit.ammo,
        0
      );
    }
  }

  drawShooterTrayBase(ctx) {
    const trayTop = 650;
    ctx.fillStyle = "rgba(32, 36, 58, 0.14)";
    roundedRect(ctx, 24, trayTop - 18, 342, 212, 22);
    ctx.fill();
  }

  drawShooterTrayDynamic(ctx) {
    for (let i = 0; i < this.shooterCards.length; i++) {
      const card = this.shooterCards[i];
      const hover = this.hoverHotspot === `card-${i}` && !card.used && this.gameState === "playing";
      this.drawShooterCard(ctx, card, hover);
    }
  }

  drawShooterCard(ctx, card, hover) {
    const x = card.x;
    const y = card.y;
    const w = card.w;
    const h = card.h;

    ctx.save();
    ctx.globalAlpha = card.used ? 0.34 : 1;
    ctx.shadowColor = COLORS.cardShadow;
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;
    const tint = hover ? 8 : 0;
    roundedRect(ctx, x, y + 10, w, h - 10, 20);
    ctx.fillStyle = "#46506d";
    ctx.fill();

    this.drawShooterShape(
      ctx,
      x + w / 2,
      y + h / 2 + 6,
      28 + tint * 0.08,
      card.color,
      card.used ? 0 : card.ammo,
      card.used ? 0.22 : 0.42
    );
    ctx.restore();
  }

  drawShooterShape(ctx, cx, cy, size, color, ammo, glowAlpha) {
    const sprite = this.getShooterBodySprite(size, color);
    const drawX = cx - sprite.width / 2;
    const drawY = cy - sprite.height / 2;

    ctx.save();
    if (glowAlpha > 0) {
      ctx.shadowColor = color === "pink" ? COLORS.pink : COLORS.cyan;
      ctx.shadowBlur = 10 * glowAlpha;
    }
    ctx.drawImage(sprite, drawX, drawY);

    ctx.fillStyle = COLORS.text;
    ctx.strokeStyle = "rgba(33, 36, 57, 0.9)";
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.font = `900 ${Math.max(11, size * 0.62)}px Trebuchet MS, Verdana, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText(String(ammo), cx, cy + size * 0.07);
    ctx.fillText(String(ammo), cx, cy + size * 0.07);
    ctx.restore();
  }

  drawWinOverlay(ctx) {
    if (this.gameState !== "won") {
      return;
    }

    ctx.fillStyle = COLORS.overlay;
    ctx.fillRect(0, 0, this.width, this.height);

    roundedRect(ctx, 66, 320, 258, 162, 24);
    ctx.fillStyle = "#5e6488";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(236,246,255,0.82)";
    ctx.stroke();

    ctx.fillStyle = COLORS.text;
    ctx.strokeStyle = "rgba(32, 36, 57, 0.95)";
    ctx.lineWidth = 7;
    ctx.font = "900 28px Trebuchet MS, Verdana, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText("Level Complete", this.width / 2, 374);
    ctx.fillText("Level Complete", this.width / 2, 374);

    ctx.font = "800 16px Trebuchet MS, Verdana, sans-serif";
    ctx.lineWidth = 5;
    ctx.strokeText("Tap Restart to play again", this.width / 2, 420);
    ctx.fillText("Tap Restart to play again", this.width / 2, 420);
  }

  getInstructionLines() {
    const hasMovingUnit = this.units.some((unit) => unit.state === "moving");
    if (hasMovingUnit) {
      return ["Wait for shooter to travel."];
    }
    return ["Tap shooter to send it", "to the conveyor"];
  }

  spawnParticles(x, y, colorName, amount) {
    const color = colorName === "pink" ? COLORS.pink : COLORS.cyan;
    for (let i = 0; i < amount; i++) {
      const angle = (Math.PI * 2 * i) / amount + Math.random() * 0.4;
      const speed = 45 + Math.random() * 75;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        color,
        life: 0.18 + Math.random() * 0.16,
        maxLife: 0.34,
        rotation: Math.random() * Math.PI,
      });
    }
  }

  tracePath(ctx, points) {
    if (!points.length) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.drawImage(this.staticLayer, 0, 0, this.width, this.height);
    this.drawRestartButton(ctx);
    this.drawPanelsDynamic(ctx);
    this.drawConveyorDynamic(ctx);
    this.drawBlocks(ctx);
    this.drawProjectiles(ctx);
    this.drawParticles(ctx);
    this.drawUnits(ctx);
    this.drawShooterTrayDynamic(ctx);
    this.drawWinOverlay(ctx);
    this.needsRender = false;
  }

  frame(timestamp) {
    if (!this.isLoopRunning) {
      return;
    }

    const delta = clamp((timestamp - this.lastTimestamp) / 1000, 0, 0.05);
    this.lastTimestamp = timestamp;
    const wasAnimating = this.hasActiveAnimations();

    if (wasAnimating) {
      this.update(delta);
    }

    if (this.needsRender || wasAnimating) {
      this.render();
    }

    if (this.hasActiveAnimations()) {
      requestAnimationFrame((nextTimestamp) => this.frame(nextTimestamp));
    } else {
      this.isLoopRunning = false;
    }
  }

  resize() {
    this.dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.buildStaticLayer();
    this.render();
  }

  hitTest(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
  }

  handlePointerMove(x, y) {
    const previousHotspot = this.hoverHotspot;
    this.hoverHotspot = null;
    if (this.hitTest(x, y, this.layout.restartRect)) {
      this.hoverHotspot = "restart";
    } else {
      for (let i = 0; i < this.shooterCards.length; i++) {
        const card = this.shooterCards[i];
        if (this.hitTest(x, y, card)) {
          this.hoverHotspot = `card-${i}`;
          break;
        }
      }
    }

    if (previousHotspot !== this.hoverHotspot) {
      this.invalidate(false);
    }
  }

  handlePointerDown(x, y) {
    if (this.hitTest(x, y, this.layout.restartRect)) {
      this.restart();
      return;
    }

    for (let i = 0; i < this.shooterCards.length; i++) {
      if (this.hitTest(x, y, this.shooterCards[i])) {
        this.spawnUnit(i);
        return;
      }
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

    const onMove = (event) => {
      const point = this.getPointerPosition(event);
      this.pointer = point;
      this.handlePointerMove(point.x, point.y);
    };

    const onPress = (event) => {
      const point = this.getPointerPosition(event);
      this.handlePointerDown(point.x, point.y);
    };

    const onTouch = (event) => {
      const touch = event.touches[0] || event.changedTouches[0];
      if (!touch) {
        return;
      }
      const point = this.getPointerPosition(touch);
      this.pointer = point;
      this.handlePointerMove(point.x, point.y);
      this.handlePointerDown(point.x, point.y);
      event.preventDefault();
    };

    this.canvas.addEventListener("mousemove", onMove);
    this.canvas.addEventListener("mousedown", onPress);
    this.canvas.addEventListener("touchstart", onTouch, { passive: false });
  }

  hasActiveAnimations() {
    if (
      (this.gameState === "playing" && this.units.length > 0) ||
      this.projectiles.length > 0 ||
      this.particles.length > 0
    ) {
      return true;
    }
    return this.level.blocks.some((block) => block.hitFlash > 0);
  }

  invalidate(animate = false) {
    this.needsRender = true;
    if (animate || this.hasActiveAnimations()) {
      if (!this.isLoopRunning) {
        this.isLoopRunning = true;
        this.lastTimestamp = performance.now();
        requestAnimationFrame((timestamp) => this.frame(timestamp));
      }
    } else {
      this.render();
    }
  }

  buildStaticLayer() {
    this.staticLayer.width = this.width;
    this.staticLayer.height = this.height;
    const ctx = this.staticCtx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);
    this.drawBackground(ctx);
    this.drawTopBarBase(ctx);
    this.drawPanelsBase(ctx);
    this.drawConveyorBase(ctx);
    this.drawFieldBase(ctx);
    this.drawShooterTrayBase(ctx);
  }

  getBlockSprite(color) {
    const key = `block-${color}-${this.layout.cellSize}`;
    if (this.spriteCache.has(key)) {
      return this.spriteCache.get(key);
    }

    const size = this.layout.cellSize;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const base = color === "pink" ? COLORS.pink : COLORS.cyan;
    const dark = color === "pink" ? COLORS.pinkDark : COLORS.cyanDark;

    roundedRect(ctx, 0, 2, size, size - 2, 4);
    ctx.fillStyle = dark;
    ctx.fill();

    roundedRect(ctx, 0, 0, size, size - 2, 4);
    ctx.fillStyle = base;
    ctx.fill();

    roundedRect(ctx, 1.5, 1.5, size - 3, size * 0.42, 3);
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fill();

    this.spriteCache.set(key, canvas);
    return canvas;
  }

  getShooterBodySprite(size, color) {
    const key = `shooter-${color}-${Math.round(size * 10)}`;
    if (this.spriteCache.has(key)) {
      return this.spriteCache.get(key);
    }

    const base = color === "pink" ? COLORS.pink : COLORS.cyan;
    const dark = color === "pink" ? COLORS.pinkDark : COLORS.cyanDark;
    const width = size * 1.16;
    const height = size * 1.18;
    const earWidth = size * 0.18;
    const earHeight = size * 0.28;
    const padding = 6;
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width + padding * 2);
    canvas.height = Math.ceil(height + earHeight + padding * 2);
    const ctx = canvas.getContext("2d");
    const bodyX = padding;
    const bodyY = padding + earHeight * 0.7;

    roundedRect(ctx, bodyX, bodyY + 2, width, height - 2, size * 0.34);
    ctx.fillStyle = dark;
    ctx.fill();

    roundedRect(ctx, bodyX, bodyY, width, height - 4, size * 0.34);
    ctx.fillStyle = base;
    ctx.fill();

    roundedRect(ctx, bodyX + 7, bodyY + 5, width - 14, height * 0.36, size * 0.24);
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fill();

    roundedRect(ctx, bodyX + width * 0.22, padding, earWidth, earHeight, 4);
    ctx.fillStyle = dark;
    ctx.fill();
    roundedRect(ctx, bodyX + width * 0.58, padding, earWidth, earHeight, 4);
    ctx.fill();

    this.spriteCache.set(key, canvas);
    return canvas;
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
      coordinateSystem: {
        origin: "top-left",
        xDirection: "right",
        yDirection: "down",
        units: "canvas pixels",
      },
      remainingBlocks: this.remainingBlocks,
      blocksByColor: {
        pink: this.level.blocks.filter((block) => block.alive && block.color === "pink").length,
        cyan: this.level.blocks.filter((block) => block.alive && block.color === "cyan").length,
      },
      units: this.units.map((unit) => ({
        id: unit.id,
        color: unit.color,
        ammo: unit.ammo,
        state: unit.state,
        slotIndex: unit.slotIndex,
        x: Number(unit.position.x.toFixed(1)),
        y: Number(unit.position.y.toFixed(1)),
      })),
      shooterCards: this.shooterCards.map((card) => ({
        color: card.color,
        ammo: card.ammo,
        used: card.used,
        x: card.x,
        y: card.y,
        w: card.w,
        h: card.h,
      })),
      restartButton: this.layout.restartRect,
      slotState: this.conveyor.slots.map((slot, index) => ({
        index,
        occupied: slot.occupiedBy !== null,
      })),
    });
  }
}

const canvas = document.getElementById("gameCanvas");
const game = new Game(canvas);

window.game = game;
window.advanceTime = (ms) => game.advanceTime(ms);
window.render_game_to_text = () => game.renderGameToText();
