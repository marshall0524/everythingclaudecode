import { useState } from 'react'
import { useApp } from '../context/AppContext'
import PentagonChart from '../components/PentagonChart'
import { Camera, ChevronRight, Mail, Link, Bell, Moon, HelpCircle, LogOut, Edit3 } from 'lucide-react'

const ALL_GENRES = [
  'Literary Fiction', 'Science Fiction', 'Mystery', 'Romance',
  'Fantasy', 'History', 'Self-Help', 'Psychology', 'Biography',
  'Non-fiction', 'Horror', 'Technology', 'Science', 'Travel',
]

const READING_TIMES = ['Morning', 'Afternoon', 'Evenings', 'Late Night', 'Weekends']
const AGE_RANGES = ['Under 18', '18-24', '25-34', '35-44', '45-54', '55+']
const GOALS = [12, 18, 24, 30, 36, 48, 52]

function Toggle({ on, onToggle }) {
  return (
    <button className={`toggle ${on ? 'on' : 'off'}`} onClick={onToggle}>
      <div className="toggle-thumb" />
    </button>
  )
}

function PersonalityBar({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', width: 80, flexShrink: 0 }}>{label}</span>
      <div className="progress-track" style={{ flex: 1, height: 6 }}>
        <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, width: 30, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function InviteSheet({ onClose }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const link = 'https://pagepal.app/join/alexchen'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>📨</p>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>Invite Friends</h2>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.5 }}>
            Share PagePal with friends who love to read!
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '12px 0 20px' }}>
            <p style={{ fontSize: 48, marginBottom: 10 }}>🎉</p>
            <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Invite sent!</p>
            <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Your friend will get an email shortly.</p>
            <button className="btn-secondary" style={{ marginTop: 16 }} onClick={() => setSent(false)}>
              Send Another
            </button>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Invite via Email</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="input"
                  type="email"
                  placeholder="friend@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  className="btn-primary"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => { if (email) setSent(true) }}
                >
                  Send
                </button>
              </div>
            </div>
            <div
              style={{
                background: 'var(--bg)',
                borderRadius: 'var(--radius-md)',
                padding: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                border: '1px solid var(--border)',
              }}
              onClick={() => { navigator.clipboard?.writeText(link); alert('Link copied!') }}
            >
              <div style={{ width: 36, height: 36, background: 'var(--purple-light)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link size={16} color="var(--purple)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Copy Invite Link</p>
                <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{link}</p>
              </div>
              <ChevronRight size={16} color="var(--text-3)" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function EditProfileSheet({ user, onClose, onSave }) {
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio)
  const [username, setUsername] = useState(user.username)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 20 }}>Edit Profile</h2>
        <div className="form-group">
          <label className="form-label">Display Name</label>
          <input className="input" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input className="input" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea
            className="input"
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            style={{ resize: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn-primary" style={{ flex: 2 }} onClick={() => { onSave({ name, bio, username }); onClose() }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SettingsScreen() {
  const { user, setUser } = useApp()
  const [showInvite, setShowInvite] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [goal, setGoal] = useState(user.readingGoal.target)
  const [readingTime, setReadingTime] = useState(user.demographics?.readingTime || 'Evenings')

  const toggleGenre = (genre) => {
    setUser(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre],
    }))
  }

  const toggleNotif = (key) => {
    setUser(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }))
  }

  const personalityColors = {
    literary:   'var(--purple)',
    adventure:  'var(--peach)',
    mystery:    'var(--text-2)',
    romance:    'var(--pink)',
    nonfiction: 'var(--blue)',
  }

  const personalityLabels = {
    literary:   'Literary',
    adventure:  'Adventure',
    mystery:    'Mystery',
    romance:    'Romance',
    nonfiction: 'Non-fiction',
  }

  const topTrait = Object.entries(user.readerPersonality)
    .sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="page-pad">
      {/* Header */}
      <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 20 }}>
        Profile
      </h1>

      {/* Profile Card */}
      <div className="section">
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, #F0EEFF 0%, #FFF2EE 100%)',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div
                className="avatar"
                style={{
                  width: 72,
                  height: 72,
                  background: user.avatarColor,
                  fontSize: 26,
                  border: '3px solid white',
                  boxShadow: '0 2px 12px rgba(116,97,239,0.25)',
                }}
              >
                {user.initials}
              </div>
              <button
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'var(--purple)',
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Camera size={11} color="white" />
              </button>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>{user.name}</p>
              <p style={{ fontSize: 13, color: 'var(--purple)', fontWeight: 600, marginBottom: 4 }}>{user.username}</p>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.4 }}>{user.bio}</p>
            </div>
            <button
              className="btn-secondary"
              style={{ padding: '8px 12px', flexShrink: 0 }}
              onClick={() => setShowEditProfile(true)}
            >
              <Edit3 size={14} />
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 0,
              marginTop: 16,
              borderTop: '1px solid rgba(116,97,239,0.12)',
              paddingTop: 14,
            }}
          >
            {[
              { value: user.stats.booksRead, label: 'Books' },
              { value: user.stats.clubsJoined, label: 'Clubs' },
              { value: user.stats.friendsCount, label: 'Friends' },
              { value: user.stats.currentStreak + 'd', label: 'Streak' },
            ].map((s, i, arr) => (
              <div
                key={s.label}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  borderRight: i < arr.length - 1 ? '1px solid rgba(116,97,239,0.12)' : 'none',
                }}
              >
                <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{s.value}</p>
                <p style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reading Personality */}
      <div className="section">
        <div className="section-header">
          <p className="section-title">Reading Personality</p>
          <span style={{
            background: 'var(--purple-light)',
            color: 'var(--purple)',
            borderRadius: 99,
            padding: '3px 10px',
            fontSize: 11,
            fontWeight: 700,
          }}>
            {personalityLabels[topTrait[0]]} Reader
          </span>
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <PentagonChart data={user.readerPersonality} size={200} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(user.readerPersonality).map(([key, value]) => (
              <PersonalityBar
                key={key}
                label={personalityLabels[key]}
                value={value}
                color={personalityColors[key]}
              />
            ))}
          </div>
          <div
            style={{
              background: 'var(--purple-light)',
              borderRadius: 'var(--radius-md)',
              padding: 12,
              marginTop: 14,
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 13, color: 'var(--purple)', fontWeight: 600 }}>
              You're a strong <strong>{personalityLabels[topTrait[0]]}</strong> reader
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 3 }}>
              You love thought-provoking books that explore the human condition
            </p>
          </div>
        </div>
      </div>

      {/* Genre Preferences */}
      <div className="section">
        <div className="section-header">
          <p className="section-title">Favourite Genres</p>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{user.genres.length} selected</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ALL_GENRES.map(genre => (
            <button
              key={genre}
              className={`genre-tag ${user.genres.includes(genre) ? 'on' : 'off'}`}
              onClick={() => toggleGenre(genre)}
            >
              {user.genres.includes(genre) && '✓ '}
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Reading Goal */}
      <div className="section">
        <p className="section-title" style={{ marginBottom: 12 }}>Reading Goal</p>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>2026 Book Goal</p>
              <p style={{ fontSize: 13, color: 'var(--text-2)' }}>{user.readingGoal.current} of {goal} books read</p>
            </div>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--purple)' }}>
              {Math.round((user.readingGoal.current / goal) * 100)}%
            </p>
          </div>
          <div className="progress-track" style={{ height: 8, marginBottom: 14 }}>
            <div className="progress-fill" style={{ width: `${Math.round((user.readingGoal.current / goal) * 100)}%` }} />
          </div>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Adjust goal</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {GOALS.map(g => (
                <button
                  key={g}
                  onClick={() => { setGoal(g); setUser(prev => ({ ...prev, readingGoal: { ...prev.readingGoal, target: g } })) }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 99,
                    border: `1.5px solid ${goal === g ? 'var(--purple)' : 'var(--border-2)'}`,
                    background: goal === g ? 'var(--purple)' : 'transparent',
                    color: goal === g ? 'white' : 'var(--text-2)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preferred Reading Time */}
      <div className="section">
        <p className="section-title" style={{ marginBottom: 12 }}>Preferred Reading Time</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {READING_TIMES.map(t => (
            <button
              key={t}
              className={`chip ${readingTime === t ? 'chip-active' : 'chip-inactive'}`}
              onClick={() => setReadingTime(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Invite Friends */}
      <div className="section">
        <p className="section-title" style={{ marginBottom: 12 }}>Invite Friends</p>
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, var(--purple) 0%, #9B8FF5 100%)',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={() => setShowInvite(true)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 36 }}>👯</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 3 }}>
                Invite friends to PagePal
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                Build your reading community together
              </p>
            </div>
            <ChevronRight size={18} color="rgba(255,255,255,0.7)" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="section">
        <p className="section-title" style={{ marginBottom: 12 }}>Notifications</p>
        <div className="card" style={{ padding: '4px 16px' }}>
          {[
            { key: 'friendActivity', label: 'Friend activity', desc: 'When friends finish or update books' },
            { key: 'clubUpdates', label: 'Club updates', desc: 'New books, meeting reminders' },
            { key: 'pollReminders', label: 'Poll reminders', desc: 'When a club vote is ending soon' },
            { key: 'weeklyDigest', label: 'Weekly digest', desc: 'Your reading summary every Sunday' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="settings-row">
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{label}</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>{desc}</p>
              </div>
              <Toggle on={user.notifications[key]} onToggle={() => toggleNotif(key)} />
            </div>
          ))}
        </div>
      </div>

      {/* Account */}
      <div className="section">
        <p className="section-title" style={{ marginBottom: 12 }}>Account</p>
        <div className="card" style={{ padding: '4px 16px' }}>
          {[
            { icon: '🔒', label: 'Privacy settings', right: <ChevronRight size={16} color="var(--text-3)" /> },
            { icon: '📊', label: 'Reading statistics', right: <ChevronRight size={16} color="var(--text-3)" /> },
            { icon: '❓', label: 'Help & Support', right: <ChevronRight size={16} color="var(--text-3)" /> },
            { icon: '⭐', label: 'Rate PagePal', right: <ChevronRight size={16} color="var(--text-3)" /> },
          ].map(({ icon, label, right }) => (
            <div key={label} className="settings-row" onClick={() => {}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{label}</p>
              </div>
              {right}
            </div>
          ))}
          <div
            className="settings-row"
            onClick={() => {}}
            style={{ borderBottom: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 18 }}>🚪</span>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--peach)' }}>Sign Out</p>
            </div>
            <ChevronRight size={16} color="var(--text-3)" />
          </div>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)', marginBottom: 24 }}>
        PagePal v1.0.0 · Made with 📚
      </p>

      {showInvite && <InviteSheet onClose={() => setShowInvite(false)} />}
      {showEditProfile && (
        <EditProfileSheet
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSave={(data) => setUser(prev => ({ ...prev, ...data }))}
        />
      )}
    </div>
  )
}
