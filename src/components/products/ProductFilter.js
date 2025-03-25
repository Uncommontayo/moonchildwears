import React, { useState } from 'react';

const ProductFilter = ({
  categories,
  selectedCategory,
  selectedPrice,
  sortOption,
  onCategoryChange,
  onPriceChange,
  onSortChange
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Price range options
  const priceRanges = [
    { value: '', label: 'All Prices' },
    { value: '0-50', label: 'Under $50' },
    { value: '50-100', label: '$50 to $100' },
    { value: '100-200', label: '$100 to $200' },
    { value: '200-', label: '$200 & Above' }
  ];
  
  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'name-a-z', label: 'Name: A to Z' },
    { value: 'name-z-a', label: 'Name: Z to A' }
  ];
  
  // Format category name for display
  const formatCategoryName = (category) => {
    if (!category) return 'All Products';
    
    if (category === 'all') return 'All Products';
    if (category === 'new') return 'New Arrivals';
    
    // Capitalize first letter
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  return (
    <div className="space-y-6">
      {/* Mobile filter dialog toggle */}
      <div className="lg:hidden">
        <button
          type="button"
          className="w-full flex items-center justify-between bg-black text-white px-4 py-2"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <span>Filters & Sorting</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            {showMobileFilters ? (
              <path
                fillRule="evenodd"
                d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V3.75A.75.75 0 0110 3z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </button>
      </div>
      
      {/* Filters - Responsive */}
      <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
        {/* Categories */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <input
                  id={`category-${category}`}
                  name="category"
                  type="radio"
                  checked={selectedCategory === category}
                  onChange={() => onCategoryChange(category)}
                  className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                />
                <label
                  htmlFor={`category-${category}`}
                  className="ml-3 text-sm text-gray-600 cursor-pointer"
                >
                  {formatCategoryName(category)}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Price ranges */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Price</h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <div key={range.value} className="flex items-center">
                <input
                  id={`price-${range.value}`}
                  name="price"
                  type="radio"
                  checked={selectedPrice === range.value}
                  onChange={() => onPriceChange(range.value)}
                  className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                />
                <label
                  htmlFor={`price-${range.value}`}
                  className="ml-3 text-sm text-gray-600 cursor-pointer"
                >
                  {range.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sort options */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-black focus:outline-none focus:ring-black"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Clear filters button */}
        <div>
          <button
            type="button"
            onClick={() => {
              onCategoryChange('');
              onPriceChange('');
              onSortChange('newest');
            }}
            className="text-sm text-gray-500 hover:text-black underline"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;