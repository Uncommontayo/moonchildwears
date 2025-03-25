import React from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from '../components/products/ProductDetail';
import ProductReviews from '../components/products/ProductReviews';
import { useWishlist } from '../context/WishlistContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  return (
    <div className="py-10">
      <ProductDetail 
        productId={id} 
        renderWishlistButton={(product) => {
          const inWishlist = product ? isInWishlist(product.id) : false;
          
          return (
            <button
              type="button"
              onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
              className="mt-3 w-full flex items-center justify-center border border-custom-orange text-custom-orange py-3 px-4 font-medium hover:bg-custom-orange hover:text-white transition-colors"
            >
              <svg 
                className="h-5 w-5 mr-2" 
                fill={inWishlist ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
              {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          );
        }} 
      />
      
      {/* Product Reviews */}
      <div className="mt-16">
        <ProductReviews productId={id} />
      </div>
    </div>
  );
};

export default ProductDetailPage;