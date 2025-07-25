import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  orderBy, 
  query 
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'wishes';

export const useWishes = () => {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to real-time updates
  useEffect(() => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const wishesData = [];
        querySnapshot.forEach((doc) => {
          wishesData.push({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toLocaleDateString() || new Date().toLocaleDateString()
          });
        });
        setWishes(wishesData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching wishes:', error);
        setError('Failed to load wishes. Using offline mode.');
        setLoading(false);
        
        // Fallback to localStorage
        const savedWishes = localStorage.getItem('wishlist');
        if (savedWishes) {
          setWishes(JSON.parse(savedWishes));
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Save to localStorage as backup
  useEffect(() => {
    if (wishes.length > 0) {
      localStorage.setItem('wishlist', JSON.stringify(wishes));
    }
  }, [wishes]);

  const addWish = async (wishText, category = 'General') => {
    try {
      const newWish = {
        text: wishText.trim(),
        category: category.trim() || 'General',
        completed: false,
        priority: false,
        createdAt: new Date()
      };

      await addDoc(collection(db, COLLECTION_NAME), newWish);
    } catch (error) {
      console.error('Error adding wish:', error);
      setError('Failed to add wish. Please try again.');
      
      // Fallback to local storage
      const localWish = {
        id: Date.now(),
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
      setError('Failed to update wish. Please try again.');
      
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
      setError('Failed to delete wish. Please try again.');
      
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
