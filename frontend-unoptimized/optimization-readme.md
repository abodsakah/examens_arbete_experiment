# Unoptimized Frontend

This version of the frontend serves as the baseline with no performance optimizations implemented. It intentionally includes anti-patterns and performance issues to demonstrate the impact of proper web performance optimization (WPO) techniques.

## Anti-Patterns and Performance Issues

### 1. Bundle Size Issues
- No code splitting or lazy loading implemented
- All pages and components eagerly loaded at startup
- Unnecessary third-party libraries imported and initialized (THREE.js, D3, GSAP, Chart.js)
- Unused dependencies throughout the codebase
- No tree-shaking or dead code elimination

### 2. Image Loading Problems
- No image optimization or compression
- Images served in inefficient formats (no WebP)
- No responsive images or srcset implementation
- No lazy loading for off-screen images
- No placeholder/blur-up technique for progressive loading

### 3. Build Configuration Issues
- Minification disabled completely
- No code splitting or chunking strategy
- No filename hashing for cache invalidation
- No tree-shaking enabled
- No bundle analysis or visualization 
- No compression (Gzip/Brotli)

### 4. Resource Loading Inefficiencies
- Render-blocking CSS loading (no critical CSS inlining)
- No resource hints (preload, prefetch, preconnect)
- Synchronous script loading blocking page rendering
- No font optimization or font display strategies
- No prioritization of above-the-fold content

### 5. Performance Anti-Patterns
- Unnecessary calculations and operations during page load
- Forced reflows causing layout thrashing
- Memory leaks from uncleared intervals and growing arrays
- Inefficient state management causing excess re-renders
- Blocking main thread with synchronous operations

### 6. HTTP and Caching Issues
- No caching headers or strategies ("no-store" directive)
- No content hashing for proper cache invalidation
- Multiple synchronous HTTP requests
- No offline capabilities

### 7. External Dependencies Issues
- Multiple external CSS and JavaScript files loaded synchronously
- No CDN optimization or consolidation of resources
- Duplicate functionality across multiple libraries

### 8. UI Rendering Issues
- No component memoization to prevent unnecessary re-renders
- Inefficient component updates causing entire tree re-renders
- No virtualization for large lists or data sets
- No debouncing or throttling for performance-intensive operations

### 9. Developer Tools and Configuration
- No performance monitoring or metrics collection
- No error boundaries or fallback UI
- No structured code organization
- No typescript strict mode

### 10. JavaScript Execution Issues
- Blocking operations in the main thread
- Unnecessary recursion (Fibonacci calculation)
- Wasteful intervals and timers
- Global variables and poor scoping
- Excessive console logging

### 11. CSS Issues
- Overly specific selectors reducing performance
- Unused CSS rules increasing payload size
- Unnecessary animations and keyframes
- No CSS minification or optimization

### 12. HTML Issues
- Render-blocking resources in the head
- Inline blocking scripts
- No semantic HTML structure
- No accessibility considerations

## How to Run

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm run dev
```

3. Build for production:
```
npm run build
```

Note: This version is intentionally designed to demonstrate poor performance practices. For a better user experience, refer to the optimized or moderately optimized versions.