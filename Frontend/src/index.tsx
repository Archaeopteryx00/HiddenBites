// Frontend/src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Correct: looks for App.tsx in the same directory
import "./index.css";

import reportWebVitals from "./reportWebVitals"; // Correct: looks for reportWebVitals.ts in the same directory

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
