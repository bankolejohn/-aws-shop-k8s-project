import { createContext, useContext, useReducer, useCallback } from 'react'

const WishlistContext = createContext(null)

function wishlistReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE':
      return state.includes(action.id)
        ? state.filter(id => id !== action.id)
        : [...state, action.id]
    default:
      return state
  }
}

export function WishlistProvider({ children }) {
  const [items, dispatch] = useReducer(wishlistReducer, [])
  const toggle = useCallback((id) => dispatch({ type: 'TOGGLE', id }), [])
  const has = useCallback((id) => items.includes(id), [items])

  return (
    <WishlistContext.Provider value={{ items, toggle, has, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)