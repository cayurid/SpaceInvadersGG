import Grid from "./classes/Grid.js";
import Obstacle from "./classes/Obstacle.js";
import Particle from "./classes/Particle.js";
import Player from "./classes/Player.js";
import SoundEffects from "./classes/SoundEffects.js";
import Boss from "./classes/Boss.js";
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

const player = new Player(canvas.width, canvas.height);
const grid = new Grid(3, 6);

const playerProjectiles = [];
const invaderProjectiles = [];
const particles = [];
const obstacles = [];

let boss = null;
let bossActive = false;
let bossShootInterval = null;

const BOSS_EVERY_N_LEVELS = 3;

const initobstacles = () => {
    const x = canvas.width / 2 - 50;
    const y = canvas.height - 250;
    const offset = canvas.width * 0.15;
    obstacles.push(new Obstacle({ x: x - offset, y }, 150, 20, "blue"));
    obstacles.push(new Obstacle({ x: x + offset, y }, 150, 20, "blue"));
};

initobstacles();

const incrementScore = (value) => {
    gameData.score += value;
    if (gameData.score > gameData.high) gameData.high = gameData.score;
};

const keys = {
    left: false,
    right: false,
    shoot: { pressed: false, realized: true },
};

const drawnObstacles = () => obstacles.forEach((o) => o.draw(ctx));

const drawProjectiles = () => {
    [...playerProjectiles, ...invaderProjectiles].forEach((p) => { p.draw(ctx); p.update(); });
};

const drawParticles = () => particles.forEach((p) => { p.draw(ctx); p.update(); });

const clearProjectiles = () => {
    playerProjectiles.forEach((p, i) => { if (p.position.y <= 0) playerProjectiles.splice(i, 1); });
    invaderProjectiles.forEach((p, i) => { if (p.position.y >= canvas.height + 50) invaderProjectiles.splice(i, 1); });
};

const clearParticle = () => {
    particles.forEach((p, i) => { if (p.opacity <= 0) particles.splice(i, 1); });
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
    boss = new Boss(canvas.width);
    bossActive = true;
    bossShootInterval = setInterval(() => {
        if (boss && boss.alive && currentState === GameState.PLAYING) {
            boss.shoot(invaderProjectiles);
        }
    }, 800);
};

const checkShootInvaders = () => {
    grid.invaders.forEach((invader, invaderIndex) => {
        playerProjectiles.some((projectile, projectileIndex) => {
            if (invader.Hit(projectile)) {
                soundEffects.playHitSound();
                createExplosion(
                    { x: invader.position.x + invader.width / 2, y: invader.position.y + invader.height / 2 },
                    10,
                    invader.type === "fast" ? "#00ffcc" : invader.type === "tank" ? "#ff4444" : "crimson"
                );
                incrementScore(invader.points);
                grid.invaders.splice(invaderIndex, 1);
                playerProjectiles.splice(projectileIndex, 1);
            }
        });
    });
};

const checkShootBoss = () => {
    if (!boss || !boss.alive) return;
    playerProjectiles.some((projectile, i) => {
        if (boss.Hit(projectile)) {
            boss.takeDamage();
            playerProjectiles.splice(i, 1);
            createExplosion({ x: projectile.position.x, y: projectile.position.y }, 5, "#cc00ff");
            if (!boss.alive) {
                soundEffects.playExplosionSound();
                for (let k = 0; k < 5; k++) {
                    createExplosion(
                        { x: boss.position.x + Math.random() * boss.width, y: boss.position.y + Math.random() * boss.height },
                        15, k % 2 === 0 ? "#cc00ff" : "crimson"
                    );
                }
                incrementScore(boss.points);
                bossActive = false;
                clearInterval(bossShootInterval);
                boss = null;
            }
            return true;
        }
    });
};

const checkShootPlayer = () => {
    invaderProjectiles.some((projectile, i) => {
        if (player.Hit(projectile)) {
            soundEffects.playExplosionSound();
            invaderProjectiles.splice(i, 1);
            gameOver();
        }
    });
};

const checkShootObstacle = () => {
    obstacles.forEach((obstacle) => {
        playerProjectiles.some((p, i) => { if (obstacle.Hit(p)) playerProjectiles.splice(i, 1); });
        invaderProjectiles.some((p, i) => { if (obstacle.Hit(p)) invaderProjectiles.splice(i, 1); });
    });
};

const spawnGrid = () => {
    if (grid.invaders.length === 0 && !bossActive) {
        soundEffects.playNextLevelSound();
        gameData.level += 1;
        if (gameData.level % BOSS_EVERY_N_LEVELS === 0) {
            spawnBoss();
        } else {
            grid.rows = Math.round(Math.random() * 9 + 2);
            grid.cols = Math.round(Math.random() * 9 + 2);
            grid.Restart();
        }
    }
};

const gameOver = () => {
    ["white", "#4D9be6", "crimson"].forEach((color) => {
        createExplosion(
            { x: player.position.x + player.width / 2, y: player.position.y + player.height / 2 },
            10, color
        );
    });
    currentState = GameState.GAME_OVER;
    player.alive = false;
    document.body.append(gameOverScreen);
    if (bossShootInterval) clearInterval(bossShootInterval);
};

const gameloop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentState === GameState.PLAYING) {
        showGameData();
        drawProjectiles();
        drawParticles();
        drawnObstacles();
        clearProjectiles();
        clearParticle();
        checkShootPlayer();
        checkShootInvaders();
        checkShootBoss();
        checkShootObstacle();

        if (!bossActive) {
            spawnGrid();
            grid.draw(ctx);
            grid.update(player.alive);
        }

        if (bossActive && boss) {
            boss.update();
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
    }

    if (currentState === GameState.GAME_OVER) {
        checkShootObstacle();
        drawParticles();
        drawProjectiles();
        drawnObstacles();
        clearProjectiles();
        clearParticle();
        if (!bossActive) { grid.draw(ctx); grid.update(player.alive); }
        if (bossActive && boss) { boss.update(); boss.draw(ctx); }
    }

    requestAnimationFrame(gameloop);
};

player.draw(ctx);

addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (key === "a") keys.left = true;
    if (key === "d") keys.right = true;
    if (key === " ") keys.shoot.pressed = true;
});

addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    if (key === "a") keys.left = false;
    if (key === "d") keys.right = false;
    if (key === " ") { keys.shoot.pressed = false; keys.shoot.realized = true; }
});

buttonPlay.addEventListener("click", () => {
    startScreen.remove();
    scoreUi.style.display = "block";
    currentState = GameState.PLAYING;
    setInterval(() => {
        if (!bossActive && grid.invaders.length > 0 && currentState === GameState.PLAYING) {
            const invader = grid.getRandomInvaderShoot();
            if (invader) invader.shoot(invaderProjectiles);
        }
    }, 1000);
});

buttonRestart.addEventListener("click", () => {
    currentState = GameState.PLAYING;
    player.alive = true;
    grid.invaders.length = 0;
    grid.invadersVelocity = 1;
    grid.rows = 3;
    grid.cols = 6;
    grid.Restart();
    invaderProjectiles.length = 0;
    playerProjectiles.length = 0;
    boss = null;
    bossActive = false;
    if (bossShootInterval) clearInterval(bossShootInterval);
    gameData.score = 0;
    gameData.level = 1;
    gameOverScreen.remove();
});

gameloop();
