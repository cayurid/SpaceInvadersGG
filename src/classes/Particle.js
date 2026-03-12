

class Particle {

    constructor(position, velocity, radius, color) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.opacity = 1;
    }

    draw(ctx) {
        ctx.beginPath();// estamos desenhando algo, e aqui e o caminho inicial
        ctx.arc(this.position.x, this.position.y, this.radius,0 , Math.PI * 2 );
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(){
        this.position.x += this.velocity.x;  // cria o feito espalhado das parrticulas
        this.position.y += this.velocity.y;
    }
}

export default Particle;