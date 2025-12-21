// Test API endpoints locally
const API_BASE = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Testing T-Tech & Appliances API endpoints...\n');

  try {
    // Test 1: Register a new user
    console.log('1️⃣  Testing user registration...');
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      })
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Registration successful');
      console.log(`   User: ${registerData.user.name} (${registerData.user.email})`);
      
      // Test 2: Login with the same user
      console.log('\n2️⃣  Testing user login...');
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerData.user.email,
          password: 'password123'
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login successful');
        console.log(`   Token received: ${loginData.accessToken ? 'Yes' : 'No'}`);
      } else {
        console.log('❌ Login failed');
      }
    } else {
      console.log('❌ Registration failed');
      const error = await registerResponse.json();
      console.log(`   Error: ${error.error}`);
    }

    // Test 3: Get products
    console.log('\n3️⃣  Testing products endpoint...');
    const productsResponse = await fetch(`${API_BASE}/products`);
    
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      console.log('✅ Products retrieved successfully');
      console.log(`   Total products: ${productsData.products?.length || 0}`);
    } else {
      console.log('❌ Products request failed');
    }

  } catch (error) {
    console.log('❌ API test failed:', error.message);
    console.log('\n💡 Make sure to:');
    console.log('   1. Start MongoDB (mongod --dbpath ./data/db)');
    console.log('   2. Run the app (npm run dev)');
    console.log('   3. Seed the database (npm run seed)');
  }

  console.log('\n🏁 API testing complete!');
}

// Only run if this script is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };