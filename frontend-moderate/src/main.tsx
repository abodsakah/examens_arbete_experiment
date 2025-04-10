import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-toastify/dist/ReactToastify.css"; // Keep essential Toast notifications CSS
import "./index.css"; // Our custom CSS
import App from "./App.tsx";

// Still include one small unnecessary calculation to maintain a "moderate" level of optimization
// This is much smaller than the original but still not fully optimized
console.log("Running lightweight calculation...");
let sum = 0;
for (let i = 0; i < 10000; i++) {
  sum += Math.sqrt(i);
}
console.log("Calculation result:", sum);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
