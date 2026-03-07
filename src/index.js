import Player from "./classes/Player.js";
import Projectile from "./classes/Projectile.js";


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth; // ocupar a tela inteira
canvas.height = innerHeight; // ocupar a tela inteira

ctx.imageSmoothingEnabled = false;

const player = new Player(canvas.width, canvas.height);
const playerProjectiles = [];



const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        realized: true,
    },
};

const drawProjectiles = () => {
    playerProjectiles.forEach((projectile) => {
        projectile.draw(ctx);
        projectile.update();
    });
    
};
const clearProjectiles = () => {
    playerProjectiles.forEach((projectile, index) => {
        if(projectile.position.y <= 0){
            playerProjectiles.splice(index,1)
        }
    });
}

const gameloop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height) // vai limpar a tela toda vez que atualizar
    console.log(playerProjectiles);
    
    drawProjectiles();
    clearProjectiles();

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

gameloop();


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

