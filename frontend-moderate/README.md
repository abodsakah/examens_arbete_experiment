# WebShop Frontend (Unoptimized Version)

This is an intentionally unoptimized version of a React.js web shop application. It serves as a baseline for web performance optimization experiments.

## Performance Issues

This version deliberately includes the following performance issues:

- No code splitting or lazy loading
- No minification or compression
- Unnecessary libraries included
- Large images served raw
- No caching (no service worker or HTTP cache headers)
- Blocking JS and CSS in `<head>`
- Inefficient component rendering
- Poor state management
- Memory leaks
- Excessive network requests
- Unnecessary computations

## Installation

1. Make sure you have Node.js installed.

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

We use `--legacy-peer-deps` because there are deliberately conflicting dependencies.

## Running the Application

To start the development server:

```bash
npm run dev
```

To build for production (creates unoptimized build):

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Technologies

- React
- TypeScript
- Vite (configured to disable optimizations)
- Redux (with inefficient state management)
- Many unnecessary libraries

## Dependencies

This project deliberately includes many unnecessary dependencies to increase bundle size:

- React Router DOM
- Redux & React Redux
- Axios
- Lodash
- jQuery
- Bootstrap
- Material UI
- Framer Motion
- Chart.js
- Three.js
- GSAP
- And many more...

## Backend API

This frontend connects to the WebShop Backend API. Please ensure the backend server is running on http://localhost:3000 before starting this application.

## Notes

This project is part of a web performance optimization study. The intentional performance issues are designed to demonstrate the impact of performance optimizations in the optimized versions.
