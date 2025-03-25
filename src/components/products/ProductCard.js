import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { id, name, price, images, category, isNew, discountPercentage } = product;
  
  // Calculate discount price if applicable
  const discountedPrice = discountPercentage 
    ? price - (price * (discountPercentage / 100)) 
    : null;

  return (
    <div className="group relative">
      {/* Product image with hover effect */}
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 h-80">
        <Link to={`/products/${id}`}>
          {images && images.length > 0 ? (
            <img
              src={images[0]}
              alt={name}
              className="h-full w-full object-cover object-center lg:h-full lg:w-full transition-opacity duration-300"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          
          {/* Hover image (second image if available) */}
          {images && images.length > 1 && (
            <img
              src={images[1]}
              alt={`${name} - alternate view`}
              className="absolute inset-0 h-full w-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}
        </Link>
        
        {/* New tag */}
        {isNew && (
          <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1">
            NEW
          </div>
        )}
        
        {/* Discount tag */}
        {discountPercentage && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1">
            {discountPercentage}% OFF
          </div>
        )}
        
        {/* Quick view button - appears on hover */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link 
            to={`/products/${id}`}
            className="bg-black text-white text-sm py-2 px-4 font-medium"
          >
            Quick View
          </Link>
        </div>
      </div>
      
      {/* Product info */}
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            <Link to={`/products/${id}`}>
              {name}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-gray-500">{category}</p>
        </div>
        <div className="text-right">
          {discountedPrice ? (
            <>
              <p className="text-sm font-medium text-gray-900">${discountedPrice.toFixed(2)}</p>
              <p className="text-xs text-gray-500 line-through">${price.toFixed(2)}</p>
            </>
          ) : (
            <p className="text-sm font-medium text-gray-900">${price.toFixed(2)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;