// pages/order-confirmed.tsx
import Head from "next/head";


const OrderConfirmedPage = () => {
  return (
    <>
      <Head>
        <title>Order Confirmed | FootballBank</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
      </Head>

      <main className="bg-primary-bg text-primary-text min-h-screen">
       
        {/* Order Confirmation Content */}
        <section className="py-16 md:py-24 min-h-[80vh]">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-12">
                <div className="w-24 h-24 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-check text-accent-green text-4xl"></i>
                </div>
                <h1 className=" font-bold text-3xl md:text-4xl mb-4">Your Order is Confirmed!</h1>
                <p className="text-primary-muted text-lg">Thank you for your purchase. We&apos;ve received your order and will process it shortly.</p>
              </div>

              <div className="bg-primary-secondary rounded-xl border border-divider p-8 mb-8 text-left shadow-lg">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-divider">
                  <h2 className=" font-semibold text-xl">Order Summary</h2>
                  <span className="text-accent-green font-medium">
                    <i className="fa-solid fa-circle-check mr-2"></i>
                    Confirmed
                  </span>
                </div>

                <div className="mb-6 flex justify-between items-center">
                  <span className="text-primary-muted">Order Number:</span>
                  <span className="font-mono font-medium text-accent-red">#FB-2024-001247</span>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-4">Items Purchased:</h3>
                  {[{
                    name: "Premium Training Kit",
                    details: "Size: L, Color: Navy Blue",
                    icon: "shirt",
                    price: "$89.99",
                    qty: 1,
                    color: "blue"
                  }, {
                    name: "Professional Football",
                    details: "FIFA Approved, Size 5",
                    icon: "futbol",
                    price: "$49.99",
                    qty: 1,
                    color: "green"
                  }, {
                    name: "Scouting Guide eBook",
                    details: "Digital Download",
                    icon: "book",
                    price: "$19.99",
                    qty: 1,
                    color: "amber"
                  }].map(({ name, details, icon, price, qty, color }, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-divider last:border-none">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-accent-${color} bg-opacity-20 rounded-lg flex items-center justify-center`}>
                          <i className={`fa-solid fa-${icon} text-accent-${color}`}></i>
                        </div>
                        <div>
                          <div className="font-medium">{name}</div>
                          <div className="text-primary-muted text-sm">{details}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{price}</div>
                        <div className="text-primary-muted text-sm">Qty: {qty}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-6 p-4 bg-accent-green/10 rounded-lg border border-accent-green border-opacity-20">
                  <div className="flex items-center gap-3 mb-2">
                    <i className="fa-solid fa-truck text-accent-green"></i>
                    <span className="font-medium">Estimated Delivery</span>
                  </div>
                  <p className="text-primary-muted">December 20-22, 2024</p>
                  <p className="text-sm text-primary-muted mt-1">Standard shipping to 123 Main St, London, UK</p>
                </div>

                <div className="pt-6 border-t border-divider space-y-2">
                  <div className="flex justify-between">
                    <span className="text-primary-muted">Subtotal:</span>
                    <span>$159.97</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-muted">Shipping:</span>
                    <span>$9.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-muted">Tax:</span>
                    <span>$16.00</span>
                  </div>
                  <div className="flex justify-between text-xl font-semibold pt-2 border-t border-divider">
                    <span>Total:</span>
                    <span className="text-accent-green">$185.96</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-accent-red hover:bg-opacity-80 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <i className="fa-solid fa-shopping-bag"></i>
                  Continue Shopping
                </button>
                <button className="bg-primary-secondary hover:bg-opacity-80 text-primary-text border border-divider px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <i className="fa-solid fa-headset"></i>
                  Contact Support
                </button>
              </div>

              <div className="mt-12 p-6 bg-primary-secondary rounded-xl border border-divider">
                <h3 className=" font-semibold text-lg mb-4">What&apos;s Next?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-envelope text-accent-red"></i>
                    <span>Confirmation email sent to your inbox</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-box text-accent-amber"></i>
                    <span>Order will be processed within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-bell text-accent-green"></i>
                    <span>Tracking info will be provided soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default OrderConfirmedPage;