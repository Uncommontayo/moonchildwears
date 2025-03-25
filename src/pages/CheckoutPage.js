import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Loader from '../components/common/Loader';

const CheckoutPage = () => {
  const { currentUser, userProfile } = useAuth();
  const { cart, cartTotal, clearCart, loading: cartLoading } = useCart();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [formData, setFormData] = useState({
    shipping: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      saveAddress: false
    },
    payment: {
      cardName: '',
      cardNumber: '',
      expMonth: '',
      expYear: '',
      cvv: ''
    }
  });
  
  // Shipping cost calculation
  const shippingCost = cartTotal > 100 ? 0 : 9.99;
  
  // Tax calculation (simplified, usually done on the server)
  const taxRate = 0.07; // 7%
  const taxAmount = cartTotal * taxRate;
  
  // Order total
  const orderTotal = cartTotal + shippingCost + taxAmount;
  
  // Initialize form with user data if available
  useEffect(() => {
    if (userProfile) {
      setFormData(prevData => ({
        ...prevData,
        shipping: {
          ...prevData.shipping,
          fullName: userProfile.displayName || '',
          email: currentUser.email || '',
          phone: userProfile.phone || '',
          address: userProfile.address?.street || '',
          city: userProfile.address?.city || '',
          state: userProfile.address?.state || '',
          postalCode: userProfile.address?.zip || '',
          country: userProfile.address?.country || ''
        }
      }));
    }
  }, [userProfile, currentUser]);
  
  const handleInputChange = (e, section) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };
  
  const validateShippingForm = () => {
    const { fullName, email, phone, address, city, state, postalCode, country } = formData.shipping;
    
    if (!fullName || !email || !phone || !address || !city || !state || !postalCode || !country) {
      setError('Please fill in all required fields');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    setError('');
    return true;
  };
  
  const validatePaymentForm = () => {
    const { cardName, cardNumber, expMonth, expYear, cvv } = formData.payment;
    
    if (!cardName || !cardNumber || !expMonth || !expYear || !cvv) {
      setError('Please fill in all required fields');
      return false;
    }
    
    // Card number validation (simplified)
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    
    // CVV validation
    if (cvv.length < 3 || cvv.length > 4) {
      setError('Please enter a valid CVV code');
      return false;
    }
    
    setError('');
    return true;
  };
  
  const handleNextStep = () => {
    if (step === 1 && validateShippingForm()) {
      setStep(2);
    } else if (step === 2 && validatePaymentForm()) {
      setStep(3);
    }
  };
  
  const handlePrevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };
  
  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create order object
      const orderData = {
        userId: currentUser.uid,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image
        })),
        shipping: {
          fullName: formData.shipping.fullName,
          address: formData.shipping.address,
          city: formData.shipping.city,
          state: formData.shipping.state,
          postalCode: formData.shipping.postalCode,
          country: formData.shipping.country,
          phone: formData.shipping.phone
        },
        subtotal: cartTotal,
        shippingCost,
        taxAmount,
        total: orderTotal,
        paymentMethod: 'Credit Card',
        status: 'processing',
        createdAt: serverTimestamp()
      };
      
      // Save order to Firestore
      const orderRef = collection(db, 'orders');
      const orderDoc = await addDoc(orderRef, orderData);
      
      // Update user's order history
      const userOrderRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        userOrderRef, 
        { 
          purchaseHistory: [...(userProfile.purchaseHistory || []), {
            orderId: orderDoc.id,
            date: new Date().toISOString(),
            total: orderTotal,
            items: cart.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              size: item.size,
              color: item.color
            }))
          }],
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
      
      // Save shipping address if requested
      if (formData.shipping.saveAddress) {
        await setDoc(
          userOrderRef,
          {
            address: {
              street: formData.shipping.address,
              city: formData.shipping.city,
              state: formData.shipping.state,
              zip: formData.shipping.postalCode,
              country: formData.shipping.country
            },
            phone: formData.shipping.phone,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      }
      
      // Clear cart
      clearCart();
      
      // Redirect to confirmation page
      navigate(`/order-confirmation/${orderDoc.id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      setError('There was an error processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (cartLoading) {
    return <Loader />;
  }
  
  // Render empty cart message
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="text-center py-10">
          <p className="text-lg mb-6">Your cart is empty</p>
          <button 
            onClick={() => navigate('/products')}
            className="inline-block bg-black text-white px-6 py-3 font-medium hover:bg-gray-900"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {/* Checkout progress */}
      <div className="flex justify-between mb-10">
        <div className={`relative flex flex-col items-center ${step >= 1 ? 'text-black' : 'text-gray-400'}`}>
          <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>
            1
          </div>
          <div className="text-sm mt-2">Shipping</div>
        </div>
        
        <div className="flex-1 flex items-center">
          <div className={`flex-1 h-1 ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
        </div>
        
        <div className={`relative flex flex-col items-center ${step >= 2 ? 'text-black' : 'text-gray-400'}`}>
          <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>
            2
          </div>
          <div className="text-sm mt-2">Payment</div>
        </div>
        
        <div className="flex-1 flex items-center">
          <div className={`flex-1 h-1 ${step >= 3 ? 'bg-black' : 'bg-gray-200'}`}></div>
        </div>
        
        <div className={`relative flex flex-col items-center ${step >= 3 ? 'text-black' : 'text-gray-400'}`}>
          <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 3 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>
            3
          </div>
          <div className="text-sm mt-2">Review</div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main checkout form */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping Information */}
          {step === 1 && (
            <div className="bg-white p-6 border border-gray-200 rounded-md">
              <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.shipping.fullName}
                    onChange={(e) => handleInputChange(e, 'shipping')}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.shipping.email}
                    onChange={(e) => handleInputChange(e, 'shipping')}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.shipping.phone}
                    onChange={(e) => handleInputChange(e, 'shipping')}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address*
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.shipping.address}
                    onChange={(e) => handleInputChange(e, 'shipping')}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.shipping.city}
                    onChange={(e) => handleInputChange(e, 'shipping')}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province*
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.shipping.state}
                    onChange={(e) => handleInputChange(e, 'shipping')}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code*
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.shipping.postalCode}
                    onChange={(e) => handleInputChange(e, 'shipping')}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country*
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.shipping.country}
                    onChange={(e) => handleInputChange(e, 'shipping')}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    required
                  />
                </div>
              </div>
              
              {currentUser && (
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="saveAddress"
                    name="saveAddress"
                    checked={formData.shipping.saveAddress}
                    onChange={(e) => handleInputChange(e, 'shipping')}
                    className="h-4 w-4 border-gray-300 rounded text-black focus:ring-black"
                  />
                  <label htmlFor="saveAddress" className="ml-2 block text-sm text-gray-700">
                    Save this address for future orders
                  </label>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-900"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Payment Information */}
          {step === 2 && (
            <div className="bg-white p-6 border border-gray-200 rounded-md">
              <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
              
              <div className="mb-6">
                <div className="flex space-x-4 mb-4">
                  <div className="border border-gray-300 rounded px-4 py-2 flex items-center">
                    <input
                      type="radio"
                      id="cc"
                      name="paymentMethod"
                      checked
                      className="mr-2"
                    />
                    <label htmlFor="cc">Credit Card</label>
                  </div>
                  <div className="border border-gray-300 rounded px-4 py-2 flex items-center opacity-50 cursor-not-allowed">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      disabled
                      className="mr-2"
                    />
                    <label htmlFor="paypal">PayPal</label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card*
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.payment.cardName}
                      onChange={(e) => handleInputChange(e, 'payment')}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number*
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.payment.cardNumber}
                      onChange={(e) => handleInputChange(e, 'payment')}
                      placeholder="**** **** **** ****"
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="expMonth" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Month*
                    </label>
                    <select
                      id="expMonth"
                      name="expMonth"
                      value={formData.payment.expMonth}
                      onChange={(e) => handleInputChange(e, 'payment')}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      required
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month.toString().padStart(2, '0')}>
                          {month.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="expYear" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Year*
                    </label>
                    <select
                      id="expYear"
                      name="expYear"
                      value={formData.payment.expYear}
                      onChange={(e) => handleInputChange(e, 'payment')}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      required
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV*
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.payment.cvv}
                      onChange={(e) => handleInputChange(e, 'payment')}
                      placeholder="***"
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="border border-black text-black px-6 py-2 rounded-md font-medium hover:bg-gray-100"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-900"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Order Review */}
          {step === 3 && (
            <div className="bg-white p-6 border border-gray-200 rounded-md">
              <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>
              
              {/* Cart items */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Items</h3>
                
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Size: {item.size} {item.color && `| Color: ${item.color}`}
                        </p>
                        <p className="text-sm">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Shipping details */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Shipping Details</h3>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-black hover:underline"
                  >
                    Edit
                  </button>
                </div>
                
                <div className="text-sm">
                  <p className="font-medium">{formData.shipping.fullName}</p>
                  <p>{formData.shipping.address}</p>
                  <p>
                    {formData.shipping.city}, {formData.shipping.state} {formData.shipping.postalCode}
                  </p>
                  <p>{formData.shipping.country}</p>
                  <p className="mt-2">{formData.shipping.phone}</p>
                  <p>{formData.shipping.email}</p>
                </div>
              </div>
              
              {/* Payment details */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Payment Details</h3>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-sm text-black hover:underline"
                  >
                    Edit
                  </button>
                </div>
                
                <div className="text-sm">
                  <p className="font-medium">{formData.payment.cardName}</p>
                  <p>
                    Card ending in {formData.payment.cardNumber.slice(-4)}
                  </p>
                  <p>
                    Expires {formData.payment.expMonth}/{formData.payment.expYear}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="border border-black text-black px-6 py-2 rounded-md font-medium hover:bg-gray-100"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-900"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 border border-gray-200 rounded-md sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                {shippingCost === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span>${shippingCost.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Promo code */}
            <div className="mb-6">
              <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-1">
                Promo Code
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="promoCode"
                  className="flex-grow border border-gray-300 px-3 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  placeholder="Enter code"
                />
                <button
                  type="button"
                  className="bg-black text-white px-4 py-2 rounded-r-md font-medium hover:bg-gray-900"
                >
                  Apply
                </button>
              </div>
            </div>
            
            {/* Order policy */}
            <div className="text-xs text-gray-500">
              <p className="mb-2">
                By placing your order, you agree to MOONCHILD's{' '}
                <button className="text-black underline">Terms of Service</button> and{' '}
                <button className="text-black underline">Privacy Policy</button>.
              </p>
              <p>
                Estimated delivery: 3-5 business days after order is placed.
                Free shipping on orders over $100.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;