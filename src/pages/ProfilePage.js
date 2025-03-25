import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Loader from '../components/common/Loader';

const ProfilePage = () => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Initialize form data from user profile
  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        email: currentUser.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: ''
        }
      });
    }
  }, [userProfile, currentUser]);
  
  // Fetch order history
  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        const ordersRef = doc(db, 'orders', currentUser.uid);
        const ordersDoc = await getDoc(ordersRef);
        
        if (ordersDoc.exists()) {
          setOrderHistory(ordersDoc.data().orders || []);
        } else {
          setOrderHistory([]);
        }
      } catch (err) {
        console.error('Error fetching order history:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderHistory();
  }, [currentUser]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setSuccessMessage('');
    setLoading(true);
    
    try {
      await updateUserProfile({
        displayName: formData.displayName,
        phone: formData.phone,
        address: formData.address,
        updatedAt: new Date().toISOString()
      });
      
      setEditMode(false);
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!userProfile || loading) {
    return <Loader />;
  }
  
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`block w-full text-left px-4 py-2 rounded-md ${
                activeTab === 'profile'
                  ? 'bg-custom-orange text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`block w-full text-left px-4 py-2 rounded-md ${
                activeTab === 'orders'
                  ? 'bg-custom-orange text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Order History
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`block w-full text-left px-4 py-2 rounded-md ${
                activeTab === 'addresses'
                  ? 'bg-custom-orange text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Saved Addresses
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`block w-full text-left px-4 py-2 rounded-md ${
                activeTab === 'preferences'
                  ? 'bg-custom-orange text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Style Preferences
            </button>
            <Link
              to="/styling"
              className="block w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              My Style Recommendations
            </Link>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="text-sm text-custom-orange hover:underline"
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
              
              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="displayName"
                      name="displayName"
                      type="text"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-custom-orange focus:border-custom-orange"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 px-3 py-2 rounded-md"
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-custom-orange focus:border-custom-orange"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-3">Default Address</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address
                        </label>
                        <input
                          id="address.street"
                          name="address.street"
                          type="text"
                          value={formData.address?.street || ''}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-custom-orange focus:border-custom-orange"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          id="address.city"
                          name="address.city"
                          type="text"
                          value={formData.address?.city || ''}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-custom-orange focus:border-custom-orange"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-1">
                          State / Province
                        </label>
                        <input
                          id="address.state"
                          name="address.state"
                          type="text"
                          value={formData.address?.state || ''}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-custom-orange focus:border-custom-orange"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address.zip" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP / Postal Code
                        </label>
                        <input
                          id="address.zip"
                          name="address.zip"
                          type="text"
                          value={formData.address?.zip || ''}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-custom-orange focus:border-custom-orange"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          id="address.country"
                          name="address.country"
                          type="text"
                          value={formData.address?.country || ''}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-custom-orange focus:border-custom-orange"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-custom-orange text-white px-4 py-2 rounded-md hover:bg-orange-600"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="mt-1">{userProfile.displayName || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                      <p className="mt-1">{currentUser.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                      <p className="mt-1">{userProfile.phone || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                      <p className="mt-1">
                        {userProfile.createdAt 
                          ? new Date(userProfile.createdAt).toLocaleDateString() 
                          : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-medium mb-3">Default Address</h3>
                    
                    {userProfile.address && (
                      Object.values(userProfile.address).some(val => val) ? (
                        <address className="not-italic">
                          <p>{userProfile.address.street}</p>
                          <p>
                            {userProfile.address.city}, {userProfile.address.state} {userProfile.address.zip}
                          </p>
                          <p>{userProfile.address.country}</p>
                        </address>
                      ) : (
                        <p className="text-gray-500">No address saved</p>
                      )
                    )}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-medium mb-3">Account Security</h3>
                    
                    <div className="flex space-x-4">
                      <Link 
                        to="/change-password"
                        className="text-custom-orange hover:underline"
                      >
                        Change Password
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Order History Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Order History</h2>
              
              {orderHistory.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
                  <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
                  <Link
                    to="/products"
                    className="inline-block bg-custom-orange text-white px-4 py-2 rounded-md hover:bg-orange-600"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <p className="text-sm font-medium mt-1">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={`${item.id}-${item.size}`} className="flex items-center">
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
                              <div className="ml-4">
                                <Link
                                  to={`/products/${item.id}`}
                                  className="text-sm text-custom-orange hover:underline"
                                >
                                  View Product
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                          <Link
                            to={`/order/${order.id}`}
                            className="text-custom-orange hover:underline"
                          >
                            View Order Details
                          </Link>
                          
                          <div className="flex space-x-4">
                            {order.status === 'delivered' && (
                              <Link 
                                to="/contact"
                                className="text-custom-orange hover:underline"
                              >
                                Need Help?
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Saved Addresses</h2>
              
              {!userProfile.address || !Object.values(userProfile.address).some(val => val) ? (
                <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
                  <p className="text-gray-500 mb-4">You don't have any saved addresses</p>
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setEditMode(true);
                    }}
                    className="inline-block bg-custom-orange text-white px-4 py-2 rounded-md hover:bg-orange-600"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        Default Address
                      </span>
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setEditMode(true);
                        }}
                        className="text-sm text-custom-orange hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <p className="font-medium">{userProfile.displayName}</p>
                      <address className="not-italic mt-2 text-gray-600">
                        <p>{userProfile.address.street}</p>
                        <p>
                          {userProfile.address.city}, {userProfile.address.state} {userProfile.address.zip}
                        </p>
                        <p>{userProfile.address.country}</p>
                      </address>
                      {userProfile.phone && (
                        <p className="mt-2 text-gray-600">{userProfile.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Style Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Style Preferences</h2>
              
              {!userProfile.preferences || Object.keys(userProfile.preferences).length === 0 ? (
                <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
                  <p className="text-gray-500 mb-4">You haven't set any style preferences yet</p>
                  <Link
                    to="/styling"
                    className="inline-block bg-custom-orange text-white px-4 py-2 rounded-md hover:bg-orange-600"
                  >
                    Go to Styling
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Color Preferences */}
                  <div>
                    <h3 className="text-md font-medium mb-3">Color Preferences</h3>
                    
                    {userProfile.preferences.colors && userProfile.preferences.colors.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userProfile.preferences.colors.map((color) => (
                          <div 
                            key={color} 
                            className="flex items-center"
                          >
                            <div 
                              className="w-6 h-6 rounded-full mr-2" 
                              style={{ backgroundColor: color.toLowerCase() }}
                            />
                            <span className="text-sm">{color}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No color preferences saved</p>
                    )}
                  </div>
                  
                  {/* Style Preferences */}
                  <div>
                    <h3 className="text-md font-medium mb-3">Style Preferences</h3>
                    
                    {userProfile.preferences.styles && userProfile.preferences.styles.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userProfile.preferences.styles.map((style) => (
                          <span 
                            key={style} 
                            className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm"
                          >
                            {style}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No style preferences saved</p>
                    )}
                  </div>
                  
                  {/* Brand Preferences */}
                  <div>
                    <h3 className="text-md font-medium mb-3">Brand Preferences</h3>
                    
                    {userProfile.preferences.brands && userProfile.preferences.brands.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userProfile.preferences.brands.map((brand) => (
                          <span 
                            key={brand} 
                            className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm"
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No brand preferences saved</p>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-4">
                      Your style preferences help us make better outfit recommendations for you.
                      They're automatically updated based on your interactions with our styling service.
                    </p>
                    <Link
                      to="/styling"
                      className="text-custom-orange hover:underline"
                    >
                      View your styling recommendations
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;