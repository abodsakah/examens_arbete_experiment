/**
 * Main entry point for the application
 * Optimized for performance with minimal dependencies
 */
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // CSS
import "./index.css"; // Our optimized CSS
import App from "./App";
import { LoadingFallback, ErrorFallback } from "./components/Fallbacks";

// Temporarily disable PWA for development
// This helps avoid virtual:pwa-register issues
const updateSW = (() => {
  // Mock PWA registration
  console.log("PWA functionality disabled for development");
  return () => {};
})();

// Performance metrics
if (process.env.NODE_ENV === 'development') {
  const reportWebVitals = async () => {
    if ('performance' in window && 'measure' in window.performance) {
      // Create a performance mark
      performance.mark('app-start');
      
      // Add web vitals reporting
      const { onCLS, onFID, onLCP, onTTFB } = await import('web-vitals');
      onCLS(console.log);
      onFID(console.log);
      onLCP(console.log);
      onTTFB(console.log);
    }
  };
  
  reportWebVitals();
}

// Preload critical fonts
const preloadFonts = () => {
  // Only preload most essential fonts
  const fontUrls = ['/fonts/main-regular.woff2'];
  
  fontUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

preloadFonts();

// Initialize the application
const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingFallback />}>
          <App />
          <ToastContainer 
            position="bottom-right" 
            autoClose={3000} 
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
          />
        </Suspense>
      </ErrorBoundary>
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}
