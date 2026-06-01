import { createContext, useContext } from 'react'

export const AppContext = createContext(null)

export function useApp() {
  return useContext(AppContext)
}
