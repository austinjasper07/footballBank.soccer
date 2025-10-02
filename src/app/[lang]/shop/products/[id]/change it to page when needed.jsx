'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { getProductById } from '@/actions/publicActions'

export default function ProductDetailsClient() {
  const params = useParams()
  const id = params?.id
  const router = useRouter()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id)
        if (!res) notFound()
        setProduct(res)
      } catch {
        // router.replace('/404')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProduct()
  }, [id, router])

  if (loading) return <div className="text-center py-24">Loading product...</div>
  if (!product) return <div className="text-center py-24 text-accent-red">Product not found.</div>

  const finalPrice = product.discount
    ? (product.price - product.price * (product.discount / 100)).toFixed(2)
    : product.price.toFixed(2)

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) {
      alert('Please select a size')
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: Number(finalPrice),
      image: product.image[0],
      quantity,
      size: selectedSize ?? undefined,
      color: selectedColor ?? undefined,
    })

    alert('Product added to cart!')
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  return (
    <main className="bg-primary-bg font-inter text-primary-text">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <Image
              src={product.image[0]}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-auto object-cover rounded-xl bg-primary-card border border-divider"
            />
            {product.image.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.image.map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-20 object-cover rounded-lg bg-primary-card border hover:border-accent-red"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className=" font-bold text-3xl md:text-4xl">{product.name}</h1>

            <div className="flex items-center gap-4">
              <span className="text-accent-red font-bold text-3xl">£{finalPrice}</span>
              {product.discount && (
                <>
                  <span className="line-through text-primary-muted text-xl">£{product.price}</span>
                  <span className="bg-accent-green text-white px-2 py-1 rounded text-sm">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-primary-muted text-sm">{product.description}</p>

            {/* Size Picker */}
            {product.sizes?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Size</h4>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border px-3 py-2 rounded-lg ${
                        selectedSize === size
                          ? 'border-accent-red bg-accent-red text-white'
                          : 'border-divider bg-primary-card hover:border-accent-red'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Picker */}
            {product.colors?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Color</h4>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color ? 'border-accent-red' : 'border-divider'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h4 className="font-semibold mb-2">Quantity</h4>
              <div className="flex items-center border border-divider rounded-lg w-32 bg-primary-card">
                <button
                  className="px-3 py-2 text-primary-text hover:text-accent-red"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span className="px-4 py-2 border-l border-r border-divider">{quantity}</span>
                <button
                  className="px-3 py-2 text-primary-text hover:text-accent-red"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock */}
            <div className="text-sm">
              {product.stock > 0 ? (
                <span className="text-accent-green">In Stock ({product.stock} items)</span>
              ) : (
                <span className="text-accent-red">Out of Stock</span>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <button
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                className="w-full bg-accent-red hover:bg-accent-red/90 text-white py-4 rounded-lg font-semibold text-lg transition disabled:opacity-50"
              >
                <i className="fa-solid fa-cart-shopping mr-2" />
                Add to Cart
              </button>

              <button
                disabled={product.stock === 0}
                onClick={handleBuyNow}
                className="w-full bg-primary-card border border-divider hover:border-accent-red text-primary-text hover:text-accent-red py-4 rounded-lg font-semibold transition disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-primary-muted pt-4 border-t border-divider">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-truck-fast text-accent-green" />
                Free Delivery
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-shield text-accent-green" />
                2 Year Warranty
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-rotate-left text-accent-green" />
                30 Day Returns
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
