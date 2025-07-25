import { useState, useEffect } from 'react';

const STORAGE_KEY = 'radhika-shivesh-wishlist';
const SYNC_URL = 'https://api.jsonbin.io/v3/b/'; // Free JSON storage service

export const useSimpleSync = () => {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncCode, setSyncCode] = useState('');

  // Load wishes from localStorage on mount
  useEffect(() => {
    const savedWishes = localStorage.getItem(STORAGE_KEY);
    const savedSyncCode = localStorage.getItem(STORAGE_KEY + '_sync');
    
    if (savedWishes) {
      setWishes(JSON.parse(savedWishes));
    }
    
    if (savedSyncCode) {
      setSyncCode(savedSyncCode);
      // Auto-sync on load if we have a sync code
      syncFromCloud(savedSyncCode);
    }
  }, []);

  // Save to localStorage whenever wishes change
  useEffect(() => {
    if (wishes.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
      // Auto-sync to cloud if we have a sync code
      if (syncCode) {
        syncToCloud();
      }
    }
  }, [wishes, syncCode]);

  const generateSyncCode = () => {
    // Generate a simple 6-digit code
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const syncToCloud = async () => {
    if (!syncCode) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${SYNC_URL}${syncCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': '$2a$10$demo.key.for.wishlist.app'
        },
        body: JSON.stringify({
          wishes: wishes,
          lastUpdated: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to sync to cloud');
      }
      
      setError(null);
    } catch (err) {
      console.error('Sync error:', err);
      setError('Failed to sync to cloud. Your wishes are saved locally.');
    } finally {
      setLoading(false);
    }
  };

  const syncFromCloud = async (code = syncCode) => {
    if (!code) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${SYNC_URL}${code}/latest`, {
        headers: {
          'X-Master-Key': '$2a$10$demo.key.for.wishlist.app'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.record && data.record.wishes) {
          setWishes(data.record.wishes);
          setError(null);
        }
      }
    } catch (err) {
      console.error('Sync error:', err);
      setError('Failed to sync from cloud. Using local data.');
    } finally {
      setLoading(false);
    }
  };

  const createSyncCode = async () => {
    const newCode = generateSyncCode();
    setSyncCode(newCode);
    localStorage.setItem(STORAGE_KEY + '_sync', newCode);
    await syncToCloud();
    return newCode;
  };

  const joinWithSyncCode = async (code) => {
    setSyncCode(code.toUpperCase());
    localStorage.setItem(STORAGE_KEY + '_sync', code.toUpperCase());
    await syncFromCloud(code.toUpperCase());
  };

  const addWish = (wishText, category = 'General') => {
    if (wishText.trim()) {
      const newWish = {
        id: Date.now(),
        text: wishText.trim(),
        category: category.trim() || 'General',
        completed: false,
        priority: false,
        createdAt: new Date().toLocaleDateString()
      };
      setWishes(prev => [newWish, ...prev]);
    }
  };

  const updateWish = (id, updates) => {
    setWishes(prev => prev.map(wish => 
      wish.id === id ? { ...wish, ...updates } : wish
    ));
  };

  const deleteWish = (id) => {
    setWishes(prev => prev.filter(wish => wish.id !== id));
  };

  const toggleComplete = (id) => {
    updateWish(id, { completed: !wishes.find(w => w.id === id)?.completed });
  };

  const togglePriority = (id) => {
    updateWish(id, { priority: !wishes.find(w => w.id === id)?.priority });
  };

  return {
    wishes,
    loading,
    error,
    syncCode,
    addWish,
    updateWish,
    deleteWish,
    toggleComplete,
    togglePriority,
    createSyncCode,
    joinWithSyncCode,
    syncFromCloud: () => syncFromCloud(),
    syncToCloud
  };
};
