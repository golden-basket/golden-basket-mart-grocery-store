const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const productController = require('../controllers/productController');
const addressController = require('../controllers/addressController');
const categoryController = require('../controllers/categoryController');
const { auth, admin, authLimiter } = require('../middleware/auth');

const {
  validateObjectId,
  registerValidation,
  loginValidation,
  productValidation,
  cartValidation,
  addressValidation,
  orderValidation,
  handleValidationErrors,
} = require('../middleware/validation');
const { cacheMiddleware, clearCache } = require('../middleware/cache');

// Authentication routes
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post(
  '/auth/register',
  authLimiter,
  registerValidation,
  handleValidationErrors,
  authController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post(
  '/auth/login',
  authLimiter,
  loginValidation,
  handleValidationErrors,
  authController.login
);

/**
 * @swagger
 * /auth/verify/{token}:
 *   get:
 *     summary: Verify email with token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get('/auth/verify/:token', authController.verifyEmail);

// Cart routes
/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/cart', auth, cartController.getCart);

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 format: mongoId
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Item added to cart
 *       400:
 *         description: Validation error or insufficient stock
 */
router.post(
  '/cart/add',
  auth,
  cartValidation,
  handleValidationErrors,
  cartController.addToCart
);

/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 format: mongoId
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       400:
 *         description: Validation error or insufficient stock
 */
router.put(
  '/cart/update',
  auth,
  cartValidation,
  handleValidationErrors,
  cartController.updateCartItem
);

/**
 * @swagger
 * /cart/remove:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 format: mongoId
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       400:
 *         description: Validation error
 */
router.delete('/cart/remove', auth, cartController.removeFromCart);

/**
 * @swagger
 * /cart/clear:
 *   post:
 *     summary: Clear user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 */
router.post('/cart/clear', auth, cartController.clearCart);

// Order routes
/**
 * @swagger
 * /orders/place:
 *   post:
 *     summary: Place order from cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shippingAddressId:
 *                 type: string
 *                 format: mongoId
 *               paymentMode:
 *                 type: string
 *                 enum: [card, paypal, upi, cod, net_banking]
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Cart is empty or insufficient stock
 */
router.post(
  '/orders/place',
  auth,
  orderValidation,
  handleValidationErrors,
  orderController.placeOrder
);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router.get('/orders', auth, orderController.getUserOrders);

/**
 * @swagger
 * /orders/all:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders retrieved successfully
 *       403:
 *         description: Admin access required
 */
router.get('/orders/all', auth, admin, orderController.getAllOrders);

// Invoices routes
/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Get user's invoices
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Invoices retrieved successfully
 */
router.get('/invoices', auth, orderController.getUserInvoices);

/**
 * @swagger
 * /invoice/{invoiceId}:
 *   get:
 *     summary: Download invoice PDF
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoId
 *     responses:
 *       200:
 *         description: Invoice PDF downloaded
 *       404:
 *         description: Invoice not found
 */
router.get(
  '/invoice/:invoiceId',
  auth,
  validateObjectId,
  orderController.downloadInvoice
);

// Product routes
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */
router.get('/products', cacheMiddleware(300), productController.getAllProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create new product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               price:
 *                 type: number
 *                 minimum: 0
 *               category:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Admin access required
 */
router.post(
  '/products',
  auth,
  admin,
  productValidation,
  handleValidationErrors,
  (req, res, next) => {
    clearCache('/products');
    next();
  },
  productController.createProduct
);

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Filter by stock availability
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */
router.get(
  '/products/search',
  cacheMiddleware(300),
  productController.searchProducts
);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get single product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoId
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get('/products/:id', validateObjectId, productController.getProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoId
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               price:
 *                 type: number
 *                 minimum: 0
 *               category:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */
router.put(
  '/products/:id',
  auth,
  admin,
  validateObjectId,
  productValidation,
  handleValidationErrors,
  (req, res, next) => {
    clearCache('/products');
    next();
  },
  productController.updateProduct
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoId
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */
router.delete(
  '/products/:id',
  auth,
  admin,
  validateObjectId,
  (req, res, next) => {
    clearCache('/products');
    next();
  },
  productController.deleteProduct
);

// Address routes
/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: Get user's addresses
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
 */
router.get('/addresses', auth, addressController.getAddresses);

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: Add new address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressLine1
 *               - city
 *               - state
 *               - country
 *               - pinCode
 *               - phoneNumber
 *             properties:
 *               addressLine1:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *               addressLine2:
 *                 type: string
 *                 maxLength: 100
 *               city:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               state:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               country:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               pinCode:
 *                 type: string
 *                 pattern: '^[0-9]{6}$'
 *               phoneNumber:
 *                 type: string
 *                 pattern: '^[0-9]{10}$'
 *     responses:
 *       201:
 *         description: Address added successfully
 *       400:
 *         description: Validation error
 */
router.post(
  '/addresses',
  auth,
  addressValidation,
  handleValidationErrors,
  addressController.addAddress
);

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     summary: Update address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoId
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressLine1:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *               addressLine2:
 *                 type: string
 *                 maxLength: 100
 *               city:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               state:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               country:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               pinCode:
 *                 type: string
 *                 pattern: '^[0-9]{6}$'
 *               phoneNumber:
 *                 type: string
 *                 pattern: '^[0-9]{10}$'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Address not found
 */
router.put(
  '/addresses/:id',
  auth,
  validateObjectId,
  addressValidation,
  handleValidationErrors,
  addressController.updateAddress
);

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     summary: Delete address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoId
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found
 */
router.delete(
  '/addresses/:id',
  auth,
  validateObjectId,
  addressController.deleteAddress
);

// User routes
/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Admin access required
 */
router.get('/users', auth, admin, authController.listUsers);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoId
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 *       403:
 *         description: Admin access required
 */
router.put('/users/:id', auth, admin, authController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoId
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 *       403:
 *         description: Admin access required
 */
router.delete('/users/:id', auth, admin, authController.deleteUser);

/**
 * @swagger
 * /users/{id}/role:
 *   patch:
 *     summary: Change user role (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoId
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: User role changed
 *       400:
 *         description: Invalid role
 *       404:
 *         description: User not found
 *       403:
 *         description: Admin access required
 */
router.patch('/users/:id/role', auth, admin, authController.changeUserRole);

// Projects routes
/**
 * @swagger
 * /projects:
 *   get:
 *     summary: List all projects (admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *       403:
 *         description: Admin access required
 */
router.get(
  '/projects',
  auth,
  admin,
  require('../controllers/projectController').listProjects
);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get single project (admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoId
 *     responses:
 *       200:
 *         description: Project details
 *       404:
 *         description: Project not found
 *       403:
 *         description: Admin access required
 */
router.get(
  '/projects/:id',
  auth,
  admin,
  require('../controllers/projectController').getProject
);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create project (admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, completed, on-hold]
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: mongoId
 *     responses:
 *       201:
 *         description: Project created
 *       400:
 *         description: Validation error
 *       403:
 *         description: Admin access required
 */
router.post(
  '/projects',
  auth,
  admin,
  require('../controllers/projectController').createProject
);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update project (admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoId
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, completed, on-hold]
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: mongoId
 *     responses:
 *       200:
 *         description: Project updated
 *       404:
 *         description: Project not found
 *       403:
 *         description: Admin access required
 */
router.put(
  '/projects/:id',
  auth,
  admin,
  require('../controllers/projectController').updateProject
);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete project (admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoId
 *     responses:
 *       200:
 *         description: Project deleted
 *       404:
 *         description: Project not found
 *       403:
 *         description: Admin access required
 */
router.delete(
  '/projects/:id',
  auth,
  admin,
  require('../controllers/projectController').deleteProject
);

// Category routes
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get('/categories', categoryController.getCategories);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create or update category (admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 maxLength: 200
 *     responses:
 *       201:
 *         description: Category created or updated successfully
 *       400:
 *         description: Validation error
 */
router.post('/categories', auth, admin, categoryController.createOrUpdateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoId
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       404:
 *         description: Category not found
 */
router.get(
  '/categories/:id',
  auth,
  validateObjectId,
  categoryController.getCategoryById
);

module.exports = router;
