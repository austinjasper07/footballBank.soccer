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

  const addToCart = (item, availableStock) => {
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
            
          if (isSameItem) {
            const newQuantity = p.quantity + item.quantity;
            // Check if adding this quantity would exceed available stock
            if (availableStock && newQuantity > availableStock) {
              // Return the cart unchanged and let the calling component handle the error
              return p;
            }
            return { ...p, quantity: newQuantity };
          }
          return p;
        });
      }
      
      // For new items, check if the requested quantity exceeds available stock
      if (availableStock && item.quantity > availableStock) {
        // Return the cart unchanged and let the calling component handle the error
        return prev;
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

  const updateCartItemQuantity = (id, variation, newQuantity, availableStock) => {
    setCart((prev) => {
      return prev.map((item) => {
        const isSameItem = item.variation && variation
          ? item.id === id && JSON.stringify(item.variation.attributes) === JSON.stringify(variation.attributes)
          : item.id === id && !item.variation && !variation;
        
        if (isSameItem) {
          if (newQuantity <= 0) {
            return null; // Remove item if quantity is 0 or negative
          }
          // Check if the new quantity exceeds available stock
          if (availableStock && newQuantity > availableStock) {
            return item; // Return unchanged if would exceed stock
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean); // Remove null items
    });
  };

  const isItemInCart = (id, variation) => {
    return cart.some((item) => {
      if (item.variation && variation) {
        return item.id === id && 
               JSON.stringify(item.variation.attributes) === JSON.stringify(variation.attributes);
      }
      return item.id === id && !item.variation && !variation;
    });
  };

  const getCartItemQuantity = (id, variation) => {
    const item = cart.find((item) => {
      if (item.variation && variation) {
        return item.id === id && 
               JSON.stringify(item.variation.attributes) === JSON.stringify(variation.attributes);
      }
      return item.id === id && !item.variation && !variation;
    });
    return item ? item.quantity : 0;
  };

  const canAddToCart = (id, variation, quantity, availableStock) => {
    const existingItem = cart.find((item) => {
      if (item.variation && variation) {
        return item.id === id && 
               JSON.stringify(item.variation.attributes) === JSON.stringify(variation.attributes);
      }
      return item.id === id && !item.variation && !variation;
    });
    
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newTotalQuantity = currentQuantity + quantity;
    
    return availableStock ? newTotalQuantity <= availableStock : true;
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      updateCartItemQuantity, 
      isItemInCart, 
      getCartItemQuantity,
      canAddToCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
