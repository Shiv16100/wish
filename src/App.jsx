import { useState, useEffect } from 'react'
import { Plus, Star, Trash2, Check, Calendar, Tag, AlertCircle } from 'lucide-react'
import './App.css'

const STORAGE_KEY = 'radhika-shivesh-wishlist'

function App() {
  const [wishes, setWishes] = useState([])
  const [newWish, setNewWish] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState(null)

  // Load wishes on mount and set up periodic sync
  useEffect(() => {
    loadWishes()
    // Check for updates every 5 seconds
    const interval = setInterval(loadWishes, 5000)
    return () => clearInterval(interval)
  }, [])

  // Save wishes whenever they change
  useEffect(() => {
    if (wishes.length >= 0) {
      saveWishes()
    }
  }, [wishes])

  const loadWishes = async () => {
    try {
      // Try to load from the shared file on GitHub
      const response = await fetch('https://raw.githubusercontent.com/Shiv16100/wish/main/public/shared-wishlist.json?' + Date.now())
      if (response.ok) {
        const data = await response.json()
        if (data && data.wishes && Array.isArray(data.wishes)) {
          // Only update if the data is different
          const currentWishesStr = JSON.stringify(wishes)
          const newWishesStr = JSON.stringify(data.wishes)
          if (currentWishesStr !== newWishesStr) {
            setWishes(data.wishes)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.wishes))
          }
          setError(null)
          return
        }
      }
    } catch (err) {
      console.log('Failed to load from shared storage:', err)
    }

    // Fallback to localStorage if shared storage fails
    const savedWishes = localStorage.getItem(STORAGE_KEY)
    if (savedWishes && wishes.length === 0) {
      try {
        const parsed = JSON.parse(savedWishes)
        setWishes(Array.isArray(parsed) ? parsed : [])
      } catch (e) {
        setWishes([])
      }
    }

    if (!error) {
      setError('Using local storage - for cross-device sync, see instructions below')
    }
  }

  const saveWishes = () => {
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes))

    // Note: To enable cross-device sync, the shared-wishlist.json file
    // needs to be updated on GitHub. This requires manual setup.
    console.log('Wishes saved locally. For cross-device sync, see setup instructions.')
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
            <div className="info-message">
              <AlertCircle size={16} />
              {error}
              <a href="./CROSS_DEVICE_SETUP.md" target="_blank" style={{color: 'white', textDecoration: 'underline', marginLeft: '10px'}}>
                Setup Guide
              </a>
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
            <button onClick={addWish} className="add-button">
              <Plus size={20} />
              Add Wish
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
