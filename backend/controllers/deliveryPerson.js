import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DeliveryPerson } from '../models/DeliveryPerson.js';

// Create or add a delivery person (Admin & RestaurantOwner)
export const addDeliveryPerson = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if delivery person already exists
    const existingPerson = await DeliveryPerson.findOne({ email });
    if (existingPerson) {
      return res.status(400).json({ message: 'Delivery person already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newDeliveryPerson = new DeliveryPerson({
      name,
      email,
      password: hashedPassword,
    });

    await newDeliveryPerson.save();
    res.status(201).json({ message: 'Delivery person added successfully', newDeliveryPerson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add delivery person' });
  }
};

// Login delivery person
export const loginDeliveryPerson = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if delivery person exists
    const deliveryPerson = await DeliveryPerson.findOne({ email });
    if (!deliveryPerson) {
      return res.status(404).json({ message: 'Delivery person not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, deliveryPerson.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: deliveryPerson._id, role: 'deliveryPerson' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ message: 'Login successful', token, deliveryPerson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Update delivery person (Admin & RestaurantOwner)
export const updateDeliveryPerson = async (req, res) => {
  try {
    const { deliveryPersonId } = req.params;
    const { name, email, password } = req.body;

    let updateData = { name, email };

    // If password is provided, hash it before updating
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedDeliveryPerson = await DeliveryPerson.findByIdAndUpdate(
      deliveryPersonId,
      updateData,
      { new: true }
    );

    if (!updatedDeliveryPerson) {
      return res.status(404).json({ message: 'Delivery person not found' });
    }

    res.status(200).json({ message: 'Delivery person updated successfully', updatedDeliveryPerson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update delivery person' });
  }
};

// Delete a delivery person (Admin & RestaurantOwner)
export const deleteDeliveryPerson = async (req, res) => {
  try {
    const { deliveryPersonId } = req.params;

    const deletedPerson = await DeliveryPerson.findByIdAndDelete(deliveryPersonId);

    if (!deletedPerson) {
      return res.status(404).json({ message: 'Delivery person not found' });
    }

    res.status(200).json({ message: 'Delivery person deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete delivery person' });
  }
};

// Get all delivery persons (Admin & RestaurantOwner)
export const getAllDeliveryPersons = async (req, res) => {
  try {
    const deliveryPersons = await DeliveryPerson.find();
    res.status(200).json(deliveryPersons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch delivery persons' });
  }
};

// Search delivery persons by name or email (Admin & RestaurantOwner)
export const searchDeliveryPerson = async (req, res) => {
  try {
    const { query } = req.query;

    const deliveryPersons = await DeliveryPerson.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    });

    if (deliveryPersons.length === 0) {
      return res.status(404).json({ message: 'No delivery persons found' });
    }

    res.status(200).json(deliveryPersons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to search delivery persons' });
  }
};