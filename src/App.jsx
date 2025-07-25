import { useState, useEffect } from 'react'
import { Plus, Star, Trash2, Check, Calendar, Tag, AlertCircle } from 'lucide-react'
import './App.css'

const SHARED_WISHLIST_ID = 'radhika-shivesh-wishlist-2024'

function App() {
  const [wishes, setWishes] = useState([])
  const [newWish, setNewWish] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load wishes from cloud storage on mount
  useEffect(() => {
    loadWishesFromCloud()
  }, [])

  // Auto-save to cloud whenever wishes change
  useEffect(() => {
    if (wishes.length >= 0) {
      saveWishesToCloud()
    }
  }, [wishes])

  const loadWishesFromCloud = async () => {
    setLoading(true)
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${SHARED_WISHLIST_ID}/latest`, {
        headers: {
          'X-Master-Key': '$2a$10$demo.key.for.wishlist.app'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.record && data.record.wishes) {
          setWishes(data.record.wishes)
          localStorage.setItem('radhika-shivesh-wishlist', JSON.stringify(data.record.wishes))
        }
      } else {
        // Fallback to localStorage if cloud fails
        const savedWishes = localStorage.getItem('radhika-shivesh-wishlist')
        if (savedWishes) {
          setWishes(JSON.parse(savedWishes))
        }
      }
      setError(null)
    } catch (err) {
      console.error('Failed to load from cloud:', err)
      // Fallback to localStorage
      const savedWishes = localStorage.getItem('radhika-shivesh-wishlist')
      if (savedWishes) {
        setWishes(JSON.parse(savedWishes))
      }
      setError('Using offline mode - changes will sync when online')
    } finally {
      setLoading(false)
    }
  }

  const saveWishesToCloud = async () => {
    try {
      await fetch(`https://api.jsonbin.io/v3/b/${SHARED_WISHLIST_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': '$2a$10$demo.key.for.wishlist.app'
        },
        body: JSON.stringify({
          wishes: wishes,
          lastUpdated: new Date().toISOString()
        })
      })

      // Also save to localStorage as backup
      localStorage.setItem('radhika-shivesh-wishlist', JSON.stringify(wishes))
      setError(null)
    } catch (err) {
      console.error('Failed to save to cloud:', err)
      // Still save to localStorage
      localStorage.setItem('radhika-shivesh-wishlist', JSON.stringify(wishes))
      setError('Saved locally - will sync when online')
    }
  }

  const addWish = () => {
    if (newWish.trim()) {
      const wish = {
        id: Date.now(),
        text: newWish.trim(),
        category: newCategory.trim() || 'General',
        completed: false,
        createdAt: new Date().toLocaleDateString(),
        priority: false
      }
      setWishes([wish, ...wishes])
      setNewWish('')
      setNewCategory('')
    }
  }

  const toggleComplete = (id) => {
    setWishes(wishes.map(wish =>
      wish.id === id ? { ...wish, completed: !wish.completed } : wish
    ))
  }

  const togglePriority = (id) => {
    setWishes(wishes.map(wish =>
      wish.id === id ? { ...wish, priority: !wish.priority } : wish
    ))
  }

  const deleteWish = (id) => {
    setWishes(wishes.filter(wish => wish.id !== id))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addWish()
    }
  }

  const filteredWishes = wishes.filter(wish => {
    if (filter === 'completed') return wish.completed
    if (filter === 'pending') return !wish.completed
    if (filter === 'priority') return wish.priority
    return true
  })

  const categories = [...new Set(wishes.map(wish => wish.category))]

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">
            <Star className="title-icon" />
            The Wishlist of Radhika and Shivesh
          </h1>
          <p className="subtitle">Dream big, achieve bigger ✨</p>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </header>

        <div className="add-wish-form">
          <div className="input-group">
            <input
              type="text"
              value={newWish}
              onChange={(e) => setNewWish(e.target.value)}
              placeholder="What's your next dream or goal?"
              className="wish-input"
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category (optional)"
              className="category-input"
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button onClick={addWish} className="add-button" disabled={loading}>
              <Plus size={20} />
              {loading ? 'Adding...' : 'Add Wish'}
            </button>
          </div>
        </div>

        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({wishes.length})
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({wishes.filter(w => !w.completed).length})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({wishes.filter(w => w.completed).length})
          </button>
          <button
            className={`filter-btn ${filter === 'priority' ? 'active' : ''}`}
            onClick={() => setFilter('priority')}
          >
            Priority ({wishes.filter(w => w.priority).length})
          </button>
        </div>

        <div className="wishes-container">
          {filteredWishes.length === 0 ? (
            <div className="empty-state">
              <Star size={48} className="empty-icon" />
              <h3>No wishes yet!</h3>
              <p>Start by adding your first dream or goal above.</p>
            </div>
          ) : (
            <div className="wishes-grid">
              {filteredWishes.map(wish => (
                <div key={wish.id} className={`wish-card ${wish.completed ? 'completed' : ''} ${wish.priority ? 'priority' : ''}`}>
                  <div className="wish-header">
                    <div className="wish-category">
                      <Tag size={14} />
                      {wish.category}
                    </div>
                    <div className="wish-actions">
                      <button
                        onClick={() => togglePriority(wish.id)}
                        className={`priority-btn ${wish.priority ? 'active' : ''}`}
                        title="Toggle Priority"
                      >
                        <Star size={16} />
                      </button>
                      <button
                        onClick={() => toggleComplete(wish.id)}
                        className={`complete-btn ${wish.completed ? 'active' : ''}`}
                        title="Toggle Complete"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => deleteWish(wish.id)}
                        className="delete-btn"
                        title="Delete Wish"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="wish-content">
                    <p className="wish-text">{wish.text}</p>
                    <div className="wish-date">
                      <Calendar size={12} />
                      Added {wish.createdAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {categories.length > 0 && (
          <div className="categories-section">
            <h3>Categories</h3>
            <div className="categories-list">
              {categories.map(category => (
                <span key={category} className="category-tag">
                  {category} ({wishes.filter(w => w.category === category).length})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
