import React from "react";

/**
 * Login Component Props Interface
 * Defines the expected properties for the login/authentication component
 */
interface LoginProps {
    /** Current username value (controlled component) */
    username: string;
    /** Function to update username state in parent component */
    setUsername: (username: string) => void;
}

/**
 * Login Component - Game Authentication Interface
 *
 * React component that handles player authentication and game entry.
 * Provides a modern gaming-themed interface for username input and validation.
 *
 * Key Features:
 * - Modern gaming UI with gradient backgrounds and glass effects
 * - Username input validation and processing
 * - Responsive design for all screen sizes
 * - Gaming branding and feature highlights
 * - Keyboard navigation support (Enter key submission)
 * - Visual feedback and hover effects
 *
 * @param {LoginProps} props - Component properties
 * @returns {JSX.Element} Rendered login interface
 */
export default function Login({username, setUsername}: LoginProps) {
    /** Local input state for controlled input component */
    const [inputValue, setInputValue] = React.useState(username);

    /**
     * Handles user login submission
     *
     * Validates and processes username input, then updates parent state
     * to transition from login screen to game interface.
     *
     * @returns {void}
     */
    const handleLogin = (): void => {
        // Validate input and trim whitespace
        if (inputValue.trim()) {
            setUsername(inputValue.trim());
        }
    };

    /**
     * Handles keyboard navigation for form submission
     *
     * Allows users to submit login form using Enter key for better UX.
     *
     * @param {React.KeyboardEvent} e - Keyboard event object
     * @returns {void}
     */
    const handleKeyPress = (e: React.KeyboardEvent): void => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className='relative w-full max-w-md mx-auto'>
            {/* Background Effects */}
            <div className='absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl' />

            {/* Main Login Container */}
            <div className='relative bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-black/90 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl'>
                {/* Header Section */}
                <div className='text-center mb-8'>
                    {/* Game Logo/Title */}
                    <div className='mb-4'>
                        <h1 className='text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2'>
                            STRICKER
                        </h1>
                        <div className='w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full' />
                    </div>

                    {/* Subtitle */}
                    <h2 className='text-2xl font-bold text-white mb-2'>
                        Welcome, Fighter!
                    </h2>
                    <p className='text-gray-300 text-sm leading-relaxed'>
                        Enter the arena and prove your skills in epic battles.
                        <br />
                        Choose your fighter name to begin your journey.
                    </p>
                </div>

                {/* Login Form */}
                <div className='space-y-6'>
                    {/* Username Input Section */}
                    <div>
                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                            Fighter Name
                        </label>
                        <div className='relative'>
                            <input
                                type='text'
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder='Enter your fighter name...'
                                className='w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200'
                                maxLength={20}
                            />
                            {/* Input Focus Effect */}
                            <div className='absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 pointer-events-none transition-opacity duration-200 focus-within:opacity-100' />
                        </div>
                    </div>

                    {/* Enter Game Button */}
                    <button
                        onClick={handleLogin}
                        disabled={!inputValue.trim()}
                        className='w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed'
                    >
                        <span className='flex items-center justify-center gap-2'>
                            <span>⚔️</span>
                            Enter the Arena
                        </span>
                    </button>
                </div>

                {/* Feature Highlights */}
                <div className='mt-8 pt-6 border-t border-white/10'>
                    <h3 className='text-sm font-semibold text-gray-300 mb-3 text-center'>
                        Game Features
                    </h3>
                    <div className='grid grid-cols-2 gap-3 text-xs text-gray-400'>
                        <div className='flex items-center gap-2'>
                            <span>🎮</span>
                            <span>Real-time Multiplayer</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span>⚡</span>
                            <span>Fast-paced Combat</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span>🏆</span>
                            <span>Competitive Battles</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span>🌟</span>
                            <span>Skill-based Gameplay</span>
                        </div>
                    </div>
                </div>

                {/* Controls Information */}
                <div className='mt-6 p-4 bg-black/20 rounded-lg border border-white/10'>
                    <h4 className='text-sm font-semibold text-gray-300 mb-2'>
                        Controls
                    </h4>
                    <div className='text-xs text-gray-400 space-y-1'>
                        <div className='flex justify-between'>
                            <span>Movement:</span>
                            <span>WASD or Arrow Keys</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Attack:</span>
                            <span>Spacebar</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
