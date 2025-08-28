const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number },
        price: { type: Number },
      },
    ],
    totalAmount: { type: Number }, // Total including delivery and GST
    subtotal: { type: Number, required: false }, // Subtotal before GST (optional for existing data)
    gst: { type: Number, required: false }, // GST amount (optional for existing data)
    deliveryCharge: { type: Number, required: false }, // Delivery charge (optional for existing data)
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShippingAddress',
    },
    paymentMode: {
      type: String,
      enum: ['card', 'paypal', 'upi', 'cod', 'net_banking'],
      default: 'cod',
    },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    tracking: {
      number: { type: String },
      url: { type: String },
    },
    transactionId: { type: String },
    adminNotes: [
      {
        note: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
