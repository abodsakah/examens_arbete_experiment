import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  // Unnecessary state for animation
  const [animationCount, setAnimationCount] = useState<number>(0);
  
  // Inefficient timer for animations
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationCount(prev => prev + 1);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Inefficient calculation
  useEffect(() => {
    // Unnecessary heavy computation
    const startTime = performance.now();
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sin(i) * Math.cos(i);
    }
    const endTime = performance.now();
    console.log(`Useless calculation took ${endTime - startTime}ms. Result: ${result}`);
  }, []);
  
  return (
    <div className="not-found-page">
      <motion.div
        className="not-found-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          rotate: animationCount % 2 === 0 ? 0 : 2 // Unnecessary animation
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="not-found-header">
          <h1>404</h1>
          <h2>Page Not Found</h2>
        </div>
        
        <div className="not-found-content">
          <p>
            Oops! The page you are looking for doesn't exist or has been moved.
          </p>
          <p>
            Please check the URL or go back to the homepage.
          </p>
        </div>
        
        <div className="not-found-actions">
          <Link to="/" className="home-btn">
            Return to Home
          </Link>
          <Link to="/products" className="products-btn">
            Browse Products
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;