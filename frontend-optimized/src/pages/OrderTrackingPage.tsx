import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trackOrderByNumber } from '../services/api';
import { Order, TrackingEvent, OrderTracking } from '../types';

const OrderTrackingPage: React.FC = () => {
  const { trackingNumber } = useParams<{ trackingNumber?: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchNumber, setSearchNumber] = useState<string>(trackingNumber || '');
  
  // Optimized data loading
  useEffect(() => {
    const loadTrackingData = async () => {
      if (!trackingNumber) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await trackOrderByNumber(trackingNumber) as OrderTracking;
        setOrder(data.order);
        setTracking(data.tracking);
        setLoading(false);
      } catch (error) {
        setError('Failed to load tracking information');
        setLoading(false);
        console.error('Error loading tracking:', error);
      }
    };
    
    loadTrackingData();
    
    // Single load is sufficient, no need for polling
    return () => {};
  }, [trackingNumber]);
  
  // Inefficient search handler
  const handleSearch = async () => {
    if (!searchNumber) {
      setError('Please enter a tracking number');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Artificial delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = await trackOrderByNumber(searchNumber);
      setOrder(data.order);
      setTracking(data.tracking);
      setLoading(false);
      
      // Update URL inefficiently
      window.history.pushState({}, '', `/order-tracking/${searchNumber}`);
    } catch (error) {
      setError('Failed to load tracking information');
      setLoading(false);
      console.error('Error loading tracking:', error);
    }
  };
  
  // Get current status
  const getCurrentStatus = () => {
    if (!tracking || tracking.length === 0) return 'pending';
    
    // Sort tracking updates by timestamp
    const sortedTracking = [...tracking].sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    return sortedTracking[0].status;
  };
  
  // Get status percentage
  const getStatusPercentage = () => {
    const status = getCurrentStatus();
    
    // Define status progression
    const statuses = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    const index = statuses.indexOf(status);
    
    if (index === -1) return 0;
    return (index / (statuses.length - 1)) * 100;
  };
  
  return (
    <div className="order-tracking-page">
      <h1>Order Tracking</h1>
      
      <div className="tracking-search">
        <div className="search-form">
          <input
            type="text"
            placeholder="Enter your tracking number"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
          />
          <button onClick={handleSearch}>Track</button>
        </div>
        
        {error && (
          <div className="tracking-error">{error}</div>
        )}
      </div>
      
      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading tracking information...</p>
        </div>
      ) : order ? (
        <div className="tracking-results">
          <div className="tracking-header">
            <h2>Tracking Information</h2>
            <div className="tracking-meta">
              <div className="meta-row">
                <span>Order Number:</span>
                <span>#{order.id}</span>
              </div>
              <div className="meta-row">
                <span>Tracking Number:</span>
                <span>{order.tracking_number}</span>
              </div>
              <div className="meta-row">
                <span>Order Date:</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="tracking-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${getStatusPercentage()}%` }}
              ></div>
            </div>
            
            <div className="progress-steps">
              <div className={`step ${getCurrentStatus() === 'pending' || ['processing', 'shipped', 'out_for_delivery', 'delivered'].includes(getCurrentStatus()) ? 'active' : ''}`}>
                <div className="step-icon">1</div>
                <div className="step-label">Order Placed</div>
              </div>
              
              <div className={`step ${getCurrentStatus() === 'processing' || ['shipped', 'out_for_delivery', 'delivered'].includes(getCurrentStatus()) ? 'active' : ''}`}>
                <div className="step-icon">2</div>
                <div className="step-label">Processing</div>
              </div>
              
              <div className={`step ${getCurrentStatus() === 'shipped' || ['out_for_delivery', 'delivered'].includes(getCurrentStatus()) ? 'active' : ''}`}>
                <div className="step-icon">3</div>
                <div className="step-label">Shipped</div>
              </div>
              
              <div className={`step ${getCurrentStatus() === 'out_for_delivery' || ['delivered'].includes(getCurrentStatus()) ? 'active' : ''}`}>
                <div className="step-icon">4</div>
                <div className="step-label">Out for Delivery</div>
              </div>
              
              <div className={`step ${getCurrentStatus() === 'delivered' ? 'active' : ''}`}>
                <div className="step-icon">5</div>
                <div className="step-label">Delivered</div>
              </div>
            </div>
          </div>
          
          <div className="tracking-updates">
            <h3>Tracking Updates</h3>
            
            {tracking.length > 0 ? (
              <div className="updates-timeline">
                {tracking.sort((a, b) => {
                  return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                }).map((update, index) => (
                  <motion.div
                    key={index}
                    className="timeline-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="timeline-icon">
                      {update.status === 'pending' && '📋'}
                      {update.status === 'processing' && '🔧'}
                      {update.status === 'shipped' && '📦'}
                      {update.status === 'out_for_delivery' && '🚚'}
                      {update.status === 'delivered' && '✅'}
                    </div>
                    
                    <div className="timeline-content">
                      <div className="update-header">
                        <span className="update-status">
                          {update.status.charAt(0).toUpperCase() + update.status.slice(1).replace(/_/g, ' ')}
                        </span>
                        <span className="update-time">
                          {new Date(update.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="update-details">
                        <p>{update.details}</p>
                        {update.location && (
                          <p className="update-location">
                            <strong>Location:</strong> {update.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="no-updates">
                No tracking updates available yet. Please check back later.
              </div>
            )}
          </div>
          
          <div className="tracking-actions">
            <Link to="/" className="home-btn">
              Return to Home
            </Link>
            <Link to="/products" className="shop-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : trackingNumber ? (
        <div className="no-tracking">
          <h2>No Tracking Information</h2>
          <p>
            We couldn't find any tracking information for the number <strong>{trackingNumber}</strong>.
            Please double-check the tracking number and try again.
          </p>
        </div>
      ) : (
        <div className="tracking-instructions">
          <h2>Track Your Order</h2>
          <p>
            Enter your tracking number above to check the status of your order.
            You can find your tracking number in your order confirmation email or on your order confirmation page.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;