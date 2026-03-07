import { INITIAL_FRAMES, PATH_ENGINE_IMAGE, PATH_ENGINE_SPRITES, PATH_SPACESHIP_IMAGE } from "../utils/constanst.js";
import Projectile from "./Projectile.js";

class Player {
    constructor(canvasWidth, canvasHeight) {
        this.width = 48 * 7; // altura
        this.height = 48 * 7; // largura // this ja instacia a variavel dentro do metodo
        this.velocity = 12;

        this.position = {
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30,


        };

        this.image = this.getImage(PATH_SPACESHIP_IMAGE);
        this.engineImage = this.getImage(PATH_ENGINE_IMAGE);
        this.engineSprites = this.getImage(PATH_ENGINE_SPRITES);

        this.sx = 0;
        this.framesCounter = INITIAL_FRAMES;

    }

    getImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }


    moveLeft() {

        this.position.x -= this.velocity;
    }
    moveRight() {

        this.position.x += this.velocity;
    }
   


    draw(ctx) {
        // a ordem importa na hora de desenhar, primeiro a nave dps o motor, se for ao contrario o motor fica por baixo


        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );

        ctx.drawImage(
            this.engineSprites,
            this.sx, 0, // source x 0, source y = 0,  e o caminho fonte da onde queremos buscar a imagem
            48, 48, // ele que saber o tamanho orginal do arquivo= extrair um  48 x 48 da imagem original
            this.position.x, // posicionar  a imagem
            this.position.y + 12,
            this.width,
            this.height
        );


        ctx.drawImage(
            this.engineImage,
            this.position.x,
            this.position.y + 10,
            this.width,
            this.height
        );

        this.update();


    }

    update() {

        if (this.framesCounter === 0) {
            this.sx = this.sx === 96 ? 0 : this.sx + 48;
            this.framesCounter = INITIAL_FRAMES;
        }
        this.framesCounter--;
    }

    shoot(projectiles) {
        const p = new Projectile(
            {
                x: this.position.x + this.width / 2 - 1,
                y: this.position.y + 10,
            },
            -10 // velocidade

        );
        projectiles.push(p);
    }

}



export default Player; // poder exportar e utlizar essa classe = Heranca