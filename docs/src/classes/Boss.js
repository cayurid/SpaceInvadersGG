import Projectile from "./Projectile.js";

class Boss {
    constructor(canvasWidth) {
        this.width = 120;
        this.height = 60;
        this.maxHp = 20;
        this.hp = this.maxHp;
        this.alive = true;
        this.points = 500;

        this.position = {
            x: canvasWidth / 2 - this.width / 2,
            y: 60,
        };

        this.velocity = 2;
        this.direction = "right";
        this.pulseTimer = 0;
        this.flashTimer = 0;
    }

    moveLeft()  { this.position.x -= this.velocity; }
    moveRight() { this.position.x += this.velocity; }

    update() {
        if (this.position.x + this.width >= innerWidth) this.direction = "left";
        if (this.position.x <= 0) this.direction = "right";

        if (this.direction === "right") this.moveRight();
        else this.moveLeft();

        this.pulseTimer += 0.05;
        if (this.flashTimer > 0) this.flashTimer--;
    }

    draw(ctx) {
        ctx.save();

        const pulse = Math.sin(this.pulseTimer) * 0.5 + 0.5;

        ctx.shadowColor = "#cc00ff";
        ctx.shadowBlur = 20 + pulse * 20;

        const hpRatio = this.hp / this.maxHp;
        const r = Math.floor(150 + (1 - hpRatio) * 105);
        const b = Math.floor(255 * hpRatio);
        const bodyColor = `rgb(${r},0,${b})`;

        ctx.beginPath();
        ctx.moveTo(this.position.x + this.width * 0.5, this.position.y);
        ctx.lineTo(this.position.x + this.width,       this.position.y + this.height * 0.25);
        ctx.lineTo(this.position.x + this.width,       this.position.y + this.height * 0.75);
        ctx.lineTo(this.position.x + this.width * 0.5, this.position.y + this.height);
        ctx.lineTo(this.position.x,                    this.position.y + this.height * 0.75);
        ctx.lineTo(this.position.x,                    this.position.y + this.height * 0.25);
        ctx.closePath();
        ctx.fillStyle = this.flashTimer > 0 ? "white" : bodyColor;
        ctx.fill();

        ctx.strokeStyle = "#cc00ff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2,
            10 + pulse * 4, 0, Math.PI * 2
        );
        ctx.fillStyle = this.flashTimer > 0 ? "#ff0000" : `rgba(255,${Math.floor(pulse * 200)},255,0.9)`;
        ctx.fill();

        // barra de vida
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

        ctx.shadowBlur = 0;
        ctx.fillStyle = "white";
        ctx.font = "bold 10px 'Press Start 2P', monospace";
        ctx.textAlign = "center";
        ctx.fillText("BOSS", this.position.x + this.width / 2, this.position.y - 22);

        ctx.restore();
    }

    shoot(projectiles) {
        [-12, 0, 12].forEach((offset) => {
            projectiles.push(new Projectile(
                {
                    x: this.position.x + this.width / 2 + offset,
                    y: this.position.y + this.height,
                },
                8,
                "boss"
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

    takeDamage() {
        this.hp -= 1;
        this.flashTimer = 6;
        if (this.hp <= 0) this.alive = false;
    }
}

export default Boss;