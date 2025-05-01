import { Customer } from '../models/Customer.js';
import { Menu } from '../models/Menu.js';

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const customerId = req.id;
    const { menuId, quantity } = req.body;

    if (!menuId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid menu item or quantity' });
    }

    const menuItem = await Menu.findById(menuId);
    if (!menuItem || !menuItem.available) {
      return res.status(404).json({ message: 'Menu item not found or not available' });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const existingItemIndex = customer.cart.findIndex(item => item.menuId.toString() === menuId);

    if (existingItemIndex !== -1) {
      customer.cart[existingItemIndex].quantity += quantity;
    } else {
      customer.cart.push({ menuId, quantity });
    }

    await customer.save();
    res.status(200).json({ message: 'Item added to cart', cart: customer.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get customer's cart
export const getCart = async (req, res) => {
  try {
    const customerId = req.id;

    const customer = await Customer.findById(customerId).populate('cart.menuId');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ cart: customer.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Optional: Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const customerId = req.id;
    const { menuId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.cart = customer.cart.filter(item => item.menuId.toString() !== menuId);

    await customer.save();
    res.status(200).json({ message: 'Item removed from cart', cart: customer.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};