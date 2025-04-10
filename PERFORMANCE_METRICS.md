# Performance Metrics for E-commerce Frontend Comparison

This document outlines the key metrics to monitor when comparing the three versions of the e-commerce frontend (unoptimized, moderate, and optimized).

## Core Web Vitals

These are Google's recommended user-centric metrics that directly impact user experience:

| Metric | Description | Target | Why It Matters |
|--------|-------------|--------|---------------|
| **Largest Contentful Paint (LCP)** | Time until the largest content element is rendered | < 2.5s | Perceived loading speed |
| **First Input Delay (FID)** / **INP** | Time from first user interaction to response | < 100ms | Responsiveness to user input |
| **Cumulative Layout Shift (CLS)** | Measure of visual stability during page load | < 0.1 | Prevents frustrating layout shifts |

## Loading Performance Metrics

| Metric | Description | Target | Why It Matters |
|--------|-------------|--------|---------------|
| **Time to First Byte (TTFB)** | Time until first byte of response received | < 800ms | Server response speed |
| **First Contentful Paint (FCP)** | Time until first content is rendered | < 1.8s | Initial visual feedback |
| **DOM Content Loaded** | HTML parsed and DOM constructed | < 2s | Page structure ready |
| **Load Event** | All initial resources loaded | < 3s | Full initial page ready |

## JavaScript and Resource Metrics

| Metric | Description | Target | Why It Matters |
|--------|-------------|--------|---------------|
| **Total JavaScript Size** | Size of all JS resources | < 300KB gzipped | Page load and parse time |
| **JavaScript Execution Time** | Time spent executing JS | < 3s | Main thread blocking |
| **Total Blocking Time (TBT)** | Sum of blocking periods after FCP | < 300ms | Main thread availability |
| **Number of Requests** | Total HTTP requests made | Minimize | Network overhead |
| **Total Page Weight** | Combined size of all resources | < 2MB | Download time |

## Runtime Metrics

| Metric | Description | Target | Why It Matters |
|--------|-------------|--------|---------------|
| **Memory Usage** | JS heap size during usage | Stable (no leaks) | Page stability over time |
| **CPU Utilization** | CPU usage during page lifecycle | < 60% peak | Battery and thermal impact |
| **Long Tasks** | Tasks taking > 50ms | Minimize | Responsiveness |
| **Frame Rate** | FPS during animations/scrolling | 60fps stable | Smooth visual experience |

## E-commerce Specific Metrics

| Metric | Description | Target | Why It Matters |
|--------|-------------|--------|---------------|
| **Time to Interactive (Product Pages)** | When users can interact with products | < 3s | Product discovery |
| **Cart Add Response Time** | Time to complete add-to-cart action | < 100ms | Conversion impact |
| **Checkout Flow Time** | Time to complete entire checkout | Minimize | Conversion completion |
| **Image Loading Time** | Time for product images to load | < 1s | Product presentation |
| **Filter/Search Response Time** | Time to show filtered/search results | < 500ms | Product discovery |

## Network Resilience

| Metric | Description | Target | Why It Matters |
|--------|-------------|--------|---------------|
| **Performance on 3G** | Load time on slow connection | < 5s FCP | Mobile users with poor connectivity |
| **Performance on 4G** | Load time on average connection | < 3s FCP | Typical mobile users |
| **Offline Capability** | PWA functionality without connection | Works offline | Service worker effectiveness |

## Tools for Measurement

- **Lighthouse** in Chrome DevTools for overall scoring and recommendations
- **WebPageTest.org** for detailed waterfall analysis and filmstrip view
- **Chrome DevTools Performance Panel** for detailed JavaScript profiling
- **Chrome DevTools Network Panel** for resource loading analysis
- **Browser Performance API** for custom metrics collection

## Methodology for Comparison

When comparing the three versions:

1. Test under identical conditions (same device, network, server load)
2. Run multiple tests and take median values
3. Test each key user journey (home → product → cart → checkout)
4. Test with both cold and warm cache
5. Test on both desktop and mobile devices
6. Create a comparison spreadsheet with all metrics side by side

## Metric Collection Script

A simplified script to collect core metrics is included in the optimized version. You can use this to log metrics to the console or send them to an analytics endpoint:

```javascript
// Monitor web vitals
import { onCLS, onFID, onLCP, onTTFB, onFCP } from 'web-vitals';

function logMetric(metric) {
  console.log(metric.name, metric.value);
  // Could also send to analytics API
}

// Register callbacks
onCLS(logMetric);
onFID(logMetric);
onLCP(logMetric);
onTTFB(logMetric);
onFCP(logMetric);

// Additional custom metrics
window.addEventListener('load', () => {
  // Log total page weight
  const resources = performance.getEntriesByType('resource');
  const totalBytes = resources.reduce((total, resource) => total + resource.encodedBodySize, 0);
  console.log('Total page size (bytes):', totalBytes);
  
  // Log JavaScript size
  const jsResources = resources.filter(resource => resource.initiatorType === 'script');
  const jsBytes = jsResources.reduce((total, resource) => total + resource.encodedBodySize, 0);
  console.log('JavaScript size (bytes):', jsBytes);
});
```