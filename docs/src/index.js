import Grid from "./classes/Grid.js";
import Obstacle from "./classes/Obstacle.js";
import Particle from "./classes/Particle.js";
import Player from "./classes/Player.js";
import SoundEffects from "./classes/SoundEffects.js";
import Boss from "./classes/Boss.js";
import Background from "./classes/Background.js";
import LivesUI from "./classes/LivesUI.js";
import { GameState } from "./utils/constanst.js";

const soundEffects = new SoundEffects();

const startScreen = document.querySelector(".start-screen");
const gameOverScreen = document.querySelector(".game-over");
const scoreUi = document.querySelector(".score-ui");
const scoreElement = scoreUi.querySelector(".score > span");
const levelElement = scoreUi.querySelector(".level > span");
const highElement = scoreUi.querySelector(".high > span");
const buttonPlay = document.querySelector(".button-play");
const buttonRestart = document.querySelector(".button-restart");

gameOverScreen.remove();

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
ctx.imageSmoothingEnabled = false;

let currentState = GameState.START;
const gameData = { score: 0, level: 1, high: 0 };

const showGameData = () => {
    scoreElement.textContent = gameData.score;
    levelElement.textContent = gameData.level;
    highElement.textContent = gameData.high;
};

const background = new Background(canvas.width, canvas.height);
const livesUI = new LivesUI();
const player = new Player(canvas.width, canvas.height);
const grid = new Grid(1);

const playerProjectiles = [];
const invaderProjectiles = [];
const particles = [];
const obstacles = [];

let boss = null;
let bossActive = false;
let bossShootInterval = null;
let invaderInterval = null;
let bossPhase = 0;

const BOSS_EVERY_N_LEVELS = 3;

const initObstacles = () => {
    obstacles.length = 0;
    const x = canvas.width / 2 - 50;
    const y = canvas.height - 250;
    const offset = canvas.width * 0.15;
    obstacles.push(new Obstacle({ x: x - offset, y }, 150, 20, "blue"));
    obstacles.push(new Obstacle({ x: x + offset, y }, 150, 20, "blue"));
};
initObstacles();

const incrementScore = (value) => {
    gameData.score += value;
    if (gameData.score > gameData.high) gameData.high = gameData.score;
};

const keys = {
    left: false,
    right: false,
    shoot: { pressed: false, realized: true },
};

const drawObstacles = () => obstacles.forEach((o) => o.draw(ctx));

const drawProjectiles = () => {
    [...playerProjectiles, ...invaderProjectiles].forEach((p) => {
        p.draw(ctx);
        p.update();
    });
};

const drawParticles = () => particles.forEach((p) => { p.draw(ctx); p.update(); });

const clearProjectiles = () => {
    for (let i = playerProjectiles.length - 1; i >= 0; i--) {
        if (playerProjectiles[i].position.y <= 0) playerProjectiles.splice(i, 1);
    }
    for (let i = invaderProjectiles.length - 1; i >= 0; i--) {
        if (invaderProjectiles[i].position.y >= canvas.height + 50) invaderProjectiles.splice(i, 1);
    }
};

const clearParticles = () => {
    for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].opacity <= 0) particles.splice(i, 1);
    }
};

const createExplosion = (position, size, color) => {
    for (let i = 0; i < size; i++) {
        particles.push(new Particle(
            { x: position.x, y: position.y },
            { x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 3 },
            2, color
        ));
    }
};

const spawnBoss = () => {
    boss = new Boss(canvas.width, bossPhase);
    bossActive = true;
    bossShootInterval = setInterval(() => {
        if (boss && boss.alive && currentState === GameState.PLAYING) {
            boss.shoot(invaderProjectiles);
        }
    }, 800);
};

const checkShootInvaders = () => {
    for (let ii = grid.invaders.length - 1; ii >= 0; ii--) {
        const invader = grid.invaders[ii];
        for (let pi = playerProjectiles.length - 1; pi >= 0; pi--) {
            if (invader.Hit(playerProjectiles[pi])) {
                playerProjectiles.splice(pi, 1);
                const died = invader.takeDamage();
                soundEffects.playHitSound();
                if (died) {
                    createExplosion(
                        { x: invader.position.x + invader.width / 2, y: invader.position.y + invader.height / 2 },
                        10,
                        invader.type === "fast" ? "#00ffcc" : invader.type === "tank" ? "#ff4444" : "crimson"
                    );
                    incrementScore(invader.points);
                    grid.invaders.splice(ii, 1);
                }
                break;
            }
        }
    }
};

const checkShootBoss = () => {
    if (!boss || !boss.alive) return;
    for (let pi = playerProjectiles.length - 1; pi >= 0; pi--) {
        if (boss.Hit(playerProjectiles[pi])) {
            const hitPos = { x: playerProjectiles[pi].position.x, y: playerProjectiles[pi].position.y };
            const result = boss.takeDamage();
            playerProjectiles.splice(pi, 1);

            if (result.damaged) {
                createExplosion(hitPos, 5, "#cc00ff");
            }

            if (result.killed) {
                soundEffects.playExplosionSound();
                for (let k = 0; k < 5; k++) {
                    createExplosion(
                        { x: boss.position.x + Math.random() * boss.width, y: boss.position.y + Math.random() * boss.height },
                        15, k % 2 === 0 ? "#cc00ff" : "crimson"
                    );
                }
                incrementScore(boss.points);
                bossPhase = Math.min(bossPhase + 1, 3);
                bossActive = false;
                clearInterval(bossShootInterval);
                boss = null;
            }
            break;
        }
    }
};

const playerTakeDamage = (hitKill = false) => {
    if (hitKill) {
        while (!livesUI.isDead()) livesUI.loseLife();
    } else {
        livesUI.loseLife();
    }

    createExplosion(
        { x: player.position.x + player.width / 2, y: player.position.y + player.height / 2 },
        10, "white"
    );

    if (livesUI.isDead()) {
        soundEffects.playExplosionSound(); // so toca ao morrer de vez
        gameOver();
    }
    invaderProjectiles.length = 0;
};

const checkShootPlayer = () => {
    for (let i = invaderProjectiles.length - 1; i >= 0; i--) {
        if (player.Hit(invaderProjectiles[i])) {
            const isBossShot = invaderProjectiles[i].type === "boss";
            invaderProjectiles.splice(i, 1);
            playerTakeDamage(isBossShot && boss && boss.isHitKill);
            return;
        }
    }
};

const checkInvaderReachPlayer = () => {
    for (let i = 0; i < grid.invaders.length; i++) {
        if (player.HitByInvader(grid.invaders[i])) {
            playerTakeDamage(false);
            return;
        }
    }
};

const checkShootObstacle = () => {
    obstacles.forEach((obstacle) => {
        for (let i = playerProjectiles.length - 1; i >= 0; i--) {
            if (obstacle.Hit(playerProjectiles[i])) playerProjectiles.splice(i, 1);
        }
        for (let i = invaderProjectiles.length - 1; i >= 0; i--) {
            if (obstacle.Hit(invaderProjectiles[i])) invaderProjectiles.splice(i, 1);
        }
    });
};

const spawnGrid = () => {
    if (grid.invaders.length === 0 && !bossActive) {
        soundEffects.playNextLevelSound();
        gameData.level += 1;
        if (gameData.level % BOSS_EVERY_N_LEVELS === 0) {
            spawnBoss();
        } else {
            grid.Restart(gameData.level);
        }
    }
};

const gameOver = () => {
    ["white", "#4D9be6", "crimson"].forEach((color) => {
        createExplosion(
            { x: player.position.x + player.width / 2, y: player.position.y + player.height / 2 },
            12, color
        );
    });
    currentState = GameState.GAME_OVER;
    player.alive = false;
    document.body.append(gameOverScreen);
    if (bossShootInterval) clearInterval(bossShootInterval);
    if (invaderInterval) clearInterval(invaderInterval);
};

const gameloop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    background.update();
    background.draw(ctx);

    if (currentState === GameState.PLAYING) {
        showGameData();

        drawProjectiles();
        drawParticles();
        drawObstacles();

        clearProjectiles();
        clearParticles();

        checkShootPlayer();
        checkShootInvaders();
        checkShootBoss();
        checkShootObstacle();
        checkInvaderReachPlayer();

        if (!bossActive) {
            spawnGrid();
            grid.draw(ctx);
            grid.update(player.alive);
        }

        if (bossActive && boss) {
            boss.update(invaderProjectiles);
            boss.draw(ctx);
        }

        ctx.save();
        ctx.translate(player.position.x + player.width / 2, player.position.y + player.height / 2);

        if (keys.shoot.pressed && keys.shoot.realized) {
            player.shoot(playerProjectiles);
            soundEffects.playShootSound();
            keys.shoot.realized = false;
        }

        if (keys.left && player.position.x >= 0) { player.moveLeft(); ctx.rotate(-0.15); }
        if (keys.right && player.position.x <= canvas.width - player.width) { player.moveRight(); ctx.rotate(+0.15); }

        ctx.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2);
        player.draw(ctx);
        ctx.restore();

        livesUI.draw(ctx);
    }

    if (currentState === GameState.GAME_OVER) {
        drawParticles();
        drawProjectiles();
        drawObstacles();
        clearProjectiles();
        clearParticles();
        if (!bossActive) { grid.draw(ctx); grid.update(false); }
        if (bossActive && boss) { boss.update(null); boss.draw(ctx); }
        livesUI.draw(ctx);
    }

    requestAnimationFrame(gameloop);
};

addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (key === "a") keys.left = true;
    if (key === "d") keys.right = true;
    if (key === " ") keys.shoot.pressed = true;
});

addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();
    if (key === "a") keys.left = false;
    if (key === "d") keys.right = false;
    if (key === " ") { keys.shoot.pressed = false; keys.shoot.realized = true; }
});

buttonPlay.addEventListener("click", () => {
    startScreen.remove();
    scoreUi.style.display = "block";
    currentState = GameState.PLAYING;

    invaderInterval = setInterval(() => {
        if (!bossActive && grid.invaders.length > 0 && currentState === GameState.PLAYING) {
            const invader = grid.getRandomInvaderShoot();
            if (invader) invader.shoot(invaderProjectiles);
        }
    }, 1000);
});

buttonRestart.addEventListener("click", () => {
    currentState = GameState.PLAYING;
    player.alive = true;
    player.position.x = canvas.width / 2 - player.width / 2;

    grid.invaders.length = 0;
    grid.invadersVelocity = 1;
    grid.Restart(1);

    invaderProjectiles.length = 0;
    playerProjectiles.length = 0;
    particles.length = 0;

    boss = null;
    bossActive = false;
    bossPhase = 0;
    if (bossShootInterval) { clearInterval(bossShootInterval); bossShootInterval = null; }
    if (invaderInterval) { clearInterval(invaderInterval); invaderInterval = null; }

    livesUI.reset();
    initObstacles();

    gameData.score = 0;
    gameData.level = 1;
    gameOverScreen.remove();

    invaderInterval = setInterval(() => {
        if (!bossActive && grid.invaders.length > 0 && currentState === GameState.PLAYING) {
            const invader = grid.getRandomInvaderShoot();
            if (invader) invader.shoot(invaderProjectiles);
        }
    }, 1000);
});

player.draw(ctx);
gameloop();
