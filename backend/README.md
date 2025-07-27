# Golden Basket Mart Backend

## Environment Variables (.env)
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Secret for JWT signing
- `EMAIL_USER`: Email address for sending verification emails
- `EMAIL_PASS`: Email password or app password
- `EMAIL_FROM`: Sender name and email (e.g., Golden Basket Mart <your_email@example.com>)

## Authentication Endpoints
- `POST /api/auth/register` — Register a new user (triggers email verification)
- `POST /api/auth/login` — Login (requires verified email)
- `GET /api/auth/verify/:token` — Email verification link

## Email Verification Flow
1. User registers with email and password
2. Receives verification email with a link
3. Clicks link to verify account
4. Can now login

## Notes
- All sensitive info must be in `.env` (never commit real credentials)
- Use the provided endpoints for authentication and verification 

## Cart API (requires authentication)
- `GET /api/cart` — Get current user's cart
- `POST /api/cart/add` — Add item to cart (`productId`, `quantity`)
- `PUT /api/cart/update` — Update item quantity (`productId`, `quantity`)
- `DELETE /api/cart/remove` — Remove item from cart (`productId`)
- `POST /api/cart/clear` — Clear cart 

## Order & Invoice API
- `POST /api/orders/place` — Place order from cart (requires authentication)
- `GET /api/orders` — Get current user's orders (requires authentication)
- `GET /api/orders/all` — Get all orders (admin only)
- `GET /api/invoice/:invoiceId` — Download invoice PDF (requires authentication) 
- `GET /api/invoices` — List all invoices for current user (requires authentication)

## Product API
- `GET /api/products` — Get all products
- `POST /api/products` — Create product (admin only)
- `PUT /api/products/:id` — Update product (admin only)
- `DELETE /api/products/:id` — Delete product (admin only) 

## Shipping Address API
- `GET /api/addresses` — List all addresses for current user (requires authentication)
- `POST /api/addresses` — Add new address (requires authentication)
- `PUT /api/addresses/:id` — Update address (requires authentication)
- `DELETE /api/addresses/:id` — Delete address (requires authentication) 