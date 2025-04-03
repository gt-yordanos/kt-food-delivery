import { Restaurant } from '../models/Restaurant.js';

// Default restaurant data
export const defaultRestaurantData = {
  name: "My Awesome Restaurant",
  about: "Serving delicious food since 2024!",
  address: "123 Main Street, Food City",
  phone: "+1234567890",
  email: "contact@restaurant.com",
  openingHours: {
    monday: "9:00 AM - 10:00 PM",
    tuesday: "9:00 AM - 10:00 PM",
    wednesday: "9:00 AM - 10:00 PM",
    thursday: "9:00 AM - 10:00 PM",
    friday: "9:00 AM - 11:00 PM",
    saturday: "10:00 AM - 11:00 PM",
    sunday: "10:00 AM - 9:00 PM",
  },
  socialLinks: {
    facebook: "https://facebook.com/myrestaurant",
    twitter: "https://twitter.com/myrestaurant",
    instagram: "https://instagram.com/myrestaurant",
    linkedin: "",
    youtube: "",
    tiktok: "",
  },
};

// Get Restaurant Details (Auto-create if not found)
export const getRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findOne();

    // Auto-create the restaurant if none exists
    if (!restaurant) {
      restaurant = new Restaurant(defaultRestaurantData);
      await restaurant.save();
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve restaurant details' });
  }
};

// Add New Restaurant (Disabled since only one instance is allowed)
export const addRestaurant = async (req, res) => {
  return res.status(400).json({ message: 'Only one restaurant instance is allowed. Use update instead.' });
};

// Update Restaurant
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne();
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Update only the provided fields
    Object.keys(req.body).forEach((key) => {
      restaurant[key] = req.body[key];
    });

    await restaurant.save();
    res.status(200).json({ message: 'Restaurant updated successfully', restaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Failed to update restaurant' });
  }
};