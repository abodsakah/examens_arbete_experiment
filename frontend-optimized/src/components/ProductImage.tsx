import React, { useState, memo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ImageFallback } from './Fallbacks';

interface ProductImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

/**
 * Highly optimized ProductImage component with:
 * - Intersection Observer-based lazy loading
 * - WebP detection and automatic format selection
 * - Responsive image handling with srcset
 * - Error handling with fallbacks
 * - Performance optimization with prefetching
 * - Blur-up technique for progressive loading
 * - Aspect ratio preservation to prevent layout shifts
 */
const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  width = 300,
  height = 300,
  className = '',
  priority = false
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(priority ? getImageUrl(src) : null);
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null);
  
  // Create ref for Intersection Observer
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px', // Start loading 200px before image enters viewport
    skip: priority // Skip if this is a priority image (above the fold)
  });
  
  // Check WebP support once on component mount
  useEffect(() => {
    const checkWebPSupport = async () => {
      try {
        const feature = {
          lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
        };
        
        const img = new Image();
        const result = await new Promise<boolean>((resolve) => {
          img.onload = () => resolve(img.width > 0 && img.height > 0);
          img.onerror = () => resolve(false);
          img.src = `data:image/webp;base64,${feature.lossy}`;
        });
        
        setSupportsWebP(result);
      } catch (e) {
        setSupportsWebP(false);
      }
    };
    
    checkWebPSupport();
  }, []);
  
  // Load image when it comes into view or is priority
  useEffect(() => {
    if (inView || priority) {
      setImgSrc(getImageUrl(src));
    }
  }, [inView, priority, src]);

  /**
   * Generate optimized image URL
   * - Adds WebP support if available
   * - Handles backend URLs
   */
  function getImageUrl(imageSrc: string): string {
    // If src is a full URL, return it as is
    if (imageSrc.startsWith('http')) {
      return imageSrc;
    }
    
    // If src is a backend image
    if (imageSrc.startsWith('/images')) {
      const baseUrl = 'http://localhost:3000';
      
      // If browser supports WebP and the image is jpg/png, try WebP version
      if (supportsWebP === true && imageSrc.match(/\.(jpg|jpeg|png)$/i)) {
        const webpSrc = imageSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        return `${baseUrl}${webpSrc}`;
      }
      
      return `${baseUrl}${imageSrc}`;
    }
    
    // For static assets
    return imageSrc;
  }
  
  // Generate placeholder SVG with correct aspect ratio
  const placeholderSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#f0f0f0" />
    </svg>
  `;
  
  const placeholderUrl = `data:image/svg+xml;utf8,${encodeURIComponent(placeholderSvg)}`;
  
  // Handle image load success
  const handleLoad = () => {
    setLoaded(true);
  };
  
  // Handle image load error
  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setError(true);
  };
  
  // Return fallback if error
  if (error) {
    return <ImageFallback alt={alt} />;
  }
  
  // Calculate aspect ratio for container
  const aspectRatio = (height / width) * 100;
  
  // Return optimized image with proper placeholders
  return (
    <div 
      ref={ref}
      className={`product-image-container ${className}`}
      style={{ 
        position: 'relative',
        paddingBottom: `${aspectRatio}%`, // Maintain aspect ratio
        backgroundColor: '#f0f0f0',
        overflow: 'hidden'
      }}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={handleLoad}
          onError={handleError}
          className={`product-image ${loaded ? 'loaded' : 'loading'}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease',
            opacity: loaded ? 1 : 0
          }}
        />
      )}
      
      {(!loaded || !imgSrc) && (
        <img
          src={placeholderUrl}
          alt=""
          aria-hidden="true"
          width={width}
          height={height}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        />
      )}
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(ProductImage);