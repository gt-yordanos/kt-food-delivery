import { Order } from '../models/Order.js';
import { Delivery } from '../models/Delivery.js';
import { DeliveryPerson } from '../models/DeliveryPerson.js';
import { Customer } from '../models/Customer.js';

// Create a new delivery
export const createDelivery = async (req, res) => {
  try {
    const { orderId, deliveryPersonId } = req.body;

    const order = await Order.findById(orderId).populate('customer');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.paymentStatus !== 'paid' || order.status !== 'inProgress') {
      return res.status(400).json({ message: 'Order must be paid and in progress to assign delivery' });
    }

    const deliveryPerson = await DeliveryPerson.findById(deliveryPersonId);
    if (!deliveryPerson) return res.status(404).json({ message: 'Delivery person not found' });

    if (order.campus !== deliveryPerson.campus) {
      return res.status(400).json({ message: 'Delivery person and order campus must match' });
    }

    const delivery = await Delivery.create({
      order: order._id,
      deliveryPerson: deliveryPerson._id,
      deliveryStatus: 'pending',
    });

    // Add delivery to deliveryPerson
    deliveryPerson.deliveries.push(delivery._id);
    await deliveryPerson.save();

    const fullDelivery = await Delivery.findById(delivery._id)
      .populate({
        path: 'order',
        populate: {
          path: 'customer',
          select: 'firstName lastName email',
        },
      })
      .populate('deliveryPerson', 'firstName lastName email campus');

    res.status(201).json({ message: 'Delivery created successfully', delivery: fullDelivery });
  } catch (error) {
    console.error('Create Delivery Error:', error);
    res.status(500).json({ message: 'Failed to create delivery' });
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
    if (status === 'delivered') delivery.deliveredAt = new Date();
    await delivery.save();

    res.status(200).json({ message: 'Delivery status updated', delivery });
  } catch (error) {
    console.error('Update Delivery Status Error:', error);
    res.status(500).json({ message: 'Failed to update delivery status' });
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
          path: 'customer',
        },
      })
      .populate('deliveryPerson');

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
      .populate('order deliveryPerson');

    res.status(200).json(deliveries);
  } catch (error) {
    console.error('Get Deliveries By Campus Error:', error);
    res.status(500).json({ message: 'Failed to fetch campus deliveries' });
  }
};

// Get deliveries by day
export const getDeliveriesByDay = async (req, res) => {
  try {
    const { date } = req.query; // Expecting YYYY-MM-DD
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const deliveries = await Delivery.find({ createdAt: { $gte: start, $lt: end } })
      .populate('order deliveryPerson');

    res.status(200).json(deliveries);
  } catch (error) {
    console.error('Get Deliveries By Day Error:', error);
    res.status(500).json({ message: 'Failed to fetch deliveries for the day' });
  }
};

// Get deliveries by hour
export const getDeliveriesByHour = async (req, res) => {
  try {
    const { date, hour } = req.query; // Expecting date as YYYY-MM-DD and hour as 0–23
    const base = new Date(date);
    const start = new Date(base.setHours(hour, 0, 0, 0));
    const end = new Date(base.setHours(hour + 1, 0, 0, 0));

    const deliveries = await Delivery.find({ createdAt: { $gte: start, $lt: end } })
      .populate('order deliveryPerson');

    res.status(200).json(deliveries);
  } catch (error) {
    console.error('Get Deliveries By Hour Error:', error);
    res.status(500).json({ message: 'Failed to fetch deliveries for the hour' });
  }
};