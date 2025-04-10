# Moderately Optimized Frontend

This version of the frontend includes moderate optimizations while maintaining the same UI layout as the unoptimized version.

## Optimizations Applied

1. **Bundle Splitting (Code Splitting)**
   - Used React.lazy and Suspense for route-based code splitting
   - Only the Homepage is eagerly loaded, all other pages are lazy loaded
   - Added appropriate loading states for lazy-loaded components

2. **Basic Image Optimization**
   - Converted key banner images to WebP format
   - Created a LazyImage component for lazy loading images
   - Added WebP fallback mechanism for browsers that don't support it

3. **Build Optimizations**
   - Enabled Vite minification with esbuild
   - Enabled tree-shaking through Vite's rollup configuration
   - Added proper content hashing for better caching
   - Set up manual chunks for vendor libraries

4. **Performance Improvements**
   - Reduced unnecessary calculations and animations
   - Added proper Intersection Observer-based lazy loading
   - Optimized slider settings to be less resource-intensive
   - Removed unnecessary dependencies and imports

5. **HTTP Caching**
   - Added appropriate cache control headers

6. **External Dependency Management**
   - Significantly reduced external fonts/scripts
   - Kept only essential dependencies

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