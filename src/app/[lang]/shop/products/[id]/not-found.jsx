// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-primary-bg text-primary-text flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-6">
        <div className="text-6xl font-bold text-accent-red">404</div>
        <h1 className="text-2xl font-semibold">Page Not Found</h1>
        <p className="text-primary-muted">
          The Page you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/shop/products"
          className="inline-block bg-accent-red hover:bg-opacity-90 text-white px-6 py-3 rounded-md font-medium transition"
        >
          Back to Shop
        </Link>
      </div>
    </main>
  )
}
