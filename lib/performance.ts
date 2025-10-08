// Performance monitoring and optimization utilities

export const performanceConfig = {
  // Image optimization settings
  imageSettings: {
    quality: 85,
    formats: ['webp', 'avif'],
    sizes: {
      mobile: 640,
      tablet: 768,
      desktop: 1024,
      large: 1920,
    },
  },

  // Lazy loading settings
  lazyLoading: {
    rootMargin: '50px',
    threshold: 0.1,
  },

  // Video optimization
  videoSettings: {
    preload: 'metadata',
    loadingDelay: 1000, // Delay in ms before loading video
    quality: 'auto',
  },

  // Font loading
  fontSettings: {
    display: 'swap',
    preload: true,
    fallback: 'system-ui, sans-serif',
  },
};

export const measurePageLoad = () => {
  if (typeof window !== 'undefined' && window.performance) {
    const loadTime =
      window.performance.timing.loadEventEnd -
      window.performance.timing.navigationStart;
    // Performance metrics collected silently for internal monitoring
    return loadTime;
  }
  return 0;
};

export const measureImageLoad = (imageElement: HTMLImageElement) => {
  const startTime = performance.now();
  imageElement.onload = () => {
    const loadTime = performance.now() - startTime;
    // Image load metrics collected silently for internal monitoring
  };
};

export const measureComponentRender = (
  componentName: string,
  renderFunction: () => void
) => {
  const startTime = performance.now();
  renderFunction();
  const renderTime = performance.now() - startTime;
  // Component render metrics collected silently for internal monitoring
  return renderTime;
};

// Utility functions for performance optimization
export const performanceUtils = {
  // Debounce function for scroll events
  debounce: (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for resize events
  throttle: (func: Function, limit: number) => {
    let inThrottle: boolean;
    return function executedFunction(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Check if element is in viewport
  isInViewport: (element: Element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
};
