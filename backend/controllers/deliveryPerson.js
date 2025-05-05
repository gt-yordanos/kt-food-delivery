import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DeliveryPerson } from '../models/DeliveryPerson.js';

// Create or add a delivery person (Admin & RestaurantOwner)
export const addDeliveryPerson = async (req, res) => {
  try {
    const { firstName, middleName, lastName, phoneNumber, email, password, campus } = req.body;

    // Check if delivery person already exists
    const existingPerson = await DeliveryPerson.findOne({ email });
    if (existingPerson) {
      return res.status(400).json({ message: 'Delivery person already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newDeliveryPerson = new DeliveryPerson({
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
      campus,
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
    const token = jwt.sign(
      { id: deliveryPerson._id, role: 'deliveryPerson' }, 
      process.env.JWT_SECRET, 
      {expiresIn: '30d', }
    );

    // Store token in cookies
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'None',
    });

    res.status(200).json({ message: 'Login successful', token, deliveryPerson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Get a single delivery person by ID
export const getDeliveryPersonById = async (req, res) => {
  try {
    const { deliveryPersonId } = req.params;

    // Find the delivery person by ID
    const deliveryPerson = await DeliveryPerson.findById(deliveryPersonId).populate('deliveries'); // Optionally populate the deliveries

    if (!deliveryPerson) {
      return res.status(404).json({ message: 'Delivery person not found' });
    }

    res.status(200).json(deliveryPerson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch delivery person' });
  }
};

// Update delivery person (Admin & RestaurantOwner)
export const updateDeliveryPerson = async (req, res) => {
  try {
    const { deliveryPersonId } = req.params;
    const { firstName, middleName, lastName, phoneNumber, email, password, campus } = req.body;

    let updateData = {};

    // Add fields to updateData only if they are provided
    if (firstName) updateData.firstName = firstName;
    if (middleName) updateData.middleName = middleName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (email) updateData.email = email;
    if (campus) updateData.campus = campus;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }

    const updatedDeliveryPerson = await DeliveryPerson.findByIdAndUpdate(
      deliveryPersonId,
      { $set: updateData }, // Ensures partial updates
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
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
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

// Get delivery persons by campus with incomplete deliveries
export const getDeliveryPersonsByCampusWithActiveDeliveries = async (req, res) => {
  try {
    const { campus } = req.params;

    // Find delivery persons by campus
    const deliveryPersons = await DeliveryPerson.find({ campus })
      .populate({
        path: 'deliveries',
        match: { status: { $ne: 'completed' } }, // Only include incomplete deliveries
      });

    // If no delivery persons found for the campus
    if (deliveryPersons.length === 0) {
      return res.status(404).json({ message: 'No delivery persons found for this campus' });
    }

    // Map through each delivery person and calculate the count of incomplete deliveries
    const result = deliveryPersons.map((deliveryPerson) => {
      return {
        ...deliveryPerson._doc,
        incompleteDeliveriesCount: deliveryPerson.deliveries.length, // Count of incomplete deliveries
      };
    });

    // Return the response with the augmented data
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching delivery persons by campus:', error);
    res.status(500).json({ message: 'Failed to fetch delivery persons by campus' });
  }
};