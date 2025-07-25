import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  orderBy, 
  query,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'radhika-shivesh-wishes';
const STORAGE_KEY = 'radhika-shivesh-wishlist';

export const useFirebaseWishes = () => {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to real-time updates from Firebase
  useEffect(() => {
    console.log('Initializing Firebase connection...');

    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const wishesData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          wishesData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toLocaleDateString() || new Date().toLocaleDateString()
          });
        });
        
        setWishes(wishesData);
        setLoading(false);
        setError(null);
        
        // Also save to localStorage as backup
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishesData));
      },
      (error) => {
        console.error('Firebase error:', error);
        let errorMessage = 'Connection issue - using offline mode';

        if (error.code === 'permission-denied') {
          errorMessage = 'Permission denied - please check Firestore security rules';
        } else if (error.code === 'unavailable') {
          errorMessage = 'Firebase unavailable - check internet connection';
        }

        setError(errorMessage);
        setLoading(false);

        // Fallback to localStorage
        const savedWishes = localStorage.getItem(STORAGE_KEY);
        if (savedWishes) {
          try {
            setWishes(JSON.parse(savedWishes));
          } catch (e) {
            setWishes([]);
          }
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const addWish = async (wishText, category = 'General') => {
    if (!wishText.trim()) return;

    const newWish = {
      text: wishText.trim(),
      category: category.trim() || 'General',
      completed: false,
      priority: false,
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, COLLECTION_NAME), newWish);
    } catch (error) {
      console.error('Error adding wish:', error);
      let errorMessage = 'Failed to add wish - please try again';

      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied - check Firestore security rules';
      }

      setError(errorMessage);

      // Fallback to local storage
      const localWish = {
        id: Date.now().toString(),
        ...newWish,
        createdAt: new Date().toLocaleDateString()
      };
      setWishes(prev => [localWish, ...prev]);
    }
  };

  const updateWish = async (id, updates) => {
    try {
      const wishRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(wishRef, updates);
    } catch (error) {
      console.error('Error updating wish:', error);
      setError('Failed to update wish - please try again');
      
      // Fallback to local update
      setWishes(prev => prev.map(wish => 
        wish.id === id ? { ...wish, ...updates } : wish
      ));
    }
  };

  const deleteWish = async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Error deleting wish:', error);
      setError('Failed to delete wish - please try again');
      
      // Fallback to local deletion
      setWishes(prev => prev.filter(wish => wish.id !== id));
    }
  };

  const toggleComplete = (id) => {
    const wish = wishes.find(w => w.id === id);
    if (wish) {
      updateWish(id, { completed: !wish.completed });
    }
  };

  const togglePriority = (id) => {
    const wish = wishes.find(w => w.id === id);
    if (wish) {
      updateWish(id, { priority: !wish.priority });
    }
  };

  return {
    wishes,
    loading,
    error,
    addWish,
    updateWish,
    deleteWish,
    toggleComplete,
    togglePriority
  };
};
