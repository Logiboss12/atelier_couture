import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

function sameLine(item, id, kind) {
  return item.id === id && item.kind === kind
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = (product, kind = 'product') => {
    setItems((prev) => {
      const existing = prev.find((i) => sameLine(i, product.id, kind))
      if (existing) {
        return prev.map((i) => (sameLine(i, product.id, kind) ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { id: product.id, kind, nom: product.nom, prix: product.prix, unite: product.unite || 'unité', qty: 1 }]
    })
  }

  const incrementItem = (id, kind = 'product') => {
    setItems((prev) => prev.map((i) => (sameLine(i, id, kind) ? { ...i, qty: i.qty + 1 } : i)))
  }

  const decrementItem = (id, kind = 'product') => {
    setItems((prev) => prev
      .map((i) => (sameLine(i, id, kind) ? { ...i, qty: i.qty - 1 } : i))
      .filter((i) => i.qty > 0))
  }

  const removeItem = (id, kind = 'product') => {
    setItems((prev) => prev.filter((i) => !sameLine(i, id, kind)))
  }

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])
  const total = useMemo(() => items.reduce((sum, i) => sum + i.qty * i.prix, 0), [items])
  const clearCart = () => setItems([])

  const value = { items, addItem, incrementItem, decrementItem, removeItem, clearCart, count, total }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
