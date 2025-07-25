import { useState } from 'react'
import { Plus, Star, Trash2, Check, Calendar, Tag, Share2, Smartphone, AlertCircle, RefreshCw } from 'lucide-react'
import { useSimpleSync } from './hooks/useSimpleSync'
import './App.css'

function App() {
  const {
    wishes,
    loading,
    error,
    syncCode,
    addWish,
    toggleComplete,
    togglePriority,
    deleteWish,
    createSyncCode,
    joinWithSyncCode,
    syncFromCloud
  } = useSimpleSync()

  const [newWish, setNewWish] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [filter, setFilter] = useState('all')
  const [showSync, setShowSync] = useState(false)
  const [joinCode, setJoinCode] = useState('')

  const handleAddWish = () => {
    if (newWish.trim()) {
      addWish(newWish, newCategory)
      setNewWish('')
      setNewCategory('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddWish()
    }
  }

  const handleCreateSync = async () => {
    const code = await createSyncCode()
    alert(`Sync code created: ${code}\nShare this code with other devices to sync your wishlist!`)
  }

  const handleJoinSync = async () => {
    if (joinCode.trim()) {
      await joinWithSyncCode(joinCode.trim())
      setJoinCode('')
      setShowSync(false)
      alert('Successfully connected to shared wishlist!')
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

          <div className="sync-section">
            {syncCode ? (
              <div className="sync-status">
                <Smartphone size={16} />
                <span>Sync Code: <strong>{syncCode}</strong></span>
                <button onClick={syncFromCloud} className="sync-refresh-btn" disabled={loading}>
                  <RefreshCw size={14} />
                </button>
              </div>
            ) : (
              <div className="sync-actions">
                <button onClick={handleCreateSync} className="sync-btn" disabled={loading}>
                  <Share2 size={16} />
                  Create Sync Code
                </button>
                <button onClick={() => setShowSync(!showSync)} className="sync-btn" disabled={loading}>
                  <Smartphone size={16} />
                  Join Existing
                </button>
              </div>
            )}
          </div>

          {showSync && !syncCode && (
            <div className="join-sync-form">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter sync code (e.g., ABC123)"
                className="sync-input"
                maxLength={6}
              />
              <button onClick={handleJoinSync} className="join-btn" disabled={!joinCode.trim() || loading}>
                Join
              </button>
            </div>
          )}

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
            <button onClick={handleAddWish} className="add-button" disabled={loading}>
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
