import mongoose from 'mongoose';

// Default MongoDB connection string for development
const defaultUri = 'mongodb://localhost:27017/footballbank';
const uri = process.env.DATABASE_URL || defaultUri;

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
};

let isConnected = false;
let useFallback = false;

// Connection with error handling
const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(uri, options);
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.warn('MongoDB connection failed, using fallback mode:', error.message);
    useFallback = true;
  }
};

// Auto-connect in development
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoosePromise) {
    global._mongoosePromise = connectDB();
  }
} else {
  connectDB();
}

export default mongoose;
export { connectDB, isConnected, useFallback };
