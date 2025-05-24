import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RestaurantOwner } from '../models/RestaurantOwner.js';

// Add/Create a new restaurant owner (Admin and Restaurant Owner can perform this)
export const addRestaurantOwner = async (req, res) => {
  try {
    const { firstName, middleName, lastName, email, password, phoneNumber } = req.body;

    // Check if the owner already exists
    const existingOwner = await RestaurantOwner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: 'Restaurant owner already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new restaurant owner
    const newOwner = new RestaurantOwner({
      firstName,
      middleName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    // Save the new owner
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
      { id: owner._id, role: 'manager' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Store token in cookies
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'None',
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
    const { firstName, middleName, lastName, email, password, phoneNumber } = req.body;

    let updatedFields = {};

    if (firstName) updatedFields.firstName = firstName;
    if (middleName) updatedFields.middleName = middleName;
    if (lastName) updatedFields.lastName = lastName;
    if (email) updatedFields.email = email;
    if (phoneNumber) updatedFields.phoneNumber = phoneNumber;

    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10);
    }

    const updatedOwner = await RestaurantOwner.findByIdAndUpdate(ownerId, updatedFields, { new: true });

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
    const { query } = req.query;

    const owners = await RestaurantOwner.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { middleName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
      ],
    });

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