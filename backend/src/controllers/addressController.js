const ShippingAddress = require('../models/ShippingAddress');
const logger = require('../utils/logger');

// Get all addresses for user
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await ShippingAddress.find({ user: req.user.userId });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add address
exports.addAddress = async (req, res) => {
  try {
    const {
      addressLine1,
      addressLine2,
      city,
      state,
      pinCode,
      country,
      phoneNumber,
    } = req.body;
    if (
      !addressLine1 ||
      !city ||
      !state ||
      !pinCode ||
      !country ||
      !phoneNumber
    ) {
      return res
        .status(400)
        .json({ error: 'All required fields must be filled.' });
    }
    const address = new ShippingAddress({
      user: req.user.userId,
      addressLine1,
      addressLine2,
      city,
      state,
      pinCode,
      country,
      phoneNumber,
    });
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    logger.error('Error adding address:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const address = await ShippingAddress.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      update,
      { new: true }
    );
    if (!address) return res.status(404).json({ error: 'Address not found.' });
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await ShippingAddress.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });
    if (!address) return res.status(404).json({ error: 'Address not found.' });
    res.json({ message: 'Address deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
