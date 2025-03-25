import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import stylingService from '../../services/StylingService';
import Button from '../common/Button';

const OutfitCard = ({ outfit, onLike }) => {
  const { currentUser } = useAuth();
  const [liked, setLiked] = useState(false);
  
  const handleLike = async () => {
    if (!currentUser) return;
    
    try {
      await stylingService.recordOutfitInteraction(currentUser.uid, outfit.id, 'liked');
      setLiked(true);
      if (onLike) onLike(outfit.id);
    } catch (err) {
      console.error('Error liking outfit:', err);
    }
  };
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{outfit.name}</h3>
          <button 
            onClick={handleLike}
            className={`text-gray-500 hover:text-custom-orange transition-colors ${liked ? 'text-custom-orange' : ''}`}
            title={liked ? 'Saved to favorites' : 'Save to favorites'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill={liked ? 'currentColor' : 'none'} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={liked ? 1 : 2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-600">{outfit.description}</p>
      </div>
      
      <div className="p-4 flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {outfit.products.map((product) => (
            <div key={product.id} className="flex">
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={product.images && product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-4 flex-grow">
                <h4 className="text-sm font-medium">{product.name}</h4>
                <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                <Link 
                  to={`/products/${product.id}`}
                  className="text-xs text-custom-orange hover:underline mt-1 inline-block"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {outfit.products.map(product => product.category).filter((value, index, self) => self.indexOf(value) === index).map(category => (
            <span key={category} className="inline-block bg-gray-100 text-xs px-2 py-1 rounded-full">
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutfitCard;