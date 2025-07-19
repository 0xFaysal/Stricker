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