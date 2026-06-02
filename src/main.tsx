import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initGlobalErrorHandlers } from "./lib/clientLogger";

initGlobalErrorHandlers();
createRoot(document.getElementById("root")).render(<App />);
