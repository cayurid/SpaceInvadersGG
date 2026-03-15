class Background {
    constructor(canvasWidth, canvasHeight) {
        this.w = canvasWidth;
        this.h = canvasHeight;
        this.stars = [];
        this.init();
    }

    init() {
        // camada 1: estrelas pequenas e lentas (fundo)
        for (let i = 0; i < 120; i++) {
            this.stars.push({
                x:     Math.random() * this.w,
                y:     Math.random() * this.h,
                r:     Math.random() * 1.2 + 0.3,
                speed: Math.random() * 0.3 + 0.1,
                alpha: Math.random() * 0.5 + 0.3,
            });
        }
        // camada 2: estrelas medias
        for (let i = 0; i < 60; i++) {
            this.stars.push({
                x:     Math.random() * this.w,
                y:     Math.random() * this.h,
                r:     Math.random() * 1.8 + 0.8,
                speed: Math.random() * 0.6 + 0.3,
                alpha: Math.random() * 0.6 + 0.4,
            });
        }
        // camada 3: estrelas grandes e rapidas (frente)
        for (let i = 0; i < 20; i++) {
            this.stars.push({
                x:     Math.random() * this.w,
                y:     Math.random() * this.h,
                r:     Math.random() * 2.5 + 1.2,
                speed: Math.random() * 1.0 + 0.6,
                alpha: Math.random() * 0.4 + 0.6,
            });
        }
    }

    update() {
        this.stars.forEach((s) => {
            s.y += s.speed;
            if (s.y > this.h + 4) {
                s.y = -4;
                s.x = Math.random() * this.w;
            }
        });
    }

    draw(ctx) {
        ctx.fillStyle = "#04020f";
        ctx.fillRect(0, 0, this.w, this.h);

        this.stars.forEach((s) => {
            ctx.save();
            ctx.globalAlpha = s.alpha;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.restore();
        });
    }
}

export default Background;