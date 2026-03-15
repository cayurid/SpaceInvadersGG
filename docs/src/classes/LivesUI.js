
import { PATH_LIFE_IMAGE, MAX_LIVES } from "../utils/constanst.js";

class LivesUI {
    constructor() {
        this.lives     = MAX_LIVES;
        this.heartSize = 36;
        this.padding   = 8;
        this.offsetX   = 20;
        this.offsetY   = 20;

        this.image = new Image();
        this.image.src = PATH_LIFE_IMAGE;

        this.imgW = 0;
        this.imgH = 0;
        this.cleanCanvas = null;
        this.cleanCtx    = null;

        this.image.onload = () => {
            this.imgW = this.image.naturalWidth;
            this.imgH = this.image.naturalHeight;
            this._buildCleanCanvas();
        };
    }

    _buildCleanCanvas() {
        this.cleanCanvas        = document.createElement("canvas");
        this.cleanCanvas.width  = this.imgW;
        this.cleanCanvas.height = this.imgH;
        this.cleanCtx           = this.cleanCanvas.getContext("2d");

        this.cleanCtx.drawImage(this.image, 0, 0);

        const imageData = this.cleanCtx.getImageData(0, 0, this.imgW, this.imgH);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
            const r = d[i], g = d[i + 1], b = d[i + 2];
            if (r > 200 && g > 200 && b > 200) {
                d[i + 3] = 0;
            }
        }
        this.cleanCtx.putImageData(imageData, 0, 0);
    }

    loseLife() { if (this.lives > 0) this.lives--; }
    reset()    { this.lives = MAX_LIVES; }
    isDead()   { return this.lives <= 0; }

    draw(ctx) {
        if (!this.cleanCanvas) return;

        const sliceW = Math.floor(this.imgW / MAX_LIVES);

        for (let i = 0; i < MAX_LIVES; i++) {
            const x = this.offsetX + i * (this.heartSize + this.padding);
            const y = this.offsetY;

            ctx.save();
            ctx.globalAlpha = i < this.lives ? 1 : 0.2;
            ctx.drawImage(
                this.cleanCanvas,
                i * sliceW, 0,
                sliceW, this.imgH,
                x, y,
                this.heartSize, this.heartSize
            );
            ctx.restore();
        }
    }
}

export default LivesUI;