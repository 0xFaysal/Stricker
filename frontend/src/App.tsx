import {useState} from "react";
import Canvas from "./components/Canvas";
import Login from "./components/login";

/**
 * App Component - Main Application Controller
 *
 * Root React component that manages the overall application state and routing
 * between login and game screens. Handles user authentication flow and provides
 * the main application layout with modern gaming aesthetics.
 *
 * Key Features:
 * - State management for user authentication
 * - Routing between login and game interfaces
 * - Responsive layout with animated background effects
 * - Modern gaming UI with gradient backgrounds
 * - Clean component lifecycle management
 * - Proper overflow control for all screen sizes
 *
 * @returns {JSX.Element} Main application interface
 */
export default function App() {
    /**
     * Username state - controls application routing
     * Empty string = show login screen
     * Non-empty string = show game interface
     */
    const [username, setUsername] = useState("");

    /**
     * Handles player death or logout events
     *
     * Resets username state to return user to login screen.
     * Used when player dies, quits, or needs to restart session.
     *
     * @returns {void}
     */
    const handlePlayerDeath = (): void => {
        // Reset username to trigger login screen display
        setUsername("");
    };

    return (
        <main className='min-h-screen max-w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-x-hidden overflow-y-auto'>
            {/* Animated Background Elements */}
            <div className='absolute inset-0 overflow-hidden'>
                {/* Purple orb - top left */}
                <div className='absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse' />

                {/* Cyan orb - bottom right */}
                <div className='absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000' />

                {/* Pink orb - center */}
                <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500' />
            </div>

            {/* Content Container */}
            <div className='relative z-10 flex flex-col items-center justify-center  p-2 sm:p-4 overflow-x-hidden w-full max-w-full'>
                {!username ? (
                    /* Login Screen - Show when no username is set */
                    <div className='w-full max-w-6xl mx-auto flex flex-col items-center justify-center overflow-x-hidden px-2'>
                        <Login username={username} setUsername={setUsername} />
                    </div>
                ) : (
                    /* Game Screen - Show when username is authenticated */
                    <div className='w-full max-w-full mx-auto flex flex-col overflow-x-hidden'>
                        {/* Game Header - Top navigation and status bar */}
                        <div className='flex items-center justify-between p-2 sm:p-4 bg-black/20 backdrop-blur-sm border-b border-white/10 overflow-x-hidden'>
                            {/* Left Section - Game branding and welcome */}
                            <div className='flex items-center gap-2 sm:gap-4 min-w-0 flex-1'>
                                <h1 className='text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap'>
                                    STRICKER
                                </h1>
                                <div className='h-4 sm:h-6 w-px bg-white/20 hidden sm:block' />
                                <span className='text-gray-300 text-sm sm:text-base truncate hidden sm:inline'>
                                    Welcome back,{" "}
                                    <span className='text-cyan-400 font-semibold'>
                                        {username}
                                    </span>
                                    !
                                </span>
                            </div>

                            {/* Right Section - Status and controls */}
                            <div className='flex items-center gap-2 sm:gap-3 flex-shrink-0'>
                                {/* Connection Status Indicator */}
                                <div className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-300'>
                                    <div className='w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400 rounded-full animate-pulse' />
                                    <span className='hidden sm:inline'>
                                        Connected
                                    </span>
                                </div>

                                {/* Leave Game Button */}
                                <button
                                    onClick={handlePlayerDeath}
                                    className='px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs sm:text-sm rounded-lg border border-red-500/30 transition-colors duration-200 whitespace-nowrap'
                                >
                                    <span className='hidden sm:inline'>
                                        Leave Game
                                    </span>
                                    <span className='sm:hidden'>Leave</span>
                                </button>
                            </div>
                        </div>

                        {/* Game Canvas Area - Main gameplay interface */}
                        <div className='flex-1 p-2 sm:p-4 overflow-x-hidden'>
                            <Canvas
                                username={username}
                                onPlayerDeath={handlePlayerDeath}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer - Show only on login screen */}
            {!username && (
                <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-gray-400 text-sm'>
                    <p>© 2025 Stricker Game - Built with ❤️ by 0xFaysal</p>
                </div>
            )}
        </main>
    );
}
