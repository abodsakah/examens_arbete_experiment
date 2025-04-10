# Web Performance Optimization Experiment

This project demonstrates the impact of various web performance optimization techniques through a comparison of three different frontend implementations (unoptimized, moderately optimized, and fully optimized) sharing a common backend API.

## Project Structure

- **`/backend`**: Express.js + TypeScript API with product catalog, order management, and performance benchmarks
- **`/frontend-unoptimized`**: Deliberately unoptimized implementation with performance issues
- **`/frontend-moderate`**: Version with basic optimizations applied
- **`/frontend-optimized`**: Version with comprehensive optimizations applied
- **`/PERFORMANCE_METRICS.md`**: Documentation on metrics tracked and measurement methodology
- **`/PERFORMANCE_TROUBLESHOOTING.md`**: Guide for common issues and testing scenarios

## Setup Instructions

### Backend Setup

```bash
cd backend
./setup.sh  # Automatic setup including database initialization
# or
npm install
npm run build
npm run dev
```

### Frontend Setup (for any version)

```bash
cd frontend-[version]  # Choose unoptimized, moderate, or optimized
npm install
npm run dev  # Development server
# or
npm run build  # Production build
```

## Features

- Complete e-commerce product catalog with filtering, search and ordering
- Order placement and tracking functionality 
- Performance benchmarking endpoints
- Comprehensive documentation on optimization strategies

## Performance Measurement

This project is designed to showcase performance differences between implementation approaches. For meaningful comparison:

1. Use tools like Lighthouse, Chrome DevTools, and WebPageTest
2. Test with different network conditions (throttling)
3. Compare Core Web Vitals and other key metrics
4. Test on various devices and connection speeds

Refer to the performance documentation files for detailed guidance.