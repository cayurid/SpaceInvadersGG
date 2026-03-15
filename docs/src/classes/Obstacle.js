

class Obstacle{
    constructor(position, width, height, color){
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;

    }

    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height,

        );

    }
    Hit(projectiles){
        const projectilePositionY = projectiles.velocity < 0
            ? projectiles.position.y
            : projectiles.position.y + projectiles.height
        return (
            projectiles.position.x >= this.position.x && 
            projectiles.position.x <= this.position.x + this.width &&
            projectilePositionY >= this.position.y &&
            projectilePositionY <= this.position.y + this.height 

        );
            
    }

}
export default Obstacle;