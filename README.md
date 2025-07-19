# Stricker - Multiplayer Sticker Game

A real-time multiplayer sticker game built with TypeScript, React, and Socket.IO featuring combat mechanics, animations, and death/respawn system.

## 🎮 Features

- **Real-time Multiplayer**: Multiple players can join and play simultaneously
- **Combat System**: Players can attack each other with punch animations
- **Character Animations**: Smooth sprite-based animations for standing, running, hurt, and attack states
- **Death/Respawn Mechanics**: Players are removed when health reaches 0 with a death modal
- **Responsive Movement**: Normalized diagonal movement and directional priority
- **Visual Feedback**: Health bars, player names, and unique player colors
- **TypeScript**: Full type safety across client and server
- **Modern UI**: React-based frontend with Tailwind CSS styling

## 🏗️ Architecture

### Frontend (`/frontend`)

- **React + TypeScript**: Modern React application with TypeScript
- **Vite**: Fast development server and build tool
- **Socket.IO Client**: Real-time communication with server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Canvas Rendering**: HTML5 Canvas for game graphics

### Backend (`/server`)

- **Node.js + TypeScript**: Server-side TypeScript application
- **Express.js**: Web server framework
- **Socket.IO**: Real-time bidirectional communication
- **Game Loop**: 60 FPS game update loop for smooth gameplay
- **AABB Collision Detection**: Axis-aligned bounding box collision system

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

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

   Frontend will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## 🎯 How to Play

1. **Enter a username** on the login screen
2. **Move your character** using:
   - WASD keys or Arrow keys for movement
   - Spacebar for attack
3. **Combat**: Attack other players to reduce their health
4. **Survival**: Avoid taking damage - when your health reaches 0, you'll be eliminated
5. **Respawn**: Click "Play Again" on the death modal to rejoin the game

## 🔧 Technical Details

### Game Mechanics

- **Movement**: Characters move at different speeds horizontally (6px) and vertically (4px)
- **Diagonal Movement**: Normalized using 1/√2 factor to prevent speed advantage
- **Collision Detection**: AABB (Axis-Aligned Bounding Box) system for hit detection
- **Health System**: Players start with 100 health, attacks deal 10 damage
- **Animation System**: Sprite-based animations with configurable frame rates

### Network Protocol

- **Connection**: Automatic Socket.IO connection on game start
- **Events**:
  - `join-game`: Player joins with username
  - `key-press`: Real-time input synchronization
  - `game-status`: Server broadcasts game state (60 FPS)
  - `player-death`: Notification when player dies

### Client-Server Synchronization

- **Authoritative Server**: All game logic runs on server
- **Client Prediction**: Immediate input response with server reconciliation
- **State Broadcasting**: Full game state sent to all clients 60 times per second

## 📁 Project Structure

```
Stricker/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── classes/         # Game classes (Client, Game, Sprite)
│   │   ├── components/      # React components
│   │   ├── types/           # TypeScript type definitions
│   │   └── ...
│   ├── public/              # Static assets (sprites, images)
│   └── package.json
├── server/                  # Node.js backend
│   ├── src/
│   │   ├── classes/         # Game classes (Game, Character, Animation)
│   │   ├── types/           # TypeScript type definitions
│   │   └── index.ts         # Server entry point
│   └── package.json
└── README.md
```

## 🛠️ Development

### Available Scripts

**Frontend:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Server:**

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

### Environment Variables

Create a `.env` file in the `/server` directory:

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
MAX_PLAYERS=10
GAME_MODE=collaborative
```

## 🎨 Assets

The game includes custom sprite sheets:

- `stickman.png` - Basic character animations (stand, run)
- `stickmanR.png` - Right-facing character animations
- `stickmanAttacks.png` - Attack animations
- `stickmanAttacksR.png` - Right-facing attack animations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues

- Players may experience slight lag during high network latency
- Collision detection is basic AABB - diagonal attacks may feel imprecise
- No persistent player data between sessions

## 🚧 Future Enhancements

- [ ] Player authentication system
- [ ] Game rooms/lobbies
- [ ] Power-ups and items
- [ ] More character types and abilities
- [ ] Leaderboard system
- [ ] Mobile touch controls
- [ ] Sound effects and music
- [ ] Improved graphics and animations

## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/0xFaysal/Stricker/issues) on GitHub.

---

Made with ❤️ by [0xFaysal](https://github.com/0xFaysal)
