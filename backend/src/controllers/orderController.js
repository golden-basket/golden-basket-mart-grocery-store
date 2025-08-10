const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Order = require('../models/Orders');
const Cart = require('../models/Cart');
const Invoice = require('../models/Invoice');

function generateInvoicePDF(invoice, order, user, shippingAddress, cb) {
  let stream = null;
  let doc = null;
  let timeout = null;

  try {
    // Validate required parameters
    if (!invoice || !order || !user) {
      throw new Error('Missing required parameters for invoice generation');
    }

    // Additional validation for order items
    if (
      !order.items ||
      !Array.isArray(order.items) ||
      order.items.length === 0
    ) {
      throw new Error('Order must have valid items array');
    }

    // Validate that items have required product information
    console.log('Validating order items:', order.items);
    for (const item of order.items) {
      if (
        !item.product ||
        !item.product.name ||
        typeof item.price !== 'number' ||
        typeof item.quantity !== 'number'
      ) {
        throw new Error(`Invalid item structure: ${JSON.stringify(item)}`);
      }
    }
    console.log('Order items validation passed');

    // Ensure invoices directory exists
    const invoicesDir = path.resolve(__dirname, '../../public/invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const filePath = path.resolve(
      __dirname,
      `../../public/invoices/invoice-${invoice._id}.pdf`
    );

    doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `Invoice - ${invoice._id}`,
        Author: 'Golden Basket Mart',
        Subject: 'Grocery Store Invoice',
      },
    });

    stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Page dimensions
    const pageWidth = doc.page.width - 80; // 80 = left + right margins
    const leftMargin = 40;
    const rightMargin = 40;
    let currentY = 60;

    // Helper function to draw horizontal line
    const drawLine = (y, width = pageWidth) => {
      doc
        .moveTo(leftMargin, y)
        .lineTo(leftMargin + width, y)
        .stroke();
    };

    // Helper function to draw filled rectangle
    const drawFilledRect = (x, y, width, height, color) => {
      doc.rect(x, y, width, height).fill(color);
    };

    // Helper function to center text
    const centerText = (text, y, fontSize = 12) => {
      const textWidth = doc.fontSize(fontSize).widthOfString(text);
      const x = (doc.page.width - textWidth) / 2;
      doc.fontSize(fontSize).text(text, x, y);
    };

    // Helper function to right align text
    const rightAlignText = (text, y, fontSize = 10) => {
      const textWidth = doc.fontSize(fontSize).widthOfString(text);
      const x = doc.page.width - rightMargin - textWidth - 25;
      doc.fontSize(fontSize).fill('#ffffff').text(text, x, y);
    };

    // Header Section with Logo and Company Info
    const logoSize = 70;
    const logoPath = path.resolve(
      __dirname,
      '../assets/golden-basket-rounded.png'
    );

    try {
      // Check if logo exists, if not create a placeholder
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, leftMargin, currentY, { width: logoSize });
      } else {
        // Create a placeholder rectangle if logo not found
        doc
          .rect(leftMargin, currentY, logoSize, logoSize)
          .fill('#a3824c')
          .fontSize(12)
          .fill('#fff')
          .text('Golden Basket Mart', leftMargin + 10, currentY + 25);
      }
    } catch (logoError) {
      // Create a placeholder rectangle if logo loading fails
      doc
        .rect(leftMargin, currentY, logoSize, logoSize)
        .fill('#a3824c')
        .fontSize(12)
        .fill('#fff')
        .text('Golden Basket Mart', leftMargin + 10, currentY + 25);
    }

    // Company name and details on the right
    doc
      .fontSize(20)
      .font('Helvetica')
      .fill('#000000')
      .text('Golden Basket Mart', leftMargin + logoSize + 25, currentY + 5);

    currentY += 28;
    doc
      .fontSize(9)
      .font('Helvetica')
      .fill('#000000')
      .text(
        '123 Grocery Lane, Downtown District',
        leftMargin + logoSize + 25,
        currentY
      );

    currentY += 16;
    doc.text(
      'City: Mumbai, Maharashtra 400001',
      leftMargin + logoSize + 25,
      currentY
    );

    currentY += 16;
    doc.text(
      'Phone: +91-22-1234-5678 | Email: support@goldenbasket.com',
      leftMargin + logoSize + 25,
      currentY
    );

    currentY += 16;
    doc.text(
      'GSTIN: 27ABCDE1234F1Z5 | PAN: ABCDE1234F',
      leftMargin + logoSize + 25,
      currentY
    );

    currentY += 35;

    // Store the Y position for parallel sections
    const parallelY = currentY;

    // Invoice Details Section (right side)
    const invoiceDetailsWidth = 200;
    const invoiceDetailsX = doc.page.width - rightMargin - invoiceDetailsWidth;

    // Invoice details background
    drawFilledRect(
      invoiceDetailsX - 10,
      parallelY - 10,
      invoiceDetailsWidth + 20,
      110,
      '#f8f9fa'
    );

    doc
      .fontSize(13)
      .font('Helvetica')
      .fill('#000000')
      .text('INVOICE', invoiceDetailsX, parallelY);

    doc
      .fontSize(8)
      .font('Helvetica')
      .fill('#000000')
      .text(
        `Invoice ID: ${invoice._id || 'N/A'}`,
        invoiceDetailsX,
        parallelY + 20
      );

    doc.text(
      `Order ID: ${order._id || 'N/A'}`,
      invoiceDetailsX,
      parallelY + 32
    );

    const orderDate = invoice.orderDate
      ? new Date(invoice.orderDate).toLocaleDateString('en-IN')
      : 'N/A';
    doc.text(`Date: ${orderDate}`, invoiceDetailsX, parallelY + 44);

    doc.text(
      `Payment: ${invoice.paymentMethod || 'N/A'}`,
      invoiceDetailsX,
      parallelY + 56
    );

    doc.text(
      `Status: ${invoice.paymentStatus || 'N/A'}`,
      invoiceDetailsX,
      parallelY + 68
    );

    // Customer Information Section (left side) - at the same Y level
    doc
      .fontSize(12)
      .font('Helvetica')
      .fill('#000000')
      .text('BILL TO:', leftMargin, parallelY);

    doc
      .fontSize(9)
      .font('Helvetica')
      .fill('#000000')
      .text(
        `${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`,
        leftMargin,
        parallelY + 18
      );

    doc.fontSize(9).font('Helvetica').fill('#000000');
    doc.text(user.email || 'N/A', leftMargin, parallelY + 30);

    if (shippingAddress && shippingAddress.addressLine1) {
      doc.text(shippingAddress.addressLine1, leftMargin, parallelY + 42);

      if (shippingAddress.addressLine2) {
        doc.text(shippingAddress.addressLine2, leftMargin, parallelY + 54);
      }

      const cityState = [
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.postalCode,
      ]
        .filter(Boolean)
        .join(', ');

      if (cityState) {
        doc.text(cityState, leftMargin, parallelY + 66);
      }

      if (shippingAddress.country) {
        doc.text(shippingAddress.country, leftMargin, parallelY + 78);
      }
    }

    // Update currentY to the bottom of the parallel sections
    currentY = parallelY + 110 + 25;

    // Items Table Section
    // Table header background
    drawFilledRect(leftMargin, currentY, pageWidth, 28, '#34495e');

    // Table header text
    doc
      .fontSize(9)
      .font('Helvetica')
      .fill('#ffffff')
      .text('Item', leftMargin + 10, currentY + 9)
      .text('Qty', leftMargin + 200, currentY + 9)
      .text('Unit Price (INR)', leftMargin + 300, currentY + 9)
      .text('Amount (INR)', leftMargin + 400, currentY + 9);

    currentY += 28;

    // Draw header line
    drawLine(currentY);

    // Table rows
    let subtotal = 0;
    let taxAmount = 0;
    const gstRate = 0.18; // 18% GST

    let validItemsCount = 0;
    order.items.forEach((item, index) => {
      // Safety check for item structure
      if (
        !item ||
        !item.product ||
        !item.product.name ||
        typeof item.price !== 'number' ||
        typeof item.quantity !== 'number'
      ) {
        return; // Skip invalid items
      }

      validItemsCount++;
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;

      // Alternate row colors
      if (index % 2 === 0) {
        drawFilledRect(leftMargin, currentY, pageWidth, 24, '#ffffff');
      } else {
        drawFilledRect(leftMargin, currentY, pageWidth, 24, '#f8f9fa');
      }

      // Item name (with word wrapping)
      const itemName = item.product.name || 'Unknown Product';
      const maxNameWidth = 280;
      let displayName = itemName;
      if (doc.fontSize(10).widthOfString(itemName) > maxNameWidth) {
        // Truncate and add ellipsis
        while (
          doc.fontSize(10).widthOfString(displayName + '...') > maxNameWidth
        ) {
          displayName = displayName.slice(0, -1);
        }
        displayName += '...';
      }

      doc
        .fontSize(8)
        .font('Helvetica')
        .fill('#000000')
        .text(displayName, leftMargin + 10, currentY + 7);

      // Quantity
      doc.fontSize(8).font('Helvetica').fill('#000000');
      doc.text(item.quantity.toString(), leftMargin + 200, currentY + 7);

      // Unit price
      doc.fontSize(8).font('Helvetica').fill('#000000');
      doc.text(`INR ${item.price.toFixed(2)}`, leftMargin + 300, currentY + 7);

      // Amount
      doc.fontSize(8).font('Helvetica').fill('#000000');
      doc.text(
        `INR ${itemSubtotal.toFixed(2)}`,
        leftMargin + 400,
        currentY + 7
      );

      currentY += 24;
    });

    // Check if we have any valid items
    if (validItemsCount === 0) {
      throw new Error('No valid items found in order');
    }

    // Draw bottom line of table
    drawLine(currentY);
    currentY += 20;

    // Summary Section
    const summaryWidth = 200;
    const summaryX = doc.page.width - rightMargin - summaryWidth;

    // Summary background
    drawFilledRect(
      summaryX - 10,
      currentY - 10,
      summaryWidth + 20,
      110,
      '#34495e'
    );

    // Calculate totals
    taxAmount = subtotal * gstRate;
    const total = subtotal + taxAmount;

    // Summary rows
    doc.fontSize(9).font('Helvetica').fill('#ffffff');

    doc.text('Subtotal:', summaryX, currentY);
    rightAlignText(`INR ${subtotal.toFixed(2)}`, currentY, 10);

    currentY += 16;
    doc.text('GST (18%):', summaryX, currentY);
    rightAlignText(`INR ${taxAmount.toFixed(2)}`, currentY);

    currentY += 16;
    doc.text('Shipping:', summaryX, currentY);
    rightAlignText(`INR ${subtotal > 499 ? 0 : 50}`, currentY, 10);

    currentY += 20;

    // Total line - right-aligned with summary box
    const lineX = summaryX - 10;
    doc
      .moveTo(lineX, currentY)
      .lineTo(lineX + summaryWidth + 20, currentY)
      .stroke();
    currentY += 14;

    doc
      .fontSize(12)
      .font('Helvetica')
      .fill('#ffffff')
      .text('TOTAL:', summaryX, currentY);
    rightAlignText(`INR ${total.toFixed(2)}`, currentY, 12);

    currentY += 150;

    // Footer Section
    drawFilledRect(leftMargin, currentY, pageWidth, 90, '#f8f9fa');

    doc.fontSize(12).font('Helvetica').fill('#000000');
    centerText(
      'Thank you for shopping with Golden Basket Mart!',
      currentY + 22,
      12
    );
    currentY += 35;

    doc.fontSize(9).font('Helvetica').fill('#000000');
    centerText(
      'This is a computer-generated invoice. No signature required.',
      currentY + 20,
      9
    );

    centerText(
      'For any queries, please contact us at support@goldenbasket.com',
      currentY + 35,
      9
    );

    console.log('PDF document content completed, ending document');
    doc.end();

    // Add timeout for PDF generation
    timeout = setTimeout(() => {
      console.error('PDF generation timeout');
      if (stream) {
        stream.destroy();
      }
      if (doc) {
        doc.end();
      }
      cb(null, new Error('PDF generation timeout'));
    }, 30000); // 30 second timeout

    // Handle stream events
    console.log('Setting up stream event handlers');
    stream.on('finish', () => {
      console.log('Stream finish event triggered');
      clearTimeout(timeout);
      // Verify file was created
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log('File exists, size:', stats.size);
        if (stats.size > 0) {
          // Clean up the stream
          stream.destroy();
          console.log(
            'PDF generation successful, calling callback with filePath:',
            filePath
          );
          cb(filePath);
        } else {
          stream.destroy();
          console.log('Generated PDF file is empty');
          cb(null, new Error('Generated PDF file is empty'));
        }
      } else {
        stream.destroy();
        console.log('PDF file was not created');
        cb(null, new Error('PDF file was not created'));
      }
    });

    stream.on('error', (error) => {
      console.log('Stream error event triggered:', error.message);
      clearTimeout(timeout);
      console.error('Stream error during PDF generation:', error);
      // Clean up the stream
      stream.destroy();
      cb(null, error);
    });

    // Handle doc errors
    if (doc) {
      doc.on('error', (error) => {
        clearTimeout(timeout);
        console.error('PDF document error during generation:', error);
        if (stream) {
          stream.destroy();
        }
        cb(null, error);
      });
    }
  } catch (error) {
    console.error('Error during PDF generation:', error);
    // Clean up resources
    if (timeout) {
      clearTimeout(timeout);
    }
    if (stream) {
      stream.destroy();
    }
    if (doc) {
      doc.end();
    }
    cb(null, error);
  }
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
      if (!item.product)
        return res.status(404).json({ error: 'Product not found in cart.' });
      if (item.product.stock < item.quantity) {
        return res
          .status(400)
          .json({ error: `Not enough stock for ${item.product.name}.` });
      }
    }

    // Decrement stock
    for (const item of cart.items) {
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = cart.items.map((item) => {
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
      shippingAddress = await require('../models/ShippingAddress').findById(
        order.shippingAddress
      );
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

    // Populate order with product details for PDF generation
    const populatedOrder = await Order.findById(order._id).populate(
      'items.product'
    );

    // Generate and store PDF
    console.log('Starting PDF generation for invoice:', invoice._id);
    console.log('Order items for PDF:', populatedOrder.items);

    generateInvoicePDF(
      invoice,
      populatedOrder,
      user,
      shippingAddress,
      async (filePath, error) => {
        if (error) {
          console.error('PDF generation failed:', error);
          // Still create the order but without PDF
          res.status(201).json({
            order,
            invoice,
            warning: 'Order created but invoice PDF generation failed',
          });
          return;
        }

        try {
          console.log('PDF generated successfully, saving to:', filePath);
          invoice.pdfPath = filePath;
          await invoice.save();
          // Clear cart
          cart.items = [];
          await cart.save();
          res.status(201).json({ order, invoice });
        } catch (saveError) {
          console.error('Error saving invoice or clearing cart:', saveError);
          res.status(201).json({
            order,
            invoice,
            warning:
              'Order created but there were issues with invoice or cart cleanup',
          });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate(
      'items.product invoice'
    );
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
    const { id: invoiceId } = req.params;

    if (!invoiceId) {
      return res.status(400).json({ error: 'Invoice ID is required' });
    }

    const invoice = await Invoice.findById(invoiceId).populate('user');

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }

    const order = await Order.findById(invoice.order)
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name price stock',
      })
      .populate('shippingAddress');

    if (!order) {
      return res
        .status(400)
        .json({ error: 'Order not found for this invoice.' });
    }

    // Update invoice object with populated order
    invoice.order = order;

    if (!invoice.pdfPath || !fs.existsSync(invoice.pdfPath)) {
      // Generate PDF if not available
      generateInvoicePDF(
        invoice,
        invoice.order,
        invoice.user,
        invoice.order.shippingAddress,
        (filePath, error) => {
          if (error) {
            return res
              .status(500)
              .json({ error: 'Failed to generate invoice PDF' });
          }
          if (!filePath) {
            return res
              .status(500)
              .json({ error: 'PDF generation returned no file path' });
          }

          res.download(filePath);
        }
      );
    } else {
      res.download(invoice.pdfPath);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.userId }).populate(
      'order'
    );
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
