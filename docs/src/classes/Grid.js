import Invader from "./Invader.js";

class Grid {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.direction = "right";
        this.moveDown = false;
        this.invadersVelocity = 1;
        this.invaders = this.init();
    }

    init() {
        const array = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                let type = "normal";
                if (row === 0) type = "fast";
                else if (row === this.rows - 1 && this.rows > 2) type = "tank";

                const invader = new Invader(
                    { x: col * 60 + 20, y: row * 60 + 120 },
                    this.invadersVelocity,
                    type
                );
                array.push(invader);
            }
        }
        return array;
    }

    draw(ctx) {
        this.invaders.forEach((invader) => invader.draw(ctx));
    }

    update(playerStatus) {
        if (this.reachedRightBoundary()) { this.direction = "left"; this.moveDown = true; }
        else if (this.reachedLeftBoundary()) { this.direction = "right"; this.moveDown = true; }

        if (!playerStatus) this.moveDown = false;

        this.invaders.forEach((invader) => {
            if (this.moveDown) {
                invader.moveDown();
                invader.incrementVelocity(0.2);
                this.invadersVelocity = invader.velocity;
            }
            if (this.direction === "right") invader.moveRight();
            if (this.direction === "left") invader.moveLeft();
        });
        this.moveDown = false;
    }

    reachedRightBoundary() {
        return this.invaders.some((i) => i.position.x + i.width >= innerWidth);
    }

    reachedLeftBoundary() {
        return this.invaders.some((i) => i.position.x <= 0);
    }

    getRandomInvaderShoot() {
        return this.invaders[Math.floor(Math.random() * this.invaders.length)];
    }

    Restart() {
        this.invaders = this.init();
        this.direction = "right";
    }
}

export default Grid;