import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,       // Avoid the deprecated parser
      useUnifiedTopology: true,   // Use the new topology engine
      useCreateIndex: true,       // Avoid deprecated ensureIndex
      useFindAndModify: false,    // Avoid deprecated findAndModify
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Stop the application if MongoDB connection fails
  }
};

export default connectDB;