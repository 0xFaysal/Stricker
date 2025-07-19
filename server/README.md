# Sticker Game Server

A TypeScript-based real-time multiplayer server for the Sticker Game using Express.js and Socket.IO.

## Features

- **Real-time multiplayer** - Multiple players can join and interact in real-time
- **WebSocket communication** - Fast, bi-directional communication using Socket.IO
- **TypeScript** - Fully typed for better development experience
- **RESTful API** - Additional HTTP endpoints for game information
- **Environment configuration** - Configurable through environment variables

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy and configure environment variables:
```bash
cp .env.example .env
```

### Development

Start the development server with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000` by default.

### Production

Build and start the production server:
```bash
npm run build
npm start
```

## API Endpoints

### REST API

- `GET /api/health` - Server health check
- `GET /api/game/info` - Game information and statistics

### Socket Events

#### Client to Server
- `join-game` - Player joins the game
- `game-action` - Player performs a game action
- `sticker-update` - Player updates a sticker
- `request-game-state` - Request current game state

#### Server to Client
- `player-joined` - A new player joined
- `player-left` - A player disconnected
- `game-action` - Broadcast game actions
- `sticker-update` - Broadcast sticker updates
- `game-state` - Current game state

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed CORS origin (default: http://localhost:5173)
- `MAX_PLAYERS` - Maximum players allowed (default: 10)
- `GAME_MODE` - Game mode (default: collaborative)

## Project Structure

```
src/
├── index.ts          # Main server file
├── types/
│   └── index.ts      # TypeScript interfaces and types
└── ...
```

## Development Commands

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run watch` - Watch and compile TypeScript files
