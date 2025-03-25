import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import StylingRecommendationsPage from './pages/StylingRecommendationsPage';
import StyleQuizPage from './pages/StyleQuizPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import PrivateRoute from './components/auth/PrivateRoute';
import { WishlistProvider } from './context/WishlistContext';
import WishlistPage from './pages/WishlistPage';
import ContactPage from './pages/ContactPage';
import initializeFirebase from './utils/initializeFirebase';
import NotFoundPage from './pages/NotFoundPage';
import FAQPage from './pages/FAQPage';
import './styles/global.css';

function App() {
  useEffect(() => {
    // Initialize sample data in Firebase if needed
    const initData = async () => {
      try {
        await initializeFirebase();
      } catch (error) {
        console.error('Error initializing Firebase data:', error);
      }
    };
    
    initData();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                    <Route path="/styling" element={<StylingRecommendationsPage />} />
                    <Route path="/style-quiz" element={<StyleQuizPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
                    <Route path="/order-confirmation/:orderId" element={<PrivateRoute><OrderConfirmationPage /></PrivateRoute>} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;