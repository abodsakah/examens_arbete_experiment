import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';

const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Unnecessary state that changes every second
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  // Inefficient timer that updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Unnecessary jQuery usage
  useEffect(() => {
    $(document).ready(function() {
      $('.footer-links li').hover(
        function() {
          $(this).css('transform', 'translateX(5px)');
        },
        function() {
          $(this).css('transform', 'translateX(0)');
        }
      );
      
      $('.footer-social a').hover(
        function() {
          $(this).animate({ opacity: 0.7 }, 200);
        },
        function() {
          $(this).animate({ opacity: 1 }, 200);
        }
      );
    });
  }, []);
  
  // Inefficient handler with unnecessary calculations
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Unnecessary calculation
    let result = '';
    for (let i = 0; i < 10000; i++) {
      result += i.toString().charAt(0);
    }
    
    console.log('Newsletter submitted:', newsletterEmail);
    console.log('Unnecessary calculation result length:', result.length);
    
    alert(`Thank you for subscribing with ${newsletterEmail}!`);
    setNewsletterEmail('');
  };
  
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-column">
            <h3>WebShop</h3>
            <div className="footer-about">
              <p>Your one-stop shop for quality products. We offer a wide range of items at competitive prices.</p>
              <p>Current time: {currentTime}</p>
            </div>
          </div>
          
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/products?category=electronics">Electronics</Link></li>
              <li><Link to="/products?category=furniture">Furniture</Link></li>
              <li><Link to="/products?category=accessories">Accessories</Link></li>
              <li><Link to="/order-tracking">Track Order</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Contact Us</h3>
            <div className="footer-contact">
              <p>Email: info@webshop.com</p>
              <p>Phone: +1 234 567 890</p>
              <p>Address: 123 WebShop Street, Internet City</p>
            </div>
          </div>
          
          <div className="footer-column">
            <h3>Subscribe</h3>
            <div className="footer-newsletter">
              <p>Subscribe to our newsletter for the latest updates and offers.</p>
              <form onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-social">
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="Twitter">TW</a>
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="LinkedIn">LI</a>
          </div>
          
          <div className="footer-copyright">
            <p>&copy; {currentYear} WebShop. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;