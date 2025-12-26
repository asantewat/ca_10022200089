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
  private initialized: Promise<void>;
  private instanceId: string; // Track instance to see if it's being recreated

  constructor() {
    this.instanceId = Math.random().toString(36).substring(7);
    console.log('DataStore instance created with ID:', this.instanceId);
    this.initialized = this.initializeData();
  }
  
  getInstanceId(): string {
    return this.instanceId;
  }

  // Ensure data is initialized before use
  async ensureInitialized(): Promise<void> {
    await this.initialized;
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
    this.users.set(adminUser.email.toLowerCase(), adminUser); // Also store by email for lookup (lowercase)
    
    console.log('DataStore initialized. Admin user created:', adminUser.email);

    // Initialize with sample products (Ghana-focused e-commerce)
    const sampleProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: ' Active Noise Cancelling Wireless Headphones',
        description: 'Latest smartphone with excellent camera and long battery life. Perfect for capturing memories and staying connected.',
        price: 800.00, // GHS
        currency: 'GHS',
        category: 'Headphones',
        image: '/images/headphones-1.jpg',
        rating: 4.5,
        numReviews: 128,
        countInStock: 15,
      },
      {
        name: 'HP Laptop 15-dw3000',
        description: 'Reliable laptop for work and entertainment. Intel Core i5, 8GB RAM, 256GB SSD.',
        price: 4200.00, // GHS
        currency: 'GHS',
        category: 'Laptops',
        image: '/images/laptop-1.webp',
        rating: 4.3,
        numReviews: 89,
        countInStock: 8,
      },
      {
        name: 'JBL Flip 6',
        description: 'JBL Flip 6 is IP67 waterproof and dustproof, so you can bring your speaker anywhere.',
        price: 180.00, // GHS
        currency: 'GHS',
        category: 'Speakers',
        image: '/images/speaker-4.webp',
        rating: 4.8,
        numReviews: 95,
        countInStock: 25,
      },
      {
        name: 'iPhone 16',
        description: 'Innovative design for ultimate performance and battery',
        price: 320.00, // GHS
        currency: 'GHS',
        category: 'Phones',
        image: '/images/phone-1.webp',
        rating: 4.6,
        numReviews: 42,
        countInStock: 12,
      },
      {
        name: '3D Thudercloud LED',
        description: 'Cloud Light Multicolor Lightning Changing, 3D Thundercloud LED Light Cotton Lightning Cloud Colorful Atmosphere Night Light, DIY Creative Cloud Lights for Bedroom Gaming Room Indoor, 16 Feet',
        price: 95.00, // GHS
        currency: 'GHS',
        category: 'LED Lights',
        image: '/images/led-1.jpg',
        rating: 4.9,
        numReviews: 203,
        countInStock: 50,
      },
      {
        name: 'Samsung Galaxy S8',
        description: '128GB, Expandable up to 1.5TB via microSD card',
        price: 850.00, // GHS
        currency: 'GHS',
        category: 'Phones',
        image: '/images/phone-5.webp',
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
    this.users.set(user.email.toLowerCase(), user); // Also store by email (lowercase)
    console.log('User created:', user.email, 'Stored with key:', user.email.toLowerCase());
    return user;
  }

  getUserByEmail(email: string): User | undefined {
    const normalizedEmail = email.toLowerCase();
    const user = this.users.get(normalizedEmail);
    console.log(`getUserByEmail: Looking for "${normalizedEmail}", found:`, user ? user.email : 'null');
    console.log(`Total users in store: ${this.users.size}, Keys:`, Array.from(this.users.keys()).filter(k => !k.includes('-')));
    return user;
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }
  
  // Debug method to get all user emails
  getAllUserEmails(): string[] {
    return Array.from(this.users.values())
      .filter(u => u.email) // Filter out entries that are keyed by ID
      .map(u => u.email);
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

// Use global variable to persist dataStore across Next.js serverless function invocations
// This is necessary because Next.js can re-evaluate modules between requests
declare global {
  var __dataStore: DataStore | undefined;
}

// Export singleton instance - use global to persist across serverless invocations
export const dataStore = globalThis.__dataStore || (globalThis.__dataStore = new DataStore());

// Format currency for Ghana cedis
export function formatCurrency(amount: number): string {
  return `GH₵${amount.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}