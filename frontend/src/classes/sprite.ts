class Sprite {
    private image: HTMLImageElement;
    private cellSize: { x: number; y: number };
    private offset: { x: number; y: number };

    constructor(
        image: HTMLImageElement,
        cellSize: { x: number; y: number },
        offset: { x: number; y: number }
    ) {
        this.image = image;
        this.cellSize = cellSize;
        this.offset = offset;
    }




    draw(ctx: CanvasRenderingContext2D, index: number, x: number, y: number) {
        const { x: cellWidth, y: cellHeight } = this.cellSize;

        ctx.drawImage(
            this.image,
            cellWidth * index,
            0,
            cellWidth,
            cellHeight,
            x + this.offset.x,
            y + this.offset.y,
            cellWidth,
            cellHeight
        );
    }

    drawShadow(ctx: CanvasRenderingContext2D, x: number, y: number) {
        this.draw(ctx, 0, x, y); // Assuming shadow is at index 0
    }


}


export default Sprite;
