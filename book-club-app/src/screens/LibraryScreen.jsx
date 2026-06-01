import { useState } from 'react'
import { useApp } from '../context/AppContext'
import BookCover from '../components/BookCover'
import { Search, Plus, Star, BookOpen, CheckCircle, Bookmark, X } from 'lucide-react'

const STATUS_TABS = [
  { key: 'all',      label: 'All',       icon: null },
  { key: 'reading',  label: 'Reading',   icon: BookOpen },
  { key: 'wishlist', label: 'Want to Read', icon: Bookmark },
  { key: 'finished', label: 'Done',      icon: CheckCircle },
]

const GENRE_COLORS = {
  'Literary Fiction': '#7461EF',
  'Science Fiction': '#4B96F3',
  'History': '#C2853A',
  'Self-Help': '#52B788',
  'Fantasy': '#9B59B6',
  'Psychology': '#2C7DA0',
}

function StarRating({ rating, onRate }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          style={{
            background: 'none',
            border: 'none',
            cursor: onRate ? 'pointer' : 'default',
            padding: '1px',
            fontSize: 14,
            lineHeight: 1,
            color: n <= (hover || rating || 0) ? '#F5C542' : 'var(--border-2)',
            transition: 'color 0.1s',
          }}
          onMouseEnter={() => onRate && setHover(n)}
          onMouseLeave={() => onRate && setHover(0)}
          onClick={() => onRate && onRate(n)}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function BookDetailModal({ book, onClose, onUpdateProgress, onRate, onUpdateStatus }) {
  const [progressInput, setProgressInput] = useState(book.pagesRead.toString())

  const save = () => {
    const pages = Math.min(book.pages, Math.max(0, parseInt(progressInput) || 0))
    const pct = Math.round((pages / book.pages) * 100)
    onUpdateProgress(book.id, pages, pct)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <BookCover book={book} size="md" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', lineHeight: 1.3, marginBottom: 4 }}>
              {book.title}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>{book.author}</p>
            <span style={{
              background: GENRE_COLORS[book.genre] ? GENRE_COLORS[book.genre] + '22' : 'var(--purple-light)',
              color: GENRE_COLORS[book.genre] || 'var(--purple)',
              borderRadius: 99,
              padding: '3px 10px',
              fontSize: 11,
              fontWeight: 700,
            }}>
              {book.genre}
            </span>
            {book.status === 'finished' && (
              <div style={{ marginTop: 8 }}>
                <StarRating rating={book.rating} onRate={(r) => onRate(book.id, r)} />
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {['reading', 'wishlist', 'finished'].map(s => (
            <button
              key={s}
              className={book.status === s ? 'btn-primary' : 'btn-outline'}
              style={{ flex: 1, padding: '9px 12px', fontSize: 12 }}
              onClick={() => { onUpdateStatus(book.id, s); onClose() }}
            >
              {s === 'reading' ? '📖 Reading' : s === 'wishlist' ? '🔖 Want' : '✅ Done'}
            </button>
          ))}
        </div>

        {(book.status === 'reading' || book.status === 'finished') && (
          <div style={{ marginBottom: 16 }}>
            <p className="form-label">Reading Progress</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <input
                className="input"
                type="number"
                value={progressInput}
                onChange={e => setProgressInput(e.target.value)}
                min="0"
                max={book.pages}
                style={{ width: 80, flexShrink: 0 }}
              />
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>/ {book.pages} pages</span>
              <div className="progress-track" style={{ flex: 1, height: 6 }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${book.pages > 0 ? Math.round((parseInt(progressInput) || 0) / book.pages * 100) : 0}%`
                  }}
                />
              </div>
            </div>
            <button className="btn-primary" style={{ width: '100%' }} onClick={save}>
              Save Progress
            </button>
          </div>
        )}

        {book.notes && (
          <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: 12 }}>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>Notes</p>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{book.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function AddBookModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [pages, setPages] = useState('')
  const [genre, setGenre] = useState('Literary Fiction')
  const [status, setStatus] = useState('wishlist')

  const EMOJIS = ['📚', '🌌', '🔍', '🌱', '🏛️', '🚀', '💕', '🎭', '🌊', '🦉', '⚡', '🧠']
  const [emoji, setEmoji] = useState('📚')
  const COLORS = ['#7461EF', '#4B96F3', '#52B788', '#E88C2A', '#E879A0', '#9B59B6', '#C2853A', '#2C7DA0']
  const [color, setColor] = useState('#7461EF')

  const genres = ['Literary Fiction', 'Science Fiction', 'Mystery', 'Romance', 'Fantasy', 'History', 'Self-Help', 'Psychology', 'Non-fiction', 'Other']

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 20 }}>Add a Book</h2>

        <div className="form-group">
          <label className="form-label">Cover</label>
          <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 60, height: 84, background: color, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              {emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setEmoji(e)} style={{ background: emoji === e ? 'var(--purple-light)' : 'var(--bg)', border: `1.5px solid ${emoji === e ? 'var(--purple)' : 'var(--border-2)'}`, borderRadius: 8, padding: 4, fontSize: 16, cursor: 'pointer' }}>{e}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <button key={c} onClick={() => setColor(c)} style={{ width: 24, height: 24, borderRadius: 6, background: c, border: color === c ? '2.5px solid var(--text)' : '2px solid transparent', cursor: 'pointer' }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="input" placeholder="Book title" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Author</label>
          <input className="input" placeholder="Author name" value={author} onChange={e => setAuthor(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Pages</label>
            <input className="input" type="number" placeholder="300" value={pages} onChange={e => setPages(e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Genre</label>
            <select
              className="input"
              value={genre}
              onChange={e => setGenre(e.target.value)}
              style={{ appearance: 'none' }}
            >
              {genres.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['reading', '📖 Reading'], ['wishlist', '🔖 Want to Read'], ['finished', '✅ Finished']].map(([s, l]) => (
              <button
                key={s}
                className={status === s ? 'btn-primary' : 'btn-outline'}
                style={{ flex: 1, padding: '9px 4px', fontSize: 11 }}
                onClick={() => setStatus(s)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            style={{ flex: 2 }}
            disabled={!title.trim() || !author.trim()}
            onClick={() => {
              onAdd({
                id: Date.now(),
                title,
                author,
                genre,
                coverColor: color,
                coverEmoji: emoji,
                status,
                progress: status === 'finished' ? 100 : 0,
                pages: parseInt(pages) || 0,
                pagesRead: status === 'finished' ? parseInt(pages) || 0 : 0,
                startDate: status !== 'wishlist' ? new Date().toISOString().split('T')[0] : null,
                rating: null,
                notes: '',
              })
              onClose()
            }}
          >
            Add to Library
          </button>
        </div>
      </div>
    </div>
  )
}

function BookGridItem({ book, onClick }) {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ position: 'relative' }}>
        <BookCover book={book} size="md" />
        {book.status === 'reading' && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'rgba(0,0,0,0.2)', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${book.progress}%`, background: 'white' }} />
          </div>
        )}
        {book.status === 'finished' && (
          <div style={{ position: 'absolute', top: -4, right: -4, background: 'var(--green)', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={11} color="white" strokeWidth={2.5} />
          </div>
        )}
      </div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, marginBottom: 2 }}>{book.title}</p>
        <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{book.author}</p>
        {book.status === 'reading' && (
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--purple)', marginTop: 2 }}>{book.progress}%</p>
        )}
        {book.status === 'finished' && book.rating && (
          <p style={{ fontSize: 11, color: '#F5C542', marginTop: 2 }}>{'★'.repeat(book.rating)}</p>
        )}
      </div>
    </div>
  )
}

export default function LibraryScreen() {
  const { books, setBooks } = useApp()
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  const filtered = books.filter(b => {
    const matchTab = activeTab === 'all' || b.status === activeTab
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const handleUpdateProgress = (id, pagesRead, progress) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, pagesRead, progress, status: progress === 100 ? 'finished' : 'reading' } : b))
  }
  const handleRate = (id, rating) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, rating } : b))
  }
  const handleUpdateStatus = (id, status) => {
    setBooks(prev => prev.map(b => {
      if (b.id !== id) return b
      return {
        ...b,
        status,
        progress: status === 'finished' ? 100 : status === 'wishlist' ? 0 : b.progress,
        pagesRead: status === 'finished' ? b.pages : status === 'wishlist' ? 0 : b.pagesRead,
        startDate: status !== 'wishlist' && !b.startDate ? new Date().toISOString().split('T')[0] : b.startDate,
        finishDate: status === 'finished' ? new Date().toISOString().split('T')[0] : b.finishDate,
      }
    }))
  }
  const handleAdd = (book) => setBooks(prev => [book, ...prev])

  const counts = {
    all: books.length,
    reading: books.filter(b => b.status === 'reading').length,
    wishlist: books.filter(b => b.status === 'wishlist').length,
    finished: books.filter(b => b.status === 'finished').length,
  }

  return (
    <div className="page-pad">
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 12 }}>
          My Library
        </h1>
        <div style={{ position: 'relative' }}>
          <Search size={15} color="var(--text-3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="input"
            placeholder="Search books..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 34 }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="scroll-row" style={{ marginBottom: 20, gap: 8 }}>
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            className={`chip ${activeTab === tab.key ? 'chip-active' : 'chip-inactive'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span style={{
              background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : 'var(--border)',
              borderRadius: 99,
              padding: '1px 6px',
              fontSize: 11,
              fontWeight: 700,
              color: activeTab === tab.key ? 'white' : 'var(--text-3)',
            }}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Stats row */}
      {activeTab === 'all' && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[
            { color: '#7461EF', label: 'Reading', count: counts.reading },
            { color: '#F5C542', label: 'Want', count: counts.wishlist },
            { color: '#52B788', label: 'Done', count: counts.finished },
          ].map(item => (
            <div
              key={item.label}
              style={{
                flex: 1,
                background: 'white',
                borderRadius: 12,
                padding: '10px 0',
                textAlign: 'center',
                border: '1px solid var(--border)',
              }}
            >
              <p style={{ fontSize: 20, fontWeight: 800, color: item.color }}>{item.count}</p>
              <p style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Book grid */}
      {filtered.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px 12px',
            paddingBottom: 24,
          }}
        >
          {filtered.map(book => (
            <BookGridItem key={book.id} book={book} onClick={() => setSelectedBook(book)} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-emoji">📚</p>
          <p className="empty-title">{search ? 'No books found' : 'Your shelf is empty'}</p>
          <p className="empty-desc">
            {search ? `No results for "${search}"` : 'Start building your library by adding a book!'}
          </p>
          {!search && (
            <button className="btn-primary" onClick={() => setShowAdd(true)}>
              <Plus size={16} /> Add Your First Book
            </button>
          )}
        </div>
      )}

      {/* FAB */}
      <button className="fab" onClick={() => setShowAdd(true)}>
        <Plus size={24} strokeWidth={2.5} />
      </button>

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onUpdateProgress={handleUpdateProgress}
          onRate={handleRate}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
      {showAdd && <AddBookModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
    </div>
  )
}
