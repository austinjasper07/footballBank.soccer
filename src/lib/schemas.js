import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String },
  role: { 
    type: String, 
    enum: ['admin', 'user', 'player', 'agent', 'editor'], 
    default: 'user' 
  },
  subscribed: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  // Address Fields (optional for users who only use shipping addresses)
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
    countryCode: { type: String }
  },
  // Multiple Shipping Addresses (up to 3)
  shippingAddresses: [{
    id: { type: String, required: true },
    name: { type: String, required: true }, // Address nickname (e.g., "Home", "Work", "Office")
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    countryCode: { type: String }, // Optional country code
    isDefault: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  // Legacy single shipping address (for backward compatibility)
  shippingAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
    countryCode: { type: String },
    isSameAsBilling: { type: Boolean, default: true }
  },
  // Notification Preferences
  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// OTP Token Schema
const otpTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String, required: true },
  token: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['LOGIN', 'SIGNUP', 'PASSWORD_RESET', 'EMAIL_VERIFICATION'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'VERIFIED', 'EXPIRED', 'FAILED'],
    default: 'PENDING' 
  },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date }
});


// Subscription Schema
const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['live_streaming', 'player_publication'],
    required: true 
  },
  plan: { 
    type: String, 
    enum: ['free', 'basic', 'premium'],
    required: true 
  },
  isActive: { type: Boolean, default: true },
  startedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  stripeSubId: { type: String, unique: true, sparse: true } // Stripe subscription ID
});


// Player Schema
const playerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: String, required: true },
  country: { type: String, required: true },
  countryCode: { type: String, required: true },
  position: { type: String, required: true },
  height: { type: String, required: true },
  weight: { type: String, required: true },
  foot: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  imageUrl: [{ type: String }],
  cvUrl: { type: String },
  description: { type: String },
  videoPrimary: { type: String },
  videoAdditional: [{ type: String }],
  featured: { type: Boolean, default: false },
  playerOfTheWeek: { type: Boolean, default: false },
  stats: { type: mongoose.Schema.Types.Mixed },
  clubHistory: { type: mongoose.Schema.Types.Mixed },
  contractStatus: { type: String },
  availableFrom: { type: String },
  preferredLeagues: { type: String },
  salaryExpectation: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  specifications: { type: String, default: "" },
  price: { type: Number, required: true },
  image: [{ type: String }],
  featured: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
  
  // Product Variation System
  hasVariations: { type: Boolean, default: false },
  variations: [{
    attributes: {
      type: Map,
      of: String
    },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    sku: { type: String }
  }],
  
  // Variation attributes configuration
  variationAttributes: [{
    name: { type: String, required: true }, // e.g., "Color", "Size", "Memory"
    type: { 
      type: String, 
      enum: ['color', 'size', 'text', 'select'],
      default: 'text'
    }
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Post Schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String },
  author: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: [{ type: String }],
  status: { 
    type: String, 
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Draft' 
  },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    variationId: { type: String }
  }],
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'fulfilled', 'completed', 'cancelled', 'refunded'],
    default: 'pending' 
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  fulfillmentStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'completed'],
    default: 'pending'
  },
  totalAmount: { type: Number, required: true },
  stripeSessionId: { type: String, unique: true, sparse: true }, // Store Stripe session ID for reference
  stripePaymentIntentId: { type: String }, // Store payment intent ID for refunds
  trackingNumber: { type: String }, // Shipping tracking number
  estimatedDelivery: { type: Date }, // Estimated delivery date
  actualDelivery: { type: Date }, // Actual delivery date
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
    updatedBy: { type: String, enum: ['system', 'admin', 'customer'] }
  }],
  shippingAddress: {
    id: { type: String },
    name: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
    countryCode: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

// Add methods to Order schema
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = 'system') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    note: note,
    updatedBy: updatedBy
  });
  this.updatedAt = new Date();
  return this.save();
};


orderSchema.methods.updatePaymentStatus = function(newStatus, note = '', updatedBy = 'system') {
  this.paymentStatus = newStatus;
  this.statusHistory.push({
    status: `payment_${newStatus}`,
    note: note,
    updatedBy: updatedBy
  });
  this.updatedAt = new Date();
  return this.save();
};

orderSchema.methods.updateFulfillmentStatus = function(newStatus, note = '', updatedBy = 'system') {
  this.fulfillmentStatus = newStatus;
  this.statusHistory.push({
    status: `fulfillment_${newStatus}`,
    note: note,
    updatedBy: updatedBy
  });
  this.updatedAt = new Date();
  return this.save();
};

// Payment Method Schema
const paymentMethodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stripePaymentMethodId: { type: String, required: true },
  stripeCustomerId: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Message Schema
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Submission Schema
const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: String, required: true },
  country: { type: String, required: true },
  countryCode: { type: String, required: true },
  position: { type: String, required: true },
  height: { type: String, required: true },
  weight: { type: String, required: true },
  foot: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  imageUrl: [{ type: String }],
  cvUrl: { type: String },
  description: { type: String },
  videoPrimary: { type: String },
  videoAdditional: [{ type: String }],
  stats: { type: mongoose.Schema.Types.Mixed },
  clubHistory: { type: mongoose.Schema.Types.Mixed },
  contractStatus: { type: String },
  availableFrom: { type: String },
  preferredLeagues: { type: String },
  salaryExpectation: { type: String },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING' 
  },
  rejectionReason: { type: String },
  submittedAt: { type: Date, default: Date.now }
});

// Pending Order Schema
const pendingOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  items: { type: mongoose.Schema.Types.Mixed }
});


// Affiliate Product Schema
const affiliateProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number, default: 0 },
  image: { type: String, required: true },
  images: [{ type: String }],
  category: { type: String, required: true },
  brand: { type: String },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  affiliateUrl: { type: String, required: true },
  amazonAsin: { type: String },
  featured: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


// Agent Schema for managing agent profile information
const agentSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "Ayodeji Fatade" },
  profilePhoto: { type: String, default: "/FootballBank_agent.jpg" },
  bio: { type: String, default: "Experienced football agent with a proven track record of helping players achieve their professional goals." },
  credentials: { type: String, default: "Licenced Agent" },
  location: { type: String, default: "United States" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models with proper error handling - use existing collection names from Prisma
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const OtpToken = mongoose.models.OtpToken || mongoose.model('OtpToken', otpTokenSchema);
export const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
export const Player = mongoose.models.Player || mongoose.model('Player', playerSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export const PaymentMethod = mongoose.models.PaymentMethod || mongoose.model('PaymentMethod', paymentMethodSchema);
export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
export const PendingOrder = mongoose.models.PendingOrder || mongoose.model('PendingOrder', pendingOrderSchema);
export const AffiliateProduct = mongoose.models.AffiliateProduct || mongoose.model('AffiliateProduct', affiliateProductSchema);
export const Agent = mongoose.models.Agent || mongoose.model('Agent', agentSchema);
