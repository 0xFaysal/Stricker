import { Server } from "socket.io";
import Character from "./Character";


class Game {
    public io: Server; // Socket.IO server instance - made public for Character access

    // Store players by their socket ID for easy access and broadcasting
    // This allows us to easily manage player states and interactions
    public players: Record<string, Character> = {}; // Store players by their socket ID 

    /** This class manages the game state, including player connections, updates, and broadcasting game state to clients.
   * It handles player movements, collisions, and interactions within the game world.
   * It also manages the game loop and ensures that all players are synchronized with the current game state.
   * @param io - The Socket.IO server instance to communicate with clients.
    */
    constructor(io: Server) {
        this.io = io;

        // socket connection handler 
        this.io.on("connection", (socket) => {

            console.log("New Client connected with id:", socket.id);
            // Don't create player here - wait for join-game event

            //On join-game event, set the player's name
            socket.on("join-game", (playerData) => {
                console.log("Player joining:", playerData.username);

                // If player doesn't exist, create a new character
                if (!this.players[socket.id]) {
                    this.players[socket.id] = new Character(this, socket.id);
                }

                // Set or update the player's name
                this.players[socket.id].setName(playerData.username);

                // If player was in dead state, respawn them
                if (this.players[socket.id] && this.players[socket.id].getPlayerInfo().health <= 0) {
                    this.players[socket.id].respawn();
                }

                console.log(`Player ${playerData.username} joined successfully`);
            });            // Handle respawn requests
            socket.on("respawn", () => {
                const player = this.players[socket.id];
                if (player) {
                    player.respawn();
                    console.log(`Player ${player.getPlayerInfo().name} requested respawn`);
                }
            });

            // Handle key presses from the client
            socket.on("key-press", ({ key, pressed }) => {
                const player = this.players[socket.id]; // Get the player by socket ID
                // If the player exists and is alive, update the key state
                if (player && player.getPlayerInfo().health > 0) {
                    // Update the key state in the player's keys object
                    player.setKeys(key, pressed);
                }
            });

            // Handle player leaving to go back to login
            socket.on("leave-game", () => {
                const player = this.players[socket.id];
                if (player) {
                    const playerInfo = player.getPlayerInfo();
                    console.log(`Player ${playerInfo.name} is leaving the game`);
                    delete this.players[socket.id]; // Remove the player from the game
                }
            });

            //On disconnect remove player
            socket.on("disconnect", () => {
                delete this.players[socket.id]; // Remove the player from the game
                console.log("Client disconnected:", socket.id);
            });
        });
    }

    /**
     * Updates the game state.
     * This method is called in a loop to update all players and check for collisions.
     */
    public update() {
        // Update all players (only if they're alive)
        Object.values(this.players).forEach((player) => {
            // Only update living players
            if (player.getPlayerInfo().health > 0) {
                // Call the character's update method to handle movement based on keys
                player.update();
            }
        });
    }

    /**
     * Checks for collisions between two bounding boxes.
     * @param box1 - The first bounding box with size and offset.
     * @param box1Position - The position of the first bounding box.
     * @param box2 - The second bounding box with size and offset.
     * @param box2Position - The position of the second bounding box.
     * @returns true if the boxes collide, false otherwise.
     */
    public checkCollisions(
        box1: { size: { x: number; y: number }; offset: { x: number; y: number } },
        box1Position: { x: number; y: number },
        box2: { size: { x: number; y: number }; offset: { x: number; y: number } },
        box2Position: { x: number; y: number }
    ) {
        // Simple AABB collision detection 
        // Check if the bounding boxes overlap
        // This is a basic collision detection method that checks if two rectangles overlap

        return (
            box1Position.x + box1.offset.x < box2Position.x + box2.offset.x + box2.size.x
            &&
            box1Position.x + box1.offset.x + box1.size.x > box2Position.x + box2.offset.x &&
            box1Position.y + box1.offset.y < box2Position.y + box2.offset.y + box2.size.y &&
            box1Position.y + box1.offset.y + box1.size.y > box2Position.y + box2.offset.y
        );
    }

    /**
     * Removes a player from the game.
     * @param playerId - The socket ID of the player to remove
     */
    public removePlayer(playerId: string): void {
        if (this.players[playerId]) {
            const playerInfo = this.players[playerId].getPlayerInfo();
            console.log(`Removing dead player: ${playerInfo.name} (${playerId})`);
            delete this.players[playerId];

            // Disconnect the socket
            const socket = this.io.sockets.sockets.get(playerId);
            if (socket) {
                socket.disconnect(true);
            }

            console.log(`Player ${playerId} removed from game`);
        }
    }

    /**
     * Broadcasts the current game state to all connected clients.
     * This includes player positions, health, and other relevant data.
     */
    public broadcastGameState() {
        // Prepare player data with all required information
        const playerData = Object.values(this.players).map((player) => {
            return player.getPlayerInfo(); // Assuming getPlayerInfo returns an object with id, name, health, position, etc.
        });
        // Broadcast the complete player data to all clients
        Object.values(this.players).forEach((player) => {
            player.game.io.emit("game-status", {
                players: playerData,
                totalPlayers: playerData.length,
                timestamp: Date.now(),
            });
        });
    }
}

export default Game;
