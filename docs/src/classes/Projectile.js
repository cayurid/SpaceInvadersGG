

class Projectile {

    constructor(position, velocity, type = "player") {
        this.position = position;
        this.velocity = velocity;
        this.type = type;

        if (type === "player") {
            this.width = 4;
            this.height = 20;
        } else if (type === "boss") {
            this.width = 10;
            this.height = 30;
        } else {
            this.width = 3;
            this.height = 14;
        }

        this.glowOffset = 0;
        this.glowDirection = 1;
    }

    draw(ctx) {
        ctx.save();

        this.glowOffset += 0.1 * this.glowDirection;
        if (this.glowOffset >= 1 || this.glowOffset <= 0) this.glowDirection *= -1;

        if (this.type === "player") {
            const grd = ctx.createLinearGradient(
                this.position.x, this.position.y,
                this.position.x, this.position.y + this.height
            );
            grd.addColorStop(0, "white");
            grd.addColorStop(0.3, "#00f7ff");
            grd.addColorStop(1, "rgba(0,180,255,0)");

            ctx.shadowColor = "#00f7ff";
            ctx.shadowBlur = 10 + this.glowOffset * 6;

            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.roundRect(this.position.x - this.width / 2, this.position.y, this.width, this.height, 3);
            ctx.fill();

            ctx.shadowBlur = 4;
            ctx.shadowColor = "white";
            ctx.fillStyle = "white";
            ctx.fillRect(this.position.x - 1, this.position.y, 2, this.height * 0.4);

        } else if (this.type === "boss") {
            const grd = ctx.createLinearGradient(
                this.position.x, this.position.y,
                this.position.x, this.position.y + this.height
            );
            grd.addColorStop(0, "rgba(255,0,100,0)");
            grd.addColorStop(0.3, "#ff3366");
            grd.addColorStop(0.7, "#cc00ff");
            grd.addColorStop(1, "white");

            ctx.shadowColor = "#cc00ff";
            ctx.shadowBlur = 16 + this.glowOffset * 8;

            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.roundRect(this.position.x - this.width / 2, this.position.y, this.width, this.height, 4);
            ctx.fill();

        } else {
            const grd = ctx.createLinearGradient(
                this.position.x, this.position.y,
                this.position.x, this.position.y + this.height
            );
            grd.addColorStop(0, "rgba(255,80,0,0)");
            grd.addColorStop(0.5, "#ff6600");
            grd.addColorStop(1, "#ffcc00");

            ctx.shadowColor = "#ff6600";
            ctx.shadowBlur = 8 + this.glowOffset * 4;

            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.roundRect(this.position.x - this.width / 2, this.position.y, this.width, this.height, 2);
            ctx.fill();
        }

        ctx.restore();
    }

    update() {
        this.position.y += this.velocity;
    }
}

export default Projectile;