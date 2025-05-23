import { Restaurant } from '../models/Restaurant.js';

// GET: Get Restaurant Info
export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne();
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Get error:', error);
    res.status(500).json({ message: 'Failed to retrieve restaurant details' });
  }
};

// POST: Create Restaurant (once)
export const addRestaurant = async (req, res) => {
  try {
    const existing = await Restaurant.findOne();
    if (existing) return res.status(400).json({ message: 'A restaurant already exists' });

    const newRestaurant = new Restaurant(req.body);
    await newRestaurant.save();
    res.status(201).json({ message: 'Restaurant created successfully', restaurant: newRestaurant });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ message: error.message || 'Failed to create restaurant' });
  }
};

// PATCH: Update restaurant fields
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne();
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Handle opening hours update
    if (req.body.openingHours) {
      for (const day in req.body.openingHours) {
        if (restaurant.openingHours[day]) {
          restaurant.openingHours[day] = {
            start: req.body.openingHours[day].start || restaurant.openingHours[day].start,
            end: req.body.openingHours[day].end || restaurant.openingHours[day].end
          };
        }
      }
    }

    // Handle social links update
    if (req.body.socialLinks) {
      restaurant.socialLinks = {
        ...restaurant.socialLinks,
        ...req.body.socialLinks
      };
    }

    // Update other fields
    const fieldsToUpdate = ['name', 'about', 'address', 'phone', 'email'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        restaurant[field] = req.body[field];
      }
    });

    const savedRestaurant = await restaurant.save();

    res.status(200).json({ 
      message: 'Restaurant updated successfully', 
      restaurant: savedRestaurant 
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message || 'Failed to update restaurant',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};