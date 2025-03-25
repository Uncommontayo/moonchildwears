import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';
import Loader from '../common/Loader';

const ProductList = () => {
  const { products = [], categories = [], loading, error } = useProducts();
  const [searchParams] = useSearchParams();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [searchParams]);

  useEffect(() => {
    if (!products.length) {
      setFilteredProducts([]);
      return;
    }

    let result = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = selectedCategory === 'new'
        ? result.filter(p => p.isNew)
        : result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Price filter
    if (selectedPrice) {
      const [min, max] = selectedPrice.split('-').map(Number);
      result = result.filter(p => {
        const price = p.discountPercentage
          ? p.price * (1 - p.discountPercentage / 100)
          : p.price;
        return max ? price >= min && price <= max : price >= min;
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'price-low-high': {
          const priceA = a.discountPercentage ? a.price * (1 - a.discountPercentage / 100) : a.price;
          const priceB = b.discountPercentage ? b.price * (1 - b.discountPercentage / 100) : b.price;
          return priceA - priceB;
        }
        case 'price-high-low': {
          const priceA = a.discountPercentage ? a.price * (1 - a.discountPercentage / 100) : a.price;
          const priceB = b.discountPercentage ? b.price * (1 - b.discountPercentage / 100) : b.price;
          return priceB - priceA;
        }
        case 'name-a-z': return a.name.localeCompare(b.name);
        case 'name-z-a': return b.name.localeCompare(a.name);
        case 'newest':
        default:
          if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
          return b.id.localeCompare(a.id);
      }
    });

    setFilteredProducts(result);
  }, [products, selectedCategory, selectedPrice, sortOption]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: {error}</p>
        <button className="mt-4 bg-black text-white px-4 py-2" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilter
            categories={[ 'all', 'new', ...categories ]}
            selectedCategory={selectedCategory}
            selectedPrice={selectedPrice}
            sortOption={sortOption}
            onCategoryChange={setSelectedCategory}
            onPriceChange={setSelectedPrice}
            onSortChange={setSortOption}
          />
        </div>

        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500">No products found matching your criteria.</p>
              <button
                className="mt-4 border border-black px-4 py-2 hover:bg-black hover:text-white transition"
                onClick={() => { setSelectedCategory(''); setSelectedPrice(''); setSortOption('newest'); }}
              >Clear All Filters</button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
