import React from "react";

interface LoginProps {
    username: string;
    setUsername: (username: string) => void;
}

export default function Login({username, setUsername}: LoginProps) {
    const [inputValue, setInputValue] = React.useState(username);
    const handleLogin = () => {
        setUsername(inputValue);
    };

    return (
        <div className='flex flex-col items-center space-y-4 border p-4 rounded bg-white shadow-md w-1/2 h-fit py-12'>
            <h2 className='text-2xl font-bold'>Login</h2>
            <p className='text-gray-600'>
                Enter your username to join the game
            </p>
            <input
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder='Enter your username'
                className='border border-gray-300 p-2 rounded w-1/2'
            />
            <button
                onClick={handleLogin}
                className='bg-green-500 w-1/2 text-white p-2 rounded'
            >
                Join
            </button>
        </div>
    );
}
