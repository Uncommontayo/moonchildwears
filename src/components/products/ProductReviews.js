import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import Loader from '../common/Loader';

const ProductReviews = ({ productId }) => {
  const { currentUser, userProfile } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: '',
    content: '',
  });
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsQuery = query(
          collection(db, 'reviews'),
          where('productId', '==', productId)
        );
        
        const querySnapshot = await getDocs(reviewsQuery);
        const reviewsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort by date (newest first)
        reviewsList.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        setReviews(reviewsList);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Unable to load reviews');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [productId]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };
  
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const newReview = {
        productId,
        userId: currentUser.uid,
        userName: userProfile?.displayName || 'Anonymous',
        title: reviewData.title,
        content: reviewData.content,
        rating: reviewData.rating,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'reviews'), newReview);
      
      // Add to local state 
      setReviews([
        {
          id: docRef.id,
          ...newReview,
          createdAt: new Date().toISOString() // For immediate display
        },
        ...reviews
      ]);
      
      // Reset form
      setReviewData({
        rating: 5,
        title: '',
        content: '',
      });
      
      setShowReviewForm(false);
    } catch (err) {
      console.error('Error adding review:', err);
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };
  
  const StarRating = ({ rating }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };
  
  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Customer Reviews</h2>
        {currentUser && !showReviewForm && (
          <Button 
            onClick={() => setShowReviewForm(true)}
            variant="secondary"
          >
            Write a Review
          </Button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Review summary */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          <div className="text-4xl font-bold mr-4">{calculateAverageRating()}</div>
          <div>
            <StarRating rating={Math.round(parseFloat(calculateAverageRating()))} />
            <p className="text-sm text-gray-500 mt-1">{reviews.length} reviews</p>
          </div>
        </div>
      </div>
      
      {/* Review form */}
      {showReviewForm && (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Write a Review</h3>
            <button 
              onClick={() => setShowReviewForm(false)}
              className="text-gray-500 hover:text-custom-orange"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`h-8 w-8 ${
                        star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Review Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={reviewData.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-custom-orange focus:border-custom-orange"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Review Content
              </label>
              <textarea
                id="content"
                name="content"
                value={reviewData.content}
                onChange={handleInputChange}
                rows="4"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-custom-orange focus:border-custom-orange"
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="secondary" 
                className="mr-2"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {/* Review list */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
          <p className="text-gray-500 mb-4">No reviews yet</p>
          {currentUser ? (
            <Button onClick={() => setShowReviewForm(true)}>
              Be the first to review
            </Button>
          ) : (
            <Button as="a" href="/login">
              Sign in to write a review
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{review.title}</h3>
                  <div className="flex items-center mt-1">
                    <StarRating rating={review.rating} />
                    <span className="ml-2 text-sm text-gray-500">
                      {review.userName}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="mt-3 text-gray-600">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;