import { useApp } from '../context/AppContext'
import { mockFriends, weeklyActivity } from '../data/mockData'
import BookCover from '../components/BookCover'
import { Bell, Flame, TrendingUp, Clock } from 'lucide-react'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function Avatar({ name, color, size = 36, initials }) {
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, background: color, fontSize: size * 0.35 }}
    >
      {initials || name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
    </div>
  )
}

function StatCard({ icon, value, label, color }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <span className="stat-value" style={{ color }}>{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

function CurrentlyReadingCard({ book, onUpdateProgress }) {
  return (
    <div
      onClick={onUpdateProgress}
      style={{
        background: 'white',
        borderRadius: 16,
        padding: 12,
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        width: 148,
        flexShrink: 0,
        cursor: 'pointer',
        transition: 'transform 0.15s',
      }}
    >
      <BookCover book={book} size="md" />
      <div style={{ marginTop: 10 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, marginBottom: 2 }}>
          {book.title}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>{book.author}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="progress-track" style={{ flex: 1, height: 5 }}>
            <div className="progress-fill" style={{ width: `${book.progress}%` }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--purple)', minWidth: 28 }}>
            {book.progress}%
          </span>
        </div>
      </div>
    </div>
  )
}

function FriendActivity({ friend }) {
  const bookTitle = friend.currentlyReading?.title || friend.lastFinished?.title
  const isFinished = !friend.currentlyReading && friend.lastFinished

  return (
    <div className="activity-item">
      <Avatar name={friend.name} color={friend.avatarColor} initials={friend.initials} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>
          <span style={{ fontWeight: 700 }}>{friend.name.split(' ')[0]}</span>
          {' '}
          <span style={{ color: 'var(--text-2)' }}>{friend.action}</span>
          {' '}
          <span style={{ fontWeight: 600, color: 'var(--purple)' }}>
            {bookTitle}
          </span>
          {isFinished && friend.lastFinished?.rating === 5 && ' ⭐'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{friend.lastActive}</span>
          {friend.streak > 0 && (
            <span style={{ fontSize: 11, color: 'var(--peach)', fontWeight: 600 }}>
              🔥 {friend.streak}d
            </span>
          )}
        </div>
      </div>
      {friend.currentlyReading && (
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--green)',
            flexShrink: 0,
            marginTop: 6,
          }}
        />
      )}
    </div>
  )
}

function WeeklyBar() {
  const maxMinutes = Math.max(...weeklyActivity.map(d => d.minutes), 1)
  const today = new Date().getDay()
  const dayIndex = today === 0 ? 6 : today - 1

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
            4.5 hrs this week
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Goal: 7 hrs</p>
        </div>
        <div
          style={{
            background: 'var(--yellow-light)',
            padding: '6px 12px',
            borderRadius: 99,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Flame size={14} color="#F5C542" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#C49B00' }}>12 day streak!</span>
        </div>
      </div>
      <div className="streak-bar">
        {weeklyActivity.map((d, i) => {
          const pct = maxMinutes > 0 ? d.minutes / maxMinutes : 0
          const isToday = i === dayIndex
          const hasRead = d.minutes > 0
          return (
            <div key={d.day} className="streak-day">
              <div
                style={{
                  width: '100%',
                  height: Math.max(pct * 48, hasRead ? 8 : 4),
                  borderRadius: 6,
                  background: hasRead
                    ? isToday
                      ? 'var(--purple)'
                      : 'var(--purple-md)'
                    : 'var(--border)',
                  opacity: hasRead ? 1 : 0.5,
                  transition: 'height 0.4s ease',
                }}
              />
              <span className="streak-label" style={{ fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--purple)' : undefined }}>
                {d.day}
              </span>
            </div>
          )
        })}
      </div>
      <div className="progress-track" style={{ height: 6, marginTop: 12 }}>
        <div className="progress-fill" style={{ width: `${(4.5 / 7) * 100}%`, background: 'var(--yellow)' }} />
      </div>
    </div>
  )
}

export default function HomeScreen() {
  const { user, books, setBooks } = useApp()
  const currentlyReading = books.filter(b => b.status === 'reading')

  const handleUpdateProgress = (bookId) => {
    const pct = window.prompt('Update reading progress (0-100):')
    if (pct === null) return
    const val = Math.min(100, Math.max(0, parseInt(pct) || 0))
    setBooks(prev => prev.map(b => b.id === bookId
      ? { ...b, progress: val, pagesRead: Math.round(b.pages * val / 100), status: val === 100 ? 'finished' : 'reading' }
      : b
    ))
  }

  return (
    <div className="page-pad">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>{getGreeting()},</p>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {user.name.split(' ')[0]} 👋
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn-ghost" style={{ padding: 8, position: 'relative' }}>
            <Bell size={22} color="var(--text-2)" />
            <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: 'var(--peach)', borderRadius: '50%', border: '2px solid white' }} />
          </button>
          <div
            className="avatar"
            style={{
              width: 44,
              height: 44,
              background: user.avatarColor,
              fontSize: 16,
              border: '3px solid var(--purple-light)',
            }}
          >
            {user.initials}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="section">
        <div className="stat-grid">
          <StatCard icon="📚" value={user.stats.booksRead} label="Books Read" color="var(--purple)" />
          <StatCard icon="📄" value={`${(user.stats.pagesRead / 1000).toFixed(1)}k`} label="Pages" color="var(--blue)" />
          <StatCard icon="🔥" value={user.stats.currentStreak} label="Day Streak" color="var(--peach)" />
          <StatCard icon="👥" value={user.stats.clubsJoined} label="Clubs" color="var(--green)" />
        </div>
      </div>

      {/* Reading Progress Banner */}
      <div className="section">
        <div
          style={{
            background: 'linear-gradient(135deg, var(--purple) 0%, #9B8FF5 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 18px',
            color: 'white',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <p style={{ fontSize: 12, opacity: 0.8, fontWeight: 500, marginBottom: 3 }}>2026 Reading Goal</p>
              <p style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
                {user.readingGoal.current} / {user.readingGoal.target} books
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 12, opacity: 0.8 }}>Completion</p>
              <p style={{ fontSize: 20, fontWeight: 800 }}>
                {Math.round((user.readingGoal.current / user.readingGoal.target) * 100)}%
              </p>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(user.readingGoal.current / user.readingGoal.target) * 100}%`,
                background: 'white',
                borderRadius: 99,
                transition: 'width 1s ease',
              }}
            />
          </div>
          <p style={{ fontSize: 11, opacity: 0.75, marginTop: 6 }}>
            {user.readingGoal.target - user.readingGoal.current} more books to reach your goal 🎯
          </p>
        </div>
      </div>

      {/* Currently Reading */}
      <div className="section">
        <div className="section-header">
          <p className="section-title">Currently Reading</p>
          <button className="section-link">See all</button>
        </div>
        {currentlyReading.length > 0 ? (
          <div className="scroll-row">
            {currentlyReading.map(book => (
              <CurrentlyReadingCard
                key={book.id}
                book={book}
                onUpdateProgress={() => handleUpdateProgress(book.id)}
              />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>📖</p>
            <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Start reading a book from your library!</p>
          </div>
        )}
      </div>

      {/* This Week */}
      <div className="section">
        <div className="section-header">
          <p className="section-title">This Week</p>
          <TrendingUp size={16} color="var(--text-3)" />
        </div>
        <div className="card">
          <WeeklyBar />
        </div>
      </div>

      {/* Friends Activity */}
      <div className="section">
        <div className="section-header">
          <p className="section-title">Friends Reading</p>
          <button className="section-link">See all</button>
        </div>
        <div className="card" style={{ padding: '4px 16px' }}>
          {mockFriends.map(friend => (
            <FriendActivity key={friend.id} friend={friend} />
          ))}
        </div>
      </div>
    </div>
  )
}
