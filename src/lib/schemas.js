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
  // Billing Address Fields
  billingAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
    countryCode: { type: String }
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

// Session Schema
const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUsed: { type: Date, default: Date.now }
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
  price: { type: Number, required: true },
  image: [{ type: String }],
  featured: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
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
    price: { type: Number, required: true }
  }],
  status: { 
    type: String, 
    enum: ['pending', 'fulfilled', 'completed', 'cancelled'],
    default: 'pending' 
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  totalAmount: { type: Number, required: true },
  stripeSessionId: { type: String }, // Store Stripe session ID for reference
  createdAt: { type: Date, default: Date.now }
});

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
  submittedAt: { type: Date, default: Date.now }
});

// Pending Order Schema
const pendingOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  items: { type: mongoose.Schema.Types.Mixed }
});

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  size: { type: String },
  color: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
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

// Order Item Schema
const orderItemSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  affiliateProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'AffiliateProduct' },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  size: { type: String },
  color: { type: String },
  image: { type: String },
  type: { type: String, enum: ['product', 'affiliate'], default: 'product' }
});

// Create models with proper error handling - use existing collection names from Prisma
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const OtpToken = mongoose.models.OtpToken || mongoose.model('OtpToken', otpTokenSchema);
export const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);
export const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
export const Player = mongoose.models.Player || mongoose.model('Player', playerSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export const PaymentMethod = mongoose.models.PaymentMethod || mongoose.model('PaymentMethod', paymentMethodSchema);
export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
export const PendingOrder = mongoose.models.PendingOrder || mongoose.model('PendingOrder', pendingOrderSchema);
export const CartItem = mongoose.models.CartItem || mongoose.model('CartItem', cartItemSchema);
export const AffiliateProduct = mongoose.models.AffiliateProduct || mongoose.model('AffiliateProduct', affiliateProductSchema);
export const OrderItem = mongoose.models.OrderItem || mongoose.model('OrderItem', orderItemSchema);
