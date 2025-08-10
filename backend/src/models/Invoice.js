const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'upi', 'cod', 'net_banking'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid', 'refunded', 'failed'],
      default: 'unpaid',
    },
    orderDate: { type: Date, required: true },
    pdfPath: { type: String }, // Path to the generated PDF file
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
