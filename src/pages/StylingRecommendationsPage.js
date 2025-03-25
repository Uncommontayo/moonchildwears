import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import stylingService from '../services/StylingService';
import OutfitCard from '../components/styling/OutfitCard';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const StylingRecommendationsPage = () => {
  const { currentUser, userProfile } = useAuth();
  const { getProductById } = useProducts();
  const [searchParams] = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [baseProduct, setBaseProduct] = useState(null);
  const [outfits, setOutfits] = useState([]);
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  // Get product ID from URL parameters or select the first purchased product
  useEffect(() => {
    const productIdParam = searchParams.get('productId');
    
    if (productIdParam) {
      setSelectedProductId(productIdParam);
    } else if (userProfile?.purchaseHistory?.length > 0) {
      // Get unique product IDs from purchase history
      const uniqueProductIds = [...new Set(
        userProfile.purchaseHistory.map(item => item.productId)
      )];
      
      if (uniqueProductIds.length > 0) {
        setSelectedProductId(uniqueProductIds[0]);
      }
    }
  }, [searchParams, userProfile]);
  
  // Load purchased products for selection
  useEffect(() => {
    const loadPurchasedProducts = async () => {
      if (!userProfile?.purchaseHistory?.length) return;
      
      try {
        // Get unique product IDs from purchase history
        const uniqueProductIds = [...new Set(
          userProfile.purchaseHistory.map(item => item.productId)
        )];
        
        // Fetch product details for each purchased product
        const productPromises = uniqueProductIds.map(id => getProductById(id));
        const purchasedProductsData = await Promise.all(productPromises);
        
        setPurchasedProducts(purchasedProductsData);
      } catch (err) {
        console.error('Error loading purchased products:', err);
        setError('Failed to load your purchased products. Please try again later.');
      }
    };
    
    loadPurchasedProducts();
  }, [userProfile, getProductById]);
  
  // Load styling recommendations when selectedProductId changes
  useEffect(() => {
    const loadRecommendations = async () => {
      if (!selectedProductId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Get product details
        const product = await getProductById(selectedProductId);
        setBaseProduct(product);
        
        // Get outfit recommendations
        const outfitRecommendations = await stylingService.getOutfitRecommendations(
          selectedProductId, 
          userProfile
        );
        
        setOutfits(outfitRecommendations);
        
        // Record that the user viewed these recommendations
        if (currentUser) {
          await stylingService.recordOutfitInteraction(
            currentUser.uid,
            outfitRecommendations[0]?.id,
            'viewed'
          );
        }
      } catch (err) {
        console.error('Error loading recommendations:', err);
        setError('Failed to load styling recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadRecommendations();
  }, [selectedProductId, getProductById, currentUser, userProfile]);
  
  // Handle when a user likes a styling recommendation
  const handleLikeOutfit = async (outfitId) => {
    if (!currentUser) return;
    
    try {
      await stylingService.recordOutfitInteraction(
        currentUser.uid,
        outfitId,
        'liked'
      );
      
      // You could update UI to show the outfit is liked
    } catch (err) {
      console.error('Error liking outfit:', err);
    }
  };
  
  // Content for users with no purchase history
  const renderNoPurchasesContent = () => (
    <div className="text-center py-10">
      <h2 className="text-2xl font-semibold mb-4">No Purchases Yet</h2>
      <p className="mb-6 text-gray-600 max-w-lg mx-auto">
        To get personalized styling recommendations, you need to make a purchase first.
        Browse our collection and find something you love!
      </p>
      <Button as={Link} to="/products">
        Shop Now
      </Button>
    </div>
  );
  
  // If user is viewing a specific product but hasn't purchased it
  const renderNonPurchasedProductRecommendations = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Styling Recommendations</h1>
        <p className="text-gray-600">
          Here's how you can style the {baseProduct.name}.
          {!userProfile?.purchaseHistory?.length && 
            " Purchase this item to save these recommendations to your profile!"}
        </p>
      </div>
      
      {renderOutfits()}
      
      <div className="mt-10 text-center">
        <h3 className="text-xl font-medium mb-3">Want to discover your style?</h3>
        <p className="text-gray-600 mb-4">
          Take our style quiz to get even more personalized recommendations.
        </p>
        <Button as={Link} to="/style-quiz" variant="secondary">
          Take Style Quiz
        </Button>
      </div>
    </div>
  );
  
  // Render the outfits grid
  const renderOutfits = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {outfits.map((outfit) => (
        <OutfitCard 
          key={outfit.id || outfit.name}
          outfit={outfit}
          onLike={handleLikeOutfit}
        />
      ))}
    </div>
  );
  
  // Main content for users with purchase history
  const renderUserRecommendations = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Your Styling Recommendations</h1>
        <p className="text-gray-600 mb-6">
          Get personalized outfit ideas based on your MOONCHILD purchases.
        </p>
        
        {/* Product selection dropdown */}
        <div className="mb-8">
          <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select an item to style:
          </label>
          <select
            id="product-select"
            value={selectedProductId || ''}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="block w-full max-w-md border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-custom-orange focus:border-custom-orange"
          >
            <option value="">Select a product</option>
            {purchasedProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {selectedProductId && renderOutfits()}
      
      <div className="mt-10 text-center">
        <h3 className="text-xl font-medium mb-3">Refine Your Recommendations</h3>
        <p className="text-gray-600 mb-4">
          Update your style preferences to get more personalized outfit suggestions.
        </p>
        <Button as={Link} to="/style-quiz" variant="secondary">
          Update Style Preferences
        </Button>
      </div>
    </div>
  );
  
  if (loading) {
    return <Loader />;
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button 
          className="mt-4 bg-custom-orange text-white px-4 py-2 rounded"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // If user has no purchase history but is viewing a specific product
  if ((!userProfile?.purchaseHistory?.length || purchasedProducts.length === 0) && baseProduct) {
    return renderNonPurchasedProductRecommendations();
  }
  
  // If user has no purchase history and no specific product
  if (!userProfile?.purchaseHistory?.length || purchasedProducts.length === 0) {
    return renderNoPurchasesContent();
  }
  
  // User has purchase history
  return renderUserRecommendations();
};

export default StylingRecommendationsPage;