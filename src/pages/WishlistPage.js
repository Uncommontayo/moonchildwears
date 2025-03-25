import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const { products, loading: productsLoading } = useProducts();
  const { addToCart } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  
  useEffect(() => {
    if (products.length > 0 && wishlist.length > 0) {
      const filteredProducts = products.filter(product => wishlist.includes(product.id));
      setWishlistProducts(filteredProducts);
    } else {
      setWishlistProducts([]);
    }
  }, [products, wishlist]);
  
  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };
  
  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };
  
  if (wishlistLoading || productsLoading) {
    return <Loader />;
  }
  
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      
      {wishlistProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">
            Add items to your wishlist by clicking the heart icon on product pages.
          </p>
          <Link 
            to="/products"
            className="inline-block bg-custom-orange text-white px-6 py-3 rounded-md hover:bg-custom-orange/90"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map(product => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="relative">
                <Link to={`/products/${product.id}`}>
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-64 object-cover"
                  />
                </Link>
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                >
                  <svg 
                    className="h-5 w-5 text-custom-orange" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <Link to={`/products/${product.id}`}>
                  <h3 className="text-lg font-medium mb-1">{product.name}</h3>
                </Link>
                <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleAddToCart(product)}
                    className="text-sm"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;