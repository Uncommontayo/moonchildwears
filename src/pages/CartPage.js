import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Loader from '../components/common/Loader';

const CartPage = () => {
  const { cart, loading, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg mb-6">Your cart is empty</p>
          <Link 
            to="/products"
            className="inline-block bg-custom-orange text-white px-6 py-3 font-medium hover:bg-orange-600"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="border-b border-gray-200 pb-4 mb-4 hidden md:flex">
              <div className="w-1/2">
                <span className="font-medium">Product</span>
              </div>
              <div className="w-1/6 text-center">
                <span className="font-medium">Price</span>
              </div>
              <div className="w-1/6 text-center">
                <span className="font-medium">Quantity</span>
              </div>
              <div className="w-1/6 text-center">
                <span className="font-medium">Total</span>
              </div>
            </div>
            
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="border-b border-gray-200 py-4">
                {/* Mobile View */}
                <div className="md:hidden flex flex-col space-y-2">
                  <div className="flex">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <Link to={`/products/${item.id}`} className="font-medium hover:underline">
                        {item.name}
                      </Link>
                      <div className="text-sm text-gray-500 mt-1">
                        <p>Size: {item.size}</p>
                        {item.color && <p>Color: {item.color}</p>}
                      </div>
                      <div className="text-sm mt-1">${item.price.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-gray-300">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, item.size, item.color, parseInt(e.target.value))}
                        className="w-12 border-x border-gray-300 py-1 text-center"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="text-gray-500 hover:text-custom-orange"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Desktop View */}
                <div className="hidden md:flex items-center">
                  <div className="w-1/2 flex items-center">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <Link to={`/products/${item.id}`} className="font-medium hover:underline">
                        {item.name}
                      </Link>
                      <div className="text-sm text-gray-500 mt-1">
                        <p>Size: {item.size}</p>
                        {item.color && <p>Color: {item.color}</p>}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        className="text-xs text-gray-500 hover:text-custom-orange mt-2 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="w-1/6 text-center">
                    ${item.price.toFixed(2)}
                  </div>
                  
                  <div className="w-1/6">
                    <div className="flex items-center justify-center border border-gray-300 mx-auto w-28">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, item.size, item.color, parseInt(e.target.value))}
                        className="w-12 border-x border-gray-300 py-1 text-center"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="w-1/6 text-center font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between mt-6">
              <Link 
                to="/products"
                className="text-custom-orange hover:underline flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Continue Shopping
              </Link>
              
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700"
              >
                Clear Cart
              </button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Estimated Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Link
                to="/checkout"
                className="block w-full bg-custom-orange text-white text-center py-3 font-medium hover:bg-orange-600"
              >
                Proceed to Checkout
              </Link>
              
              {/* Payment methods */}
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">We accept:</p>
                <div className="flex space-x-2">
                  <div className="p-1 border border-gray-200 rounded">
                    <svg className="h-6 w-10" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="40" height="24" rx="4" fill="#F3F4F6"/>
                      <path d="M14.4 8H25.6C26.37 8 27 8.63 27 9.4V14.6C27 15.37 26.37 16 25.6 16H14.4C13.63 16 13 15.37 13 14.6V9.4C13 8.63 13.63 8 14.4 8Z" fill="#3C4B5C"/>
                    </svg>
                  </div>
                  <div className="p-1 border border-gray-200 rounded">
                    <svg className="h-6 w-10" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="40" height="24" rx="4" fill="#F3F4F6"/>
                      <path d="M16 8H24C25.1 8 26 8.9 26 10V14C26 15.1 25.1 16 24 16H16C14.9 16 14 15.1 14 14V10C14 8.9 14.9 8 16 8Z" fill="#F59E0B"/>
                    </svg>
                  </div>
                  <div className="p-1 border border-gray-200 rounded">
                    <svg className="h-6 w-10" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="40" height="24" rx="4" fill="#F3F4F6"/>
                      <circle cx="20" cy="12" r="5" fill="#EF4444"/>
                      <circle cx="15" cy="12" r="5" fill="#F59E0B"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Promo code */}
            <div className="mt-6 p-6 border border-gray-200">
              <h3 className="text-md font-medium mb-3">Promo Code</h3>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-grow border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-custom-orange focus:border-custom-orange"
                />
                <button
                  className="bg-custom-orange text-white px-4 py-2 font-medium hover:bg-orange-600"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;