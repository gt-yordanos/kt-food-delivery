import { Menu } from '../models/Menu.js';

// **Add a new menu item**
export const addMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, available } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const newMenuItem = new Menu({
      name,
      description,
      price,
      category,
      available,
      image,
    });

    await newMenuItem.save();
    res.status(201).json({ message: 'Menu item added successfully', newMenuItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add menu item' });
  }
};

// **Update an existing menu item**
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

    const updatedMenuItem = await Menu.findByIdAndUpdate(menuId, updatedFields, { new: true });

    if (!updatedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({ message: 'Menu item updated successfully', updatedMenuItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update menu item' });
  }
};

// **Delete a menu item**
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

// **Get all menu items** (Accessible by anyone)
export const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.status(200).json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
};

// **Get all available menu items** (Accessible only if available)
export const getAvailableMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find({ available: true }); // Only available items
    res.status(200).json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch available menu items' });
  }
};

// **Get a menu item by ID** (Accessible by anyone)
export const getMenuItemById = async (req, res) => {
  try {
    const { menuId } = req.params;

    const menuItem = await Menu.findById(menuId);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch menu item by ID' });
  }
};

// **Get a menu item by ID** (Accessible only if available)
export const getAvailableMenuItemById = async (req, res) => {
  try {
    const { menuId } = req.params;

    const menuItem = await Menu.findOne({ _id: menuId, available: true });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found or unavailable' });
    }

    res.status(200).json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch available menu item by ID' });
  }
};

// **Get menu items by category** (Accessible by anyone)
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

// **Get menu items by category** (Accessible only if available)
export const getAvailableMenuByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const menuItems = await Menu.find({ category, available: true });

    if (menuItems.length === 0) {
      return res.status(404).json({ message: 'No available menu items found for this category' });
    }

    res.status(200).json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch available menu items by category' });
  }
};

// **Search menu items by name** (Accessible by anyone)
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

// **Search menu items by name** (Accessible only if available)
export const searchAvailableMenuByName = async (req, res) => {
  try {
    const { name } = req.query;

    const menuItems = await Menu.find({
      name: { $regex: name, $options: 'i' },
      available: true, // Only available items
    });

    if (menuItems.length === 0) {
      return res.status(404).json({ message: 'No available menu items found with this name' });
    }

    res.status(200).json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to search available menu items by name' });
  }
};