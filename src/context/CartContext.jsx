import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);
const storageKey = "northstar_cart";

function initialCart() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(initialCart);
  const commit = (next) => {
    setItems(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };
  const add = (product, quantity = 1) => {
    const existing = items.find((item) => item.product._id === product._id);
    if (existing) {
      return commit(items.map((item) =>
        item.product._id === product._id
          ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
          : item
      ));
    }
    commit([...items, { product, quantity: Math.min(product.stock, quantity) }]);
  };
  const update = (id, quantity) => commit(items.map((item) =>
    item.product._id === id
      ? { ...item, quantity: Math.max(1, Math.min(item.product.stock, quantity)) }
      : item
  ));
  const remove = (id) => commit(items.filter((item) => item.product._id !== id));
  const clear = () => commit([]);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const value = {
    items, add, update, remove, clear, subtotal,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
