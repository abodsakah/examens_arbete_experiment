import React, { useState } from 'react';
import LazyImage from './LazyImage'; // Import LazyImage component

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ src, alt, className = '' }) => {
  const [error, setError] = useState(false);
  
  // Generate a local placeholder for fallback
  const generatePlaceholder = () => {
    const placeholderText = alt || 'Product Image';
    const colors = ['#007bff', '#6f42c1', '#fd7e14', '#28a745', '#dc3545'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    return (
      <div 
        className={`placeholder-image ${className}`}
        style={{ 
          backgroundColor: randomColor,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          fontSize: '16px',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '1rem'
        }}
      >
        {placeholderText}
      </div>
    );
  };
  
  // Get full URL for image
  const getImageUrl = () => {
    // If src is a full URL, return it as is
    if (src.startsWith('http')) {
      return src;
    }
    
    // If src is a relative URL, prepend the backend URL
    // For product images from the backend
    if (src.startsWith('/images')) {
      return `http://localhost:3000${src}`;
    }
    
    // For other relative URLs, use the current origin
    return src;
  };
  
  // Handle image loading errors
  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setError(true);
  };
  
  // If there was an error loading the image, show the placeholder
  if (error) {
    return generatePlaceholder();
  }
  
  // Use LazyImage component for lazy loading
  return (
    <LazyImage 
      src={getImageUrl()} 
      alt={alt}
      className={className}
    />
  );
};

export default ProductImage;