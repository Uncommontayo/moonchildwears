import React from 'react';
import ProductList from '../components/products/ProductList';

const ProductsPage = () => {
  return (
    <div className="py-10">
      <div className="container mx-auto px-4 mb-8">
        <h1 className="text-3xl font-bold">Shop All Products</h1>
      </div>
      <ProductList />
    </div>
  );
};

export default ProductsPage;