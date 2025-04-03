import { Restaurant } from '../models/Restaurant.js';

// Get Restaurant Details
export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne();
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve restaurant details' });
  }
};

// Add New Restaurant (Only If None Exists)
export const addRestaurant = async (req, res) => {
  try {
    const existingRestaurant = await Restaurant.findOne();
    if (existingRestaurant) {
      return res.status(400).json({ message: 'A restaurant already exists' });
    }

    const newRestaurant = new Restaurant(req.body);
    await newRestaurant.save();
    res.status(201).json({ message: 'Restaurant created successfully', restaurant: newRestaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Failed to create restaurant' });
  }
};

// Update Specific Fields of Restaurant
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