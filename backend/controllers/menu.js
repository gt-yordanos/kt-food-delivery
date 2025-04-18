import { Menu } from '../models/Menu.js';

  export const addMenuItem = async (req, res) => {
    try {
      const { name, description, price, category } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : '';

      const newMenuItem = new Menu({
        name,
        description,
        price,
        category,
        image,
      });

      await newMenuItem.save();
      res.status(201).json({ message: 'Menu item added successfully', newMenuItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to add menu item' });
    }
  };

  // Update an existing menu item (Admin and RestaurantOwner can perform this)
  export const updateMenuItem = async (req, res) => {
    try {
      const { menuId } = req.params;
      const { name, description, price, category, available } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : undefined;

      const updatedFields = {
        name,
        description,
        price,
        category,
        available,
      };

      if (image) {
        updatedFields.image = image;
      }

      const updatedMenuItem = await Menu.findByIdAndUpdate(
        menuId,
        updatedFields,
        { new: true }
      );

      if (!updatedMenuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }

      res.status(200).json({ message: 'Menu item updated successfully', updatedMenuItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update menu item' });
    }
  };

// Delete a menu item (Admin and RestaurantOwner can perform this)
export const deleteMenuItem = async (req, res) => {
  try {
    const { menuId } = req.params;

    const deletedMenuItem = await Menu.findByIdAndDelete(menuId);

    if (!deletedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete menu item' });
  }
};

// Get all menu items (Accessible by everyone)
export const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.status(200).json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
};

// Get menu items by category (Accessible by everyone)
export const getMenuByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const menuItems = await Menu.find({ category });

    if (menuItems.length === 0) {
      return res.status(404).json({ message: 'No menu items found for this category' });
    }

    res.status(200).json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch menu items by category' });
  }
};

// Search menu items by name (Accessible by everyone)
export const searchMenuByName = async (req, res) => {
  try {
    const { name } = req.query;

    const menuItems = await Menu.find({ name: { $regex: name, $options: 'i' } });

    if (menuItems.length === 0) {
      return res.status(404).json({ message: 'No menu items found with this name' });
    }

    res.status(200).json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to search menu items by name' });
  }
};