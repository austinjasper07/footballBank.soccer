"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { FaMinus, FaPlus } from "react-icons/fa";

export default function ProductDetailsClient({ product, lang, dict }) {
  const router = useRouter();
  const {
    addToCart,
    updateCartItemQuantity,
    isItemInCart,
    getCartItemQuantity,
    canAddToCart,
  } = useCart();
  const { toast } = useToast();

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [cartMessage, setCartMessage] = useState("");

  // Check if current product configuration is in cart
  const currentVariation = product.hasVariations ? selectedVariation : null;
  const isInCart = isItemInCart(product.id, currentVariation);
  const cartQuantity = getCartItemQuantity(product.id, currentVariation);

  // Get available stock for current product configuration
  const getAvailableStock = () => {
    if (product.hasVariations && selectedVariation) {
      return selectedVariation.stock || 0;
    }
    return product.stock || 0;
  };

  const availableStock = getAvailableStock();

  // Calculate final price based on selected variation
  const getFinalPrice = () => {
    if (product.hasVariations && selectedVariation) {
      const basePrice = selectedVariation.price;
      return product.discount
        ? (basePrice - basePrice * (product.discount / 100)).toFixed(2)
        : basePrice.toFixed(2);
    }
    return product.discount
      ? (product.price - product.price * (product.discount / 100)).toFixed(2)
      : product.price.toFixed(2);
  };

  const finalPrice = getFinalPrice();

  // Get available variations based on selected attributes
  const getAvailableVariations = () => {
    if (!product.hasVariations || !product.variations) return [];

    return product.variations.filter((variation) => {
      return Object.keys(selectedAttributes).every((attrName) => {
        return (
          !selectedAttributes[attrName] ||
          variation.attributes[attrName] === selectedAttributes[attrName]
        );
      });
    });
  };

  // Handle attribute selection
  const handleAttributeChange = (attrName, value) => {
    const newAttributes = { ...selectedAttributes, [attrName]: value };
    setSelectedAttributes(newAttributes);

    // Find matching variation
    const matchingVariation = product.variations?.find((variation) =>
      Object.keys(newAttributes).every(
        (key) =>
          !newAttributes[key] ||
          variation.attributes[key] === newAttributes[key]
      )
    );

    setSelectedVariation(matchingVariation || null);
  };

  // Get attribute options from variations
  const getAttributeOptions = (attrName) => {
    if (!product.hasVariations || !product.variations) return [];

    const options = new Set();
    product.variations.forEach((variation) => {
      if (variation.attributes[attrName]) {
        options.add(variation.attributes[attrName]);
      }
    });

    return Array.from(options);
  };

  // Get current stock
  const getCurrentStock = () => {
    if (product.hasVariations && selectedVariation) {
      return selectedVariation.stock || 0;
    }
    return product.stock || 0;
  };

  const handleAddToCart = () => {
    // Validate required attributes for variations
    if (product.hasVariations) {
      const requiredAttributes =
        product.variationAttributes?.filter((attr) => attr.required) || [];
      const missingAttributes = requiredAttributes.filter(
        (attr) => !selectedAttributes[attr.name]
      );

      if (missingAttributes.length > 0) {
        toast({
          title: "Missing Required Options",
          description: `Please select: ${missingAttributes.map((attr) => attr.name).join(", ")}`,
          variant: "destructive",
        });
        return;
      }

      if (!selectedVariation) {
        toast({
          title: "Selection Required",
          description: "Please select all required product options",
          variant: "destructive",
        });
        return;
      }
    } else {
      // Legacy validation for non-variation products
      if (product.sizes.length > 0 && !selectedSize) {
        toast({
          title: "Size Required",
          description: "Please select a size",
          variant: "destructive",
        });
        return;
      }
      if (product.colors.length > 1 && !selectedColor) {
        toast({
          title: "Color Required",
          description: "Please select a color",
          variant: "destructive",
        });
        return;
      }
    }

    // Check stock availability
    if (!canAddToCart(product.id, currentVariation, quantity, availableStock)) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${availableStock} items available in stock`,
        variant: "destructive",
      });
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: Number(finalPrice),
      image: selectedVariation?.image || product.image[0],
      quantity,
      size: selectedSize ?? undefined,
      color: selectedColor ?? undefined,
      // Add variation data
      variation: selectedVariation
        ? {
            attributes: selectedAttributes,
            variationId: selectedVariation._id || selectedVariation.id,
            sku: selectedVariation.sku,
          }
        : undefined,
    };

    addToCart(cartItem, availableStock);
    setCartMessage("Item added to Cart");
    setTimeout(() => setCartMessage(""), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/secure-payment/order-confirmation");
  };

  const handleQuantityUpdate = (newQuantity) => {
    if (newQuantity <= 0) {
      setCartMessage("Item removed from Cart");
      setTimeout(() => setCartMessage(""), 3000);
      toast({
        title: "Item Removed",
        description: "Product removed from cart",
        variant: "default",
      });
    } else {
      const currentQty = cartQuantity;
      if (newQuantity > currentQty) {
        setCartMessage("Item quantity increased by 1");
      } else if (newQuantity < currentQty) {
        setCartMessage("Item quantity decreased by 1");
      }
      setTimeout(() => setCartMessage(""), 3000);
      
      toast({
        title: "Quantity Updated",
        description: `Quantity updated to ${newQuantity}`,
        variant: "default",
      });
    }

    updateCartItemQuantity(product.id, currentVariation, newQuantity, availableStock);
  };

  return (
    <main className="max-w-7xl mx-auto text-gray-900">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 text-sm text-gray-600">
          <nav className="flex items-center space-x-2">
            <Link href={`/${lang}/shop`} className="hover:text-accent-red">
              Shop
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={`/${lang}/shop/products`}
              className="hover:text-accent-red"
            >
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-medium text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Gallery */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <div className="relative">
                  <Image
                    src={product.image[selectedImage]}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="w-full aspect-square object-cover rounded-lg border border-gray-200 shadow-sm cursor-zoom-in"
                    onClick={() => setShowZoom(true)}
                  />
                  {/* {product.discount && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
                      {product.discount}% OFF
                    </div>
                  )} */}
                </div>

                {product.image.length > 1 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto">
                    {product.image.map((img, i) => (
                      <Image
                        key={i}
                        src={img}
                        alt={`${product.name} thumbnail ${i + 1}`}
                        width={80}
                        height={80}
                        className={`w-20 h-20 object-cover rounded-md border cursor-pointer flex-shrink-0 ${
                          selectedImage === i
                            ? "border-accent-red ring-2 ring-red-200"
                            : "border-gray-300 hover:border-accent-red"
                        }`}
                        onClick={() => setSelectedImage(i)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Brand & Title */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-500">Category:</span>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {product.category}
                    </span>
                    {product.brand && (
                      <>
                        <span className="text-sm text-gray-500">|</span>
                        <span className="text-sm text-gray-500">Brand:</span>
                        <span className="text-sm font-medium text-gray-700">
                          {product.brand}
                        </span>
                      </>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900">
                    {product.name}
                  </h1>
                </div>

                {/* Rating - Only show if product has rating data */}
                {product.rating && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fa-star text-yellow-400 ${i < Math.floor(product.rating) ? "fa-solid" : "fa-regular"}`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">
                      {product.rating} out of 5
                    </span>
                    {product.reviewCount && (
                      <span className="text-gray-500 text-sm">
                        ({product.reviewCount} verified ratings)
                      </span>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-4">
                  {product.discount > 0 ? (
                    <>
                      <span className="text-accent-red text-3xl font-bold">
                        ₦{finalPrice}
                      </span>
                      <span className="line-through text-gray-400 text-lg">
                        ₦{product.price}
                      </span>
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
                        {product.discount}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-accent-red text-3xl font-bold">
                      ₦{finalPrice}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="bg-gray-50 rounded-lg">
                  <div className="text-sm">
                    {getCurrentStock() > 0 ? (
                      <span className="text-green-600 font-medium">
                        In Stock ({getCurrentStock()} items)
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>


                {/* Dynamic Variations */}
                {product.hasVariations &&
                product.variationAttributes?.length > 0 ? (
                  <div className="space-y-4">
                    {product.variationAttributes.map((attr, index) => {
                      const availableOptions = getAttributeOptions(attr.name);

                      return (
                        <div key={index}>
                          <h4 className="font-semibold mb-3 text-gray-900">
                            {attr.name}
                            {attr.required && (
                              <span className="text-accent-red ml-1">*</span>
                            )}
                          </h4>

                          {attr.type === "color" ? (
                            <div className="flex flex-wrap gap-2">
                              {availableOptions.map((option) => (
                                <button
                                  key={option}
                                  onClick={() =>
                                    handleAttributeChange(attr.name, option)
                                  }
                                  className={`px-4 py-2 rounded-md border text-sm font-medium ${
                                    selectedAttributes[attr.name] === option
                                      ? "bg-accent-red text-white border-accent-red"
                                      : "border-gray-300 hover:border-accent-red hover:text-accent-red"
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          ) : attr.type === "size" ? (
                            <div className="flex flex-wrap gap-2">
                              {availableOptions.map((option) => (
                                <button
                                  key={option}
                                  onClick={() =>
                                    handleAttributeChange(attr.name, option)
                                  }
                                  className={`px-4 py-2 rounded-md border text-sm font-medium ${
                                    selectedAttributes[attr.name] === option
                                      ? "bg-accent-red text-white border-accent-red"
                                      : "border-gray-300 hover:border-accent-red hover:text-accent-red"
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          ) : attr.type === "select" ? (
                            <select
                              value={selectedAttributes[attr.name] || ""}
                              onChange={(e) =>
                                handleAttributeChange(attr.name, e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent-red focus:border-accent-red"
                            >
                              <option value="">Select {attr.name}</option>
                              {availableOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {availableOptions.map((option) => (
                                <button
                                  key={option}
                                  onClick={() =>
                                    handleAttributeChange(attr.name, option)
                                  }
                                  className={`px-4 py-2 rounded-md border text-sm font-medium ${
                                    selectedAttributes[attr.name] === option
                                      ? "bg-accent-red text-white border-accent-red"
                                      : "border-gray-300 hover:border-accent-red hover:text-accent-red"
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Legacy size and color selection for non-variation products
                  <>
                    {product.sizes?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-gray-900">
                          Variation available
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-4 py-2 rounded-md border text-sm font-medium ${
                                selectedSize === size
                                  ? "bg-accent-red text-white border-accent-red"
                                  : "border-gray-300 hover:border-accent-red hover:text-accent-red"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.colors?.length > 0 && (
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold mb-3 text-gray-900">
                          Color:
                        </h4>
                        <div className="flex gap-3 flex-wrap">
                          {product.colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`px-2 py-1 rounded-md border text-sm cursor-pointer ${
                                selectedColor === color
                                  ? "bg-accent-red text-white border-accent-red"
                                  : "border-gray-300 hover:border-accent-red hover:text-accent-red"
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Cart Message */}
                {cartMessage && (
                  <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-2 rounded-md text-sm font-medium mb-4">
                    {cartMessage}
                  </div>
                )}

                {/* Conditional Quantity and CTA Section */}
                <div className="flex gap-4">
                  {isInCart ? (
                    /* Quantity Selector for items in cart */
                    <div className="flex items-center border border-gray-300 rounded-md w-fit">
                      <button
                        className="px-3 text-gray-600 hover:text-accent-red border-r border-gray-300"
                        onClick={() => handleQuantityUpdate(cartQuantity - 1)}
                      >
                        <FaMinus className="text-sm"/>
                      </button>
                      <span className="px-3 border-r border-gray-300 min-w-[40px] text-center text-gray-600">
                        {cartQuantity}
                      </span>
                      <button
                        className="px-3 text-gray-600 hover:text-accent-red border-l border-gray-200"
                        onClick={() => handleQuantityUpdate(cartQuantity + 1)}
                      >
                        <FaPlus className="text-sm"/>
                      </button>
                    </div>
                  ) : (
                    /* Add to cart button for items not in cart */
                    <button
                      onClick={handleAddToCart}
                      disabled={getCurrentStock() === 0}
                      className="p-4 bg-accent-red text-white rounded-lg font-semibold text-base hover:bg-red-700 transition disabled:opacity-50"
                    >
                      Add to cart
                    </button>
                  )}

                  {/* Buy Now button - always visible */}
                  <button
                    onClick={handleBuyNow}
                    disabled={getCurrentStock() === 0}
                    className="p-4 border-2 border-accent-red text-accent-red rounded-lg font-semibold text-lg hover:bg-accent-red hover:text-white transition disabled:opacity-50"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Promotions - Only show if there are active promotions */}
                {product.promotions && product.promotions.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Promotions
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {product.promotions.map((promotion, index) => (
                        <li key={index}>• {promotion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seller Information - Only show if seller data exists */}
      {product.seller && (
        <section className="bg-white border-t border-gray-200 py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Seller Information
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-store text-accent-red text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {product.seller.name}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {product.seller.score && (
                        <span>{product.seller.score}% Seller Score</span>
                      )}
                      {product.seller.followers && (
                        <span>{product.seller.followers} Followers</span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="bg-accent-red text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700">
                  Follow
                </button>
              </div>

              {product.seller.metrics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {product.seller.metrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className={`font-semibold text-sm ${metric.color}`}>
                        {metric.rating}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews - Only show if reviews exist */}
      {product.reviews && product.reviews.length > 0 && (
        <section className="bg-white border-t border-gray-200 py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            <h3 className="font-semibold text-gray-900 mb-6">
              Customer Reviews
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Rating Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-gray-900">
                      {product.rating || 0}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fa-star text-yellow-400 ${i < Math.floor(product.rating || 0) ? "fa-solid" : "fa-regular"}`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      {product.reviewCount || 0} verified ratings
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {product.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fa-star text-yellow-400 text-sm ${i < review.rating ? "fa-solid" : "fa-regular"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {review.title}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {review.comment}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {review.date} by {review.author}
                      </div>
                      {review.verified && (
                        <div className="text-xs text-green-600 font-medium">
                          Verified Purchase
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tabs Section */}
      <section className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition ${
                activeTab === "description"
                  ? "border-accent-red text-accent-red"
                  : "border-transparent text-gray-500 hover:text-accent-red"
              }`}
            >
              Product details
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition ${
                activeTab === "specs"
                  ? "border-accent-red text-accent-red"
                  : "border-transparent text-gray-500 hover:text-accent-red"
              }`}
            >
              Specifications
            </button>
          </div>

          {activeTab === "description" ? (
            <div className="text-gray-700 leading-relaxed space-y-4 max-w-4xl">
              <p className="text-sm leading-relaxed">{product.description}</p>
            </div>
          ) : (
            <div className="text-gray-700 leading-relaxed">
              {product.specifications ? (
                <div className="whitespace-pre-line text-sm">
                  {product.specifications}
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  No specifications available for this product.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Related Products - Only show if related products exist */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="bg-white border-t border-gray-200 py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <h3 className="font-semibold text-gray-900 mb-6">
              Related Products
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {product.relatedProducts.map((item, i) => (
                <Link
                  key={i}
                  href={`/${lang}/shop/products/${item.id}`}
                  className="text-sm text-gray-600 hover:text-accent-red cursor-pointer"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
