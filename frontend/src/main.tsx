import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App";

/**
 * Main Entry Point - React Application Bootstrap
 *
 * Initializes and renders the React application into the DOM.
 * StrictMode is disabled in development to prevent double rendering
 * which causes duplicate socket connections and event listeners.
 *
 * Note: StrictMode can be re-enabled in production for additional checks
 * once the socket singleton pattern is fully stable.
 */

// Get root DOM element and render application
const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error(
        "Root element not found. Make sure index.html contains a div with id='root'"
    );
}

// Create React root and render application
createRoot(rootElement).render(<App />);
