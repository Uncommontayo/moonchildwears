import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import sampleProducts from '../data/sampleProducts';

// Sample outfit data for styling recommendations
const sampleOutfits = [
  {
    name: 'Casual Moon Gazer',
    description: 'A comfortable, everyday outfit perfect for casual occasions.',
    productIds: ['p1', 'p2', 'p6'],
    isAlgorithmic: false,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Night Out Celestial',
    description: 'An elegant evening outfit with celestial-inspired pieces.',
    productIds: ['p3', 'p6', 'p9'],
    isAlgorithmic: false,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Office Cosmic Chic',
    description: 'A professional yet stylish outfit for the workplace.',
    productIds: ['p7', 'p5', 'p6'],
    isAlgorithmic: false,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Weekend Moonlight',
    description: 'A relaxed weekend look with a touch of MOONCHILD magic.',
    productIds: ['p10', 'p2', 'p9'],
    isAlgorithmic: false,
    createdAt: new Date().toISOString()
  }
];

// Initialize Firebase with sample data if needed
const initializeFirebase = async () => {
  try {
    // Check if products already exist to avoid duplicates
    const productsCollection = collection(db, 'products');
    const productSnapshot = await getDocs(productsCollection);
    
    if (productSnapshot.empty) {
      console.log('Initializing Firebase with sample products...');
      
      // Add products
      for (const product of sampleProducts) {
        await addDoc(productsCollection, product);
      }
      
      console.log('Sample products added successfully');
    } else {
      console.log('Products already exist in database, skipping initialization');
    }
    
    // Check if outfits already exist
    const outfitsCollection = collection(db, 'outfits');
    const outfitSnapshot = await getDocs(outfitsCollection);
    
    if (outfitSnapshot.empty) {
      console.log('Initializing Firebase with sample outfits...');
      
      // Add outfits
      for (const outfit of sampleOutfits) {
        await addDoc(outfitsCollection, outfit);
      }
      
      console.log('Sample outfits added successfully');
    } else {
      console.log('Outfits already exist in database, skipping initialization');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return false;
  }
};

export default initializeFirebase;