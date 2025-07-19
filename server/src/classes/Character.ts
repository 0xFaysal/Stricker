import { PlayerData } from "../types";
import Animation from "./Animation";
import Game from "./Game";

/**
 * Represents a character in the game.
 * Handles movement, actions, animations, and interactions with other players.
 */
class Character {

    private id: string; // Unique identifier for the character
    public game: Game; // Reference to the game instance
    private health: number; // Health of the character
    private name: string; // Name of the character
    private color: string; // Color of the character, generated based on ID
    private input: { [key: string]: boolean } = {}; // Input state for the character
    private moveSpeed: { x: number; y: number } = { x: 6, y: 4 }; // Speed of movement per update
    private animations: Record<string, Animation> = {}; // Store animations by name
    private action: string; // Current action of the character (e.g., NONE, HURT, ATTACK)
    private animation: Animation; // Current animation being played
    private facingRight: boolean; // Whether the character is facing right or left

    private position = { x: 100, y: 100 }; // Position of the character in the game world
    private hurtBox = {
        size: { x: 44, y: 12 },
        offset: { x: -22, y: -6 }
    } as const; // Hurt box for collision detection

    private actions = {
        NONE: 'none',
        HURT: 'hurt',
        ATTACK: {
            PUNCH: 'attack.punch'
        },
    } as const; // Define possible actions

    private attacks: Record<string, {
        hitBox: {
            size: { x: number, y: number },
            offset: { x: number, y: number }
        }
    }> = {
        punch: {
            hitBox: {
                size: { x: 56, y: 24 },
                offset: { x: -56, y: -12 }
            }
        },
        punchR: {
            hitBox: {
                size: { x: 56, y: 24 },
                offset: { x: 0, y: -12 }
            }
        }
    } as const; // Define attacks with their hit boxes

    /**
     * Creates an instance of Character.
     * @param game Reference to the game instance
     * @param id Unique identifier for the character
     */
    constructor(game: Game, id: string) {
        this.game = game;
        this.id = id;

        this.name = 'Player'; // Default name, can be set later
        this.color = this.generateColor(); // Generate a color based on the player's ID for consistency
        this.health = 100; // Default health

        this.facingRight = true; // Default facing direction



        // Initialize animations 
        this.animations = {
            stand: new Animation('stickman', 0, 3, 4, true),
            standR: new Animation('stickmanR', 0, 3, 4, true),
            run: new Animation('stickman', 3, 4, 3, true),
            runR: new Animation('stickmanR', 3, 4, 3, true),
            hurt: new Animation('stickman', 7, 5, 3, false),
            hurtR: new Animation('stickmanR', 7, 5, 3, false),
            punch: new Animation('stickmanAttacks', 0, 6, 3, false),
            punchR: new Animation('stickmanAttacksR', 0, 6, 3, false),
        };

        // Set up for punch attack
        this.animations.punch.setOnIndexMethod(3, () => {
            this.doAttack('punch', Object.values(this.game.players)); // Attack all players
        });

        // Set up for punch Right attack
        this.animations.punchR.setOnIndexMethod(3, () => {
            this.doAttack('punchR', Object.values(this.game.players)); // Attack all players
        });


        this.action = this.actions.NONE; // Default action is NONE
        this.animation = this.animations.stand; // Start with standing animation

    }

    /**
     * Updates the character's state.
     * Handles movement, actions, and animations based on input.
     */
    public update(): void {
        let dy = 0; // Vertical movement based on input
        if (this.input.UP) dy--; // Move up
        if (this.input.DOWN) dy++; // Move down

        let dx = 0; // Horizontal movement based on input
        if (this.input.LEFT) dx--; // Move left
        if (this.input.RIGHT) dx++; // Move right

        this.animation.update(); // Update the current animation

        //Based on the action, set the animation
        switch (this.action) {

            case this.actions.NONE:
                this.move(dx, dy); // Move the character based on input
                this.facingRight = !(dx < 0); // Update facing direction based on movement

                // If no movement, use standing animation
                if (dx === 0 && dy === 0) {
                    // If not moving, use standing animation
                    this.animation = this.facingRight ? this.animations.standR : this.animations.stand;
                } else {
                    // If moving, use running animation
                    this.animation = this.facingRight ? this.animations.runR : this.animations.run;
                }

                //input handling to change action
                if (this.input.ATTACK) {
                    this.action = this.actions.ATTACK.PUNCH;
                    this.animation = this.facingRight ? this.animations.punchR : this.animations.punch;
                    this.animation.reset(); // Reset animation to start
                }
                break;

            case this.actions.HURT:
                if (this.animation.isDone) {
                    this.action = this.actions.NONE; // Reset to none after hurt animation is done
                    this.animation = this.facingRight ? this.animations.standR : this.animations.stand; // Reset to standing animation
                }
                break;

            case this.actions.ATTACK.PUNCH:
                if (this.animation.isDone) { // Check if punch animation is done
                    this.action = this.actions.NONE; // Reset to none after punch animation is done
                    this.animation = this.facingRight ? this.animations.standR : this.animations.stand; // Reset to standing animation
                }
                break;
        }

        // Enforce boundaries that keep the character within the game area
        this.enforceBoundaries();
    }

    /**
     * Sets the name of the character.
     * @param name The name to set for the character
     */
    public setName(name: string): void {
        this.name = name;
    }

    /**
     * Sets the input keys for the character.
     * @param key The key to set
     * @param pressed Whether the key is pressed or not
     */
    public setKeys(key: string, pressed: boolean): void {
        if (pressed) {
            this.input[key] = true;
        } else {
            delete this.input[key];
        }
    }

    /**
     * Moves the character based on input.
     * Handles diagonal movement normalization.
     * @param dx Horizontal movement
     * @param dy Vertical movement
     */
    private move(dx: number, dy: number): void {
        // If moving diagonally, normalize the speed
        if (dx !== 0 && dy !== 0) {
            // Normalize diagonal movement by multiplying by approximately 0.707 (1/√2)
            const diagonalFactor = 0.7071;
            this.position.x += dx * this.moveSpeed.x * diagonalFactor;
            this.position.y += dy * this.moveSpeed.y * diagonalFactor;
        } else {
            // Moving in a single direction, use full speed
            this.position.x += dx * this.moveSpeed.x;
            this.position.y += dy * this.moveSpeed.y;
        }
    }

    /**
     * Applies the hurt animation to the character.
     * Sets the action to HURT and updates the animation accordingly.
     */
    private hurt(): void {
        this.action = this.actions.HURT;
        this.animation = (!this.facingRight) ? this.animations.hurt : this.animations.hurtR;
        this.animation.reset(); // Reset animation to start
    }


    /**     * Reduces the character's health by a specified amount.
         * Ensures health does not drop below zero.
         * Checks for death and handles player removal.
         * @param amount Amount of damage to apply
         * @returns The character's current health after taking damage
         */
    private takeDamage(amount: number): void {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.handleDeath();
        }
    }

    /**
     * Handles the character's death.
     * Notifies the client of death but keeps the connection alive for respawn.
     */
    private handleDeath(): void {
        console.log(`Player ${this.name} (${this.id}) has died!`);

        // Notify the specific player that they died
        this.game.io.to(this.id).emit("player-death", {
            message: "You died! Respawn to continue playing.",
            killedBy: null // Could be extended to track who killed whom
        });

        // Reset player to a "dead" state instead of removing them
        this.resetToDeadState();
    }

    /**
     * Resets the character to a dead state.
     * The player remains connected but inactive until respawn.
     */
    private resetToDeadState(): void {
        this.health = 0;
        this.action = this.actions.NONE;
        this.input = {}; // Clear all input
        // Move player off-screen or to a safe area
        this.position = { x: -100, y: -100 }; // Off-screen position
        console.log(`Player ${this.name} is now in dead state`);
    }

    /**
     * Respawns the character with full health at spawn position.
     */
    public respawn(): void {
        this.health = 100;
        this.position = { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 }; // Random spawn position
        this.action = this.actions.NONE;
        this.input = {};
        this.facingRight = true;
        this.animation = this.animations.stand;
        console.log(`Player ${this.name} has respawned at position ${this.position.x}, ${this.position.y}`);
    }


    /**     * Performs an attack on other players.
         * Checks for collisions with the attack hit box and applies damage if a collision occurs.
         * @param attackType Type of attack to perform (e.g., 'punch')
         * @param players List of other players to check for collisions
         */
    private doAttack(attackType: string, players: Character[]): void {
        const attack = this.attacks[attackType]; // Get the attack configuration
        if (!attack) return; // Exit if attack type is not defined
        // Check for collisions with other players
        players.forEach((player) => {
            // Skip self collision
            if (player.id !== this.id) {
                const isColliding = this.game.checkCollisions(
                    attack.hitBox,
                    this.position,
                    player.hurtBox,
                    player.position
                );
                if (isColliding) {
                    player.hurt(); // Apply hurt animation
                    player.takeDamage(10); // Deal damage to the player
                    this.animation.Pause(5); // Pause the attacking player's animation
                    player.animation.Pause(5); // Pause the attacked player's animation
                }
            }
        });
    }

    /**
     * Enforces boundaries to keep the character within the game area.
     * Prevents the character from moving outside the defined limits.
     */
    private enforceBoundaries(): void {
        const maxX = 970;
        const maxY = 600;
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.y < 0) this.position.y = 0;
        if (this.position.x > maxX) this.position.x = maxX;
        if (this.position.y > maxY) this.position.y = maxY;
    }

    /**
     * Generates a color based on the player's ID for consistency.
     * Uses HSL format to create a unique color for each player.
     * @returns A string representing the color in HSL format
     */
    private generateColor(): string {
        // Generate a color based on the player's ID for consistency
        const hash = Array.from(this.id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360; // Ensure hue is within 0-360
        return `hsl(${hue}, 70%, 50%)`; // Generate a color in HSL format
    }

    /**
     * Returns the player's information including position, health, and facing direction.
     * @returns Player information object
     */
    public getPlayerInfo(): PlayerData {
        return {
            id: this.id,
            name: this.name,
            health: this.health,
            position: this.position,
            facingRight: this.facingRight,
            color: this.color,
            animation: {
                name: this.animation.name,
                index: this.animation.getCurrentFrame()
            }
        };
    }
}

export default Character;


