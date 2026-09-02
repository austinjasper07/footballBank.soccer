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
export const Player = mongoose.models.Player || mongoose.model('Player', playerSchema);
export const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export const PaymentMethod = mongoose.models.PaymentMethod || mongoose.model('PaymentMethod', paymentMethodSchema);
export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
export const Agent = mongoose.models.Agent || mongoose.model('Agent', agentSchema);
