import bcrypt from 'bcryptjs';
import { User, Product, Order, CartItem, Session } from './types';

// Generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// In-memory data stores (in production, these would be persistent databases)
class DataStore {
  private users: Map<string, User> = new Map();
  private products: Map<string, Product> = new Map();
  private orders: Map<string, Order> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private sessions: Map<string, Session> = new Map();

  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    // Create admin user
    const adminId = generateId();
    const adminPasswordHash = await hashPassword('admin123');
    
    const adminUser: User = {
      id: adminId,
      name: 'Admin User',
      email: 'admin@ttech.com',
      password: adminPasswordHash,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.users.set(adminId, adminUser);
    this.users.set(adminUser.email, adminUser); // Also store by email for lookup

    // Initialize with sample products (Ghana-focused e-commerce)
    const sampleProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Samsung Galaxy A54 5G',
        description: 'Latest smartphone with excellent camera and long battery life. Perfect for capturing memories and staying connected.',
        price: 2800.00, // GHS
        currency: 'GHS',
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        rating: 4.5,
        numReviews: 128,
        countInStock: 15,
      },
      {
        name: 'HP Laptop 15-dw3000',
        description: 'Reliable laptop for work and entertainment. Intel Core i5, 8GB RAM, 256GB SSD.',
        price: 4200.00, // GHS
        currency: 'GHS',
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80&auto=format&fit=crop&crop=entropy',
        rating: 4.3,
        numReviews: 89,
        countInStock: 8,
      },
      {
        name: 'African Print Kente Shirt',
        description: 'Beautiful traditional Kente print shirt. Made with high-quality African fabric. Available in various sizes.',
        price: 180.00, // GHS
        currency: 'GHS',
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&q=80&auto=format&fit=crop&crop=entropy',
        rating: 4.8,
        numReviews: 95,
        countInStock: 25,
      },
      {
        name: 'Adinkra Symbol Wall Art',
        description: 'Handcrafted wooden wall art featuring traditional Adinkra symbols. Perfect for home decoration.',
        price: 320.00, // GHS
        currency: 'GHS',
        category: 'Home & Decor',
        image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=500&q=80&auto=format&fit=crop&crop=entropy',
        rating: 4.6,
        numReviews: 42,
        countInStock: 12,
      },
      {
        name: 'Pure Shea Butter (500g)',
        description: 'Raw, unrefined shea butter from northern Ghana. Perfect for skincare and hair care.',
        price: 45.00, // GHS
        currency: 'GHS',
        category: 'Health & Beauty',
        image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=500',
        rating: 4.9,
        numReviews: 203,
        countInStock: 50,
      },
      {
        name: 'Ghanaian Cocoa Powder (1kg)',
        description: 'Premium quality cocoa powder from Ghana. Rich flavor perfect for baking and beverages.',
        price: 85.00, // GHS
        currency: 'GHS',
        category: 'Food & Beverages',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        rating: 4.7,
        numReviews: 156,
        countInStock: 30,
      },
    ];

    // Add sample products
    sampleProducts.forEach(productData => {
      const productId = generateId();
      const product: Product = {
        ...productData,
        id: productId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.products.set(productId, product);
    });
  }

  // User methods
  async createUser(userData: { name: string; email: string; password: string }): Promise<User> {
    const userId = generateId();
    const hashedPassword = await hashPassword(userData.password);
    
    const user: User = {
      id: userId,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.users.set(userId, user);
    this.users.set(user.email, user); // Also store by email
    return user;
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.get(email.toLowerCase());
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  // Product methods
  getAllProducts(): Product[] {
    return Array.from(this.products.values());
  }

  getProductById(id: string): Product | undefined {
    return this.products.get(id);
  }

  createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const productId = generateId();
    const product: Product = {
      ...productData,
      id: productId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.products.set(productId, product);
    return product;
  }

  updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Product | null {
    const product = this.products.get(id);
    if (!product) return null;
    
    const updatedProduct: Product = {
      ...product,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  deleteProduct(id: string): boolean {
    return this.products.delete(id);
  }

  // Order methods
  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const orderId = generateId();
    const order: Order = {
      ...orderData,
      id: orderId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.orders.set(orderId, order);
    return order;
  }

  getOrdersByUserId(userId: string): Order[] {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.get(id);
  }

  updateOrder(id: string, updates: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>): Order | null {
    const order = this.orders.get(id);
    if (!order) return null;
    
    const updatedOrder: Order = {
      ...order,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Cart methods
  addToCart(userId: string, productId: string, quantity: number): CartItem {
    const cartItemId = generateId();
    const cartItem: CartItem = {
      id: cartItemId,
      userId,
      productId,
      quantity,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Remove existing cart item for same product/user
    const existingKey = Array.from(this.cartItems.keys()).find(key => {
      const item = this.cartItems.get(key);
      return item && item.userId === userId && item.productId === productId;
    });
    
    if (existingKey) {
      this.cartItems.delete(existingKey);
    }
    
    this.cartItems.set(cartItemId, cartItem);
    return cartItem;
  }

  getCartByUserId(userId: string): CartItem[] {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  removeFromCart(userId: string, productId: string): boolean {
    const key = Array.from(this.cartItems.keys()).find(key => {
      const item = this.cartItems.get(key);
      return item && item.userId === userId && item.productId === productId;
    });
    
    if (key) {
      return this.cartItems.delete(key);
    }
    return false;
  }

  clearCart(userId: string): void {
    const keysToDelete = Array.from(this.cartItems.keys()).filter(key => {
      const item = this.cartItems.get(key);
      return item && item.userId === userId;
    });
    
    keysToDelete.forEach(key => this.cartItems.delete(key));
  }

  // Session methods
  createSession(userId: string): Session {
    const sessionId = generateId();
    const session: Session = {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
    };
    
    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId: string): Session | undefined {
    const session = this.sessions.get(sessionId);
    if (session && session.expiresAt > new Date()) {
      return session;
    }
    // Remove expired session
    if (session) {
      this.sessions.delete(sessionId);
    }
    return undefined;
  }

  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  // Clean up expired sessions
  cleanupExpiredSessions(): void {
    const now = new Date();
    const expiredKeys = Array.from(this.sessions.entries())
      .filter(([_, session]) => session.expiresAt <= now)
      .map(([key, _]) => key);
    
    expiredKeys.forEach(key => this.sessions.delete(key));
  }
}

// Export singleton instance
export const dataStore = new DataStore();

// Format currency for Ghana cedis
export function formatCurrency(amount: number): string {
  return `GH₵${amount.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}