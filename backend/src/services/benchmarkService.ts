import { logger } from '../utils/logger';

// Interface for benchmark data
export interface BenchmarkData {
  id: string;
  timestamp: number;
  clientId: string;
  pageUrl: string;
  userAgent: string;
  metrics: {
    ttfb?: number; // Time to First Byte
    fcp?: number; // First Contentful Paint
    lcp?: number; // Largest Contentful Paint
    fid?: number; // First Input Delay
    cls?: number; // Cumulative Layout Shift
    ttfp?: number; // Time to First Paint
    ttdi?: number; // Time to Interactive
    load?: number; // Page Load Time
    domContentLoaded?: number; // DOMContentLoaded Time
    resourceLoading?: {
      // Individual resource loading times
      js?: number;
      css?: number;
      img?: number;
      font?: number;
      other?: number;
    };
    navigation?: {
      // Navigation performance
      redirect?: number;
      dns?: number;
      tcp?: number;
      ssl?: number;
      request?: number;
      response?: number;
      dom?: number;
      domInteractive?: number;
      contentLoaded?: number;
      complete?: number;
    };
    memory?: {
      // Memory usage metrics
      jsHeapSizeLimit?: number;
      totalJSHeapSize?: number;
      usedJSHeapSize?: number;
    };
    custom?: Record<string, any>; // Any additional custom metrics
  };
  events?: Array<{
    // User events (e.g., clicks, scrolls)
    type: string;
    timestamp: number;
    target?: string;
    value?: any;
  }>;
  errors?: Array<{
    // JS errors
    message: string;
    timestamp: number;
    stack?: string;
  }>;
  network?: Array<{
    // Network requests
    url: string;
    type: string;
    size?: number;
    duration?: number;
    status?: number;
  }>;
  userFeedback?: {
    // Subjective user feedback
    rating?: number;
    comments?: string;
    usabilityScore?: number;
  };
}

// In-memory storage for benchmark data
// In a production app, this would be stored in a database
let benchmarkData: BenchmarkData[] = [];

/**
 * Add benchmark data received from the frontend
 */
export const addBenchmarkData = (data: BenchmarkData): BenchmarkData => {
  // Add current timestamp if not provided
  if (!data.timestamp) {
    data.timestamp = Date.now();
  }

  // Store benchmark data
  benchmarkData.push(data);

  // Log benchmark data receipt
  logger.info(`Received benchmark data [ID: ${data.id}] from ${data.clientId} for ${data.pageUrl}`);

  // Keep only the last 1000 benchmark entries to manage memory
  if (benchmarkData.length > 1000) {
    benchmarkData = benchmarkData.slice(-1000);
  }

  return data;
};

/**
 * Get all benchmark data, optionally filtered by clientId
 */
export const getBenchmarkData = (clientId?: string): BenchmarkData[] => {
  if (clientId) {
    return benchmarkData.filter((data) => data.clientId === clientId);
  }
  return benchmarkData;
};

/**
 * Get aggregated statistics for benchmark data
 */
export const getBenchmarkStats = (): any => {
  if (benchmarkData.length === 0) {
    return {
      count: 0,
      message: 'No benchmark data available',
    };
  }

  // Interface for metric statistics
  interface MetricStats {
    values?: number[];
    avg?: number;
    min?: number;
    max?: number;
    p90?: number;
    median?: number;
  }

  // Calculate average metrics
  const metrics = benchmarkData.reduce(
    (acc, data) => {
      // Only include entries with metrics
      if (!data.metrics) return acc;

      // Process core metrics
      acc.ttfb.values?.push(data.metrics.ttfb || 0);
      acc.fcp.values?.push(data.metrics.fcp || 0);
      acc.lcp.values?.push(data.metrics.lcp || 0);
      acc.fid.values?.push(data.metrics.fid || 0);
      acc.cls.values?.push(data.metrics.cls || 0);
      acc.load.values?.push(data.metrics.load || 0);

      return acc;
    },
    {
      ttfb: { values: [] as number[] } as MetricStats,
      fcp: { values: [] as number[] } as MetricStats,
      lcp: { values: [] as number[] } as MetricStats,
      fid: { values: [] as number[] } as MetricStats,
      cls: { values: [] as number[] } as MetricStats,
      load: { values: [] as number[] } as MetricStats,
    }
  );

  // Calculate averages, min, max for each metric
  for (const key in metrics) {
    const typedKey = key as keyof typeof metrics;
    const values = metrics[typedKey].values?.filter((v) => v > 0); // Only include non-zero values

    if (values && values.length > 0) {
      metrics[typedKey].avg =
        values.reduce((sum: number, val: number) => sum + val, 0) / values.length;
      metrics[typedKey].min = Math.min(...values);
      metrics[typedKey].max = Math.max(...values);
      metrics[typedKey].p90 = calculatePercentile(values, 90);
      metrics[typedKey].median = calculatePercentile(values, 50);
    } else {
      metrics[typedKey].avg = 0;
      metrics[typedKey].min = 0;
      metrics[typedKey].max = 0;
      metrics[typedKey].p90 = 0;
      metrics[typedKey].median = 0;
    }

    delete metrics[typedKey].values; // Remove the raw values array
  }

  // Get data by page URL
  const pageData: Record<string, { count: number }> = {};
  benchmarkData.forEach((data) => {
    if (!pageData[data.pageUrl]) {
      pageData[data.pageUrl] = { count: 0 };
    }
    pageData[data.pageUrl].count++;
  });

  // Get data by client ID (browser)
  const clientData: Record<string, { count: number; userAgent?: string }> = {};
  benchmarkData.forEach((data) => {
    if (!clientData[data.clientId]) {
      clientData[data.clientId] = { count: 0, userAgent: data.userAgent };
    }
    clientData[data.clientId].count++;
  });

  return {
    count: benchmarkData.length,
    metrics,
    pages: pageData,
    clients: clientData,
    timeRange: {
      oldest: Math.min(...benchmarkData.map((d) => d.timestamp)),
      newest: Math.max(...benchmarkData.map((d) => d.timestamp)),
    },
  };
};

/**
 * Calculate percentile for an array of values
 */
const calculatePercentile = (values: number[], percentile: number): number => {
  if (values.length === 0) return 0;

  // Sort values in ascending order
  const sorted = [...values].sort((a, b) => a - b);

  // Calculate percentile index
  const index = Math.floor(sorted.length * (percentile / 100));

  return sorted[index];
};
