const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Joi = require('joi');
const logger = require('../utils/logger');

const cartItemSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

// Get current user's cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId }).populate(
      'items.product'
    );
    if (!cart) {
      cart = await Cart.create({ user: req.user.userId, items: [] });
    }
    res.json(cart);
  } catch (err) {
    logger.error('Error in getCart:', err);
    res.status(500).json({ error: err.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { error } = cartItemSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    if (product.stock < quantity)
      return res.status(400).json({ error: 'Not enough stock available.' });
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) cart = await Cart.create({ user: req.user.userId, items: [] });
    const existing = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (existing) {
      if (product.stock < existing.quantity + quantity)
        return res.status(400).json({ error: 'Not enough stock available.' });
      existing.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    // Populate product data before sending response
    const populatedCart = await Cart.findById(cart._id).populate(
      'items.product'
    );
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update item quantity in cart
exports.updateCartItem = async (req, res) => {
  try {
    const { error } = cartItemSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    if (product.stock < quantity)
      return res.status(400).json({ error: 'Not enough stock available.' });
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found.' });
    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item)
      return res.status(404).json({ error: 'Item not found in cart.' });
    item.quantity = quantity;
    await cart.save();
    // Populate product data before sending response
    const populatedCart = await Cart.findById(cart._id).populate(
      'items.product'
    );
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { error } = Joi.object({
      productId: Joi.string().required(),
    }).validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { productId } = req.body;

    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    // Populate product data before sending response
    const populatedCart = await Cart.findById(cart._id).populate(
      'items.product'
    );
    res.json(populatedCart);
  } catch (err) {
    logger.error('Error in removeFromCart:', err);
    res.status(500).json({ error: err.message });
  }
};

// Clear cart (after order placed)
exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared.' });
  } catch (err) {
    logger.error('Error in clearCart:', err);
    res.status(500).json({ error: err.message });
  }
};
