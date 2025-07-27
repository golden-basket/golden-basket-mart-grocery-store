// Create or update a category
exports.createOrUpdateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate input
    if (!name) {
      logger.warn('Category creation attempt with missing name');
      return res.status(400).json({ error: 'Name is required.' });
    }

    // Create or update category using upsert
    const category = await Category.findOneAndUpdate(
      { name },
      { name, description },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    logger.info(`Category created: ${category.name} by admin`);
    res.status(201).json(category);
  } catch (err) {
    logger.error('Error creating category:', err);
    res.status(400).json({ error: 'Failed to create category.' });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    logger.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      logger.warn(`Category fetch attempt for non-existent category: ${id}`);
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.json(category);
  } catch (err) {
    logger.error('Error fetching category:', err);
    res.status(500).json({ error: 'Failed to fetch category.' });
  }
};
