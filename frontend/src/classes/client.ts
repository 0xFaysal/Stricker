import { io, Socket } from "socket.io-client";
import Game from "./Game";


// Create socket outside the class as a singleton to prevent multiple connections
let socketInstance: Socket | null = null;

function getSocketInstance(): Socket {
    if (!socketInstance) {
        socketInstance = io("http://localhost:3001");
    }
    return socketInstance;
}



class Client {

    username: string;
    context: CanvasRenderingContext2D;
    height: number;
    width: number;
    io: Socket;
    keyMap: Record<string, string> = {};
    onPlayerDeath?: (message: string) => void; // Callback for when player dies






    constructor(
        context: CanvasRenderingContext2D,
        username: string = "Player" + Math.floor(Math.random() * 1000),
        onPlayerDeath?: (message: string) => void
    ) {
        this.username = username;
        this.username = username;
        this.context = context;
        this.height = 600; // Default height
        this.width = 800; // Default width
        this.onPlayerDeath = onPlayerDeath;
        this.setupCanvas(context);

        //KeyMap initialization
        this.keyMap = {
            "w": "UP",
            "a": "LEFT",
            "s": "DOWN",
            "d": "RIGHT",
            "ArrowUp": "UP",
            "ArrowDown": "DOWN",
            "ArrowLeft": "LEFT",
            "ArrowRight": "RIGHT",
            "Enter": "ENTER",
            " ": "ATTACK",
            "Escape": "ESCAPE"
        };



        //setup socket.io
        this.io = getSocketInstance();


        this.io.on("connect", () => {
            console.log("Connected to server");
            this.io.emit("join-game", { username: this.username });
        });

        const game = new Game(context);


        this.io.on("game-status", (data) => {
            game.draw(data);
        });

        // Handle player death event
        this.io.on("player-death", (data) => {
            console.log("Player died:", data.message);
            if (this.onPlayerDeath) {
                this.onPlayerDeath(data.message);
            } else {
                // Fallback to the old DOM method if no callback is provided
                this.showDeathModal(data.message);
            }
        });




        // Use bound methods to handle events and allow proper cleanup
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        // Add event listeners
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);

        this.io.on("disconnect", (reason) => {
            console.log("Disconnected from server for reason:", reason);
        });


    }


    private setupCanvas(context: CanvasRenderingContext2D) {
        // Apply anti-aliasing for text
        this.context.imageSmoothingEnabled = true;
        this.context.imageSmoothingQuality = "high";

        // Get the device pixel ratio
        const dpr = window.devicePixelRatio || 1;

        // Set actual size in memory (scaled for device pixel ratio)
        const canvas = context.canvas;
        canvas.width = this.width * dpr;
        canvas.height = this.height * dpr;

        // Set the display size of the canvas (CSS)
        canvas.style.width = this.width + 'px';
        canvas.style.height = this.height + 'px';

        // Scale all drawing operations by the dpr
        context.scale(dpr, dpr);
    }

    inputs: Record<string, boolean> = {};

    setInput = (key: string, value: boolean) => {
        if (key !== undefined && this.inputs[key] !== value) {
            this.inputs[key] = value;
            this.io.emit("key-press", { key, pressed: value });
        }
    };


    // Key event handlers as class methods
    handleKeyDown(event: KeyboardEvent): void {
        const key = this.keyMap[event.key];
        this.setInput(key, true);
    }

    handleKeyUp(event: KeyboardEvent): void {
        const key = this.keyMap[event.key];
        this.setInput(key, false);
    }

    // Clean up method to remove event listeners when no longer needed
    cleanup(): void {
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
        // Only disconnect if we're the ones who created the connection
        if (this.io) {
            this.io.disconnect();
        }
    }

    // Show death modal and redirect to login page
    showDeathModal(message: string): void {
        // Create modal backdrop
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

        // Create modal content
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

        // Create death message
        const deathMessage = document.createElement('h2');
        deathMessage.textContent = '💀 You Died! 💀';
        deathMessage.style.cssText = `
            color: #d32f2f;
            margin-bottom: 15px;
            font-size: 24px;
        `;

        // Create description
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

        // Create quit button
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

        // Add click handlers
        playAgainButton.onclick = () => {
            this.redirectToLogin();
        };

        quitButton.onclick = () => {
            this.redirectToLogin();
        };

        // Assemble modal
        modalContent.appendChild(deathMessage);
        modalContent.appendChild(description);
        modalContent.appendChild(playAgainButton);
        modalContent.appendChild(quitButton);
        modalBackdrop.appendChild(modalContent);

        // Add to document
        document.body.appendChild(modalBackdrop);

        // Auto-redirect after 10 seconds
        setTimeout(() => {
            this.redirectToLogin();
        }, 10000);
    }

    // Redirect to login page (now handled by React component, but kept for fallback)
    redirectToLogin(): void {
        // Clean up client resources
        this.cleanup();

        // Instead of redirecting, we'll trigger a page reload to reset the application state
        // This will bring the user back to the login screen
        window.location.reload();
    }







}

export default Client;