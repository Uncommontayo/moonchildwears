import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { products } = useProducts();
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length >= 2) {
      // Simple search algorithm (case-insensitive)
      const results = products.filter(product => 
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.description.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase())
      ).slice(0, 5); // Limit to top 5 results
      
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };
  
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
    setShowResults(false);
    setSearchTerm('');
  };
  
  const handleBlur = () => {
    // Delay closing the results to allow for clicking
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };
  
  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
          onBlur={handleBlur}
          className="px-4 py-2 w-full focus:outline-none"
        />
        <button 
          className="bg-custom-orange text-white p-2"
          onClick={() => navigate(`/products?search=${searchTerm}`)}
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </button>
      </div>
      
      {/* Search results dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <ul>
            {searchResults.map(product => (
              <li 
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
              >
                <div className="w-10 h-10 flex-shrink-0">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <div className="ml-auto font-medium text-sm">
                  ${product.price.toFixed(2)}
                </div>
              </li>
            ))}
            <li className="p-2 text-center">
              <button 
                onClick={() => navigate(`/products?search=${searchTerm}`)}
                className="text-custom-orange text-sm hover:underline"
              >
                View all results
              </button>
            </li>
          </ul>
        </div>
      )}
      
      {showResults && searchResults.length === 0 && searchTerm.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-center">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;