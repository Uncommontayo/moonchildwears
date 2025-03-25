import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';

const HomePage = () => {
  const { products, loading, error } = useProducts();
  
  // Filter for new arrivals and featured products
  const newArrivals = products
    .filter(product => product.isNew)
    .slice(0, 4);
    
  const featuredProducts = products
    .filter(product => product.isFeatured)
    .slice(0, 4);
    
  const onSaleProducts = products
    .filter(product => product.discountPercentage)
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 4);
  
  if (loading) {
    return <Loader />;
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: {error}</p>
        <button 
          className="mt-4 bg-custom-orange text-white px-4 py-2"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-custom-orange text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/hero-background.jpg" 
            alt="MOONCHILD Fashion"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative container mx-auto px-4 py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">MOONCHILD</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Explore our new collection inspired by the mystery and magic of the night.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/products"
              className="bg-white text-custom-orange px-8 py-3 font-medium hover:bg-gray-200"
            >
              Shop Now
            </Link>
            <Link 
              to="/styling"
              className="border border-white px-8 py-3 font-medium hover:bg-white hover:text-custom-orange"
            >
              Style Guide
            </Link>
          </div>
        </div>
      </section>
      
      {/* New Arrivals Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">New Arrivals</h2>
          <Link 
            to="/products?category=new"
            className="text-sm font-medium border-b border-custom-orange hover:border-gray-500"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      {/* Featured Categories */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8 text-center">Shop by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category 1 */}
            <div className="group relative h-96 overflow-hidden">
              <img
                src="/images/category-tops.jpg"
                alt="Tops"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-custom-orange bg-opacity-30 flex items-center justify-center">
                <Link 
                  to="/products?category=tops"
                  className="bg-white text-custom-orange px-6 py-3 font-medium hover:bg-gray-200"
                >
                  Tops
                </Link>
              </div>
            </div>
            
            {/* Category 2 */}
            <div className="group relative h-96 overflow-hidden">
              <img
                src="/images/category-dresses.jpg"
                alt="Dresses"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-custom-orange bg-opacity-30 flex items-center justify-center">
                <Link 
                  to="/products?category=dresses"
                  className="bg-white text-custom-orange px-6 py-3 font-medium hover:bg-gray-200"
                >
                  Dresses
                </Link>
              </div>
            </div>
            
            {/* Category 3 */}
            <div className="group relative h-96 overflow-hidden">
              <img
                src="/images/category-accessories.jpg"
                alt="Accessories"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-custom-orange bg-opacity-30 flex items-center justify-center">
                <Link 
                  to="/products?category=accessories"
                  className="bg-white text-custom-orange px-6 py-3 font-medium hover:bg-gray-200"
                >
                  Accessories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Featured Products</h2>
            <Link 
              to="/products"
              className="text-sm font-medium border-b border-custom-orange hover:border-gray-500"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
      
      {/* On Sale Products */}
      {onSaleProducts.length > 0 && (
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">On Sale</h2>
              <Link 
                to="/products?sale=true"
                className="text-sm font-medium border-b border-custom-orange hover:border-gray-500"
              >
                View All Sales
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {onSaleProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Styling Service Banner */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-custom-orange text-white p-8 md:p-12 flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Personal Styling Recommendations</h2>
            <p className="mb-6">
              Get personalized outfit suggestions based on your MOONCHILD purchases.
              Our unique styling service helps you make the most of your wardrobe.
            </p>
            <Link 
              to="/styling"
              className="inline-block bg-white text-custom-orange px-6 py-3 font-medium hover:bg-gray-200"
            >
              Learn More
            </Link>
          </div>
          <div className="md:w-1/3">
            <img 
              src="/images/styling-service.jpg" 
              alt="MOONCHILD Styling Service"
              className="w-full h-auto" 
            />
          </div>
        </div>
      </section>
      
      {/* Instagram Feed Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Follow Us @MOONCHILD</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <a 
              key={num}
              href="https://instagram.com/moonchildwears" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram post ${num}`}
              className="group relative aspect-square overflow-hidden"
            >
              <img 
                src={`/images/instagram-${num}.jpg`} 
                alt={`Instagram post ${num}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-custom-orange bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-opacity duration-300">
                <svg 
                  className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </a>
          ))}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <h2 className="text-2xl font-semibold mb-4">Sign Up for Our Newsletter</h2>
          <p className="mb-6 text-gray-600">
            Stay updated with new arrivals, exclusive promotions, and styling tips.
          </p>
          <form className="flex">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 outline-none focus:ring-1 focus:ring-custom-orange" 
              required 
            />
            <button 
              type="submit" 
              className="bg-custom-orange text-white px-6 py-3 font-medium hover:bg-orange-600"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;