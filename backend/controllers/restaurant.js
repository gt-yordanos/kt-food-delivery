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
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    // Update only the fields sent
    Object.keys(req.body).forEach((key) => {
      restaurant[key] = req.body[key];
    });

    await restaurant.save();
    res.status(200).json({ message: 'Restaurant updated successfully', restaurant });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: error.message || 'Failed to update restaurant' });
  }
};

// Update the availability of a menu item
export const updateMenuItemAvailability = async (req, res) => {
  const { menuId } = req.params;
  const { available } = req.body;

  try {
    const menuItem = await Menu.findById(menuId);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    menuItem.available = available;

    await menuItem.save();

    return res.status(200).json({ message: 'Menu item availability updated', menuItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};