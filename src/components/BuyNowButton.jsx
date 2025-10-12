"use client";
import { useState } from "react";
import { useAuth } from "@/context/NewAuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function BuyNowButton({ cartItems, selectedAddressId }) {
  const {isAuthenticated, user, loading: isLoading} = useAuth();
  const [loading, setLoading] = useState(false);
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    
    // Redirect unauthenticated users
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/secure-payment/order-confirmation');
      return;
    }

    try {
      // Calculate pricing breakdown
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shipping = subtotal > 50 ? 0 : 5.99;
      const taxRate = 0.06625; // 6.625% Tax
      const tax = +(subtotal * taxRate).toFixed(2);
      const total = +(subtotal + shipping + tax).toFixed(2);

      const res = await fetch("/api/stripe/checkout/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: cartItems.map((item) => ({
            name: item.name,
            amount: item.price,
            quantity: item.quantity,
            image: item.image,
            currency: "usd", // Using USD currency
          })),
          // Include tax and shipping information
          tax: tax,
          shipping: shipping,
          subtotal: subtotal,
          total: total,
          // Include selected shipping address
          selectedAddressId: selectedAddressId,
        }),
      });

      const data = await res.json();

      if (data.url) window.location.href = data.url;
      else alert(data.error || "Failed to create checkout session");
    } catch (err) {
      console.error("Checkout error:", err);
      alert("An unexpected error occurred");
    } finally {
      setLoading(false);
      clearCart();
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={cartItems.length === 0 || loading}
      className="mt-6 w-full bg-accent-red hover:bg-accent-red/90 text-white py-4 rounded-lg font-semibold text-lg transition disabled:opacity-50"
    >
      {loading ? (
        "Processing..."
      ) : (
        <>
          <i className="fa-solid fa-credit-card mr-2" />
          Confirm & Pay
        </>
      )}
</button>
  );}

// Usage:
// import BuyNowButton from "@/components/BuyNowButton";

// export default function StorePage() {
//   const cartItems = [
//     { name: "Wireless Mouse", price: 25.99, quantity: 1, image: "/images/mouse.jpg" },
//     { name: "Mechanical Keyboard", price: 79.99, quantity: 1, image: "/images/keyboard.jpg" },
//   ];

//   return (
//     <div className="flex flex-col gap-6">
//       <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
//       <BuyNowButton cartItems={cartItems} />
//     </div>
//   );
// }
