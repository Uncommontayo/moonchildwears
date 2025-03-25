import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, setDoc, getDoc, arrayUnion, arrayRemove, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const WishlistContext = createContext();

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load wishlist from Firestore when user logs in
  useEffect(() => {
    async function loadWishlist() {
      setLoading(true);
      
      try {
        if (currentUser) {
          // If user is logged in, get wishlist from Firestore
          const wishlistDoc = await getDoc(doc(db, 'wishlists', currentUser.uid));
          
          if (wishlistDoc.exists()) {
            setWishlist(wishlistDoc.data().items || []);
          } else {
            // If no wishlist exists in Firestore, initialize with an empty array
            setWishlist([]);
            
            // Create an empty wishlist document
            await setDoc(doc(db, 'wishlists', currentUser.uid), {
              userId: currentUser.uid,
              items: [],
              updatedAt: new Date().toISOString()
            });
          }
        } else {
          // If not logged in, set empty wishlist
          setWishlist([]);
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadWishlist();
  }, [currentUser]);

  // Add product to wishlist
  const addToWishlist = async (product) => {
    if (!currentUser) return;
    
    try {
      // Update local state
      setWishlist(prev => [...prev, product.id]);
      
      // Update Firestore
      const wishlistRef = doc(db, 'wishlists', currentUser.uid);
      await updateDoc(wishlistRef, {
        items: arrayUnion(product.id),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    if (!currentUser) return;
    
    try {
      // Update local state
      setWishlist(prev => prev.filter(id => id !== productId));
      
      // Update Firestore
      const wishlistRef = doc(db, 'wishlists', currentUser.uid);
      await updateDoc(wishlistRef, {
        items: arrayRemove(productId),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}