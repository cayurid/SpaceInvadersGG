class Player {
    constructor(canvasWidth, canvasHeight ) {
        this.width = 100; // altura
        this.height = 100; // largura // this ja instacia a variavel dentro do metodo
        
        this.position = {
            x: canvasWidth/ 2 - this.width / 2,
            y: canvasHeight - this.height - 30,
            

        };
    }
    draw(ctx){

        ctx.fillStyle = "red"
        ctx.fillRect(this.position.x,this.position.y,this.width, this.height);

    }
}



export default Player; // poder exportar e utlizar essa classe = Heranca