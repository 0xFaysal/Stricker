import React from "react";

interface LoginProps {
    username: string;
    setUsername: (username: string) => void;
}

export default function Login({username, setUsername}: LoginProps) {
    const [inputValue, setInputValue] = React.useState(username);

    const handleLogin = () => {
        if (inputValue.trim()) {
            setUsername(inputValue.trim());
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className='relative w-full max-w-md mx-auto'>
            {/* Background Effects */}
            <div className='absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl' />

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
                    {/* Username Input */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-300'>
                            Fighter Name
                        </label>
                        <div className='relative'>
                            <input
                                type='text'
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder='Enter your fighter name...'
                                className='w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200'
                                maxLength={20}
                                autoFocus
                            />
                            <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                                <span className='text-cyan-400'>⚔️</span>
                            </div>
                        </div>
                        <div className='text-xs text-gray-400'>
                            {inputValue.length}/20 characters
                        </div>
                    </div>

                    {/* Join Button */}
                    <button
                        onClick={handleLogin}
                        disabled={!inputValue.trim()}
                        className='group relative w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 disabled:transform-none disabled:shadow-none disabled:cursor-not-allowed'
                    >
                        <span className='relative z-10 flex items-center justify-center gap-2'>
                            <span>🎮</span>
                            Enter the Arena
                            <span>⚔️</span>
                        </span>
                        <div className='absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
                    </button>
                </div>

                {/* Game Features */}
                <div className='mt-8 pt-6 border-t border-white/10'>
                    <div className='text-center text-xs text-gray-400 mb-3'>
                        Game Features
                    </div>
                    <div className='grid grid-cols-2 gap-3 text-xs'>
                        <div className='flex items-center gap-2 text-gray-300'>
                            <span className='text-green-400'>⚡</span>
                            Real-time Combat
                        </div>
                        <div className='flex items-center gap-2 text-gray-300'>
                            <span className='text-blue-400'>🌐</span>
                            Multiplayer Online
                        </div>
                        <div className='flex items-center gap-2 text-gray-300'>
                            <span className='text-purple-400'>🎯</span>
                            Skill-based Gameplay
                        </div>
                        <div className='flex items-center gap-2 text-gray-300'>
                            <span className='text-yellow-400'>🏆</span>
                            Competitive Action
                        </div>
                    </div>
                </div>

                {/* Version Info */}
                <div className='mt-6 text-center text-xs text-gray-500'>
                    Stricker v1.0 - Built with React & Socket.IO
                </div>
            </div>
        </div>
    );
}
