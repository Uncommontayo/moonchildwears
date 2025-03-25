import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-9xl font-bold text-custom-orange mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          We're sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-3">
          <Button as={Link} to="/" className="w-full">
            Return to Home
          </Button>
          <Button as={Link} to="/products" variant="secondary" className="w-full">
            Explore Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;