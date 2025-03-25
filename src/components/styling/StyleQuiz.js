import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const StyleQuiz = () => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    stylePreferences: [],
    colorPreferences: [],
    fitPreferences: [],
    occasionPreferences: [],
    avoidPreferences: []
  });
  
  // Style options
  const styleOptions = [
    { id: 'casual', label: 'Casual', image: '/images/styles/casual.jpg' },
    { id: 'formal', label: 'Formal', image: '/images/styles/formal.jpg' },
    { id: 'bohemian', label: 'Bohemian', image: '/images/styles/bohemian.jpg' },
    { id: 'streetwear', label: 'Streetwear', image: '/images/styles/streetwear.jpg' },
    { id: 'vintage', label: 'Vintage', image: '/images/styles/vintage.jpg' },
    { id: 'minimalist', label: 'Minimalist', image: '/images/styles/minimalist.jpg' },
    { id: 'elegant', label: 'Elegant', image: '/images/styles/elegant.jpg' },
    { id: 'athleisure', label: 'Athleisure', image: '/images/styles/athleisure.jpg' }
  ];
  
  // Color options
  const colorOptions = [
    { id: 'black', label: 'Black', color: '#000000' },
    { id: 'white', label: 'White', color: '#FFFFFF' },
    { id: 'gray', label: 'Gray', color: '#808080' },
    { id: 'navy', label: 'Navy', color: '#000080' },
    { id: 'blue', label: 'Blue', color: '#0000FF' },
    { id: 'green', label: 'Green', color: '#008000' },
    { id: 'red', label: 'Red', color: '#FF0000' },
    { id: 'pink', label: 'Pink', color: '#FFC0CB' },
    { id: 'purple', label: 'Purple', color: '#800080' },
    { id: 'yellow', label: 'Yellow', color: '#FFFF00' },
    { id: 'orange', label: 'Orange', color: '#FFA500' },
    { id: 'brown', label: 'Brown', color: '#8B4513' },
    { id: 'custom-orange', label: 'MOONCHILD Orange', color: '#a95109' }
  ];
  
  // Fit preferences
  const fitOptions = [
    { id: 'slim', label: 'Slim Fit' },
    { id: 'regular', label: 'Regular Fit' },
    { id: 'loose', label: 'Loose Fit' },
    { id: 'oversized', label: 'Oversized' }
  ];
  
  // Occasion preferences
  const occasionOptions = [
    { id: 'everyday', label: 'Everyday Wear' },
    { id: 'work', label: 'Work / Office' },
    { id: 'night-out', label: 'Night Out' },
    { id: 'special-event', label: 'Special Events' },
    { id: 'active', label: 'Active / Sports' }
  ];
  
  // Items to avoid
  const avoidOptions = [
    { id: 'crop-tops', label: 'Crop Tops' },
    { id: 'skinny-jeans', label: 'Skinny Jeans' },
    { id: 'graphic-tees', label: 'Graphic Tees' },
    { id: 'bodycon', label: 'Bodycon Styles' },
    { id: 'neon', label: 'Neon Colors' },
    { id: 'floral', label: 'Floral Prints' },
    { id: 'animal-print', label: 'Animal Prints' },
    { id: 'ripped', label: 'Ripped/Distressed' }
  ];
  
  const handleMultiSelect = (category, itemId) => {
    setFormData(prev => {
      const currentItems = prev[category];
      
      if (currentItems.includes(itemId)) {
        // Remove item if already selected
        return {
          ...prev,
          [category]: currentItems.filter(id => id !== itemId)
        };
      } else {
        // Add item if not already selected
        return {
          ...prev,
          [category]: [...currentItems, itemId]
        };
      }
    });
  };
  
  const handleNextStep = () => {
    setStep(prev => prev + 1);
  };
  
  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };
  
  const handleSubmit = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/styling' } });
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Map the style preferences to the format expected by the styling engine
      const preferences = {
        styles: formData.stylePreferences,
        colors: formData.colorPreferences,
        fits: formData.fitPreferences,
        occasions: formData.occasionPreferences,
        avoid: formData.avoidPreferences
      };
      
      // Update user profile with new preferences
      await updateUserProfile({
        preferences,
        updatedAt: new Date().toISOString()
      });
      
      // Navigate to styling recommendations
      navigate('/styling');
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save your preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Personal Style Quiz</h1>
        <p className="text-gray-600">
          Answer a few questions to help us understand your style preferences
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Step {step} of 5</span>
          <span className="text-sm text-gray-500">{step * 20}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-custom-orange h-2.5 rounded-full"
            style={{ width: `${step * 20}%` }}
          ></div>
        </div>
      </div>
      
      {/* Step 1: Style Preferences */}
      {step === 1 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Which styles do you prefer?</h2>
          <p className="text-gray-600 mb-6">
            Select all that appeal to you. These will help us curate your recommendations.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {styleOptions.map(style => (
              <div
                key={style.id}
                onClick={() => handleMultiSelect('stylePreferences', style.id)}
                className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all 
                  ${formData.stylePreferences.includes(style.id) 
                    ? 'border-custom-orange ring-2 ring-custom-orange' 
                    : 'border-transparent hover:border-gray-300'}`}
              >
                <div className="aspect-w-1 aspect-h-1 w-full">
                  <img
                    src={style.image || `/images/placeholder.jpg`}
                    alt={style.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 text-center">
                  <span className="text-sm font-medium">{style.label}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleNextStep}
              disabled={formData.stylePreferences.length === 0}
              className="px-6"
            >
              Next
            </Button>
          </div>
        </div>
      )}
      
      {/* Step 2: Color Preferences */}
      {step === 2 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">What colors do you prefer to wear?</h2>
          <p className="text-gray-600 mb-6">
            Select all colors you enjoy wearing regularly.
          </p>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {colorOptions.map(color => (
              <div
                key={color.id}
                onClick={() => handleMultiSelect('colorPreferences', color.id)}
                    className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all
                      ${formData.colorPreferences.includes(color.id) 
                        ? 'border-custom-orange ring-2 ring-custom-orange' 
                        : 'border-transparent hover:border-gray-300'}`}
                  >
                    <div 
                      className="aspect-w-1 aspect-h-1 w-full"
                      style={{ backgroundColor: color.color }}
                    >
                      <div className="flex items-center justify-center h-full">
                        {formData.colorPreferences.includes(color.id) && (
                          <svg 
                            className={`h-6 w-6 ${['white', 'yellow'].includes(color.id) ? 'text-black' : 'text-white'}`} 
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
                        )}
                      </div>
                    </div>
                    <div className="p-2 text-center bg-white">
                      <span className="text-sm font-medium">{color.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-between">
                <Button
                  variant="secondary"
                  onClick={handlePrevStep}
                  className="px-6"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={formData.colorPreferences.length === 0}
                  className="px-6"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 3: Fit Preferences */}
          {step === 3 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">What fits do you prefer?</h2>
              <p className="text-gray-600 mb-6">
                Select all that you find comfortable and flattering.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {fitOptions.map(fit => (
                  <div
                    key={fit.id}
                    onClick={() => handleMultiSelect('fitPreferences', fit.id)}
                    className={`cursor-pointer rounded-md p-4 border-2 transition-all
                      ${formData.fitPreferences.includes(fit.id) 
                        ? 'border-custom-orange bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center mr-3
                        ${formData.fitPreferences.includes(fit.id) ? 'bg-custom-orange border-custom-orange' : ''}`}
                      >
                        {formData.fitPreferences.includes(fit.id) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium">{fit.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-between">
                <Button
                  variant="secondary"
                  onClick={handlePrevStep}
                  className="px-6"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={formData.fitPreferences.length === 0}
                  className="px-6"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 4: Occasion Preferences */}
          {step === 4 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">What occasions do you shop for?</h2>
              <p className="text-gray-600 mb-6">
                Select all the occasions you'd like to receive styling recommendations for.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {occasionOptions.map(occasion => (
                  <div
                    key={occasion.id}
                    onClick={() => handleMultiSelect('occasionPreferences', occasion.id)}
                    className={`cursor-pointer rounded-md p-4 border-2 transition-all
                      ${formData.occasionPreferences.includes(occasion.id) 
                        ? 'border-custom-orange bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center mr-3
                        ${formData.occasionPreferences.includes(occasion.id) ? 'bg-custom-orange border-custom-orange' : ''}`}
                      >
                        {formData.occasionPreferences.includes(occasion.id) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium">{occasion.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-between">
                <Button
                  variant="secondary"
                  onClick={handlePrevStep}
                  className="px-6"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={formData.occasionPreferences.length === 0}
                  className="px-6"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 5: Items to Avoid */}
          {step === 5 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Any styles you prefer to avoid?</h2>
              <p className="text-gray-600 mb-6">
                Select any items or styles you'd prefer not to see in your recommendations.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {avoidOptions.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleMultiSelect('avoidPreferences', item.id)}
                    className={`cursor-pointer rounded-md p-4 border-2 transition-all
                      ${formData.avoidPreferences.includes(item.id) 
                        ? 'border-custom-orange bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center mr-3
                        ${formData.avoidPreferences.includes(item.id) ? 'bg-custom-orange border-custom-orange' : ''}`}
                      >
                        {formData.avoidPreferences.includes(item.id) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-between">
                <Button
                  variant="secondary"
                  onClick={handlePrevStep}
                  className="px-6"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6"
                >
                  Complete Quiz
                </Button>
              </div>
            </div>
          )}
    </div>
  );
};

export default StyleQuiz;