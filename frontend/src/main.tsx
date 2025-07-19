import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Removed StrictMode for development to prevent double rendering
// which was causing duplicate socket connections and event listeners
createRoot(document.getElementById("root")!).render(<App />);
