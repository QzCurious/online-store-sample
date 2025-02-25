import { createContext, useContext, useState, useCallback } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  variants?: {
    [key: string]: string
  }
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((newItem: CartItem) => {
    setItems((currentItems) => {
      // 檢查是否已存在相同商品（包括規格）
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item.id === newItem.id &&
          JSON.stringify(item.variants) === JSON.stringify(newItem.variants)
      )

      if (existingItemIndex > -1) {
        // 如果存在，更新數量
        const updatedItems = [...currentItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity
        return updatedItems
      }

      // 如果不存在，新增商品
      return [...currentItems, newItem]
    })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId))
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  // 計算總金額
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // 計算商品總數
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
} 