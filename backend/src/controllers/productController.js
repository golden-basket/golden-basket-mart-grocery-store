const Product = require('../models/Product');
const Category = require('../models/Category');
const logger = require('../utils/logger');

// Get all products with pagination and field selection
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Field selection to avoid fetching unnecessary data
    const selectFields =
      'name description price category stock images ratings createdAt';

    // Build query with optional filters
    const query = {};
    if (req.query.category) query.category = req.query.category;
    if (req.query.minPrice)
      query.price = { $gte: parseFloat(req.query.minPrice) };
    if (req.query.maxPrice)
      query.price = { ...query.price, $lte: parseFloat(req.query.maxPrice) };
    if (req.query.inStock === 'true') query.stock = { $gt: 0 };

    // Execute queries in parallel for better performance
    const [products, filteredCount, totalCount] = await Promise.all([
      Product.find(query)
        .select(selectFields)
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // Use lean() for better performance when not needing Mongoose documents
      Product.countDocuments(query), // Count of products matching current filters
      Product.countDocuments({}), // Total count of all products in database
    ]);

    const totalPages = Math.ceil(filteredCount / limit);

    logger.info(
      `Products retrieved: ${products.length} products (page ${page}/${totalPages})`
    );

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount, // Total products in database
        filteredCount, // Products matching current filters
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    logger.error('Error getting products:', err);
    res.status(500).json({ error: 'Failed to retrieve products.' });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    // Populate category reference
    const product = await Product.findById(req.params.id).populate('category');
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
      return res
        .status(409)
        .json({ error: 'Product with this name already exists.' });
    }

    // Validate category
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      logger.warn(
        `Product creation attempt with non-existent category: ${category}`
      );
      return res.status(400).json({ error: 'Invalid category.' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      images: images || [],
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

    // Populate category reference
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .populate('category');

    logger.info(
      `Products searched: ${
        products.length
      } results for query: ${JSON.stringify(req.query)}`
    );
    res.json(products);
  } catch (err) {
    logger.error('Error searching products:', err);
    res.status(500).json({ error: 'Failed to search products.' });
  }
};
