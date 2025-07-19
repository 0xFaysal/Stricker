import {useRef, useEffect, useState, useCallback} from "react";
import Client from "../classes/client";
import DeathModal from "./DeathModal";

export default function Canvas({
    username = "Player" + Math.floor(Math.random() * 1000),
    onPlayerDeath,
}: {
    username?: string;
    onPlayerDeath?: () => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [client, setClient] = useState<Client | null>(null);
    const [showDeathModal, setShowDeathModal] = useState(false);
    const [deathMessage, setDeathMessage] = useState("");

    const handleRedirectToLogin = useCallback(() => {
        if (client) {
            // Notify server that player is leaving
            client.leaveGame();
            // Clean up client
            client.cleanup();
        }
        setShowDeathModal(false);
        if (onPlayerDeath) {
            onPlayerDeath();
        } else {
            // Fallback: reload the page
            window.location.reload();
        }
    }, [client, onPlayerDeath]);

    const handlePlayerDeath = useCallback((message: string) => {
        setDeathMessage(message);
        setShowDeathModal(true);
    }, []);

    const handlePlayAgain = useCallback(() => {
        // Instead of creating a new client, just request respawn
        if (client) {
            console.log("Player requesting respawn");
            client.respawn();
        }

        // Hide the death modal
        setShowDeathModal(false);
    }, [client]);

    useEffect(() => {
        // Create client instance only once
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

        // Cleanup function to remove event listeners when component unmounts
        return () => {
            if (client) {
                client.cleanup();
            }
        };
    }, [client, username, handlePlayerDeath]);

    return (
        <div className='relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2'>
            {/* Game Header */}
            <div className='absolute top-4 left-4 right-4 flex justify-between items-center z-10'>
                <div className='bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 text-white'>
                    <h2 className='text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400'>
                        Stricker
                    </h2>
                    <p className='text-sm text-gray-300'>Player: {username}</p>
                </div>

                <div className='bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 text-white'>
                    <div className='text-sm text-gray-300'>Status</div>
                    <div className='text-green-400 font-semibold'>
                        🟢 Online
                    </div>
                </div>
            </div>

            {/* Game Canvas Container */}
            <div className='relative bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 shadow-2xl '>
                <canvas
                    ref={canvasRef}
                    className='block border-2 border-white/30 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900'
                    style={{
                        filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))",
                    }}
                />

                {/* Canvas Overlay Effects */}
                <div className='absolute inset-0 pointer-events-none'>
                    <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/10' />
                    <div className='absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20' />
                    <div className='absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20' />
                </div>
            </div>

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
