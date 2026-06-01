import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppContext } from './context/AppContext'
import { mockUser, mockBooks, mockClubs } from './data/mockData'
import Navigation from './components/Navigation'
import HomeScreen from './screens/HomeScreen'
import ClubsScreen from './screens/ClubsScreen'
import LibraryScreen from './screens/LibraryScreen'
import SettingsScreen from './screens/SettingsScreen'

export default function App() {
  const [user, setUser] = useState(mockUser)
  const [books, setBooks] = useState(mockBooks)
  const [clubs, setClubs] = useState(mockClubs)

  return (
    <AppContext.Provider value={{ user, setUser, books, setBooks, clubs, setClubs }}>
      <div className="app-wrap">
        <div className="app-shell">
          <div className="screen">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/clubs" element={<ClubsScreen />} />
              <Route path="/library" element={<LibraryScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
            </Routes>
          </div>
          <Navigation />
        </div>
      </div>
    </AppContext.Provider>
  )
}
