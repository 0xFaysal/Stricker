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
        <div className='w-full flex justify-center items-center h-full relative'>
            <canvas ref={canvasRef} className='border border-black' />

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
