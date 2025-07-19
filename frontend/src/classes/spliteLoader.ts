import Sprite from "./sprite";

const spriteData = [
    {
        spriteKey: 'stickman',
        filename: 'stickman.png',
        cellSize: { x: 64, y: 64 },
        offset: { x: -32, y: -62 }
    },
    {
        spriteKey: 'stickmanR',
        filename: 'stickmanR.png',
        cellSize: { x: 64, y: 64 },
        offset: { x: -32, y: -62 }
    },
    {
        spriteKey: 'stickmanAttacks',
        filename: 'stickmanAttacks.png',
        cellSize: { x: 128, y: 64 },
        offset: { x: -96, y: -62 }
    },
    {
        spriteKey: 'stickmanAttacksR',
        filename: 'stickmanAttacksR.png',
        cellSize: { x: 128, y: 64 },
        offset: { x: -32, y: -62 }
    },
    {
        spriteKey: 'stickmanShadow',
        filename: 'stickmanShadow.png',
        cellSize: { x: 64, y: 32 },
        offset: { x: -32, y: -16 }
    }
];

class SpriteLoader {
    private sprites: Map<string, Sprite>;

    constructor() {
        this.sprites = new Map();
        this.loadSprites().then(() => {
            console.log("Sprites loaded successfully");
        }).catch((error) => {
            console.error("Error loading sprites:", error);
        });
    }


    async loadSprites(): Promise<void> {
        for (const sprite of spriteData) {
            const image = await this.loadImage(sprite.filename);
            const spriteInstance = new Sprite(image, sprite.cellSize, sprite.offset);
            this.sprites.set(sprite.spriteKey, spriteInstance);
        }
    }

    private loadImage(filename: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = `./${filename}`;
            img.onload = () => resolve(img);
            img.onerror = (error) => reject(error);
        });
    }

    getSprites(): Map<string, Sprite> {
        return this.sprites;
    }
}


export default SpriteLoader;