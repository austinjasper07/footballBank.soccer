'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      // Create a unique key for cart items that includes variation data
      const itemKey = item.variation 
        ? `${item.id}-${JSON.stringify(item.variation.attributes)}`
        : item.id;
      
      const exists = prev.find((p) => {
        if (p.variation && item.variation) {
          return p.id === item.id && 
                 JSON.stringify(p.variation.attributes) === JSON.stringify(item.variation.attributes);
        }
        return p.id === item.id && !p.variation && !item.variation;
      });
      
      if (exists) {
        return prev.map((p) => {
          const isSameItem = p.variation && item.variation
            ? p.id === item.id && JSON.stringify(p.variation.attributes) === JSON.stringify(item.variation.attributes)
            : p.id === item.id && !p.variation && !item.variation;
            
          return isSameItem ? { ...p, quantity: p.quantity + item.quantity } : p;
        });
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
