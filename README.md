# 🛍️ T-Tech & Appliances - Completed E-Commerce Platform

## ✅ **FINISHED & DEPLOYED**

A production-ready, deployed, full-stack e-commerce application for T-Tech & Appliances, built with **Next.js 15+**, **MongoDB**, and **TypeScript**.
Deployed website: https://t-tech-and-appliances.netlify.app/

## Features

### 🔐 Authentication

- User registration and login
- JWT-based authentication (simulated)
- Role-based access control (USER, ADMIN)
- Protected routes
- Persistent sessions

### 🛒 Customer Features

- **Home Page**: Featured products and hero section
- **Product Catalog**: Browse all products with search and filtering
- **Product Details**: Detailed view with quantity selection
- **Shopping Cart**: Add, update, and remove items
- **Checkout**: Complete order form with simulated payment
- **Order History**: View all past orders with status tracking
- **User Profile**: View account information

### 👨‍💼 Admin Features

- **Admin Dashboard**: Overview with statistics (products, orders, users, revenue)
- **Product Management**: Create, edit, and delete products
- **Order Management**: View all orders and update status
- **User Management**: View all registered users

## 🎨 Design Features

- Modern, clean UI with Tailwind CSS
- Fully responsive (mobile, tablet, desktop)
- Card-based layouts
- Professional color scheme
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications

## 🏗️ Project Structure

```
/src
  /lib
    types.ts           # TypeScript type definitions
    api.ts             # Simulated API with localStorage
    mockData.ts        # Initial product and user data
  /contexts
    AuthContext.tsx    # Authentication state management
    CartContext.tsx    # Shopping cart state management
  /app
    /components
      Navbar.tsx              # Navigation bar
      ProductCard.tsx         # Product display card
      /pages
        HomePage.tsx          # Landing page
        ProductsPage.tsx      # Product listing
        ProductDetailPage.tsx # Product details
        CartPage.tsx          # Shopping cart
        CheckoutPage.tsx      # Checkout form
        OrdersPage.tsx        # Order history
        LoginPage.tsx         # Login form
        RegisterPage.tsx      # Registration form
        ProfilePage.tsx       # User profile
        /admin
          AdminDashboard.tsx  # Admin overview
          AdminProducts.tsx   # Product management
          AdminOrders.tsx     # Order management
      /ui                     # Reusable UI components
    App.tsx            # Main application component
```

## 🗄️ Data Models

### User

```typescript
{
  id: string;
  name: string;
  email: string;
  password: string; // Stored as plain text in demo (would be hashed in production)
  role: "USER" | "ADMIN";
  createdAt: string;
}
```

### Product

```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  createdAt: string;
}
```

### Order

```typescript
{
  id: string;
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }>;
  totalAmount: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}
```

### Cart

```typescript
{
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm (node package manager)

### Installation

1. **Clone or download the project**

   ```bash
   git clone <your-repo-url>
  cd t-tech-2
  cd t-tech-main
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 👤 Demo Accounts

-### Admin Account

- **Email**: `admin@ttech.com`
- **Password**: `admin123`
- **Access**: Full admin panel with product and order management

### Create Your Own Account

- Click "Sign Up" on the login page
- Fill in your details
- Start shopping!

## 🎯 How to Use

### As a Customer:

1. **Register/Login**: Create an account or use demo credentials
2. **Browse Products**: View featured products on home or browse all products
3. **Add to Cart**: Select products and add them to your cart
4. **Checkout**: Fill in shipping and payment details (simulated)
5. **Track Orders**: View your order history and status

### As an Admin:

1. **Login**: Use admin credentials
2. **Dashboard**: View statistics and quick actions
3. **Manage Products**: Create, edit, or delete products
4. **Manage Orders**: Update order statuses (pending → shipped → delivered)

## 🔧 Configuration

### Data Storage

All data is stored in `localStorage` with these keys:

- `ttech_products`: Product catalog
- `ttech_users`: User accounts
- `ttech_orders`: Order history
- `ttech_carts`: Shopping carts
- `ttech_token`: Authentication token
- `ttech_user`: Current user data

### Reset Data

To reset all data to initial state, clear localStorage:

```javascript
localStorage.clear();
```

Then refresh the page.

## 📦 Deployment

### Build for Production

```bash
npm run build
```

### Deployment Platforms

This app can be deployed to:

- **Netlify**


## 🔒 Security Notes

⚠️ **IMPORTANT**: This is a demo application with simulated backend:

- Passwords are stored in **plain text** in localStorage (never do this in production!)
- JWT tokens are **simulated** and not cryptographically secure
- No real payment processing occurs
- Not suitable for handling real customer data or PII

### For Production Use:

- Implement a real backend (Node.js, Django, etc.)
- Use a proper database (PostgreSQL, MongoDB, etc.)
- Hash passwords with bcrypt
- Use real JWT with secret keys
- Implement proper authentication middleware
- Add HTTPS/SSL certificates
- Implement real payment gateway (Stripe, PayPal, etc.)
- Add proper validation and sanitization
- Implement rate limiting and security headers

## 🛠️ Technologies Used

- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS 4**: Styling
- **Vite**: Build tool
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icons
- **Sonner**: Toast notifications
- **Context API**: State management

## 📝 API Reference

### Authentication

```typescript
authAPI.register(data: RegisterData): Promise<AuthResponse>
authAPI.login(credentials: LoginCredentials): Promise<AuthResponse>
authAPI.getProfile(token: string): Promise<User>
```

### Products

```typescript
productsAPI.getAll(): Promise<Product[]>
productsAPI.getById(id: string): Promise<Product>
productsAPI.create(product: Partial<Product>, token: string): Promise<Product>
productsAPI.update(id: string, updates: Partial<Product>, token: string): Promise<Product>
productsAPI.delete(id: string, token: string): Promise<void>
```

### Cart

```typescript
cartAPI.get(userId: string): Promise<Cart>
cartAPI.addItem(userId: string, productId: string, quantity: number): Promise<Cart>
cartAPI.updateItem(userId: string, productId: string, quantity: number): Promise<Cart>
cartAPI.removeItem(userId: string, productId: string): Promise<Cart>
cartAPI.clear(userId: string): Promise<void>
```

### Orders

```typescript
ordersAPI.create(userId: string, products: OrderProduct[], totalAmount: number): Promise<Order>
ordersAPI.getMyOrders(userId: string): Promise<Order[]>
ordersAPI.getAll(token: string): Promise<Order[]>
ordersAPI.updateStatus(id: string, status: OrderStatus, token: string): Promise<Order>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or as a foundation for your own e-commerce application.

**Built with ❤️ using React and TypeScript**
