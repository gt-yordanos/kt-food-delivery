import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Customer } from '../models/Customer.js';
import { Order } from '../models/Order.js';

// Sign Up Controller
export const signUp = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // Check if the customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new customer
    const newCustomer = new Customer({
      name,
      email,
      password: hashedPassword,
      address,
    });

    // Save the customer to the database
    await newCustomer.save();
    res.status(201).json({ message: 'Customer created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Log In Controller
export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the customer exists
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: 'Customer not found' });
    }

    // Compare the entered password with the stored hash
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token with customer ID and role (e.g., 'customer')
    const token = jwt.sign(
      { customerId: customer._id, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Store token in cookies (HttpOnly for security)
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 ,
      ameSite: 'None',
    });

    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Log Out Controller
export const logOut = (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie('authToken');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update Account Controller
export const updateAccount = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const customerId = req.customerId; // Extracted from the token

    // Find and update the customer account
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      { name, email, address },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Account updated successfully', updatedCustomer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete Account Controller
export const deleteAccount = async (req, res) => {
  try {
    const customerId = req.customerId; // Extracted from the token

    // Delete the customer account
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Optionally, delete all orders associated with this customer
    await Order.deleteMany({ customer: customerId });

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get Customer Info Controller (Customer's own information)
export const getCustomerInfo = async (req, res) => {
  try {
    const customerId = req.customerId; // Extracted from the token

    // Fetch the customer data
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ customer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get All Customers Controller (Admin access only)
export const getAllCustomers = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Fetch all customers
    const customers = await Customer.find();
    res.status(200).json({ customers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Search Customers by Name Controller (Admin access only)
export const searchCustomerByName = async (req, res) => {
  try {
    const { name } = req.query;

    // Ensure the user is an admin
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Find customers by name (case-insensitive search)
    const customers = await Customer.find({
      name: { $regex: name, $options: 'i' },
    });

    if (customers.length === 0) {
      return res.status(404).json({ message: 'No customers found' });
    }

    res.status(200).json({ customers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};