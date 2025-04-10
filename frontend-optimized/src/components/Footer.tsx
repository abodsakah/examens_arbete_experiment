import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const currentYear = new Date().getFullYear();
  const currentTime = new Date().toLocaleTimeString();
  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter submitted:', newsletterEmail);
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