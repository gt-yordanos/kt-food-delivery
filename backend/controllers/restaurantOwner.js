import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RestaurantOwner } from '../models/RestaurantOwner.js';

// Add/Create a new restaurant owner (Admin and Restaurant Owner can perform this)
export const addRestaurantOwner = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingOwner = await RestaurantOwner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: 'Restaurant owner already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newOwner = new RestaurantOwner({
      name,
      email,
      password: hashedPassword,
    });

    await newOwner.save();
    res.status(201).json({ message: 'Restaurant owner added successfully', newOwner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add restaurant owner' });
  }
};

// Login restaurant owner (Token stored in cookies)
export const loginRestaurantOwner = async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await RestaurantOwner.findOne({ email });
    if (!owner) {
      return res.status(404).json({ message: 'Restaurant owner not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, owner.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: owner._id, role: 'restaurantOwner' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Store token in cookies
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      ameSite: 'None',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to login' });
  }
};

// Update a restaurant owner (Admin and Restaurant Owner can perform this)
export const updateRestaurantOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { name, email, password } = req.body;

    // Prepare the fields to be updated
    let updatedFields = {};

    // Update name and email if they are provided
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;

    // If password is provided, hash it before updating
    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10);
    }

    // Update the owner in the database
    const updatedOwner = await RestaurantOwner.findByIdAndUpdate(
      ownerId,
      updatedFields,
      { new: true }
    );

    if (!updatedOwner) {
      return res.status(404).json({ message: 'Restaurant owner not found' });
    }

    res.status(200).json({ message: 'Restaurant owner updated successfully', updatedOwner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update restaurant owner' });
  }
};

// Get all restaurant owners (Admin and Restaurant Owner can perform this)
export const getAllRestaurantOwners = async (req, res) => {
  try {
    const owners = await RestaurantOwner.find();
    res.status(200).json(owners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch restaurant owners' });
  }
};

// Search restaurant owner by name (Admin and Restaurant Owner can perform this)
export const searchRestaurantOwner = async (req, res) => {
  try {
    const { name } = req.query;

    const owners = await RestaurantOwner.find({ name: { $regex: name, $options: 'i' } });

    if (owners.length === 0) {
      return res.status(404).json({ message: 'No restaurant owners found' });
    }

    res.status(200).json(owners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to search restaurant owner' });
  }
};

// Delete a restaurant owner (Admin can perform this)
export const deleteRestaurantOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Find and delete the restaurant owner by ID
    const deletedOwner = await RestaurantOwner.findByIdAndDelete(ownerId);

    if (!deletedOwner) {
      return res.status(404).json({ message: 'Restaurant owner not found' });
    }

    res.status(200).json({ message: 'Restaurant owner deleted successfully', deletedOwner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete restaurant owner' });
  }
};