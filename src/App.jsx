import { useState, useEffect } from 'react'
import { Plus, Star, Trash2, Check, Calendar, Tag } from 'lucide-react'
import './App.css'

function App() {
  const [wishes, setWishes] = useState([])
  const [newWish, setNewWish] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [filter, setFilter] = useState('all')

  // Load wishes from localStorage on component mount
  useEffect(() => {
    const savedWishes = localStorage.getItem('wishlist')
    if (savedWishes) {
      setWishes(JSON.parse(savedWishes))
    }
  }, [])

  // Save wishes to localStorage whenever wishes change
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishes))
  }, [wishes])

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
      setWishes([...wishes, wish])
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
            My Wishlist & Bucket List
          </h1>
          <p className="subtitle">Dream big, achieve bigger ✨</p>
        </header>

        <div className="add-wish-form">
          <div className="input-group">
            <input
              type="text"
              value={newWish}
              onChange={(e) => setNewWish(e.target.value)}
              placeholder="What's your next dream or goal?"
              className="wish-input"
              onKeyPress={(e) => e.key === 'Enter' && addWish()}
            />
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category (optional)"
              className="category-input"
              onKeyPress={(e) => e.key === 'Enter' && addWish()}
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
