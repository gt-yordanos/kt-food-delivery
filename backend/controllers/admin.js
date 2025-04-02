import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

// Create a new admin
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, permissions } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      permissions,
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully', newAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create admin' });
  }
};

// Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, role: 'admin', permissions: admin.permissions },
      process.env.JWT_SECRET,
      { expiresIn: '30d' } 
    );

    // Store token in cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to login' });
  }
};

// Update admin details
export const updateAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { name, email, password, permissions } = req.body;

    let updatedFields = { name, email, permissions };
    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updatedFields, { new: true });

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin updated successfully', updatedAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update admin' });
  }
};

// Delete an admin
export const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const deletedAdmin = await Admin.findByIdAndDelete(adminId);
    if (!deletedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete admin' });
  }
};