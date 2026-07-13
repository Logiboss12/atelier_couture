import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { id: product.id, nom: product.nom, prix: product.prix, qty: 1 }]
    })
  }

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])

  const value = { items, addItem, count }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
