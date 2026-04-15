import { createContext, useContext, useReducer, useCallback } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
          )
        }
      }
      return { ...state, items: [...state.items, { ...action.product, qty: 1 }] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE_QTY':
      if (action.qty < 1) return { ...state, items: state.items.filter(i => i.id !== action.id) }
      return {
        ...state,
        items: state.items.map(i => i.id === action.id ? { ...i, qty: action.qty } : i)
      }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addToCart = useCallback((product) => dispatch({ type: 'ADD', product }), [])
  const removeFromCart = useCallback((id) => dispatch({ type: 'REMOVE', id }), [])
  const updateQty = useCallback((id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  const total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = state.items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ items: state.items, total, count, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)