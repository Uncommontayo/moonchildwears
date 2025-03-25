import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const ProductContext = createContext();

export function useProducts() {
  return useContext(ProductContext);
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(productList.map(product => product.category))];
      setCategories(uniqueCategories);
      
      setError(null);
      return productList;
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (productId) => {
    try {
      // First check if we already have the product in state
      const existingProduct = products.find(p => p.id === productId);
      if (existingProduct) return existingProduct;
      
      // Otherwise fetch from Firestore
      const productDoc = await getDoc(doc(db, 'products', productId));
      if (productDoc.exists()) {
        return { id: productDoc.id, ...productDoc.data() };
      } else {
        throw new Error('Product not found');
      }
    } catch (err) {
      console.error('Error getting product:', err);
      throw err;
    }
  };

  const getProductsByCategory = async (category) => {
    try {
      // First check if we can filter from existing products
      if (products.length > 0) {
        return products.filter(p => p.category === category);
      }
      
      // Otherwise fetch from Firestore
      const productsCollection = collection(db, 'products');
      const q = query(productsCollection, where('category', '==', category));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      console.error('Error getting products by category:', err);
      throw err;
    }
  };

  // Get related products based on category or other attributes
  const getRelatedProducts = (product, limit = 4) => {
    if (!product || products.length === 0) return [];
    
    return products
      .filter(p => p.id !== product.id && p.category === product.category)
      .slice(0, limit);
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    getProductById,
    getProductsByCategory,
    getRelatedProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}