import Player from "./classes/Player.js";


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth; // ocupar a tela inteira
canvas.height = innerHeight; // ocupar a tela inteira

const player = new Player(canvas.width, canvas.height);

const keys = {
    left: false,
    right: false,
};

const gameloop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height) // vai limpar a tela toda vez que atualizar

    if (keys.left) {
        player.position.x -= 6;
    }

    if (keys.right) {
        player.position.x += 6;
    }

    player.draw(ctx);

    requestAnimationFrame(gameloop) // atualiza a tela so quando necessario
}

gameloop();


player.draw(ctx); // player 

addEventListener("keydown", (event) => { // funcao para registras as teclas para se movimentar so com o kewdown ela fica mt lenta

    const key = event.key.toLowerCase(); // deixar as teclas paertadas tudo em lowercase

    if (key === "a") {
        keys.left = true;
    }

    if (key === "d") {
        keys.right = true;

    }

})      

addEventListener("keyup", (event) => { // funcao para registras as teclas so que o keyup ja da uma ajustada melhor na fluidez

    const key = event.key.toLowerCase(); // deixar as teclas paertadas tudo em lowercase

    if (key === "a") {
        keys.left = false;
    }

    if (key === "d") {
        keys.right = false;

    }

})      