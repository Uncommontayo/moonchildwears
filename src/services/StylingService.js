import { collection, getDocs, query, where, getDoc, doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

class StylingService {
  // Generate outfit recommendations based on a purchased product
  async getOutfitRecommendations(productId, userProfile = null) {
    try {
      // Get the base product first
      const productDoc = await getDoc(doc(db, 'products', productId));
      
      if (!productDoc.exists()) {
        throw new Error('Product not found');
      }
      
      const baseProduct = { id: productDoc.id, ...productDoc.data() };
      
      // Get pre-defined outfits that include this product
      const outfitsCollection = collection(db, 'outfits');
      const outfitsQuery = query(outfitsCollection, where('productIds', 'array-contains', productId));
      const outfitDocs = await getDocs(outfitsQuery);
      
      const outfits = [];
      
      for (const outfitDoc of outfitDocs.docs) {
        const outfit = { id: outfitDoc.id, ...outfitDoc.data() };
        
        // For each outfit, fetch the full product details
        const outfitProducts = await Promise.all(
          outfit.productIds.map(async (id) => {
            if (id === productId) return baseProduct;
            
            const prodDoc = await getDoc(doc(db, 'products', id));
            if (prodDoc.exists()) {
              return { id: prodDoc.id, ...prodDoc.data() };
            }
            return null;
          })
        );
        
        outfits.push({
          ...outfit,
          products: outfitProducts.filter(p => p !== null)
        });
      }
      
      // If there are no pre-defined outfits, generate recommendations algorithmically
      if (outfits.length === 0) {
        const algorithmicOutfits = await this.generateAlgorithmicOutfits(baseProduct, userProfile);
        return algorithmicOutfits;
      }
      
      return outfits;
    } catch (error) {
      console.error('Error getting outfit recommendations:', error);
      throw error;
    }
  }
  
  // Generate algorithmic outfits when no pre-defined outfits exist
  async generateAlgorithmicOutfits(baseProduct, userProfile) {
    try {
      // Start with an empty outfit containing just the base product
      const outfit = {
        name: `${baseProduct.name} Outfit`,
        description: `Styled outfit featuring the ${baseProduct.name}`,
        products: [baseProduct],
        productIds: [baseProduct.id]
      };
      
      // Determine what additional items are needed based on the product type
      const neededCategories = this.determineNeededCategories(baseProduct.category);
      
      // Query for products in the needed categories
      const productsCollection = collection(db, 'products');
      
      for (const category of neededCategories) {
        const q = query(
          productsCollection, 
          where('category', '==', category)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // Filter products to find compatible items
          const compatibleProducts = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(product => this.isCompatible(baseProduct, product));
          
          // If user profile exists, sort by preference
          let selectedProducts = compatibleProducts;
          
          if (userProfile && userProfile.preferences) {
            selectedProducts = this.sortByUserPreference(compatibleProducts, userProfile.preferences);
          }
          
          // Add the best match to the outfit
          if (selectedProducts.length > 0) {
            outfit.products.push(selectedProducts[0]);
            outfit.productIds.push(selectedProducts[0].id);
          }
        }
      }
      
      // Save this generated outfit to Firestore for future use
      if (outfit.products.length > 1) {
        const outfitRef = doc(collection(db, 'outfits'));
        await setDoc(outfitRef, {
          name: outfit.name,
          description: outfit.description,
          productIds: outfit.productIds,
          createdAt: new Date().toISOString(),
          isAlgorithmic: true
        });
        
        outfit.id = outfitRef.id;
      }
      
      return [outfit];
    } catch (error) {
      console.error('Error generating algorithmic outfits:', error);
      return [{
        name: `${baseProduct.name} Style`,
        description: 'Basic style recommendation',
        products: [baseProduct],
        productIds: [baseProduct.id]
      }];
    }
  }
  
  // Determine what categories of items are needed to complete an outfit based on base item
  determineNeededCategories(baseCategory) {
    switch (baseCategory.toLowerCase()) {
      case 'tops':
      case 'shirts':
      case 'blouses':
        return ['pants', 'jeans', 'skirts', 'shoes', 'accessories'];
      
      case 'pants':
      case 'jeans':
      case 'shorts':
        return ['tops', 'shirts', 'shoes', 'accessories'];
      
      case 'dresses':
        return ['shoes', 'accessories', 'outerwear'];
      
      case 'skirts':
        return ['tops', 'blouses', 'shoes', 'accessories'];
      
      case 'outerwear':
      case 'jackets':
      case 'coats':
        return ['tops', 'pants', 'jeans', 'dresses', 'shoes'];
      
      case 'shoes':
        return ['tops', 'pants', 'jeans', 'dresses', 'skirts'];
      
      case 'accessories':
        return ['tops', 'dresses', 'outerwear'];
      
      default:
        return ['tops', 'pants', 'shoes', 'accessories'];
    }
  }
  
  // Check if two products are compatible for styling
  isCompatible(product1, product2) {
    // Basic compatibility: different categories
    if (product1.category.toLowerCase() === product2.category.toLowerCase()) {
      return false;
    }
    
    // Style compatibility - check if styles match or complement
    if (product1.style && product2.style) {
      // Direct style match
      if (product1.style === product2.style) {
        return true;
      }
      
      // Compatible style combinations
      const compatibleStyles = {
        'casual': ['bohemian', 'vintage', 'streetwear'],
        'formal': ['business', 'classic', 'elegant'],
        'bohemian': ['casual', 'vintage'],
        'streetwear': ['casual', 'urban'],
        'business': ['formal', 'classic'],
        'classic': ['formal', 'elegant', 'business'],
        'elegant': ['formal', 'classic'],
        'vintage': ['bohemian', 'casual']
      };
      
      if (
        compatibleStyles[product1.style] && 
        compatibleStyles[product1.style].includes(product2.style)
      ) {
        return true;
      }
    }
    
    // Color compatibility - simplified version
    if (product1.color && product2.color) {
      // Neutral colors go with everything
      const neutralColors = ['black', 'white', 'gray', 'beige', 'navy'];
      
      if (
        neutralColors.includes(product1.color.toLowerCase()) || 
        neutralColors.includes(product2.color.toLowerCase())
      ) {
        return true;
      }
      
      // Basic color matching rules
      const complementaryColors = {
        'red': ['green', 'blue', 'black', 'white'],
        'blue': ['orange', 'yellow', 'white', 'red'],
        'green': ['red', 'purple', 'white', 'black'],
        'purple': ['yellow', 'green', 'white'],
        'yellow': ['purple', 'blue', 'black'],
        'orange': ['blue', 'black', 'white'],
        'pink': ['navy', 'gray', 'black', 'white'],
        'custom-orange': ['blue', 'black', 'white', 'beige']
      };
      
      if (
        (complementaryColors[product1.color?.toLowerCase()] && 
         complementaryColors[product1.color?.toLowerCase()].includes(product2.color?.toLowerCase())) ||
        (complementaryColors[product2.color?.toLowerCase()] && 
         complementaryColors[product2.color?.toLowerCase()].includes(product1.color?.toLowerCase()))
      ) {
        return true;
      }
    }
    
    // Default to compatible if no specific rules are violated
    return true;
  }
  
  // Sort products by user preference
  sortByUserPreference(products, preferences) {
    return [...products].sort((a, b) => {
      let aScore = 0;
      let bScore = 0;
      
      // Check color preferences
      if (preferences.colors && preferences.colors.includes(a.color)) {
        aScore += 2;
      }
      if (preferences.colors && preferences.colors.includes(b.color)) {
        bScore += 2;
      }
      
      // Check style preferences
      if (preferences.styles && preferences.styles.includes(a.style)) {
        aScore += 3;
      }
      if (preferences.styles && preferences.styles.includes(b.style)) {
        bScore += 3;
      }
      
      // Check brand preferences
      if (preferences.brands && preferences.brands.includes(a.brand)) {
        aScore += 1;
      }
      if (preferences.brands && preferences.brands.includes(b.brand)) {
        bScore += 1;
      }
      
      // Sort by score descending
      return bScore - aScore;
    });
  }
  
  // Save user preferences based on their selection/feedback
  async saveUserPreference(userId, product, liked = true) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      const userData = userDoc.data();
      const preferences = userData.preferences || {};
      
      // Update style preferences
      if (product.style) {
        preferences.styles = preferences.styles || [];
        if (liked && !preferences.styles.includes(product.style)) {
          preferences.styles.push(product.style);
        } else if (!liked && preferences.styles.includes(product.style)) {
          preferences.styles = preferences.styles.filter(s => s !== product.style);
        }
      }
      
      // Update color preferences
      if (product.color) {
        preferences.colors = preferences.colors || [];
        if (liked && !preferences.colors.includes(product.color)) {
          preferences.colors.push(product.color);
        } else if (!liked && preferences.colors.includes(product.color)) {
          preferences.colors = preferences.colors.filter(c => c !== product.color);
        }
      }
      
      // Update brand preferences
      if (product.brand) {
        preferences.brands = preferences.brands || [];
        if (liked && !preferences.brands.includes(product.brand)) {
          preferences.brands.push(product.brand);
        } else if (!liked && preferences.brands.includes(product.brand)) {
          preferences.brands = preferences.brands.filter(b => b !== product.brand);
        }
      }
      
      // Save updated preferences
      await updateDoc(userRef, { 
        preferences,
        updatedAt: new Date().toISOString()
      });
      
      return preferences;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  }
  
  // Record which recommendations a user viewed or purchased
  async recordOutfitInteraction(userId, outfitId, interactionType) {
    try {
      const userRef = doc(db, 'users', userId);
      const timestamp = new Date().toISOString();
      
      await updateDoc(userRef, {
        [`outfitInteractions.${interactionType}`]: arrayUnion({
          outfitId,
          timestamp
        })
      });
      
      return true;
    } catch (error) {
      console.error('Error recording outfit interaction:', error);
      return false;
    }
  }
}

export const stylingService = new StylingService();
export default stylingService;