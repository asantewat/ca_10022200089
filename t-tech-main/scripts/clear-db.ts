import mongoose from 'mongoose';
import { connectToDatabase } from '../src/lib/database';

async function clearDatabase() {
  try {
    await connectToDatabase();
    
    console.log('🗑️  Clearing database...');
    
    // Drop all collections
    const collections = await mongoose.connection.db.collections();
    
    for (const collection of collections) {
      await collection.drop();
      console.log(`   Dropped collection: ${collection.collectionName}`);
    }
    
    console.log('✅ Database cleared successfully');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

clearDatabase();