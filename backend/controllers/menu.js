import { Menu } from '../models/Menu.js';

// **Add a new menu item**
export const addMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, available } = req.body;

    console.log('Category:', category);
    console.log('Available:', available);

    const image = req.file ? `/uploads/${req.file.filename}` : '';
    console.log('Image Path:', image);

    const newMenuItem = new Menu({
      name,
      description,
      price,
      category,
      available,
      image,
    });

    console.log('New Menu Item:', newMenuItem);

    await newMenuItem.save();

    res.status(201).json({ message: 'Menu item added successfully', newMenuItem });
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ message: 'Failed to add menu item' });
  }
};

// **Update an existing menu item**
export const updateMenuItem = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { name, description, price, category, available } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Debug logs
    console.log('[UPDATE] Request received for Menu ID:', menuId);
    console.log('[UPDATE] New Data:', { name, description, price, category, available, image });

    const updatedFields = { name, description, price, category, available };
    if (image) updatedFields.image = image;

    const updatedMenuItem = await Menu.findByIdAndUpdate(menuId, updatedFields, { new: true });

    if (!updatedMenuItem) {
      console.warn('[UPDATE] Menu item not found:', menuId);
      return res.status(404).json({ message: 'Menu item not found' });
    }

    console.log('[UPDATE] Successfully updated menu item:', updatedMenuItem);
    res.status(200).json({ message: 'Menu item updated successfully', updatedMenuItem });
  } catch (error) {
    console.error('[UPDATE] Error:', error);
    res.status(500).json({ message: 'Failed to update menu item' });
  }
};

// **Delete a menu item**
export const deleteMenuItem = async (req, res) => {
  try {
    const { menuId } = req.params;

    console.log('[DELETE] Request to delete Menu ID:', menuId);

    const deletedMenuItem = await Menu.findByIdAndDelete(menuId);

    if (!deletedMenuItem) {
      console.warn('[DELETE] Menu item not found:', menuId);
      return res.status(404).json({ message: 'Menu item not found' });
    }

    console.log('[DELETE] Successfully deleted menu item:', deletedMenuItem);
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('[DELETE] Error:', error);
    res.status(500).json({ message: 'Failed to delete menu item' });
  }
};

// **Get all menu items**
export const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.status(200).json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
};

// **Get all available menu items**
export const getAvailableMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find({ available: true });
    res.status(200).json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch available menu items' });
  }
};

// **Get a menu item by ID**
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

// **Get a menu item by ID (only if available)**
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

// **Get menu items by category**
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

// **Get available menu items by category**
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

// **Search menu items by name**
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

// **Search available menu items by name**
export const searchAvailableMenuByName = async (req, res) => {
  try {
    const { name } = req.query;

    const menuItems = await Menu.find({
      name: { $regex: name, $options: 'i' },
      available: true,
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

// **Update the availability of a menu item**
export const updateMenuItemAvailability = async (req, res) => {
  const { menuId } = req.params;
  const { available } = req.body;

  try {
    console.log('[AVAILABILITY UPDATE] Menu ID:', menuId);
    console.log('[AVAILABILITY UPDATE] New availability:', available);

    const menuItem = await Menu.findById(menuId);

    if (!menuItem) {
      console.warn('[AVAILABILITY UPDATE] Menu item not found:', menuId);
      return res.status(404).json({ message: 'Menu item not found' });
    }

    menuItem.available = available;

    await menuItem.save();

    console.log('[AVAILABILITY UPDATE] Availability updated:', menuItem);
    return res.status(200).json({ message: 'Menu item availability updated', menuItem });
  } catch (error) {
    console.error('[AVAILABILITY UPDATE] Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
