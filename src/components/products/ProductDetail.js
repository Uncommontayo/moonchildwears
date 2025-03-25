import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Loader from '../common/Loader';
import RelatedProducts from './RelatedProducts';
import ProductReviews from './ProductReviews';
import Button from '../common/Button';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, getRelatedProducts, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [loadingProduct, setLoadingProduct] = useState(true);
  
  // Check if product is in wishlist
  const inWishlist = product ? isInWishlist(product.id) : false;
  
  // Common sizes for clothing
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  // Fetch product data when component mounts or productId changes
  useEffect(() => {
    const fetchProductData = async () => {
      setLoadingProduct(true);
      try {
        // Fetch the product details
        const productData = await getProductById(id);
        setProduct(productData);
        
        // Select default options if available
        if (productData.availableSizes && productData.availableSizes.length > 0) {
          setSelectedSize(productData.availableSizes[0]);
        } else {
          setSelectedSize('M'); // Default size if no sizes specified
        }
        
        if (productData.availableColors && productData.availableColors.length > 0) {
          setSelectedColor(productData.availableColors[0]);
        }
        
        // Reset selected image to first one
        setCurrentImage(0);
        
        // Get related products
        const related = await getRelatedProducts(productData);
        setRelatedProducts(related);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoadingProduct(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id, getProductById, getRelatedProducts]);
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    addToCart(product, quantity, selectedSize, selectedColor);
    navigate('/cart');
  };
  
  // Calculate discount price if applicable
  const discountedPrice = product?.discountPercentage 
    ? product.price - (product.price * (product.discountPercentage / 100)) 
    : null;
  
  if (loading || loadingProduct) {
    return <Loader />;
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: {error}</p>
        <button 
          className="mt-4 bg-custom-orange text-white px-4 py-2 rounded"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="text-center py-10">
        <p className="text-lg">Product not found</p>
        <Link 
          to="/products"
          className="mt-4 inline-block bg-custom-orange text-white px-4 py-2 rounded"
        >
          Browse All Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
            <img
              src={product.images[currentImage]}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          
          {/* Thumbnail images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md ${
                    currentImage === index ? 'ring-2 ring-custom-orange' : 'ring-1 ring-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - view ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
          
          {/* Price */}
          <div className="mt-4">
            {discountedPrice ? (
              <div className="flex items-center">
                <p className="text-xl font-semibold text-gray-900">${discountedPrice.toFixed(2)}</p>
                <p className="ml-2 text-lg text-gray-500 line-through">${product.price.toFixed(2)}</p>
                <p className="ml-2 text-sm text-red-500 font-medium">
                  Save {product.discountPercentage}%
                </p>
              </div>
            ) : (
              <p className="text-xl font-semibold text-gray-900">${product.price.toFixed(2)}</p>
            )}
          </div>
          
          {/* Description */}
          <div className="mt-4">
            <p className="text-sm text-gray-600">{product.description}</p>
          </div>
          
          {/* Size selection */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">Size</h3>
            <div className="mt-2 grid grid-cols-6 gap-2">
              {(product.availableSizes || sizes).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`flex items-center justify-center rounded-md py-2 px-3 text-sm font-medium uppercase ${
                    selectedSize === size
                      ? 'bg-custom-orange text-white'
                      : 'bg-white text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Color selection if available */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Color</h3>
              <div className="mt-2 flex space-x-2">
                {product.availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`relative h-8 w-8 rounded-full ${
                      selectedColor === color ? 'ring-2 ring-custom-orange ring-offset-1' : ''
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
            <div className="mt-2 flex">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded-l-md border border-r-0 border-gray-300 bg-white px-3 py-2 text-gray-900 hover:bg-gray-50"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 border-y border-gray-300 bg-white px-3 py-2 text-center text-gray-900"
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-r-md border border-l-0 border-gray-300 bg-white px-3 py-2 text-gray-900 hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to cart button */}
          <div className="mt-6">
            <Button
              onClick={handleAddToCart}
              className="w-full"
            >
              Add to Cart
            </Button>
          </div>
          
          {/* Add to wishlist button */}
          <button
            type="button"
            onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
            className="mt-3 w-full flex items-center justify-center border border-custom-orange text-custom-orange py-3 px-4 font-medium hover:bg-custom-orange hover:text-white transition-colors rounded-md"
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
          
          {/* Additional info */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="prose prose-sm text-gray-500">
              <h3 className="font-medium text-gray-900">Product Details</h3>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                {product.details && product.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
                <li>Category: {product.category}</li>
                {product.material && <li>Material: {product.material}</li>}
                {product.brand && <li>Brand: {product.brand}</li>}
              </ul>
            </div>
          </div>
          
          {/* Styling suggestions button */}
          <div className="mt-6">
            <Link
              to={`/styling?productId=${product.id}`}
              className="w-full block text-center border border-custom-orange text-custom-orange py-3 px-4 font-medium hover:bg-gray-100 rounded-md"
            >
              Get Styling Suggestions
            </Link>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">You May Also Like</h2>
          <RelatedProducts products={relatedProducts} />
        </div>
      )}
      
      {/* Product Reviews */}
      <div className="mt-16">
        <ProductReviews productId={id} />
      </div>
    </div>
  );
};

export default ProductDetail;