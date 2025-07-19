import {useState} from "react";
import Canvas from "./components/Canvas";
import Login from "./components/login";

function App() {
    const [username, setUsername] = useState("");

    const handlePlayerDeath = () => {
        // Reset username to show login screen again
        setUsername("");
    };

    return (
        <main className='flex flex-col items-center justify-center h-screen bg-gray-100'>
            <h1 className='text-center text-3xl font-bold mb-4'>
                Sticker Game
            </h1>
            <p className='text-center mb-4'>
                {username
                    ? `Welcome, ${username}!`
                    : "Please log in to start playing."}
            </p>
            <div className='flex justify-center w-full h-full p-4'>
                {username ? (
                    <Canvas
                        username={username}
                        onPlayerDeath={handlePlayerDeath}
                    />
                ) : (
                    <Login username={username} setUsername={setUsername} />
                )}
            </div>
        </main>
    );
}

export default App;
