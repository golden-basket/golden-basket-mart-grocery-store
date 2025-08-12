# Golden Basket Mart - Grocery Store

A full-stack e-commerce grocery store application built with modern web technologies. This project features a React frontend with Material-UI components and a Node.js/Express backend with MongoDB database.

## 🚀 Features

### Frontend Features
- **Modern React 19** with hooks and functional components
- **Material-UI 7** for beautiful, responsive design
- **Responsive Design** optimized for all device sizes including foldables
- **Lazy Loading** for improved performance
- **React Router** for client-side navigation
- **React Query** for efficient data fetching and caching
- **Form Validation** with React Hook Form
- **Error Boundaries** for graceful error handling

### Backend Features
- **Node.js/Express** server with RESTful API
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** with role-based access control
- **Security Middleware** (Helmet, CORS, XSS protection, etc.)
- **API Documentation** with Swagger/OpenAPI
- **Performance Monitoring** and caching
- **Input Validation** with Joi and Express Validator
- **Rate Limiting** and security measures
- **PDF Generation** for invoices
- **Email Services** with Nodemailer

### Core Functionality
- **User Authentication** (Register, Login, Password Management)
- **Product Catalog** with categories and search
- **Shopping Cart** management
- **Order Processing** and checkout
- **Address Management** for shipping
- **Admin Panel** for product and user management
- **Order History** and tracking
- **Responsive Design** for all devices

## 🏗️ Project Structure

```
golden-basket-mart-grocery-store/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Utility functions
│   ├── index.js            # Server entry point
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   └── providers/      # Context providers
│   ├── index.html          # HTML template
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Material-UI 7** - Component library
- **React Router 7** - Routing
- **React Query** - Data fetching
- **Vite** - Build tool
- **ESLint** - Code quality

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Joi** - Validation
- **Winston** - Logging
- **Swagger** - API documentation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/golden-basket-mart-grocery-store.git
   cd golden-basket-mart-grocery-store
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file with your configuration
   cp .env.example .env
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - Update the `MONGODB_URI` in your backend `.env` file

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/golden-basket-mart
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## 📱 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

The backend provides a comprehensive REST API documented with Swagger:

- **Authentication**: `/api/auth/*`
- **Products**: `/api/products/*`
- **Categories**: `/api/categories/*`
- **Cart**: `/api/cart/*`
- **Orders**: `/api/orders/*`
- **Users**: `/api/users/*`
- **Addresses**: `/api/addresses/*`

Access the full API documentation at: `http://localhost:3000/api-docs`

## 🔐 Authentication & Authorization

- **JWT-based authentication**
- **Role-based access control** (User/Admin)
- **Protected routes** for authenticated users
- **Admin-only routes** for administrative functions

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices
- Tablets
- Desktop computers
- Foldable devices
- Ultra-wide screens

## 🚀 Performance Features

- **Lazy loading** of components
- **Code splitting** with Vite
- **Caching** with React Query
- **Compression** middleware
- **Database indexing** for faster queries
- **Performance monitoring** endpoints

## 🧪 Testing

- **Jest** for backend testing
- **Supertest** for API testing
- **Error boundaries** for frontend error handling

## 📦 Deployment

### Backend Deployment
- Set `NODE_ENV=production`
- Configure production MongoDB URI
- Set secure JWT secret
- Configure CORS origin for production domain

### Frontend Deployment
- Build the application: `npm run build`
- Deploy the `dist` folder to your hosting service
- Configure environment variables for production API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Rohitash Kator**

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**Golden Basket Mart** - Your one-stop solution for online grocery shopping! 🛒✨