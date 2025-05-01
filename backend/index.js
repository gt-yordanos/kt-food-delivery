import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import route files
import adminRoutes from './routes/admin.js';
import customerRoutes from './routes/customer.js';
import deliveryRoutes from './routes/delivery.js';
import deliveryPersonRoutes from './routes/deliveryPerson.js';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/order.js';
import restaurantRoutes from './routes/restaurant.js';
import restaurantOwnerRoutes from './routes/restaurantOwner.js';
import cartRoutes from './routes/cartRoutes.js';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// CORS middleware to dynamically allow all origins and credentials
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins
      callback(null, true); // `true` will allow any origin
    },
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

connectDB();
app.use(express.json());

// Register routes
app.use('/api/admin', adminRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/delivery-persons', deliveryPersonRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/restaurant-owners', restaurantOwnerRoutes);
app.use('/api/cart', cartRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Restaurant Delivery API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});