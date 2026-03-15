import Invader from "./Invader.js";

function getGridConfig(level) {
    // cols cresce de 6 ate 12, +1 a cada nivel
    const cols = Math.min(5 + level, 12);

    let rows;

    if (level === 1) {
        rows = ["fast", "normal"];
    } else if (level === 2) {
        rows = ["fast", "normal", "normal", "tank"];
    } else if (level === 4) {
        rows = ["fast", "fast", "normal", "normal", "tank"];
    } else if (level === 5) {
        rows = ["fast", "fast", "normal", "normal", "tank", "tank"];
    } else if (level === 7) {
        rows = ["fast", "normal", "normal", "tank", "tank", "tank"];
    } else if (level === 8) {
        rows = ["normal", "normal", "tank", "tank", "tank", "tank"];
    } else if (level === 10) {
        rows = ["normal", "tank", "tank", "tank", "tank", "tank"];
    } else if (level >= 11) {
        rows = ["tank", "tank", "tank", "tank", "tank", "tank"];
    } else {
        rows = _intermediateRows(level);
    }

    return { rows, cols };
}

function _intermediateRows(level) {
    if (level <= 3)  return ["fast", "normal", "normal"];
    if (level <= 6)  return ["fast", "normal", "normal", "tank", "tank"];
    if (level <= 9)  return ["normal", "normal", "tank", "tank", "tank"];
    return ["tank", "tank", "tank", "tank", "tank", "tank"];
}

class Grid {
    constructor(level = 1) {
        this.level            = level;
        this.direction        = "right";
        this.moveDown         = false;
        this.invadersVelocity = 1;
        this.invaders         = this.init();
    }

    init() {
        const { rows, cols } = getGridConfig(this.level);
        const array = [];

        rows.forEach((type, rowIndex) => {
            for (let col = 0; col < cols; col++) {
                array.push(new Invader(
                    {
                        x: col * 60 + 20,
                        y: rowIndex * 60 + 120,
                    },
                    this.invadersVelocity,
                    type
                ));
            }
        });

        return array;
    }

    draw(ctx) {
        this.invaders.forEach((invader) => invader.draw(ctx));
    }

    update(playerStatus) {
        if (this.reachedRightBoundary())      { this.direction = "left";  this.moveDown = true; }
        else if (this.reachedLeftBoundary())  { this.direction = "right"; this.moveDown = true; }

        if (!playerStatus) this.moveDown = false;

        this.invaders.forEach((invader) => {
            if (this.moveDown) {
                invader.moveDown();
                invader.incrementVelocity(0.2);
                this.invadersVelocity = invader.velocity;
            }
            if (this.direction === "right") invader.moveRight();
            if (this.direction === "left")  invader.moveLeft();
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

    Restart(level) {
        this.level            = level;
        this.invaders         = this.init();
        this.direction        = "right";
        this.invadersVelocity = 1;
    }
}

export default Grid;