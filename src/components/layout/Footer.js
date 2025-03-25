import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-custom-orange text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-bold mb-4 block">MOONCHILD</Link>
            <p className="text-sm text-gray-100 mb-4">
              MOONCHILD is a fashion brand for the dreamers, the visionaries, and those who dance under moonlight.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-100 hover:text-white" aria-label="Twitter">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-100 hover:text-white" aria-label="Instagram">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-100 hover:text-white" aria-label="LinkedIn">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div className="md:col-span-1">
            <h3 className="text-base font-semibold mb-4">SHOP</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?category=new" className="text-gray-100 hover:text-white">New Arrivals</Link></li>
              <li><Link to="/products?category=tops" className="text-gray-100 hover:text-white">Tops</Link></li>
              <li><Link to="/products?category=bottoms" className="text-gray-100 hover:text-white">Bottoms</Link></li>
              <li><Link to="/products?category=dresses" className="text-gray-100 hover:text-white">Dresses</Link></li>
              <li><Link to="/products?category=outerwear" className="text-gray-100 hover:text-white">Outerwear</Link></li>
              <li><Link to="/products?category=accessories" className="text-gray-100 hover:text-white">Accessories</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="md:col-span-1">
            <h3 className="text-base font-semibold mb-4">CUSTOMER SERVICE</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-gray-100 hover:text-white">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-gray-100 hover:text-white">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-gray-100 hover:text-white">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="text-gray-100 hover:text-white">FAQ</Link></li>
              <li><Link to="/size-guide" className="text-gray-100 hover:text-white">Size Guide</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="text-base font-semibold mb-4">NEWSLETTER</h3>
            <p className="text-sm text-gray-100 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                aria-label="Email for newsletter"
                className="px-4 py-2 w-full text-black text-sm focus:outline-none focus:ring-1 focus:ring-custom-orange" 
                required
              />
              <button 
                type="submit" 
                className="bg-white text-custom-orange px-4 py-2 text-sm font-semibold hover:bg-gray-100"
              >
                SIGN UP
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-100 mb-4 md:mb-0">
            &copy; {currentYear} MOONCHILD. All Rights Reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-xs text-gray-100 hover:text-white">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-xs text-gray-100 hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;