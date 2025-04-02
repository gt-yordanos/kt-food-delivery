import { Delivery } from '../models/Delivery.js';

// Create a delivery (Assign a delivery person) - Only Admin or Restaurant Owner
export const createDelivery = async (req, res) => {
  try {
    const { orderId, deliveryPersonId } = req.body;

    const existingDelivery = await Delivery.findOne({ order: orderId });
    if (existingDelivery) {
      return res.status(400).json({ message: 'Delivery already assigned for this order' });
    }

    const newDelivery = new Delivery({
      order: orderId,
      deliveryPerson: deliveryPersonId,
    });

    await newDelivery.save();
    res.status(201).json({ message: 'Delivery created successfully', delivery: newDelivery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create delivery' });
  }
};

// Get delivery details (Admin or Restaurant Owner)
export const getDeliveryDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const delivery = await Delivery.findOne({ order: orderId }).populate('deliveryPerson', 'name');

    if (!delivery) {
      return res.status(404).json({ message: 'No delivery found for this order' });
    }

    res.status(200).json(delivery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get delivery details' });
  }
};

// Change delivery status (Only Delivery Person)
export const changeDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { deliveryStatus } = req.body;
    const deliveryPersonId = req.user._id;

    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    // Ensure only the assigned delivery person can update the status
    if (delivery.deliveryPerson.toString() !== deliveryPersonId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this delivery' });
    }

    let updateFields = { deliveryStatus };

    // If status is changed to 'delivered', update deliveredAt timestamp
    if (deliveryStatus === 'delivered') {
      updateFields.deliveredAt = new Date();
    }

    const updatedDelivery = await Delivery.findByIdAndUpdate(deliveryId, updateFields, { new: true });

    res.status(200).json({ message: 'Delivery status changed successfully', delivery: updatedDelivery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to change delivery status' });
  }
};