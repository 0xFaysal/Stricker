// Player related interfaces
export interface PlayerData {
  id: string;
  name: string;
  health: number;
  position: {
    x: number;
    y: number;
  };
  facingRight: boolean;
  color: string;
  animation: {
    name: string;
    index: number;
  };
}

export interface ClientToServerEvents {
  "join-game": (playerData: { username: string }) => void;
  "key-press": (data: { key: string; pressed: boolean }) => void;
  "respawn": () => void;
  "leave-game": () => void;
}

export interface ServerToClientEvents {
  "game-state": (data: { players: PlayerData[] }) => void;
  "game-status": (data: { players: PlayerData[]; totalPlayers: number; timestamp: number }) => void;
  "player-joined": (playerData: PlayerData) => void;
  "player-left": (playerId: string) => void;
  "player-death": (data: { message: string; killedBy: string | null }) => void;
}

