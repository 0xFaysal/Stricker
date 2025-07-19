import type { PlayerData, serverData } from "../types";
import SpriteLoader from "./spliteLoader";
import type Sprite from "./sprite";

/**
 * Game class - Frontend game rendering engine
 * 
 * Manages the visual representation of the game state received from the server.
 * Handles sprite loading, player rendering, UI elements, and canvas drawing operations.
 * 
 * Responsibilities:
 * - Loading and managing game sprites/textures
 * - Rendering players with proper layering (shadows, characters, UI)
 * - Drawing player names and health bars
 * - Optimizing rendering performance through sprite caching
 * - Handling canvas operations and coordinate transformations
 */
class Game {
    /** Sprite loading and management system */
    private spriteLoader: SpriteLoader;

    /** Canvas 2D rendering context for drawing operations */
    private ctx: CanvasRenderingContext2D;

    /** Map of all loaded sprites for quick access */
    private sprites: Map<string, Sprite>;

    /** 
     * Performance optimization: cached frequently used sprites
     * Eliminates expensive Map lookups during high-frequency rendering
     */
    private cachedSprites: {
        /** Shadow sprite used under every player character */
        stickmanShadow: Sprite | null;
    };

    /**
     * Initializes the game rendering system
     * 
     * Sets up sprite loading, caching systems, and prepares the rendering context
     * for optimal game graphics performance.
     * 
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context for drawing
     */
    constructor(ctx: CanvasRenderingContext2D) {
        // Store rendering context
        this.ctx = ctx;

        // Initialize sprite loading system
        this.spriteLoader = new SpriteLoader();
        this.sprites = this.spriteLoader.getSprites();

        // Initialize performance optimization cache
        this.cachedSprites = {
            stickmanShadow: null
        };

        // Pre-load commonly used sprites for performance
        this.initializeSpriteCache();
    }

    /**
     * Pre-caches frequently used sprites for performance optimization
     * 
     * Reduces Map lookup overhead during rendering by storing references
     * to commonly used sprites in direct properties.
     * 
     * @returns {void}
     */
    private initializeSpriteCache(): void {
        // Cache shadow sprite as it's rendered for every player every frame
        this.cachedSprites.stickmanShadow = this.sprites.get("stickmanShadow") || null;
    }

    /**
     * Main rendering method - draws complete game state
     * 
     * Receives game state from server and renders all visual elements including
     * player characters, shadows, names, health bars with proper depth sorting.
     * 
     * @param {serverData} data - Complete game state from server including all players
     * @returns {void}
     */
    draw(data: serverData): void {
        // Clear canvas for fresh frame
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Sort players by Y position for proper depth rendering (painter's algorithm)
        // Players lower on screen (higher Y) should be drawn last (appear in front)
        data.players.sort((a, b) => a.position.y - b.position.y);

        // Render all players with their components
        data.players.forEach((player: PlayerData) => {
            // Render shadow first (behind character)
            if (this.cachedSprites.stickmanShadow) {
                this.cachedSprites.stickmanShadow.drawShadow(
                    this.ctx,
                    player.position.x,
                    player.position.y
                );
            }

            // Get current animation frame information
            const { name: spriteName, index } = player.animation;

            // Render player character sprite
            const playerSprite = this.sprites.get(spriteName);
            if (playerSprite) {
                playerSprite.draw(
                    this.ctx,
                    index,
                    player.position.x,
                    player.position.y
                );
            }

            // Render UI elements on top of character
            this.drawName(player);      // Player name tag
            this.drawHealthBar(player); // Health status bar
        });
    }

    /**
     * Renders player name above character
     * 
     * Draws the player's username as a text label positioned above their character
     * using their assigned color for visual identification.
     * 
     * @param {PlayerData} player - Player data containing name, position, and color
     * @returns {void}
     */
    drawName(player: PlayerData): void {
        // Configure text rendering properties
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = player.color;

        // Position name above character (offset by 68 pixels)
        this.ctx.fillText(
            player.name,
            player.position.x - 20,  // Center horizontally with slight left offset
            player.position.y - 68   // Position above character
        );
    }

    /**
     * Renders player health bar above character
     * 
     * Draws a visual health indicator showing current health as a percentage
     * with red background and green foreground for clear status communication.
     * 
     * @param {PlayerData} player - Player data containing health and position
     * @returns {void}
     */
    drawHealthBar(player: PlayerData): void {
        // Health bar dimensions and positioning
        const healthBarWidth = 40;  // Total width in pixels
        const healthBarHeight = 5;  // Height in pixels
        const healthPercentage = player.health / 100; // Convert to 0-1 range

        // Draw red background (represents missing health)
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(
            player.position.x - 20,  // X position (centered above player)
            player.position.y - 66,  // Y position (above name)
            healthBarWidth,          // Full width background
            healthBarHeight          // Bar height
        );

        // Draw green foreground (represents current health)
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(
            player.position.x - 20,           // Same X position
            player.position.y - 66,           // Same Y position
            healthBarWidth * healthPercentage, // Width based on health percentage
            healthBarHeight                   // Same height
        );
    }
}

export default Game;