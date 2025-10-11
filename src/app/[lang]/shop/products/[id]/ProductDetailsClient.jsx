


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProductDetailsClient({ product, lang, dict }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 16, seconds: 18 });
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});

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
    
    return product.variations.filter(variation => {
      return Object.keys(selectedAttributes).every(attrName => {
        return !selectedAttributes[attrName] || variation.attributes[attrName] === selectedAttributes[attrName];
      });
    });
  };

  // Handle attribute selection
  const handleAttributeChange = (attrName, value) => {
    const newAttributes = { ...selectedAttributes, [attrName]: value };
    setSelectedAttributes(newAttributes);
    
    // Find matching variation
    const matchingVariation = product.variations?.find(variation => 
      Object.keys(newAttributes).every(key => 
        !newAttributes[key] || variation.attributes[key] === newAttributes[key]
      )
    );
    
    setSelectedVariation(matchingVariation || null);
  };

  // Get attribute options from variations
  const getAttributeOptions = (attrName) => {
    if (!product.hasVariations || !product.variations) return [];
    
    const options = new Set();
    product.variations.forEach(variation => {
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

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = () => {
    // Validate required attributes for variations
    if (product.hasVariations) {
      const requiredAttributes = product.variationAttributes?.filter(attr => attr.required) || [];
      const missingAttributes = requiredAttributes.filter(attr => !selectedAttributes[attr.name]);
      
      if (missingAttributes.length > 0) {
        alert(`Please select: ${missingAttributes.map(attr => attr.name).join(', ')}`);
        return;
      }
      
      if (!selectedVariation) {
        alert("Please select all required product options");
        return;
      }
    } else {
      // Legacy validation for non-variation products
      if (product.sizes && !selectedSize) {
        alert("Please select a size");
        return;
      }
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
      variation: selectedVariation ? {
        attributes: selectedAttributes,
        variationId: selectedVariation._id || selectedVariation.id,
        sku: selectedVariation.sku
      } : undefined
    };

    addToCart(cartItem);
    alert("Product added to cart!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/order-confirmation");
  };

  return (
    <main className="bg-white text-gray-900">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 text-sm text-gray-600">
          <nav className="flex items-center space-x-2">
            <Link href={`/${lang}/shop`} className="hover:text-orange-600">Shop</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/${lang}/shop/products`} className="hover:text-orange-600">Products</Link>
            <span className="text-gray-400">/</span>
            <span className="font-medium text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Flash Sale Banner */}
      <div className="bg-orange-100 border-b border-orange-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="bg-orange-600 text-white px-3 py-1 rounded text-sm font-semibold">
                Flash Sales
              </span>
              <div className="flex items-center gap-2 text-orange-700">
                <span className="text-sm">Time Left:</span>
                <div className="flex items-center gap-1 font-mono text-lg font-bold">
                  <span className="bg-orange-600 text-white px-2 py-1 rounded">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span>:</span>
                  <span className="bg-orange-600 text-white px-2 py-1 rounded">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span>:</span>
                  <span className="bg-orange-600 text-white px-2 py-1 rounded">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-orange-700 text-sm">
              <span className="font-semibold">50 items left</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-8">
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
                  {product.discount && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
                      {product.discount}% OFF
                    </div>
                  )}
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
                            ? "border-orange-500 ring-2 ring-orange-200" 
                            : "border-gray-300 hover:border-orange-500"
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
                    <span className="text-sm text-gray-500">Brand:</span>
                    <span className="text-sm font-medium text-gray-700">TINMO</span>
                    <span className="text-sm text-gray-500">|</span>
                    <Link href="#" className="text-sm text-orange-600 hover:underline">
                      Similar products from TINMO
                    </Link>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900">
                    {product.name}
                  </h1>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fa-star text-yellow-400 ${i < 4 ? "fa-solid" : "fa-regular"}`} />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">
                    3.8 out of 5
                  </span>
                  <span className="text-gray-500 text-sm">
                    (225 verified ratings)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4">
                  <span className="text-orange-600 text-3xl font-bold">₦{finalPrice}</span>
                  {product.discount && (
                    <>
                      <span className="line-through text-gray-400 text-xl">₦{product.price}</span>
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
                        {product.discount}%
                      </span>
                    </>
                  )}
                </div>

                {/* Stock & Shipping */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">+ shipping from</span>
                    <span className="text-sm font-semibold text-gray-900">₦950</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    to <span className="font-medium">LEKKI-AJAH (SANGOTEDO)</span>
                  </div>
                  <div className="mt-2 text-sm">
                    {getCurrentStock() > 0 ? (
                      <span className="text-green-600 font-medium">
                        In Stock ({getCurrentStock()} items)
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">Out of Stock</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    {product.shortDescription ?? product.description}
                  </p>
                </div>

                {/* Dynamic Variations */}
                {product.hasVariations && product.variationAttributes?.length > 0 ? (
                  <div className="space-y-4">
                    {product.variationAttributes.map((attr, index) => {
                      const availableOptions = getAttributeOptions(attr.name);
                      
                      return (
                        <div key={index}>
                          <h4 className="font-semibold mb-3 text-gray-900">
                            {attr.name}
                            {attr.required && <span className="text-red-500 ml-1">*</span>}
                          </h4>
                          
                          {attr.type === 'color' ? (
                            <div className="flex gap-3 flex-wrap">
                              {availableOptions.map((option) => (
                                <button
                                  key={option}
                                  onClick={() => handleAttributeChange(attr.name, option)}
                                  className={`w-12 h-12 rounded-full border-2 ${
                                    selectedAttributes[attr.name] === option 
                                      ? "border-orange-600 ring-2 ring-orange-200" 
                                      : "border-gray-300 hover:border-orange-600"
                                  }`}
                                  style={{ backgroundColor: option.toLowerCase() }}
                                  title={option}
                                />
                              ))}
                            </div>
                          ) : attr.type === 'size' ? (
                            <div className="flex flex-wrap gap-2">
                              {availableOptions.map((option) => (
                                <button
                                  key={option}
                                  onClick={() => handleAttributeChange(attr.name, option)}
                                  className={`px-4 py-2 rounded-md border text-sm font-medium ${
                                    selectedAttributes[attr.name] === option
                                      ? "bg-orange-600 text-white border-orange-600"
                                      : "border-gray-300 hover:border-orange-600 hover:text-orange-600"
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          ) : attr.type === 'select' ? (
                            <select
                              value={selectedAttributes[attr.name] || ''}
                              onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                                  onClick={() => handleAttributeChange(attr.name, option)}
                                  className={`px-4 py-2 rounded-md border text-sm font-medium ${
                                    selectedAttributes[attr.name] === option
                                      ? "bg-orange-600 text-white border-orange-600"
                                      : "border-gray-300 hover:border-orange-600 hover:text-orange-600"
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
                        <h4 className="font-semibold mb-3 text-gray-900">Variation available</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-4 py-2 rounded-md border text-sm font-medium ${
                                selectedSize === size
                                  ? "bg-orange-600 text-white border-orange-600"
                                  : "border-gray-300 hover:border-orange-600 hover:text-orange-600"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.colors?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-gray-900">Color</h4>
                        <div className="flex gap-3 flex-wrap">
                          {product.colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`w-10 h-10 rounded-full border-2 ${
                                selectedColor === color ? "border-orange-600" : "border-gray-300"
                              }`}
                              style={{ backgroundColor: color.toLowerCase() }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Quantity */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Quantity</h4>
                  <div className="flex items-center border border-gray-300 rounded-md w-fit">
                    <button
                      className="px-4 py-2 text-gray-600 hover:text-orange-600 border-r"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-r border-gray-200 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      className="px-4 py-2 text-gray-600 hover:text-orange-600"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={getCurrentStock() === 0}
                    className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-orange-700 transition disabled:opacity-50"
                  >
                    Add to cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={getCurrentStock() === 0}
                    className="w-full border-2 border-orange-600 text-orange-600 py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 hover:text-white transition disabled:opacity-50"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Promotions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Promotions</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Call 07006000000 To Place Your Order</li>
                    <li>• Enjoy cheaper shipping fees when you select a PickUp Station at checkout.</li>
                  </ul>
                </div>

                {/* Delivery & Returns */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Delivery & Returns</h4>
                  <div className="text-sm text-gray-700">
                    <p className="mb-2">
                      The BEST products, delivered faster. Now PAY on DELIVERY, Cash or Bank Transfer Anywhere, Zero Wahala!
                    </p>
                    <Link href="#" className="text-orange-600 hover:underline">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seller Information */}
      <section className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Seller Information</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-store text-orange-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Mummy's choices store - AC</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>86% Seller Score</span>
                    <span>197 Followers</span>
                  </div>
                </div>
              </div>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700">
                Follow
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-green-600 font-semibold text-sm">Excellent</div>
                <div className="text-gray-600 text-xs">Shipping speed</div>
              </div>
              <div className="text-center">
                <div className="text-green-600 font-semibold text-sm">Good</div>
                <div className="text-gray-600 text-xs">Quality Score</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-600 font-semibold text-sm">Average</div>
                <div className="text-gray-600 text-xs">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <h3 className="font-semibold text-gray-900 mb-6">Verified Customer Feedback</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rating Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-gray-900">3.8</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fa-star text-yellow-400 ${i < 4 ? "fa-solid" : "fa-regular"}`} />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">225 verified ratings</div>
                </div>
                
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-6">{rating}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: `${rating === 5 ? 48 : rating === 4 ? 19 : rating === 3 ? 13 : rating === 2 ? 10 : 10}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {rating === 5 ? 107 : rating === 4 ? 43 : rating === 3 ? 30 : rating === 2 ? 23 : 22}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {/* Sample Reviews */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fa-star fa-solid text-yellow-400 text-sm" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">Tinmo Airfryer</span>
                    <span className="text-sm text-gray-500">Awesome product</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">09-10-2025 by Sandra</div>
                  <div className="text-xs text-green-600 font-medium">Verified Purchase</div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(2)].map((_, i) => (
                        <i key={i} className="fa-star fa-solid text-yellow-400 text-sm" />
                      ))}
                      {[...Array(3)].map((_, i) => (
                        <i key={i} className="fa-star fa-regular text-gray-300 text-sm" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">High in temperature degree</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Fine and big in shape, but not fast in drying</div>
                  <div className="text-sm text-gray-600 mb-2">08-10-2025 by Oluwaseyi</div>
                  <div className="text-xs text-green-600 font-medium">Verified Purchase</div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fa-star fa-solid text-yellow-400 text-sm" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">Good product</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">I love it</div>
                  <div className="text-sm text-gray-600 mb-2">07-10-2025 by Shobowale Esther</div>
                  <div className="text-xs text-green-600 font-medium">Verified Purchase</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition ${
                activeTab === "description"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-orange-600"
              }`}
            >
              Product details
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition ${
                activeTab === "specs"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-orange-600"
              }`}
            >
              Specifications
            </button>
          </div>

          {activeTab === "description" ? (
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="text-sm leading-relaxed">
                The Tinmo <strong>Air</strong> Fryer helps you reduce up to 90% of your fat intake enabling you to fry food without the need of oil. 
                It features rapid air technology, an adjustable temperature control and a 30 minute timer that helps you pre-set your cooking time. 
                The Integrated air filter keeps your kitchen fresh and clean while parts of the air fryer are removable and dishwasher safe. 
                Included is a recipe booklet to help you kick start your healthy cooking regime.
              </p>
              <p className="text-sm leading-relaxed">
                Cooking deliciously is not enough anymore. Healthy cooking is the new life hack! This Air Fryer with Rapid Air Circulation Technology 
                will be your new kitchen assistant with 90% fat free cooking even with deep fried food. Fry fish, chicken, meat or potatoes with this 
                quick and easy Air Fryer in a jiff. Enjoy Oil-free toasting!
              </p>
            </div>
          ) : (
            <div className="text-gray-700 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Key Features</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Healthy eating lifestyle.</li>
                    <li>• Adjustable timer.</li>
                    <li>• Temperature control.</li>
                    <li>• Capacity: 10L</li>
                    <li>• High-power performance for fast cooking results.</li>
                    <li>• Easy to clean and creates less smell than normal fryers.</li>
                    <li>• Non stick</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Specifications</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">SKU:</span>
                      <span>TI362HA6N95AXNAFAMZ</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Weight (kg):</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      <section className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <h3 className="font-semibold text-gray-900 mb-6">Related results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "Calphalon air fryer",
              "Nontoxic air fryer", 
              "Elite platinum air fryer",
              "Hello kitty air fryer",
              "Elite gourmet air fryer",
              "Ninja microwave air fryer"
            ].map((item, i) => (
              <div key={i} className="text-sm text-gray-600 hover:text-orange-600 cursor-pointer">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

