import { io, Socket } from "socket.io-client";
import Game from "./Game";

/**
 * Socket instance management - Singleton pattern
 * Prevents multiple socket connections which can cause memory leaks
 * and connection conflicts in the application
 */
let socketInstance: Socket | null = null;

/**
 * Gets or creates a singleton Socket.IO instance
 * Ensures only one active connection to the server at any time
 * 
 * @returns {Socket} Active socket connection to the game server
 */
function getSocketInstance(): Socket {
    if (!socketInstance || socketInstance.disconnected) {
        if (socketInstance) {
            socketInstance.disconnect();
        }
        socketInstance = io("http://localhost:3001");
    }
    return socketInstance;
}

/**
 * Safely disconnects and resets the socket instance
 * Used for cleanup when switching between game states
 * 
 * @returns {void}
 */
function resetSocketInstance(): void {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
}

/**
 * Client class - Main game client controller
 * 
 * Manages the connection between the frontend React components and the game server.
 * Handles user input, canvas rendering, socket communication, and game state management.
 * 
 * Responsibilities:
 * - Establishing and maintaining WebSocket connection to game server
 * - Processing user keyboard input and sending to server
 * - Managing canvas setup and rendering pipeline
 * - Handling player death, respawn, and disconnection events
 * - Coordinating between React UI components and game logic
 */
class Client {
    /** Player's chosen username for identification in the game */
    username: string;

    /** Canvas 2D rendering context for drawing game graphics */
    context: CanvasRenderingContext2D;

    /** Canvas height in pixels - affects game area size */
    height: number;

    /** Canvas width in pixels - affects game area size */
    width: number;

    /** Socket.IO connection for real-time communication with game server */
    io: Socket;

    /** 
     * Mapping of keyboard keys to game actions
     * Allows both WASD and arrow key controls for movement
     */
    keyMap: Record<string, string> = {};

    /** 
     * Optional callback function triggered when player dies
     * Used by React components to show death modal and handle UI state
     */
    onPlayerDeath?: (message: string) => void;

    /** 
     * Tracks current input states to prevent duplicate key events
     * Key: action name (UP, DOWN, LEFT, RIGHT, ATTACK)
     * Value: boolean indicating if key is currently pressed
     */
    inputs: Record<string, boolean> = {};

    /** 
     * Timestamp tracking for input throttling
     * Prevents network spam from rapid key press events
     */
    private lastInputTime: Record<string, number> = {};

    /** 
     * Input throttling interval in milliseconds
     * 16ms = ~60 FPS, prevents excessive network traffic
     */
    private INPUT_THROTTLE_MS = 16;

    /**
     * Initializes a new Client instance
     * 
     * Sets up the game client with canvas rendering, socket connection,
     * input handling, and communication with the game server.
     * 
     * @param {CanvasRenderingContext2D} context - Canvas 2D rendering context for drawing
     * @param {string} username - Player's chosen username (auto-generated if not provided)
     * @param {function} onPlayerDeath - Optional callback for death events (used by React components)
     */
    constructor(
        context: CanvasRenderingContext2D,
        username: string = "Player" + Math.floor(Math.random() * 1000),
        onPlayerDeath?: (message: string) => void
    ) {
        // Initialize player identification and rendering context
        this.username = username;
        this.context = context;

        // Set default canvas dimensions for game area
        this.height = 600; // Default height in pixels
        this.width = 1000; // Default width in pixels

        // Store death callback for React component integration
        this.onPlayerDeath = onPlayerDeath;

        // Configure canvas for optimal rendering
        this.setupCanvas(context);

        /**
         * Keyboard input mapping configuration
         * Maps physical keys to game actions for flexible controls
         * Supports both WASD and arrow key movement schemes
         */
        this.keyMap = {
            "w": "UP",           // Move up
            "a": "LEFT",         // Move left  
            "s": "DOWN",         // Move down
            "d": "RIGHT",        // Move right
            "ArrowUp": "UP",     // Alternative up
            "ArrowDown": "DOWN", // Alternative down
            "ArrowLeft": "LEFT", // Alternative left
            "ArrowRight": "RIGHT", // Alternative right
            "Enter": "ENTER",    // Confirm/select action
            " ": "ATTACK",       // Attack action (spacebar)
            "Escape": "ESCAPE"   // Cancel/menu action
        };

        // Establish connection to game server
        this.io = getSocketInstance();

        /**
         * Socket event handlers setup
         * Handles real-time communication with game server
         */

        // Connection established - join the game
        this.io.on("connect", () => {
            console.log("Connected to server");
            this.io.emit("join-game", { username: this.username });
        });

        // Initialize game rendering system
        const game = new Game(context);

        // Receive and render game state updates from server
        this.io.on("game-status", (data) => {
            game.draw(data);
        });

        // Handle player death notifications from server
        this.io.on("player-death", (data) => {
            console.log("Player died:", data.message);
            if (this.onPlayerDeath) {
                // Use React component callback if available
                this.onPlayerDeath(data.message);
            } else {
                // Fallback to DOM-based modal for non-React usage
                this.showDeathModal(data.message);
            }
        });

        // Bind input event handlers to maintain correct 'this' context
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        // Register global keyboard event listeners
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);

        // Handle unexpected disconnections
        this.io.on("disconnect", (reason) => {
            console.log("Disconnected from server for reason:", reason);
        });
    }

    /**
     * Configures canvas for high-quality rendering
     * 
     * Sets up device pixel ratio scaling, anti-aliasing, and proper canvas sizing
     * to ensure crisp graphics on all display types including retina displays.
     * 
     * @param {CanvasRenderingContext2D} context - Canvas rendering context to configure
     * @returns {void}
     */
    private setupCanvas(context: CanvasRenderingContext2D): void {
        // Enable anti-aliasing for smooth text and graphics
        this.context.imageSmoothingEnabled = true;
        this.context.imageSmoothingQuality = "high";

        // Get device pixel ratio for high-DPI displays
        const dpr = window.devicePixelRatio || 1;

        // Get canvas element from context
        const canvas = context.canvas;

        // Set actual canvas buffer size (scaled for device pixel ratio)
        canvas.width = this.width * dpr;
        canvas.height = this.height * dpr;

        // Set display size using CSS pixels
        canvas.style.width = this.width + 'px';
        canvas.style.height = this.height + 'px';

        // Scale all drawing operations to match device pixel ratio
        context.scale(dpr, dpr);
    }

    /**
     * Handles input state changes with network throttling
     * 
     * Processes keyboard input and sends updates to server while preventing
     * network spam through intelligent throttling mechanisms.
     * 
     * @param {string} key - Game action key (UP, DOWN, LEFT, RIGHT, ATTACK)
     * @param {boolean} value - Whether the key is pressed (true) or released (false)
     * @returns {void}
     */
    setInput = (key: string, value: boolean): void => {
        // Validate input and check for state changes
        if (key !== undefined && this.inputs[key] !== value) {
            const currentTime = Date.now();
            const lastTime = this.lastInputTime[key] || 0;

            // Apply throttling to reduce network traffic
            // Only send input if enough time has passed since last update
            if (currentTime - lastTime >= this.INPUT_THROTTLE_MS) {
                this.inputs[key] = value;

                // Send input state to game server
                this.io.emit("key-press", { key, pressed: value });

                // Update throttling timestamp
                this.lastInputTime[key] = currentTime;
            }
        }
    };

    /**
     * Handles keyboard key press events
     * 
     * Converts physical keyboard events to game actions and processes them
     * through the input system.
     * 
     * @param {KeyboardEvent} event - Browser keyboard event object
     * @returns {void}
     */
    handleKeyDown(event: KeyboardEvent): void {
        // Map physical key to game action
        const key = this.keyMap[event.key];

        // Process the input if it's a recognized game key
        this.setInput(key, true);
    }

    /**
     * Handles keyboard key release events
     * 
     * Processes key release events to stop continuous actions like movement.
     * 
     * @param {KeyboardEvent} event - Browser keyboard event object
     * @returns {void}
     */
    handleKeyUp(event: KeyboardEvent): void {
        // Map physical key to game action
        const key = this.keyMap[event.key];

        // Process the input release
        this.setInput(key, false);
    }

    /**
     * Cleans up client resources and connections
     * 
     * Removes event listeners, disconnects socket, and performs cleanup
     * to prevent memory leaks when switching game states.
     * 
     * @returns {void}
     */
    cleanup(): void {
        // Remove global keyboard event listeners
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);

        // Reset socket instance for clean reconnection
        resetSocketInstance();
    }

    /**
     * Requests player respawn from the server
     * 
     * Sends respawn request and rejoins the game with the same username.
     * Used when player chooses to respawn after death.
     * 
     * @returns {void}
     */
    respawn(): void {
        console.log("Requesting respawn from server");

        // Send respawn request to server
        this.io.emit("respawn");

        // Rejoin game with existing username
        this.io.emit("join-game", { username: this.username });
    }

    /**
     * Leaves the current game session
     * 
     * Notifies server that player is leaving and returns to login screen.
     * Used when player chooses to quit and go back to main menu.
     * 
     * @returns {void}
     */
    leaveGame(): void {
        console.log("Leaving game and going back to login");

        // Notify server of player departure
        this.io.emit("leave-game");
    }

    /**
     * Shows legacy DOM-based death modal (fallback method)
     * 
     * Creates and displays a death notification modal using pure DOM manipulation.
     * This is a fallback method used when React components are not available.
     * 
     * @param {string} message - Death message to display to the player
     * @returns {void}
     */
    showDeathModal(message: string): void {
        // Create modal backdrop overlay
        const modalBackdrop = document.createElement('div');
        modalBackdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            font-family: Arial, sans-serif;
        `;

        // Create modal content container
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 90%;
        `;

        // Create death notification title
        const deathMessage = document.createElement('h2');
        deathMessage.textContent = '💀 You Died! 💀';
        deathMessage.style.cssText = `
            color: #d32f2f;
            margin-bottom: 15px;
            font-size: 24px;
        `;

        // Create death description text
        const description = document.createElement('p');
        description.textContent = message;
        description.style.cssText = `
            color: #333;
            margin-bottom: 20px;
            font-size: 16px;
        `;

        // Create play again button
        const playAgainButton = document.createElement('button');
        playAgainButton.textContent = 'Play Again';
        playAgainButton.style.cssText = `
            background-color: #4caf50;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
        `;

        // Create quit game button
        const quitButton = document.createElement('button');
        quitButton.textContent = 'Quit Game';
        quitButton.style.cssText = `
            background-color: #f44336;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
        `;

        // Add button click handlers
        playAgainButton.onclick = () => {
            this.redirectToLogin();
        };

        quitButton.onclick = () => {
            this.redirectToLogin();
        };

        // Assemble modal structure
        modalContent.appendChild(deathMessage);
        modalContent.appendChild(description);
        modalContent.appendChild(playAgainButton);
        modalContent.appendChild(quitButton);
        modalBackdrop.appendChild(modalContent);

        // Add modal to document
        document.body.appendChild(modalBackdrop);

        // Auto-redirect after 10 seconds
        setTimeout(() => {
            this.redirectToLogin();
        }, 10000);
    }

    /**
     * Redirects to login screen (legacy fallback method)
     * 
     * Cleans up client resources and reloads the page to return to login.
     * This is a fallback method when React routing is not available.
     * 
     * @returns {void}
     */
    redirectToLogin(): void {
        // Clean up all client resources
        this.cleanup();

        // Reload page to reset application state and return to login
        window.location.reload();
    }
}

export default Client;