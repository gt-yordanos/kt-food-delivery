import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Customer } from '../models/Customer.js';
import { Order } from '../models/Order.js';

export const signUp = async (req, res) => {
  try {
    const { firstName, middleName, lastName, phoneNumber, email, password, address } = req.body;

    const existingCustomer = await Customer.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
      address,
    });

    await newCustomer.save();
    res.status(201).json({ message: 'Customer created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: 'Customer not found' });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: customer._id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'None',
    });

    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const logOut = (req, res) => {
  try {
    res.clearCookie('authToken');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const { password, ...otherFields } = req.body;

    const updateData = {};

    // If password is present, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Only include non-undefined fields
    for (const key in otherFields) {
      if (otherFields[key] !== undefined) {
        updateData[key] = otherFields[key];
      }
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    return res.status(200).json({
      message: password
        ? 'Account updated successfully with new password'
        : 'Account updated successfully',
      updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const customerId = req.params.customerId;  // Use params for customer ID

    const deletedCustomer = await Customer.findByIdAndDelete(customerId);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await Order.deleteMany({ customer: customerId });

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getCustomerInfo = async (req, res) => {
  try {
    const customerId = req.params.customerId;  // Use params for customer ID

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ customer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const customers = await Customer.find();
    res.status(200).json({ customers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const searchCustomerByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const regex = new RegExp(name, 'i');

    const customers = await Customer.find({
      $or: [{ firstName: regex }, { middleName: regex }, { lastName: regex }],
    });

    if (customers.length === 0) {
      return res.status(404).json({ message: 'No customers found' });
    }

    res.status(200).json({ customers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};