const canvas = document.getElementById("arena");
const ctx = canvas.getContext("2d");
const gravity = 0.75;
const floorY = canvas.height - 70;

const p1Text = document.getElementById("p1");
const p2Text = document.getElementById("p2");
const msg = document.getElementById("msg");
const restartBtn = document.getElementById("restart");

const keys = new Set();
let gameOver = false;

class Fighter {
  constructor({ name, color, x, controls, facing }) {
    this.name = name;
    this.color = color;
    this.x = x;
    this.y = floorY;
    this.vx = 0;
    this.vy = 0;
    this.hp = 100;
    this.controls = controls;
    this.facing = facing;

    this.width = 30;
    this.height = 100;
    this.speed = 4.2;
    this.jumpPower = 14;

    this.attackCooldown = 0;
    this.guardCooldown = 0;
    this.isAttacking = false;
    this.isGuarding = false;
  }

  get headY() {
    return this.y - this.height;
  }

  bodyBox() {
    return {
      left: this.x - this.width / 2,
      right: this.x + this.width / 2,
      top: this.headY,
      bottom: this.y,
    };
  }

  attackRange() {
    const box = this.bodyBox();
    const length = 45;
    if (this.facing > 0) {
      return { left: box.right, right: box.right + length, top: box.top + 25, bottom: box.top + 60 };
    }
    return { left: box.left - length, right: box.left, top: box.top + 25, bottom: box.top + 60 };
  }

  intersects(a, b) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  tryAttack(opponent) {
    if (this.attackCooldown > 0 || gameOver) return;
    this.isAttacking = true;
    this.attackCooldown = 28;

    const hit = this.intersects(this.attackRange(), opponent.bodyBox());
    if (!hit) return;

    const baseDamage = 12;
    const damage = opponent.isGuarding ? 4 : baseDamage;
    opponent.hp = Math.max(0, opponent.hp - damage);
    opponent.vx += this.facing * 2.5;
    msg.textContent = `${this.name} 命中 ${opponent.name}，造成 ${damage} 点伤害！`;

    if (opponent.hp <= 0) {
      gameOver = true;
      msg.textContent = `${this.name} 获胜！`;
    }
  }

  tryGuard() {
    if (this.guardCooldown > 0 || gameOver) return;
    this.isGuarding = true;
    this.guardCooldown = 20;
  }

  update(opponent) {
    this.isAttacking = false;
    this.isGuarding = false;

    if (!gameOver) {
      const movingLeft = keys.has(this.controls.left);
      const movingRight = keys.has(this.controls.right);

      if (movingLeft === movingRight) {
        this.vx *= 0.8;
      } else {
        this.vx = movingLeft ? -this.speed : this.speed;
      }

      if (keys.has(this.controls.jump) && this.y >= floorY) {
        this.vy = -this.jumpPower;
      }

      if (keys.has(this.controls.attack)) {
        this.tryAttack(opponent);
      }

      if (keys.has(this.controls.guard)) {
        this.tryGuard();
      }
    }

    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;

    if (this.y >= floorY) {
      this.y = floorY;
      this.vy = 0;
    }

    this.x = Math.max(30, Math.min(canvas.width - 30, this.x));

    if (this.attackCooldown > 0) this.attackCooldown -= 1;
    if (this.guardCooldown > 0) this.guardCooldown -= 1;

    this.facing = this.x <= opponent.x ? 1 : -1;
  }

  draw() {
    const headRadius = 12;
    const neckY = this.headY + 20;
    const hipY = this.y - 35;

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.arc(this.x, this.headY + headRadius, headRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.x, neckY);
    ctx.lineTo(this.x, hipY);
    ctx.stroke();

    const armY = neckY + 18;
    const armReach = this.isAttacking ? 38 : 24;
    const leftArm = this.facing > 0 ? -20 : -armReach;
    const rightArm = this.facing > 0 ? armReach : 20;

    ctx.beginPath();
    ctx.moveTo(this.x, armY);
    ctx.lineTo(this.x + leftArm, armY + (this.isGuarding ? -8 : 6));
    ctx.moveTo(this.x, armY);
    ctx.lineTo(this.x + rightArm, armY + (this.isAttacking ? -5 : 6));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.x, hipY);
    ctx.lineTo(this.x - 18, this.y);
    ctx.moveTo(this.x, hipY);
    ctx.lineTo(this.x + 18, this.y);
    ctx.stroke();

    if (this.isGuarding) {
      ctx.strokeStyle = "#85e1ff";
      ctx.lineWidth = 2;
      const shieldX = this.x + this.facing * 24;
      ctx.beginPath();
      ctx.arc(shieldX, armY, 10, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function reset() {
  gameOver = false;
  msg.textContent = "开始对战！";
  fighter1 = new Fighter({
    name: "玩家1",
    color: "#ffcc66",
    x: 220,
    facing: 1,
    controls: { left: "KeyA", right: "KeyD", jump: "KeyW", attack: "KeyF", guard: "KeyG" },
  });
  fighter2 = new Fighter({
    name: "玩家2",
    color: "#8ad6ff",
    x: 740,
    facing: -1,
    controls: {
      left: "ArrowLeft",
      right: "ArrowRight",
      jump: "ArrowUp",
      attack: "Slash",
      guard: "Period",
    },
  });
}

let fighter1;
let fighter2;
reset();

function renderArena() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#22304f";
  ctx.fillRect(0, floorY, canvas.width, canvas.height - floorY);

  ctx.strokeStyle = "#9ab3ff";
  ctx.lineWidth = 2;
  for (let i = 0; i < canvas.width; i += 80) {
    ctx.beginPath();
    ctx.moveTo(i, floorY);
    ctx.lineTo(i + 20, floorY - 10);
    ctx.stroke();
  }
}

function updateHud() {
  p1Text.textContent = `玩家1 HP: ${fighter1.hp}`;
  p2Text.textContent = `玩家2 HP: ${fighter2.hp}`;
}

function loop() {
  renderArena();
  fighter1.update(fighter2);
  fighter2.update(fighter1);

  fighter1.draw();
  fighter2.draw();
  updateHud();

  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  keys.add(event.code);
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.code);
});

restartBtn.addEventListener("click", reset);

loop();
