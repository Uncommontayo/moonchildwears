import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  // Calculate total number of items in cart
  const itemCount = cart.reduce((count, item) => {
    return count + item.quantity;
  }, 0);

  // Load cart from local storage or Firestore when component mounts
  useEffect(() => {
    async function loadCart() {
      setLoading(true);
      
      try {
        if (currentUser) {
          // If user is logged in, get cart from Firestore
          const cartDoc = await getDoc(doc(db, 'carts', currentUser.uid));
          
          if (cartDoc.exists()) {
            setCart(cartDoc.data().items || []);
          } else {
            // If no cart exists in Firestore, initialize with local storage or empty array
            const localCart = localStorage.getItem('moonchild_cart');
            
            if (localCart) {
              const parsedCart = JSON.parse(localCart);
              setCart(parsedCart);
              
              // Save local cart to Firestore
              await setDoc(doc(db, 'carts', currentUser.uid), {
                userId: currentUser.uid,
                items: parsedCart,
                updatedAt: new Date().toISOString()
              });
            } else {
              setCart([]);
            }
          }
        } else {
          // If not logged in, load from local storage
          const localCart = localStorage.getItem('moonchild_cart');
          
          if (localCart) {
            setCart(JSON.parse(localCart));
          } else {
            setCart([]);
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        
        // Fallback to local storage if error
        const localCart = localStorage.getItem('moonchild_cart');
        
        if (localCart) {
          setCart(JSON.parse(localCart));
        } else {
          setCart([]);
        }
      } finally {
        setLoading(false);
      }
    }
    
    loadCart();
  }, [currentUser]);

  // Save cart whenever it changes
  useEffect(() => {
    if (loading) return;
    
    // Save to local storage regardless of auth status
    localStorage.setItem('moonchild_cart', JSON.stringify(cart));
    
    // If logged in, also save to Firestore
    async function saveToFirestore() {
      if (currentUser) {
        try {
          await setDoc(doc(db, 'carts', currentUser.uid), {
            userId: currentUser.uid,
            items: cart,
            updatedAt: new Date().toISOString()
          });
        } catch (error) {
          console.error('Error saving cart to Firestore:', error);
        }
      }
    }
    
    saveToFirestore();
  }, [cart, currentUser, loading]);

  // Add item to cart
  const addToCart = (product, quantity = 1, size = 'M', color = null) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.id === product.id && item.size === size && 
        (color === null || item.color === color)
      );
      
      if (existingItem) {
        // Update quantity of existing item
        return prevCart.map(item =>
          item.id === product.id && item.size === size && 
          (color === null || item.color === color)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevCart, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          size,
          color,
          quantity
        }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId, size, color) => {
    setCart(prevCart => 
      prevCart.filter(item => 
        !(item.id === itemId && item.size === size && 
          (color === null || item.color === color))
      )
    );
  };

  // Update item quantity
  const updateQuantity = (itemId, size, color, quantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId && item.size === size && 
        (color === null || item.color === color)
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    loading,
    cartTotal,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}