import type { PlayerData, serverData } from "../types";
import SpriteLoader from "./spliteLoader";
import type Sprite from "./sprite";

class Game {
    private spriteLoader: SpriteLoader;
    private ctx: CanvasRenderingContext2D;
    private sprites: Map<string, Sprite>;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;

        this.spriteLoader = new SpriteLoader();
        this.sprites = this.spriteLoader.getSprites();
    }

    draw(data: serverData) {
        // Drawing logic using this.ctx and this.spriteLoader
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        data.players.sort((a, b) => a.position.y - b.position.y); // Sort players by Y position

        // Render all players
        data.players.forEach((player: PlayerData) => {
            const sprite = this.sprites.get("stickmanShadow");
            if (sprite) {
                sprite.drawShadow(this.ctx, player.position.x, player.position.y); // Draw shadow
            }
            const { name: spriteName, index } = player.animation;

            const playerSprite = this.sprites.get(spriteName);
            if (playerSprite) {
                playerSprite.draw(this.ctx, index, player.position.x, player.position.y);
            }
            this.drawName(player); // Draw player name
            this.drawHealthBar(player); // Draw health bar
        });
    }

    drawName(player: PlayerData) {
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = player.color;
        this.ctx.fillText(player.name, player.position.x - 20, player.position.y - 68); // Draw player name above the character
    }

    drawHealthBar(player: PlayerData) {
        const healthBarWidth = 40;
        const healthBarHeight = 5;
        const healthPercentage = player.health / 100;

        this.ctx.fillStyle = "red";
        this.ctx.fillRect(player.position.x - 20, player.position.y - 66, healthBarWidth, healthBarHeight); // Background

        this.ctx.fillStyle = "green";
        this.ctx.fillRect(player.position.x - 20, player.position.y - 66, healthBarWidth * healthPercentage, healthBarHeight); // Health bar
    }

}

export default Game;

