import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { discoverClubs } from '../data/mockData'
import BookCover from '../components/BookCover'
import { Plus, Users, ChevronRight, Crown, Check, X, Search } from 'lucide-react'

function Avatar({ initials, color, size = 28 }) {
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  )
}

function MemberStack({ members, total }) {
  const shown = members.slice(0, 4)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{ display: 'flex' }}>
        {shown.map((m, i) => (
          <div key={m.id} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: shown.length - i }}>
            <Avatar initials={m.initials} color={m.color} size={24} />
          </div>
        ))}
      </div>
      <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>
        {total} members
      </span>
    </div>
  )
}

function PollOption({ option, selected, voted, totalVotes, onSelect }) {
  const pct = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0

  return (
    <div
      className={`poll-option ${selected ? 'selected' : ''} ${voted ? 'voted' : ''}`}
      onClick={!voted ? onSelect : undefined}
    >
      {voted && (
        <div className="poll-bar" style={{ width: `${pct}%` }} />
      )}
      <div className="poll-content">
        <div
          style={{
            width: 36,
            height: 50,
            borderRadius: 6,
            background: option.coverColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }}
        >
          {option.coverEmoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{option.title}</p>
          <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{option.author}</p>
        </div>
        {voted ? (
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--purple)', minWidth: 36, textAlign: 'right' }}>
            {pct}%
          </span>
        ) : (
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: `2px solid ${selected ? 'var(--purple)' : 'var(--border-2)'}`,
              background: selected ? 'var(--purple)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {selected && <Check size={11} color="white" strokeWidth={3} />}
          </div>
        )}
      </div>
    </div>
  )
}

function ClubPoll({ club, onVote }) {
  const [selected, setSelected] = useState(club.poll.userVotedFor || null)
  const voted = club.poll.userVoted

  return (
    <div
      style={{
        background: 'var(--purple-light)',
        borderRadius: 'var(--radius-md)',
        padding: 14,
        marginTop: 12,
        border: '1px solid rgba(116,97,239,0.15)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: 14 }}>🗳️</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--purple)' }}>{club.poll.question}</p>
          <p style={{ fontSize: 11, color: 'var(--text-3)' }}>
            Ends in {club.poll.endsIn} · {club.poll.totalVotes} votes
          </p>
        </div>
      </div>
      {club.poll.options.map(opt => (
        <PollOption
          key={opt.id}
          option={opt}
          selected={selected === opt.id}
          voted={voted}
          totalVotes={club.poll.totalVotes}
          onSelect={() => setSelected(opt.id)}
        />
      ))}
      {!voted && (
        <button
          className="btn-primary"
          style={{ width: '100%', marginTop: 4 }}
          disabled={!selected}
          onClick={() => selected && onVote(club.id, selected)}
        >
          Cast My Vote
        </button>
      )}
      {voted && (
        <p style={{ fontSize: 12, color: 'var(--purple)', textAlign: 'center', fontWeight: 600, marginTop: 4 }}>
          ✓ You voted
        </p>
      )}
    </div>
  )
}

function ClubCard({ club, onVote }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div
        style={{ display: 'flex', gap: 12, cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: club.coverColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          {club.coverEmoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{club.name}</p>
            {club.isAdmin && (
              <span style={{ background: 'var(--yellow-light)', color: '#C49B00', borderRadius: 99, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>
                Admin
              </span>
            )}
          </div>
          <MemberStack members={club.members} total={club.memberCount} />
          {club.currentBook && (
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
              Reading: <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>{club.currentBook.title}</span>
            </p>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <ChevronRight
            size={16}
            color="var(--text-3)"
            style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
          />
          {club.poll && !club.poll.userVoted && (
            <span style={{ background: 'var(--peach)', color: 'white', borderRadius: 99, padding: '2px 8px', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>
              Vote!
            </span>
          )}
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 14, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          {club.currentBook && (
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <BookCover book={club.currentBook} size="sm" />
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>Currently Reading</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{club.currentBook.title}</p>
                <p style={{ fontSize: 12, color: 'var(--text-2)' }}>{club.currentBook.author}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <div className="progress-track" style={{ flex: 1, height: 5 }}>
                    <div className="progress-fill" style={{ width: `${club.currentBook.progress}%` }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--purple)' }}>
                    {club.currentBook.progress}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {club.recentActivity?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent</p>
              {club.recentActivity.map((item, i) => (
                <p key={i} style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{item.user}</span>
                  {' '}{item.action}{' '}
                  <span style={{ color: 'var(--text-3)' }}>· {item.time}</span>
                </p>
              ))}
            </div>
          )}

          <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
            📅 Next meeting: <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>{club.nextMeeting}</span>
          </p>

          {club.poll && <ClubPoll club={club} onVote={onVote} />}
        </div>
      )}
    </div>
  )
}

function CreateClubModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [emoji, setEmoji] = useState('📚')
  const emojis = ['📚', '🌌', '🔍', '🌱', '🏛️', '🚀', '💕', '🎭', '🌊', '🦉']

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 20 }}>
          Create a Club
        </h2>
        <div className="form-group">
          <label className="form-label">Club Emoji</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {emojis.map(e => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: `2px solid ${emoji === e ? 'var(--purple)' : 'var(--border-2)'}`,
                  background: emoji === e ? 'var(--purple-light)' : 'var(--bg)',
                  fontSize: 20,
                  cursor: 'pointer',
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Club Name</label>
          <input
            className="input"
            placeholder="e.g. The Bookworms"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="input"
            placeholder="What's your club about?"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={3}
            style={{ resize: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            style={{ flex: 2 }}
            disabled={!name.trim()}
            onClick={() => { onCreate({ name, desc, emoji }); onClose() }}
          >
            Create Club
          </button>
        </div>
      </div>
    </div>
  )
}

function InviteModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Invite Friends</h2>
        <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 20 }}>
          Share the love of reading with your friends!
        </p>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>🎉</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Invite sent!</p>
            <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Your friend will receive an email shortly.</p>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="input"
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <button
              className="btn-primary"
              style={{ width: '100%', marginBottom: 10 }}
              onClick={() => { if (email) setSent(true) }}
            >
              Send Invite
            </button>
            <button
              className="btn-secondary"
              style={{ width: '100%' }}
              onClick={() => {
                navigator.clipboard?.writeText('https://pagepal.app/invite/alexchen')
                alert('Link copied!')
              }}
            >
              📋 Copy Invite Link
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function ClubsScreen() {
  const { clubs, setClubs } = useApp()
  const [showCreate, setShowCreate] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [searchDiscover, setSearchDiscover] = useState('')

  const handleVote = (clubId, optionId) => {
    setClubs(prev => prev.map(c => {
      if (c.id !== clubId || !c.poll) return c
      return {
        ...c,
        poll: {
          ...c.poll,
          userVoted: true,
          userVotedFor: optionId,
          totalVotes: c.poll.totalVotes + 1,
          options: c.poll.options.map(o =>
            o.id === optionId ? { ...o, votes: o.votes + 1 } : o
          ),
        },
      }
    }))
  }

  const handleCreate = ({ name, desc, emoji }) => {
    const newClub = {
      id: Date.now(),
      name,
      description: desc,
      coverColor: 'var(--purple)',
      coverEmoji: emoji,
      memberCount: 1,
      isAdmin: true,
      currentBook: null,
      nextMeeting: 'TBD',
      members: [{ id: 1, name: 'Alex Chen', initials: 'AC', color: '#7461EF' }],
      poll: null,
      recentActivity: [],
    }
    setClubs(prev => [newClub, ...prev])
  }

  const filtered = discoverClubs.filter(c =>
    c.name.toLowerCase().includes(searchDiscover.toLowerCase())
  )

  return (
    <div className="page-pad">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          My Clubs
        </h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-secondary" onClick={() => setShowInvite(true)}>
            Invite
          </button>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={16} strokeWidth={2.5} /> Create
          </button>
        </div>
      </div>

      {/* My Clubs */}
      <div className="section">
        {clubs.map(club => (
          <ClubCard key={club.id} club={club} onVote={handleVote} />
        ))}
      </div>

      {/* Discover */}
      <div className="section">
        <div className="section-header">
          <p className="section-title">Discover Clubs</p>
        </div>
        <div
          style={{
            position: 'relative',
            marginBottom: 12,
          }}
        >
          <Search
            size={15}
            color="var(--text-3)"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            className="input"
            placeholder="Search clubs..."
            value={searchDiscover}
            onChange={e => setSearchDiscover(e.target.value)}
            style={{ paddingLeft: 34 }}
          />
        </div>
        {filtered.map(club => (
          <div
            key={club.id}
            className="card"
            style={{ marginBottom: 10, display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}
            onClick={() => alert(`Joining ${club.name}! (demo)`)}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: club.coverColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {club.coverEmoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{club.name}</p>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>{club.description}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>
                  <Users size={10} style={{ display: 'inline', marginRight: 3 }} />
                  {club.memberCount} members
                </span>
                <span style={{
                  background: 'var(--purple-light)',
                  color: 'var(--purple)',
                  borderRadius: 99,
                  padding: '1px 8px',
                  fontSize: 10,
                  fontWeight: 700,
                }}>
                  {club.genre}
                </span>
              </div>
            </div>
            <button
              className="btn-outline"
              style={{ padding: '7px 14px', fontSize: 12 }}
              onClick={e => { e.stopPropagation(); alert(`Joined ${club.name}!`) }}
            >
              Join
            </button>
          </div>
        ))}
      </div>

      {showCreate && <CreateClubModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  )
}
