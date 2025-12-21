import { connectToDatabase } from '../src/lib/database';
import { User } from '../src/models/User';
import { Product } from '../src/models/Product';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-canceling headphones with 30-hour battery life.',
    price: 299.99,
    category: 'Electronics',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  },
  {
    name: 'Laptop Pro 15',
    description: 'High-performance laptop with Intel i7 processor and 16GB RAM.',
    price: 1299.99,
    category: 'Electronics',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
  },
  {
    name: 'Smartphone X',
    description: 'Latest smartphone with advanced camera and 5G connectivity.',
    price: 899.99,
    category: 'Electronics',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracking smartwatch with heart rate monitor.',
    price: 249.99,
    category: 'Electronics',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable wireless speaker with excellent sound quality.',
    price: 149.99,
    category: 'Electronics',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
  }
];

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@ttech.com',
    password: 'admin123',
    role: 'ADMIN' as const
  },
  {
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'demo123',
    role: 'USER' as const
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');
    
    await connectToDatabase();
    
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    
    console.log('🗑️  Cleared existing data');
    
    // Create users with hashed passwords
    console.log('👥 Creating users...');
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      console.log(`   ✅ Created user: ${user.name} (${user.email})`);
    }
    
    // Create products
    console.log('🛍️  Creating products...');
    for (const productData of sampleProducts) {
      const product = await Product.create(productData);
      console.log(`   ✅ Created product: ${product.name}`);
    }
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n👤 Demo accounts:');
    console.log('   Admin: admin@ttech.com / admin123');
    console.log('   User:  demo@example.com / demo123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedDatabase();