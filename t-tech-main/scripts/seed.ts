import connectDB from '../server/config/database';
import { User } from '../server/models/User';
import { Product } from '../server/models/Product';

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-canceling headphones with 30-hour battery life.',
    price: 299.99,
    category: 'Audio',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  },
  {
    name: 'Laptop Pro 15',
    description: 'High-performance laptop with Intel i7 processor and 16GB RAM.',
    price: 1299.99,
    category: 'Computers',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
  },
  {
    name: 'Smartphone X',
    description: 'Latest flagship smartphone with 6.7 inch OLED display.',
    price: 899.99,
    category: 'Mobile',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
  },
  {
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking smartwatch with heart rate monitor.',
    price: 399.99,
    category: 'Wearables',
    stock: 75,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable wireless speaker with 360° sound and waterproof design.',
    price: 149.99,
    category: 'Audio',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    await User.deleteMany({});
    await Product.deleteMany({});
    
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@ttech.com',
      password: 'admin123',
      role: 'ADMIN',
    });
    await adminUser.save();

    const sampleUser = new User({
      name: 'Margery Andah',
      email: 'margery@gmail.com',
      password: 'Margery',
      role: 'USER',
    });
    await sampleUser.save();
    
    await Product.insertMany(sampleProducts);
    
    console.log('Database seeded successfully!');
    console.log('Admin: admin@ttech.com / admin123');
    console.log('User: john@example.com / password123');
    process.exit(0);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedDatabase();