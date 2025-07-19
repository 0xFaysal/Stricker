//import third-party libraries
import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

// Import the Custom classes
import Game from './classes/Game';
import { ClientToServerEvents, ServerToClientEvents } from './types';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = createServer(app);// Create HTTP server for Socket.IO

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create Socket.IO server with proper typing
const io = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents
>(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Allow requests from the frontend
        methods: ["GET", "POST"] // Allow GET and POST methods
    }
});

// Create a new Game instance
const game = new Game(io);

// Basic route
app.get('/api/health', (req: Request, res: Response) => {
    res.json({
        status: 'OK',
        message: 'Sticker Game Server is running!',
        timestamp: new Date().toISOString()
    });
});


// game loop using setInterval framerate 1/60 seconds 
setInterval(() => {
    game.update(); // Update the game state
    game.broadcastGameState(); // Broadcast the updated game state to all clients
}, 1000 / 60);


// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Sticker Game Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🎮 Game info: http://localhost:${PORT}/api/game/info`);
});

export default app;
