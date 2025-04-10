import React, { useState, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

// This component provides lazy loading for images
// It also attempts to load WebP versions of images if they exist
const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = '', width, height }) => {
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  
  useEffect(() => {
    // Check if the image is in the viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Try to load WebP version if it's a JPG or PNG
          if (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png')) {
            // Create WebP path by replacing the extension
            const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            
            // Attempt to load WebP version first
            const img = new Image();
            img.onload = () => {
              setImgSrc(webpSrc);
              setLoaded(true);
            };
            img.onerror = () => {
              // Fall back to original format if WebP doesn't exist
              setImgSrc(src);
              setLoaded(true);
            };
            img.src = webpSrc;
          } else {
            // For other formats, just use the original
            setImgSrc(src);
            setLoaded(true);
          }
          
          // Disconnect after loading
          observer.disconnect();
        }
      });
    }, {
      rootMargin: '100px 0px', // Start loading when within 100px of viewport
      threshold: 0.01
    });
    
    // Start observing
    const element = document.getElementById(`lazy-img-${src}`);
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [src]);
  
  return (
    <div 
      id={`lazy-img-${src}`} 
      className={`lazy-image-container ${loaded ? 'loaded' : 'loading'} ${className}`}
      style={{ 
        width: width ? `${width}px` : '100%', 
        height: height ? `${height}px` : 'auto',
        position: 'relative',
        backgroundColor: '#f0f0f0'
      }}
    >
      {loaded ? (
        <img 
          src={imgSrc} 
          alt={alt} 
          className="lazy-image"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div className="lazy-image-placeholder" />
      )}
    </div>
  );
};

export default LazyImage;