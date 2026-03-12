

class Projectile {

    constructor(position,velocity){
        this.position = position;
        this.width = 2;
        this.height = 30;
        this.velocity = velocity;
    }
awddddddda
    draw(ctx){
        ctx.fillStyle = "white";
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
     update(){
        this.position.y += this.velocity;

     }

}


export default Projectile;