import {useEffect, useState} from "react";

interface DeathModalProps {
    message: string;
    onPlayAgain: () => void;
    onQuit: () => void;
}

const DeathModal: React.FC<DeathModalProps> = ({
    message,
    onPlayAgain,
    onQuit,
}) => {
    const [counter, setCounter] = useState(10);

    useEffect(() => {
        if (counter <= 0) {
            onPlayAgain();
            return;
        }

        const timer = setTimeout(() => {
            setCounter(counter - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [counter, onPlayAgain]);

    return (
        <div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 font-sans animate-in fade-in duration-300 overflow-hidden'>
            <div className='bg-gradient-to-br from-slate-800 via-slate-900 to-black p-8 rounded-2xl text-center shadow-2xl max-w-md w-11/12 border border-red-500/30 relative overflow-hidden'>
                {/* Animated Background Effects */}
                <div className='absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-purple-500/10 animate-pulse' />
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500' />

                {/* Skull Icon with Animation */}
                <div className='relative mb-6'>
                    <div className='text-6xl animate-bounce'>💀</div>
                    <div className='absolute inset-0 text-6xl animate-ping opacity-20'>
                        💀
                    </div>
                </div>

                {/* Death Title */}
                <h2 className='text-red-400 text-3xl font-bold mb-2 relative z-10'>
                    <span className='bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent'>
                        YOU DIED!
                    </span>
                </h2>

                {/* Death Message */}
                <p className='text-gray-300 text-lg mb-6 relative z-10 leading-relaxed'>
                    {message}
                </p>

                {/* Action Buttons */}
                <div className='flex justify-center gap-4 mb-6 relative z-10'>
                    <button
                        onClick={onPlayAgain}
                        className='group relative px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25'
                    >
                        <span className='relative z-10 flex items-center gap-2'>
                            <span>🔄</span>
                            Respawn
                        </span>
                        <div className='absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
                    </button>

                    <button
                        onClick={onQuit}
                        className='group relative px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25'
                    >
                        <span className='relative z-10 flex items-center gap-2'>
                            <span>🚪</span>
                            Back to Login
                        </span>
                        <div className='absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
                    </button>
                </div>

                {/* Countdown Timer */}
                <div className='relative z-10'>
                    <div className='bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-white/10'>
                        <div className='flex items-center justify-center gap-2 text-gray-400 text-sm'>
                            <div className='w-2 h-2 bg-yellow-500 rounded-full animate-pulse' />
                            <span>Auto-respawn in</span>
                            <span className='text-yellow-400 font-bold text-lg'>
                                {counter}
                            </span>
                            <span>{counter === 1 ? "second" : "seconds"}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className='mt-2 w-full bg-gray-700 rounded-full h-1.5 overflow-hidden'>
                            <div
                                className='h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-1000 ease-linear'
                                style={{
                                    width: `${((10 - counter) / 10) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeathModal;
