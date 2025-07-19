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
    }, [counter]);

    return (
        <div className='fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 font-sans'>
            <div className='bg-white p-8 rounded-lg text-center shadow-xl max-w-md w-11/12'>
                <h2 className='text-red-600 text-3xl font-bold mb-4'>
                    💀 You Died! 💀
                </h2>

                <p className='text-gray-700 text-lg mb-6'>{message}</p>

                <div className='flex justify-center gap-4'>
                    <button
                        onClick={onPlayAgain}
                        className='bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200'
                    >
                        Play Again
                    </button>

                    <button
                        onClick={onQuit}
                        className='bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200'
                    >
                        Quit Game
                    </button>
                </div>

                <p className='text-gray-500 text-sm mt-4'>
                    Auto-redirect in {counter}{" "}
                    {counter === 1 ? "second" : "seconds"}...
                </p>
            </div>
        </div>
    );
};

export default DeathModal;
