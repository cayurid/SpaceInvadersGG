import Grid from "./classes/Grid.js";
import Invader from "./classes/invader.js";
import Particle from "./classes/particle.js";
import Player from "./classes/Player.js";
import Projectile from "./classes/Projectile.js";


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth; // ocupar a tela inteira
canvas.height = innerHeight; // ocupar a tela inteira

ctx.imageSmoothingEnabled = false;

const player = new Player(canvas.width, canvas.height);
const grid = new Grid(3, 6); // colunas e linhas

const playerProjectiles = [];
const invaderProjectiles = [];
const particles = [];


const keys = {
    left: false,
    right: false,
    shoot:
    {
        pressed: false,
        realized: true,
    },
};

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

const createExplosion = () => {
    for (let i = 0; i < 10; i += 1) {
        const particle = new Particle(
            {
                x: 300, // posicao
                y: 500,
            },
            {
                x: Math.random() - 0.5 * 1.5, // velocidade 
                y: Math.random() - 0.5 * 1.5, // subtrai 0,5 pq ai d apra harmonizar e suavizar o efeito das particulas
            },
            2, // medida do raio
            "crimson" // cor
        );
        particles.push(particle);

    }
};



const checkShootInvaders = () => {
    grid.invaders.forEach((invader, invaderIndex) => {
        playerProjectiles.some((projectiles, projectileIndex) => {
            if (invader.Hit(projectiles)) {

                createExplosion();

                grid.invaders.splice(invaderIndex, 1);
                playerProjectiles.splice(projectileIndex, 1);
            }

        });
    });
};



const gameloop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height) // vai limpar a tela toda vez que atualizar

    drawParticles();
    drawProjectiles();
    clearProjectiles();

    checkShootInvaders();


    grid.draw(ctx);
    // grid.update();
    ctx.save();

    ctx.translate(
        player.position.x + player.width / 2,
        player.position.y + player.height / 2
    ); // centralizei o ponto de rotacao no meio do player para que n gire a tela inteira

    if (keys.shoot.pressed && keys.shoot.realized) {
        player.shoot(playerProjectiles);
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

    requestAnimationFrame(gameloop) // atualiza a tela so quando necessario
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

// setInterval(() => {
//     const invader = grid.getRandomInvaderShoot()

//     if (invader) {
//         invader.shoot(invaderProjectiles);
//     }

// }, 1000);

gameloop();
