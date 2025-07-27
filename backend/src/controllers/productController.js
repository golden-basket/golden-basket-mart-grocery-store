const Product = require('../models/Product');
const logger = require('../utils/logger');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    logger.info(`Products retrieved: ${products.length} products`);
    res.json(products);
  } catch (err) {
    logger.error('Error getting products:', err);
    res.status(500).json({ error: 'Failed to retrieve products.' });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      logger.warn(`Product not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Product not found.' });
    }
    logger.info(`Product retrieved: ${product.name}`);
    res.json(product);
  } catch (err) {
    logger.error('Error getting product:', err);
    res.status(500).json({ error: 'Failed to retrieve product.' });
  }
};

// Create product (admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, images } = req.body;
    
    // Check for duplicate product name
    const exists = await Product.findOne({ name });
    if (exists) {
      logger.warn(`Product creation attempt with existing name: ${name}`);
      return res.status(409).json({ error: 'Product with this name already exists.' });
    }
    
    const newProduct = new Product({ 
      name, 
      description, 
      price, 
      category, 
      stock, 
      images: images || [] 
    });
    const product = await newProduct.save();
    
    logger.info(`Product created: ${product.name} by admin`);
    res.status(201).json(product);
  } catch (err) {
    logger.error('Error creating product:', err);
    res.status(400).json({ error: 'Failed to create product.' });
  }
};

// Update product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    
    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!product) {
      logger.warn(`Product update attempt for non-existent product: ${id}`);
      return res.status(404).json({ error: 'Product not found.' });
    }
    
    logger.info(`Product updated: ${product.name} by admin`);
    res.json(product);
  } catch (err) {
    logger.error('Error updating product:', err);
    res.status(400).json({ error: 'Failed to update product.' });
  }
};

// Delete product (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      logger.warn(`Product deletion attempt for non-existent product: ${id}`);
      return res.status(404).json({ error: 'Product not found.' });
    }
    
    logger.info(`Product deleted: ${product.name} by admin`);
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    logger.error('Error deleting product:', err);
    res.status(400).json({ error: 'Failed to delete product.' });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, inStock } = req.query;
    
    let query = {};
    
    // Text search
    if (q) {
      query.$text = { $search: q };
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Stock filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    logger.info(`Products searched: ${products.length} results for query: ${JSON.stringify(req.query)}`);
    res.json(products);
  } catch (err) {
    logger.error('Error searching products:', err);
    res.status(500).json({ error: 'Failed to search products.' });
  }
};
