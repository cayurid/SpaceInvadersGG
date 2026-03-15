import Grid from "./classes/Grid.js";
import Obstacle from "./classes/Obstacle.js";
import Particle from "./classes/Particle.js";
import Player from "./classes/Player.js";
import SoundEffects from "./classes/SoundEffects.js";
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

canvas.width = innerWidth; // ocupar a tela inteira
canvas.height = innerHeight; // ocupar a tela inteira

ctx.imageSmoothingEnabled = false;

let currentState = GameState.START;

const gameData = {
    score: 0,
    level: 1,
    high: 0,
};

const showGameData = () => {
    scoreElement.textContent = gameData.score;
    levelElement.textContent = gameData.level;
    highElement.textContent = gameData.high;
};

const player = new Player(canvas.width, canvas.height);
const grid = new Grid(3, 6); // colunas e linhas

const playerProjectiles = [];
const invaderProjectiles = [];
const particles = [];
const obstacles = [];

const initobstacles = () => {
    const x = canvas.width / 2 - 50;
    const y = canvas.height - 250;
    const offset = canvas.width * 0.15;
    const color = "blue";

    const obstacle1 = new Obstacle({ x: x - offset, y }, 150, 20, color);
    const obstacle2 = new Obstacle({ x: x + offset, y }, 150, 20, color);

    obstacles.push(obstacle1);
    obstacles.push(obstacle2);

};

initobstacles();

const incrementScore = (value) => {
    gameData.score += value;

    if(gameData.score > gameData.high){
        gameData.high = gameData.score
    }
};

const keys = {
    left: false,
    right: false,
    shoot:
    {
        pressed: false,
        realized: true,
    },
};

const drawnObstacles = () => {
    obstacles.forEach((obstacle) => obstacle.draw(ctx));
}

const drawProjectiles = () => {
    const projectiles = [...playerProjectiles, ...invaderProjectiles]

    projectiles.forEach((projectile) => {
        projectile.draw(ctx);
        projectile.update();
    });

};

const drawParticles = () => {
    particles.forEach((particle) => {
        particle.draw(ctx);
        particle.update();
    });
};

const clearProjectiles = () => {
    playerProjectiles.forEach((projectiles, index) => {
        if (projectiles.position.y <= 0) {
            playerProjectiles.splice(index, 1); // deletar projeteis 1 por um
        }
    });
};

const clearParticle = () => {
    particles.forEach((particle, i) => {
        if (particle.op <= 0) {
            particle.splice(i, 1);
        }
    });
};

const createExplosion = (position, size, color) => {
    for (let i = 0; i < size; i += 1) {
        const particle = new Particle(
            {
                x: position.x, // posicao
                y: position.y,
            },
            {
                x: Math.random() - 0.5 * 1.5, // velocidade 
                y: Math.random() - 0.5 * 1.5, // subtrai 0,5 pq ai d apra harmonizar e suavizar o efeito das particulas
            },
            2, // medida do raio
            color // cor
        );
        particles.push(particle);

    }
};



const checkShootInvaders = () => {
    grid.invaders.forEach((invader, invaderIndex) => {
        playerProjectiles.some((projectiles, projectileIndex) => {
            if (invader.Hit(projectiles)) {

                soundEffects.playHitSound();
                createExplosion(
                    {
                        x: invader.position.x + invader.width / 2,
                        y: invader.position.y + invader.height / 2,

                    },
                    10,
                    "crimson"
                );

                incrementScore(10);


                grid.invaders.splice(invaderIndex, 1);
                playerProjectiles.splice(projectileIndex, 1);
            }

        });
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
        playerProjectiles.some((projectile, i) => {
            if (obstacle.Hit(projectile)) {
                playerProjectiles.splice(i, 1);
            }
        });

        invaderProjectiles.some((projectile, i) => {
            if (obstacle.Hit(projectile)) {
                invaderProjectiles.splice(i, 1);
            }
        });
    });
};

const spawnGrid = () => {
    if (grid.invaders.length === 0) {
        soundEffects.playNextLevelSound();
        grid.rows = Math.round(Math.random() * 9 + 2);
        grid.cols = Math.round(Math.random() * 9 + 2);
        grid.Restart();

        gameData.level += 1;
    }
};

const gameOver = () => {
    createExplosion({
        x: player.position.x + player.width / 2,
        y: player.position.y + player.height / 2,

    },
        10,
        "white"
    );

    createExplosion({
        x: player.position.x + player.width / 2,
        y: player.position.y + player.height / 2,

    },
        10,
        "#4D9be6"
    );

    createExplosion({
        x: player.position.x + player.width / 2,
        y: player.position.y + player.height / 2,

    },
        10,
        "crimson"
    );
    currentState = GameState.GAME_OVER;
    player.alive = false;
    document.body.append(gameOverScreen);
};




const gameloop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height) // vai limpar a tela toda vez que atualizar
    if (currentState == GameState.PLAYING) {

        showGameData();
        spawnGrid();

        drawProjectiles();
        drawParticles();
        drawnObstacles();

        clearProjectiles();
        clearParticle();

        checkShootPlayer();
        checkShootInvaders();
        checkShootObstacle();


        grid.draw(ctx);
        grid.update(player.alive);

        ctx.save();

        ctx.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2
        ); // centralizei o ponto de rotacao no meio do player para que n gire a tela inteira

        if (keys.shoot.pressed && keys.shoot.realized) {
            player.shoot(playerProjectiles);
            soundEffects.playShootSound();
            keys.shoot.realized = false;
        };

        if (keys.left && player.position.x >= 0) { // logica para n deixar o player sair da tela pela  esquerda
            player.moveLeft();
            ctx.rotate(-0.15);
        }

        if (keys.right && player.position.x <= canvas.width - player.width) { // logica para n deixa o player sair da tela pela direita
            player.moveRight();
            ctx.rotate(+0.15);
        }

        ctx.translate(
            - player.position.x - player.width / 2,
            - player.position.y - player.height / 2
        );


        player.draw(ctx);

        ctx.restore();


    }
    if (currentState == GameState.GAME_OVER) {
        checkShootObstacle();
        drawParticles();
        drawProjectiles();
        drawnObstacles();

        clearProjectiles();
        clearParticle();

        grid.draw(ctx);
        grid.update(player.alive);
    }
    requestAnimationFrame(gameloop);// atualiza a tela so quando necessario


}




player.draw(ctx); // player 

addEventListener("keydown", (event) => { // funcao para registras as teclas para se movimentar so com o kewdown ela fica mt lenta, pois so conta quando precionada  

    const key = event.key.toLowerCase(); // deixar as teclas paertadas tudo em lowercase

    if (key === "a") keys.left = true;
    if (key === "d") keys.right = true;
    if (key === " ") keys.shoot.pressed = true;

});

addEventListener("keyup", (event) => { // funcao para registras as teclas so que o keyup ja da uma ajustada melhor na fluidez porque registra quando solta tambem

    const key = event.key.toLowerCase(); // deixar as teclas apertadas tudo em lowercase

    if (key === "a") keys.left = false;
    if (key === "d") keys.right = false;
    if (key === " ") {
        keys.shoot.pressed = false;
        keys.shoot.realized = true;
    }
});



buttonPlay.addEventListener("click", () => {
    startScreen.remove();
    scoreUi.style.display = "block"
    currentState = GameState.PLAYING;

    setInterval(() => {
        const invader = grid.getRandomInvaderShoot()

        if (invader) {
            invader.shoot(invaderProjectiles);
        }

    }, 1000);
})


buttonRestart.addEventListener("click", () => {
    currentState = GameState.PLAYING;
    player.alive = true;
    grid.invaders.length = 0;
    grid.invadersVelocity = 1;

    invaderProjectiles.length = 0;

    gameData.score = 0;
    gameData.level = 0;

    gameOverScreen.remove();
});


gameloop();
