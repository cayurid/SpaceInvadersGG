import Projectile from "./Projectile.js";

class Boss {
    constructor(canvasWidth, phase = 0) {
        this.canvasWidth = canvasWidth;
        this.phase       = Math.min(phase, 3);

        this.width  = 120;
        this.height = 60;
        this.maxHp  = 20 + this.phase * 5;
        this.hp     = this.maxHp;
        this.alive  = true;
        this.points = 500 + this.phase * 200;

        this.position = {
            x: canvasWidth / 2 - this.width / 2,
            y: 60,
        };

        this.velocity  = 2 + this.phase * 0.5;
        this.direction = "right";
        this.pulseTimer = 0;
        this.flashTimer = 0;

        // barreira (fase 2+)
        this.shieldHp    = this.phase >= 2 ? 3 : 0;
        this.shieldMaxHp = 3;
        this.shieldFlash = 0;

        // chuva de tiros (fase 1+)
        this.rainTimer    = 0;
        this.rainInterval = 180;
        this.rainActive   = false;
        this.rainCounter  = 0;
        this.rainTotal    = 12;
    }

    moveLeft()  { this.position.x -= this.velocity; }
    moveRight() { this.position.x += this.velocity; }

    get hasShield() { return this.phase >= 2 && this.shieldHp > 0; }
    get isHitKill() { return this.phase >= 3; }

    update(invaderProjectiles) {
        if (this.position.x + this.width >= innerWidth) this.direction = "left";
        if (this.position.x <= 0)                       this.direction = "right";
        if (this.direction === "right") this.moveRight();
        else                            this.moveLeft();

        this.pulseTimer += 0.05;
        if (this.flashTimer  > 0) this.flashTimer--;
        if (this.shieldFlash > 0) this.shieldFlash--;

        // chuva de tiros (fase 1+)
        if (this.phase >= 1 && invaderProjectiles) {
            this.rainTimer++;
            if (this.rainTimer >= this.rainInterval && !this.rainActive) {
                this.rainActive  = true;
                this.rainCounter = 0;
                this.rainTimer   = 0;
            }
            if (this.rainActive) {
                if (this.rainCounter < this.rainTotal) {
                    const offsetX = (Math.random() - 0.5) * this.width * 1.5;
                    invaderProjectiles.push(new Projectile(
                        {
                            x: this.position.x + this.width / 2 + offsetX,
                            y: this.position.y + this.height,
                        },
                        7 + Math.random() * 3,
                        "boss"
                    ));
                    this.rainCounter++;
                } else {
                    this.rainActive = false;
                }
            }
        }
    }

    draw(ctx) {
        ctx.save();
        const pulse = Math.sin(this.pulseTimer) * 0.5 + 0.5;

        const phaseColors = ["#cc00ff", "#ff6600", "#ff0055", "#ff0000"];
        const bossColor   = phaseColors[this.phase];

        ctx.shadowColor = bossColor;
        ctx.shadowBlur  = 20 + pulse * 20;

        const hpRatio = this.hp / this.maxHp;
        const r = Math.floor(150 + (1 - hpRatio) * 105);
        const b = Math.floor(255 * hpRatio);

        ctx.beginPath();
        ctx.moveTo(this.position.x + this.width * 0.5, this.position.y);
        ctx.lineTo(this.position.x + this.width,        this.position.y + this.height * 0.25);
        ctx.lineTo(this.position.x + this.width,        this.position.y + this.height * 0.75);
        ctx.lineTo(this.position.x + this.width * 0.5,  this.position.y + this.height);
        ctx.lineTo(this.position.x,                     this.position.y + this.height * 0.75);
        ctx.lineTo(this.position.x,                     this.position.y + this.height * 0.25);
        ctx.closePath();
        ctx.fillStyle = this.flashTimer > 0 ? "white" : `rgb(${r},0,${b})`;
        ctx.fill();
        ctx.strokeStyle = bossColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2,
            10 + pulse * 4, 0, Math.PI * 2
        );
        ctx.fillStyle = this.flashTimer > 0
            ? "#ff0000"
            : `rgba(255,${Math.floor(pulse * 200)},255,0.9)`;
        ctx.fill();

        // barra de HP
        const barX = this.position.x;
        const barY = this.position.y - 18;
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#333";
        ctx.fillRect(barX, barY, this.width, 8);
        ctx.fillStyle = hpRatio > 0.5 ? "#00ff88" : hpRatio > 0.25 ? "#ffaa00" : "#ff2200";
        ctx.fillRect(barX, barY, this.width * hpRatio, 8);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, this.width, 8);

        // label por fase
        ctx.fillStyle = "white";
        ctx.font = "bold 10px 'Press Start 2P', monospace";
        ctx.textAlign = "center";
        const label = ["BOSS", "BOSS II", "BOSS III", "BOSS MAX"][this.phase];
        ctx.fillText(label, this.position.x + this.width / 2, this.position.y - 22);

        // barreira (fase 2+)
        if (this.phase >= 2 && this.shieldHp > 0) {
            const sp = Math.sin(this.pulseTimer * 2) * 0.3 + 0.7;
            ctx.save();
            ctx.shadowColor = "#00cfff";
            ctx.shadowBlur  = 14 * sp;
            for (let i = 0; i < this.shieldMaxHp; i++) {
                ctx.beginPath();
                ctx.arc(
                    this.position.x + this.width / 2,
                    this.position.y + this.height / 2,
                    this.width * 0.72,
                    (i / this.shieldMaxHp) * Math.PI * 2 - Math.PI / 2,
                    ((i + 0.8) / this.shieldMaxHp) * Math.PI * 2 - Math.PI / 2
                );
                ctx.strokeStyle = i < this.shieldHp
                    ? (this.shieldFlash > 0 ? "white" : "#00cfff")
                    : "#333";
                ctx.lineWidth   = 5;
                ctx.globalAlpha = i < this.shieldHp ? 0.9 : 0.3;
                ctx.stroke();
            }
            ctx.restore();
        }

        ctx.restore();
    }

    shoot(projectiles) {
        [-12, 0, 12].forEach((offset) => {
            projectiles.push(new Projectile(
                {
                    x: this.position.x + this.width / 2 + offset,
                    y: this.position.y + this.height,
                },
                8, "boss"
            ));
        });
    }

    Hit(projectile) {
        return (
            projectile.position.x >= this.position.x &&
            projectile.position.x <= this.position.x + this.width &&
            projectile.position.y >= this.position.y &&
            projectile.position.y <= this.position.y + this.height
        );
    }

    // retorna { damaged, killed }
    takeDamage() {
        if (this.hasShield) {
            this.shieldHp--;
            this.shieldFlash = 8;
            return { damaged: false, killed: false };
        }
        this.hp--;
        this.flashTimer = 6;
        if (this.hp <= 0) {
            this.alive = false;
            return { damaged: true, killed: true };
        }
        return { damaged: true, killed: false };
    }
}

export default Boss;
