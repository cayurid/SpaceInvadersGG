import { PATH_INVADER_IMAGE } from "../utils/constanst.js";
import Projectile from "./Projectile.js";

class Invader {
    constructor(position, velocity, type = "normal") {
        this.position = position;
        this.type     = type;
        this.velocity = velocity;

        if (type === "fast") {
            this.width  = 50 * 0.7;
            this.height = 37 * 0.7;
            this.color  = "#00ffcc";
            this.points = 20;
            this.hp     = 1;
        } else if (type === "tank") {
            this.width  = 50 * 1.1;
            this.height = 37 * 1.1;
            this.color  = "#ff4444";
            this.points = 30;
            this.hp     = 2; // aguenta 2 tiros
        } else {
            this.width  = 50 * 0.8;
            this.height = 37 * 0.8;
            this.color  = "#ffffff";
            this.points = 10;
            this.hp     = 1;
        }

        this.image      = this.getImage(PATH_INVADER_IMAGE);
        this.flashTimer = 0;
    }

    getImage(path) {
        const img = new Image();
        img.src = path;
        return img;
    }

    moveLeft()  { this.position.x -= this.velocity; }
    moveRight() { this.position.x += this.velocity; }
    moveDown()  { this.position.y += this.height;   }

    incrementVelocity(boost) { this.velocity += boost; }

    // retorna true se morreu
    takeDamage() {
        this.hp--;
        this.flashTimer = 8;
        return this.hp <= 0;
    }

    draw(ctx) {
        ctx.save();

        if (this.type === "fast") {
            ctx.shadowColor = "#00ffcc";
            ctx.shadowBlur  = 14;
        } else if (this.type === "tank") {
            ctx.shadowColor = "#ff4444";
            ctx.shadowBlur  = 14;
            if (this.hp === 1) ctx.globalAlpha = 0.6; // indica dano
        }

        if (this.flashTimer > 0) {
            ctx.shadowColor = "white";
            ctx.shadowBlur  = 20;
            this.flashTimer--;
        }

        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.restore();
    }

    shoot(projectiles) {
        projectiles.push(new Projectile(
            { x: this.position.x + this.width / 2 - 1, y: this.position.y + 10 },
            10,
            "invader"
        ));
    }

    Hit(projectile) {
        return (
            projectile.position.x >= this.position.x &&
            projectile.position.x <= this.position.x + this.width &&
            projectile.position.y >= this.position.y &&
            projectile.position.y <= this.position.y + this.height
        );
    }
}

export default Invader;