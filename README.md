# Stricker - Multiplayer Sticker Game

A real-time multiplayer sticker game built with TypeScript, React, and Socket.IO featuring combat mechanics, sprite-based animations, and comprehensive death/respawn system.

## 🎮 Features

- **Real-time Multiplayer**: Multiple players can join and play simultaneously with Socket.IO
- **Combat System**: Players can attack each other with animated punch mechanics
- **Advanced Sprite System**: Comprehensive sprite-based animations for standing, running, attacks, and directional movement
- **Death/Respawn Mechanics**: Players are eliminated when health reaches 0 with animated death modal and respawn system
- **Optimized Movement**: Normalized diagonal movement with input throttling for smooth gameplay
- **Visual Feedback**: Dynamic health bars, player names, shadows, and unique player colors
- **Full TypeScript**: Complete type safety across client and server with shared type definitions
- **Modern React UI**: Component-based frontend with Tailwind CSS 4.x and responsive design
- **Performance Optimized**: Sprite caching, input throttling, and efficient rendering pipeline

## 📸 Screenshots

### Game Interface

![Main Game Arena](https://github.com/0xFaysal/Stricker/assets/screenshots/game-arena.png)

*Real-time multiplayer gameplay with two players (Fahim and Faysal) in the arena showing character sprites, health bars, and modern UI*

### Multiplayer Sessions

![Multiplayer Gameplay](https://github.com/0xFaysal/Stricker/assets/screenshots/multiplayer-sessions.png)

*Multiple browser windows demonstrating real-time synchronization between different players*

### Login Interface

![Login Screen](https://github.com/0xFaysal/Stricker/assets/screenshots/login-interface.png)

*Stylized authentication interface featuring game controls, features overview, and modern gradient design*

## 🏗️ Architecture

### Frontend (`/frontend`)

- **React 19 + TypeScript**: Modern React application with latest hooks and TypeScript 5.8
- **Vite 7.x**: Lightning-fast development server and optimized build tool
- **Socket.IO Client**: Real-time bidirectional communication with server
- **Tailwind CSS 4.x**: Utility-first CSS framework with modern features
- **Canvas Rendering**: High-performance HTML5 Canvas for game graphics
- **Optimized Classes**:
  - `Client`: Main game controller with input management and socket handling
  - `Game`: Rendering engine with sprite caching and performance optimization
  - `Sprite`: Efficient sprite rendering system
  - `SpriteLoader`: Asset management and loading system

### Backend (`/server`)

- **Node.js + TypeScript**: Server-side TypeScript application with modern ES modules
- **Express.js**: Lightweight web server framework
- **Socket.IO**: Real-time bidirectional event-based communication
- **Game Loop**: 60 FPS authoritative game update loop for smooth gameplay
- **AABB Collision Detection**: Axis-aligned bounding box collision system
- **Optimized Classes**:
  - `Game`: Server-side game state management and physics
  - `Character`: Player entity with health, movement, and combat mechanics
  - `Animation`: Advanced animation state management## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/0xFaysal/Stricker.git
   cd Stricker
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the server** (in `/server` directory)

   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:3001`

2. **Start the frontend** (in `/frontend` directory)

   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173` (Vite development server)

3. **Open your browser** and navigate to `http://localhost:5173`

## 🎯 How to Play

1. **Enter a username** on the stylized login screen
2. **Move your character** using:
   - WASD keys or Arrow keys for movement (optimized with input throttling)
   - Spacebar for attack with directional animations
3. **Combat**: Attack other players to reduce their health (10 damage per hit)
4. **Survival**: Avoid taking damage - when your health reaches 0, you'll see the death modal
5. **Respawn**: Click "Play Again" on the animated death modal to rejoin the game with full health

## 🔧 Technical Details

### Game Mechanics

- **Movement**: Characters move with normalized speed calculations for balanced gameplay
- **Diagonal Movement**: Optimized using mathematical normalization to prevent speed advantages
- **Collision Detection**: Advanced AABB (Axis-Aligned Bounding Box) system for precise hit detection
- **Health System**: Players start with 100 health, attacks deal 10 damage with visual feedback
- **Animation System**: Comprehensive sprite-based animations with multiple directional states
- **Input Handling**: Throttled input processing (16ms intervals) for smooth performance

### Performance Optimizations

- **Sprite Caching**: Frequently used sprites are cached to reduce Map lookup overhead
- **Input Throttling**: Client input is throttled to prevent server spam and ensure smooth gameplay
- **Efficient Rendering**: Optimized draw calls with proper layering (shadows, characters, UI)
- **Memory Management**: Proper cleanup of event listeners and socket connections

### Network Protocol

- **Connection**: Automatic Socket.IO connection with singleton pattern to prevent memory leaks
- **Events**:
  - `join-game`: Player joins with username validation
  - `key-press`: Real-time input synchronization with throttling
  - `game-state`: Server broadcasts optimized game state
  - `game-status`: Full game status with player count and timestamp
  - `player-death`: Notification when player dies with kill attribution
  - `respawn`: Player respawn request handling

### Client-Server Synchronization

- **Authoritative Server**: All game logic and physics calculations run on server
- **Client Prediction**: Immediate visual feedback with server authority reconciliation
- **State Broadcasting**: Optimized game state sent to all clients at 60 FPS
- **Type Safety**: Shared TypeScript interfaces ensure data consistency

## 📁 Project Structure

```plaintext
Stricker/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── classes/         # Game engine classes
│   │   │   ├── client.ts    # Main game client controller
│   │   │   ├── Game.ts      # Rendering engine with optimizations
│   │   │   ├── sprite.ts    # Sprite rendering system
│   │   │   └── spliteLoader.ts # Asset loading and management
│   │   ├── components/      # React components
│   │   │   ├── Canvas.tsx   # Main game interface component
│   │   │   ├── login.tsx    # Authentication interface
│   │   │   └── DeathModal.tsx # Death notification with countdown
│   │   ├── types/           # TypeScript type definitions
│   │   │   └── index.ts     # Shared interfaces and types
│   │   ├── App.tsx          # Main application controller
│   │   ├── main.tsx         # React application entry point
│   │   └── index.css        # Global styles and Tailwind imports
│   ├── public/              # Static assets
│   │   ├── stickman.png     # Character sprite sheets
│   │   ├── stickmanR.png    # Right-facing character animations
│   │   ├── stickmanAttacks.png # Attack animations
│   │   ├── stickmanAttacksR.png # Right-facing attack animations
│   │   └── stickmanShadow.png # Character shadow sprites
│   ├── package.json         # Frontend dependencies and scripts
│   └── vite.config.ts       # Vite build configuration
├── server/                  # Node.js TypeScript backend
│   ├── src/
│   │   ├── classes/         # Server game logic
│   │   │   ├── Game.ts      # Server-side game state management
│   │   │   ├── Character.ts # Player entity with physics
│   │   │   └── Animation.ts # Animation state management
│   │   ├── types/           # Server type definitions
│   │   │   └── index.ts     # Socket events and player interfaces
│   │   └── index.ts         # Server entry point with Express
│   ├── package.json         # Server dependencies and scripts
│   └── tsconfig.json        # TypeScript configuration
├── README.md                # Project documentation
└── .gitignore              # Git ignore patterns
```

## 🛠️ Development

### Available Scripts

**Frontend:**

- `npm run dev` - Start Vite development server with HMR
- `npm run build` - TypeScript compilation and production build
- `npm run preview` - Preview production build locally
- `npm run lint` - ESLint code quality checking

**Server:**

- `npm run dev` - Start development server with nodemon and ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run dev:watch` - Development server with file watching

### Environment Variables

Create a `.env` file in the `/server` directory:

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Development Dependencies

**Frontend:**

- React 19.x with TypeScript support
- Vite 7.x for development and building
- Tailwind CSS 4.x for styling
- ESLint for code quality
- Socket.IO Client for real-time communication

**Server:**

- Express.js for HTTP server
- Socket.IO for WebSocket communication
- TypeScript with ts-node for development
- Nodemon for auto-reloading
- CORS for cross-origin requests

## 🎨 Assets

The game includes comprehensive sprite sheets for smooth character animations:

- `stickman.png` - Left-facing character animations (standing, running)
- `stickmanR.png` - Right-facing character animations
- `stickmanAttacks.png` - Left-facing attack animations with extended frames
- `stickmanAttacksR.png` - Right-facing attack animations
- `stickmanShadow.png` - Character shadow for depth perception
- Optimized sprite loading system with caching for performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues

- Network latency may cause slight visual delays in high-ping environments
- Collision detection uses basic AABB - complex diagonal attacks may need refinement
- No persistent player data or session management between browser refreshes
- Mobile touch controls not yet implemented (keyboard/mouse only)

## 🚧 Future Enhancements

- [ ] Player authentication and persistent sessions
- [ ] Game rooms/lobbies with private matches
- [ ] Power-ups and collectible items
- [ ] Multiple character types with unique abilities
- [ ] Global leaderboard and statistics system
- [ ] Mobile touch controls and responsive design
- [ ] Sound effects and background music
- [ ] Enhanced graphics with particle effects and animations
- [ ] Spectator mode for eliminated players
- [ ] Team-based game modes
- [ ] Chat system for player communication
- [ ] Replay system for match recording

## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/0xFaysal/Stricker/issues) on GitHub.

---

Made with ❤️ by [0xFaysal](https://github.com/0xFaysal)
