import {useRef, useEffect, useState, useCallback} from "react";
import Client from "../classes/client";
import DeathModal from "./DeathModal";

/**
 * Canvas Component Props Interface
 * Defines the expected properties for the Canvas component
 */
interface CanvasProps {
    /** Player's chosen username for game identification */
    username?: string;
    /** Callback function triggered when player needs to return to login */
    onPlayerDeath?: () => void;
}

/**
 * Canvas Component - Main Game Interface
 *
 * React component that manages the game canvas, client connection, and game state.
 * Serves as the bridge between React UI and the game client/server architecture.
 *
 * Key Features:
 * - Canvas setup and client initialization
 * - Death modal management and respawn handling
 * - Modern gaming UI with gradient backgrounds and glass effects
 * - Responsive design for different screen sizes
 * - Clean client lifecycle management
 *
 * @param {CanvasProps} props - Component properties
 * @returns {JSX.Element} Rendered game canvas with UI overlays
 */
export default function Canvas({
    username = "Player" + Math.floor(Math.random() * 1000),
    onPlayerDeath,
}: CanvasProps) {
    /** Reference to canvas DOM element for client initialization */
    const canvasRef = useRef<HTMLCanvasElement>(null);

    /** Game client instance managing server connection and input */
    const [client, setClient] = useState<Client | null>(null);

    /** Controls visibility of death modal overlay */
    const [showDeathModal, setShowDeathModal] = useState(false);

    /** Stores death message to display in modal */
    const [deathMessage, setDeathMessage] = useState("");

    /**
     * Handles player logout and cleanup
     *
     * Properly disconnects from server, cleans up client resources,
     * and redirects to login screen through parent component callback.
     *
     * @returns {void}
     */
    const handleRedirectToLogin = useCallback(() => {
        if (client) {
            // Notify server that player is leaving the game
            client.leaveGame();

            // Clean up client resources to prevent memory leaks
            client.cleanup();
        }

        // Hide death modal
        setShowDeathModal(false);

        if (onPlayerDeath) {
            // Use parent component's logout handler
            onPlayerDeath();
        } else {
            // Fallback: reload page to reset application state
            window.location.reload();
        }
    }, [client, onPlayerDeath]);

    /**
     * Handles player death notification from server
     *
     * Receives death message and displays modal interface for respawn/quit decision.
     *
     * @param {string} message - Death message from server
     * @returns {void}
     */
    const handlePlayerDeath = useCallback((message: string) => {
        setDeathMessage(message);
        setShowDeathModal(true);
    }, []);

    /**
     * Handles player respawn request
     *
     * Requests respawn from server and hides death modal to resume gameplay.
     * Uses existing client connection rather than creating new instance.
     *
     * @returns {void}
     */
    const handlePlayAgain = useCallback(() => {
        if (client) {
            console.log("Player requesting respawn");
            // Request respawn from server through existing client
            client.respawn();
        }

        // Hide death modal to return to game
        setShowDeathModal(false);
    }, [client]);

    /**
     * Client initialization effect
     *
     * Creates game client when canvas is available and manages cleanup.
     * Handles client lifecycle tied to component mounting/unmounting.
     */
    useEffect(() => {
        // Create client instance only once when canvas ref is available
        if (canvasRef.current && !client) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
                const clientInstance = new Client(
                    context,
                    username,
                    handlePlayerDeath
                );
                setClient(clientInstance);
            }
        }
    }, [username, handlePlayerDeath, client]);

    /**
     * Client cleanup effect
     *
     * Ensures proper cleanup of client resources when component unmounts
     * to prevent memory leaks and orphaned connections.
     */
    useEffect(() => {
        return () => {
            if (client) {
                client.cleanup();
            }
        };
    }, [client]);

    return (
        <div className='relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2'>
            {/* Game Header - Status and Information Display */}
            <div className='absolute top-4 left-4 right-4 flex justify-between items-center z-10'>
                {/* Player Information Panel */}
                <div className='bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 text-white'>
                    <h2 className='text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400'>
                        Stricker
                    </h2>
                    <p className='text-sm text-gray-300'>Player: {username}</p>
                </div>

                {/* Connection Status Panel */}
                <div className='bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 text-white'>
                    <div className='text-sm text-gray-300'>Status</div>
                    <div className='text-green-400 font-semibold'>
                        🟢 Online
                    </div>
                </div>
            </div>

            {/* Game Canvas Container - Main Gameplay Area */}
            <div className='relative bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 shadow-2xl'>
                {/* Primary Game Canvas */}
                <canvas
                    ref={canvasRef}
                    className='block border-2 border-white/30 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900'
                    style={{
                        filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))",
                    }}
                />

                {/* Canvas Visual Enhancement Overlays */}
                <div className='absolute inset-0 pointer-events-none'>
                    {/* Subtle gradient overlay for depth */}
                    <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/10' />

                    {/* Top accent line */}
                    <div className='absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20' />

                    {/* Bottom accent line */}
                    <div className='absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20' />
                </div>
            </div>

            {/* Death Modal Overlay - Shown when player dies */}
            {/* Death Modal Overlay - Shown when player dies */}
            {showDeathModal && (
                <DeathModal
                    message={deathMessage}
                    onPlayAgain={handlePlayAgain}
                    onQuit={handleRedirectToLogin}
                />
            )}
        </div>
    );
}
