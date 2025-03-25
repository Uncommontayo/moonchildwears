import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Order ID not found');
        setLoading(false);
        return;
      }
      
      try {
        const orderDoc = await getDoc(doc(db, 'orders', orderId));
        
        if (orderDoc.exists()) {
          setOrder({ id: orderDoc.id, ...orderDoc.data() });
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);
  
  if (loading) {
    return <Loader />;
  }
  
  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center py-10">
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'Unable to load order details'}</p>
          <Button as={Link} to="/">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }
  
  // Format date
  const orderDate = order.createdAt ? new Date(order.createdAt.toDate()) : new Date();
  const formattedDate = orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Estimated delivery date (5 business days after order date)
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 border border-gray-200 rounded-md">
        <div className="text-center mb-8">
          <div className="inline-block bg-green-100 text-green-800 p-3 rounded-full mb-4">
            <svg 
              className="h-10 w-10" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2">
            Order #{orderId.slice(0, 8).toUpperCase()}
          </p>
        </div>
        
        <div className="mb-8">
          <p className="text-center text-gray-600">
            Thank you for your purchase! We've sent a confirmation email to <strong>{order.shipping.email}</strong> with your order details.
          </p>
        </div>
        
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Order Date:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Order Status:</span>
              <span className="capitalize">{order.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Estimated Delivery:</span>
              <span>{formattedDeliveryDate}</span>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Items</h3>
            
            <div className="space-y-4">
              {order.items.map((item) => (
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
          
          {/* Order Totals */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping:</span>
              {order.shippingCost === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                <span>${order.shippingCost.toFixed(2)}</span>
              )}
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax:</span>
              <span>${order.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Shipping Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Shipping Address</h3>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">{order.shipping.fullName}</p>
                <p>{order.shipping.address}</p>
                <p>
                  {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}
                </p>
                <p>{order.shipping.country}</p>
                <p className="mt-2">{order.shipping.phone}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Payment Method</h3>
              <div className="text-sm text-gray-600">
                <p>{order.paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Have questions about your order? <Link to="/contact" className="text-custom-orange hover:underline">Contact our support team</Link>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button as={Link} to="/products">
              Continue Shopping
            </Button>
            
            <Button as={Link} to="/profile" variant="secondary">
              View Order History
            </Button>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">Get Personalized Styling</h3>
            <p className="text-gray-600 mb-4">
              Discover outfit suggestions based on your new purchases
            </p>
            <Button as={Link} to="/styling" variant="outline">
              Go to Styling Recommendations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;