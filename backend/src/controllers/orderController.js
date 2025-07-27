const Order = require('../models/Orders');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');
const PDFDocument = require('pdfkit');
const fs = require('fs');

function generateInvoicePDF(invoice, order, user, shippingAddress, cb) {
  const PDFDocument = require('pdfkit');
  const fs = require('fs');
  const filePath = `./invoices/invoice-${invoice._id}.pdf`;
  const doc = new PDFDocument({ margin: 40 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Header
  doc
    .image('backend/src/assets/logo.png', 40, 30, { width: 60 })
    .fontSize(22)
    .text('Golden Basket Mart', 110, 30)
    .fontSize(10)
    .text('123 Grocery Lane, City, Country', 110, 55)
    .text('Phone: +91-1234567890', 110, 70)
    .text('Email: support@goldenbasket.com', 110, 85)
    .moveDown();

  // Invoice Info
  doc
    .fontSize(14)
    .text(`Invoice ID: ${invoice._id}`)
    .text(`Order ID: ${order._id}`)
    .text(`Invoice Date: ${invoice.orderDate.toLocaleString()}`)
    .text(`Payment Method: ${invoice.paymentMethod}`)
    .text(`Status: ${invoice.paymentStatus}`)
    .moveDown();

  // Customer Info
  doc
    .fontSize(12)
    .text('Billed To:', { underline: true })
    .text(`${user.firstName} ${user.lastName}`)
    .text(user.email);
  if (shippingAddress) {
    doc.text(`${shippingAddress.addressLine1}`);
    if (shippingAddress.addressLine2) doc.text(shippingAddress.addressLine2);
    doc.text(`${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}`);
    doc.text(shippingAddress.country);
  }
  doc.moveDown();

  // Table Header
  doc.fontSize(12).text('Items:', { underline: true });
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold');
  doc.text('Product', 40, doc.y, { continued: true });
  doc.text('Qty', 250, doc.y, { continued: true });
  doc.text('Price', 300, doc.y, { continued: true });
  doc.text('Subtotal', 370, doc.y);
  doc.font('Helvetica');

  let total = 0;
  order.items.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    doc.text(item.product.name, 40, doc.y, { continued: true });
    doc.text(item.quantity.toString(), 250, doc.y, { continued: true });
    doc.text(`₹${item.price}`, 300, doc.y, { continued: true });
    doc.text(`₹${subtotal}`, 370, doc.y);
  });
  doc.moveDown();

  // Summary
  doc.font('Helvetica-Bold').text(`Total: ₹${total}`, { align: 'right' });
  doc.font('Helvetica');
  doc.moveDown();

  // Footer
  doc.fontSize(10).text('Thank you for shopping with Golden Basket Mart!', { align: 'center' });
  doc.text('This is a system-generated invoice.', { align: 'center' });
  doc.end();
  stream.on('finish', () => cb(filePath));
}

// Place order from cart (refactored)
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }
    // Check stock for all items
    for (const item of cart.items) {
      if (!item.product) return res.status(404).json({ error: 'Product not found in cart.' });
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${item.product.name}.` });
      }
    }
    // Decrement stock
    for (const item of cart.items) {
      item.product.stock -= item.quantity;
      await item.product.save();
    }
    // Calculate total
    let totalAmount = 0;
    const orderItems = cart.items.map(item => {
      totalAmount += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });
    // Create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      paymentStatus: 'pending',
      orderStatus: 'processing',
      paymentMode: req.body.paymentMode || 'cod',
      shippingAddress: req.body.shippingAddressId,
    });
    // Get user and address
    const user = await require('../models/User').findById(userId);
    let shippingAddress = null;
    if (order.shippingAddress) {
      shippingAddress = await require('../models/ShippingAddress').findById(order.shippingAddress);
    }
    // Create invoice
    const invoice = await Invoice.create({
      user: userId,
      order: order._id,
      amount: totalAmount,
      paymentMethod: order.paymentMode,
      paymentStatus: 'unpaid',
      orderDate: new Date(),
    });
    order.invoice = invoice._id;
    await order.save();
    // Generate and store PDF
    const invoicesDir = './invoices';
    if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir);
    generateInvoicePDF(invoice, order, user, shippingAddress, async (filePath) => {
      invoice.pdfPath = filePath;
      await invoice.save();
      // Clear cart
      cart.items = [];
      await cart.save();
      res.status(201).json({ order, invoice });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate('items.product invoice');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user items.product invoice');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Download invoice PDF (refactored)
exports.downloadInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId).populate('order user');
    if (!invoice) return res.status(404).json({ error: 'Invoice not found.' });
    if (!invoice.pdfPath || !fs.existsSync(invoice.pdfPath)) {
      return res.status(410).json({ error: 'Invoice PDF not available.' });
    }
    res.download(invoice.pdfPath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.userId }).populate('order');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 