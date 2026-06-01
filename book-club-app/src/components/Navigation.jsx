import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, BookOpen, Settings } from 'lucide-react'

const tabs = [
  { path: '/home', label: 'Home', Icon: Home },
  { path: '/clubs', label: 'Clubs', Icon: Users },
  { path: '/library', label: 'Library', Icon: BookOpen },
  { path: '/settings', label: 'Settings', Icon: Settings },
]

export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="bottom-nav">
      {tabs.map(({ path, label, Icon }) => {
        const active = location.pathname === path
        return (
          <button
            key={path}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
