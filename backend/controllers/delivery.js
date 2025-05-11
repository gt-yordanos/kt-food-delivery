import { Order } from '../models/Order.js';
import { Delivery } from '../models/Delivery.js';
import { DeliveryPerson } from '../models/DeliveryPerson.js';
import { Customer } from '../models/Customer.js';
import mongoose from 'mongoose';

export const createDelivery = async (req, res) => {
  try {
    const { orderId, deliveryPersonId } = req.body;

    // Validate order exists and populate customer
    const order = await Order.findById(orderId).populate('customer');
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Validate order status
    if (order.paymentStatus !== 'paid' || order.status !== 'inProgress') {
      return res.status(400).json({ 
        success: false,
        message: 'Order must be paid and in progress to assign delivery' 
      });
    }

    // Validate delivery person exists
    const deliveryPerson = await DeliveryPerson.findById(deliveryPersonId);
    if (!deliveryPerson) {
      return res.status(404).json({ 
        success: false,
        message: 'Delivery person not found' 
      });
    }

    // Validate campus match
    if (order.campus !== deliveryPerson.campus) {
      return res.status(400).json({ 
        success: false,
        message: 'Delivery person and order campus must match' 
      });
    }

    // Prevent duplicate deliveries
    const existingDelivery = await Delivery.findOne({ order: orderId });
    if (existingDelivery) {
      return res.status(400).json({ 
        success: false,
        message: 'A delivery already exists for this order' 
      });
    }

    // Access customer data from the populated order
    const customer = order.customer;

    // Create delivery
    const delivery = await Delivery.create({
      order: order._id,
      deliveryPerson: deliveryPerson._id,
      customer: customer._id,
      deliveryStatus: 'pending',
    });

    // Update delivery person (Add the new delivery to the delivery person's deliveries)
    deliveryPerson.deliveries.push(delivery._id);
    await deliveryPerson.save();

    // Update order status
    order.status = 'completed';
    await order.save();

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Delivery created successfully',
      data: {
        deliveryId: delivery._id,
        orderId: order._id,
        deliveryPersonId: deliveryPerson._id,
        customerId: customer._id,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Delivery creation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'inProgress', 'delivered'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid delivery status' });
    }

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    delivery.deliveryStatus = status;
    if (status === 'delivered') {
      delivery.deliveredAt = new Date();
    }

    await delivery.save();
    res.status(200).json({ message: 'Delivery status updated', delivery });
  } catch (error) {
    console.error('Update Delivery Status Error:', error);
    res.status(500).json({ message: 'Failed to update delivery status' });
  }
};

// Get all deliveries
export const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate('order')
      .populate('deliveryPerson')
      .populate('customer');

    res.status(200).json(deliveries);
  } catch (error) {
    console.error('Get All Deliveries Error:', error);
    res.status(500).json({ message: 'Failed to fetch deliveries' });
  }
};


// ✅ Customer verifies delivery
export const verifyDeliveryByCustomer = async (req, res) => {
  try {
    const { deliveryId } = req.params;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    if (delivery.deliveryStatus !== 'delivered') {
      return res.status(400).json({ message: 'Cannot verify undelivered order' });
    }

    delivery.customerVerified = true;
    await delivery.save();

    res.status(200).json({ message: 'Delivery verified by customer', delivery });
  } catch (error) {
    console.error('Customer Verification Error:', error);
    res.status(500).json({ message: 'Failed to verify delivery' });
  }
};

// Get delivery by ID
export const getDeliveryById = async (req, res) => {
  try {
    const { deliveryId } = req.params;

    const delivery = await Delivery.findById(deliveryId)
      .populate({
        path: 'order',
        populate: {
          path: 'customer', // This ensures the customer data is populated within the order
        },
      })
      .populate('deliveryPerson')
      .populate('customer');  // Explicitly populate customer here as well

    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    res.status(200).json(delivery);
  } catch (error) {
    console.error('Get Delivery By ID Error:', error);
    res.status(500).json({ message: 'Failed to fetch delivery' });
  }
};

// Get deliveries by delivery person
export const getDeliveriesByPerson = async (req, res) => {
  try {
    const { deliveryPersonId } = req.params;

    const deliveries = await Delivery.find({ deliveryPerson: deliveryPersonId })
      .populate('order')
      .populate('customer')
      .populate('deliveryPerson')
      .sort({ createdAt: -1 });

    res.status(200).json(deliveries);
  } catch (error) {
    console.error('Get Deliveries By Person Error:', error);
    res.status(500).json({ message: 'Failed to fetch deliveries' });
  }
};

// Get deliveries by campus
export const getDeliveriesByCampus = async (req, res) => {
  try {
    const { campus } = req.params;

    const deliveryPersons = await DeliveryPerson.find({ campus }).select('_id');
    const deliveryPersonIds = deliveryPersons.map(dp => dp._id);

    const deliveries = await Delivery.find({ deliveryPerson: { $in: deliveryPersonIds } })
      .populate('order deliveryPerson')
      .populate('customer');  // Populate customer here as well

    res.status(200).json(deliveries);
  } catch (error) {
    console.error('Get Deliveries By Campus Error:', error);
    res.status(500).json({ message: 'Failed to fetch campus deliveries' });
  }
};

// Get deliveries by day
export const getDeliveriesByDay = async (req, res) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const deliveries = await Delivery.find({ createdAt: { $gte: start, $lt: end } })
      .populate('order deliveryPerson')
      .populate('customer');  // Populate customer here as well

    res.status(200).json(deliveries);
  } catch (error) {
    console.error('Get Deliveries By Day Error:', error);
    res.status(500).json({ message: 'Failed to fetch deliveries for the day' });
  }
};

// Get deliveries by hour
export const getDeliveriesByHour = async (req, res) => {
  try {
    const { date, hour } = req.query; // YYYY-MM-DD, hour: 0–23
    const base = new Date(date);
    const start = new Date(base.setHours(hour, 0, 0, 0));
    const end = new Date(base.setHours(hour + 1, 0, 0, 0));

    const deliveries = await Delivery.find({ createdAt: { $gte: start, $lt: end } })
      .populate('order deliveryPerson')
      .populate('customer');  // Populate customer here as well

    res.status(200).json(deliveries);
  } catch (error) {
    console.error('Get Deliveries By Hour Error:', error);
    res.status(500).json({ message: 'Failed to fetch deliveries for the hour' });
  }
};

// Get deliveries by orderId
export const getDeliveriesByOrderId = async (req, res) => {
  try {
    let { orderId } = req.params;

    // If orderId is a string and looks like a valid ObjectId, cast it
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      orderId = mongoose.Types.ObjectId(orderId);
    } else {
      return res.status(400).json({ message: 'Invalid Order ID format' });
    }

    const delivery = await Delivery.findOne({ order: orderId })
      .populate({
        path: 'order',
        populate: {
          path: 'customer', // Populate the customer inside order
        },
      })
      .populate('deliveryPerson')
      .populate('customer');  // Populate customer here as well

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found for this order ID' });
    }

    res.status(200).json(delivery);
  } catch (error) {
    console.error('Get Deliveries By Order ID Error:', error);
    res.status(500).json({ message: 'Failed to fetch delivery for the provided order ID' });
  }
};

// Get deliveries by status
export const getDeliveriesByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    // Validate the status
    const allowedStatuses = ['pending', 'inProgress', 'delivered'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid delivery status' });
    }

    // Find deliveries with the given status
    const deliveries = await Delivery.find({ deliveryStatus: status })
      .populate({
        path: 'order',
        populate: {
          path: 'customer', // Populate the customer inside order
        },
      })
      .populate('deliveryPerson')
      .populate('customer');  // Explicitly populate customer here as well

    // Check if deliveries exist for the given status
    if (!deliveries || deliveries.length === 0) {
      return res.status(404).json({ message: 'No deliveries found for this status' });
    }

    res.status(200).json(deliveries);
  } catch (error) {
    console.error('Get Deliveries By Status Error:', error);
    res.status(500).json({ message: 'Failed to fetch deliveries by status' });
  }
};

// Get deliveries by delivery person ID and status
export const getDeliveriesByPersonAndStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const deliveryPersonId = req.id;  // Use the authenticated delivery person's ID from the token

    const allowedStatuses = ['pending', 'inProgress', 'delivered'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid delivery status' });
    }

    const deliveries = await Delivery.find({ 
      deliveryPerson: deliveryPersonId, 
      deliveryStatus: status 
    })
      .populate('order')
      .populate('customer')
      .populate('deliveryPerson')
      .sort({ createdAt: -1 });

    if (!deliveries || deliveries.length === 0) {
      return res.status(404).json({ message: 'No deliveries found for this person with the specified status' });
    }

    res.status(200).json(deliveries);
  } catch (error) {
    console.error('Get Deliveries By Person And Status Error:', error);
    res.status(500).json({ message: 'Failed to fetch deliveries by person and status' });
  }
};

// Get deliveries by delivery person, status, and customerVerified
export const getDeliveriesByPersonStatusAndVerification = async (req, res) => {
  try {
    const { status, customerVerified } = req.params;
    const deliveryPersonId = req.id;  // Use the authenticated delivery person's ID from the token

    // Validate the status
    const allowedStatuses = ['pending', 'inProgress', 'delivered'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid delivery status' });
    }

    // Validate customerVerified value
    const isVerified = customerVerified === 'true' ? true : customerVerified === 'false' ? false : null;
    if (isVerified === null) {
      return res.status(400).json({ message: 'Invalid customerVerified value, must be "true" or "false"' });
    }

    // Find deliveries based on the criteria
    const deliveries = await Delivery.find({
      deliveryPerson: deliveryPersonId,
      deliveryStatus: status,
      customerVerified: isVerified,
    })
      .populate('order')
      .populate('customer')
      .populate('deliveryPerson')
      .sort({ createdAt: -1 });

    if (!deliveries || deliveries.length === 0) {
      return res.status(404).json({ message: 'No deliveries found for the given filters' });
    }

    res.status(200).json(deliveries);
  } catch (error) {
    console.error('Get Deliveries By Person, Status, and Verification Error:', error);
    res.status(500).json({ message: 'Failed to fetch deliveries by person, status, and verification' });
  }
};
// Get deliveries by delivery person ID and customer verification status
export const getDeliveriesByPersonAndCustomerVerification = async (req, res) => {
  try {
    const { customerVerified } = req.params;
    const deliveryPersonId = req.id;  // Use the authenticated delivery person's ID from the token

    // Validate customerVerified value
    const isVerified = customerVerified === 'true' ? true : customerVerified === 'false' ? false : null;
    if (isVerified === null) {
      return res.status(400).json({ message: 'Invalid customerVerified value, must be "true" or "false"' });
    }

    // Find deliveries based on the criteria
    const deliveries = await Delivery.find({
      deliveryPerson: deliveryPersonId,
      customerVerified: isVerified,
    })
      .populate('order')
      .populate('customer')
      .populate('deliveryPerson')
      .sort({ createdAt: -1 });

    if (!deliveries || deliveries.length === 0) {
      return res.status(404).json({ message: 'No deliveries found for the given filters' });
    }

    res.status(200).json(deliveries);
  } catch (error) {
    console.error('Get Deliveries By Person and Customer Verification Error:', error);
    res.status(500).json({ message: 'Failed to fetch deliveries by person and customer verification' });
  }
};

export const getDeliveriesByCustomer = async (req, res) => {
  try {
    const customerId = req.id;

    const deliveries = await Delivery.find({ customer: customerId })
      .populate('order')
      .populate('deliveryPerson')
      .populate('customer')
      .sort({ createdAt: -1 });

    if (!deliveries || deliveries.length === 0) {
      return res.status(404).json({ message: 'No deliveries found for this customer' });
    }

    res.status(200).json(deliveries);
  } catch (error) {
    console.error('Get Deliveries By Customer Error:', error);
    res.status(500).json({ message: 'Failed to fetch deliveries for this customer' });
  }
};