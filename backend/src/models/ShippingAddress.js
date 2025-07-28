const mongoose = require('mongoose');

const shippingAddressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 6,
      match: [/^\d{6}$/, 'Pin code must be exactly 6 digits'],
    },
    phoneNumber: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
      match: [/^\d{10}$/, 'Pin code must be exactly 6 digits'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShippingAddress', shippingAddressSchema);
