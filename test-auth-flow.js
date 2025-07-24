const fetch = require('node-fetch');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAuthFlow() {
  try {
    console.log('🧪 Testing authentication flow...');
    
    // Test the /api/user/current endpoint without authentication
    console.log('\n1. Testing /api/user/current without auth...');
    try {
      const response = await fetch('http://localhost:3001/api/user/current');
      const data = await response.json();
      console.log('   Status:', response.status);
      console.log('   Response:', data);
    } catch (error) {
      console.log('   Error:', error.message);
    }

    // Test authentication credentials provider
    console.log('\n2. Testing authentication with admin credentials...');
    try {
      const loginResponse = await fetch('http://localhost:3001/api/auth/signin/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@tourpad.com',
          password: 'password123',
          redirect: false
        })
      });
      
      console.log('   Login Status:', loginResponse.status);
      const loginData = await loginResponse.json();
      console.log('   Login Response:', loginData);
    } catch (error) {
      console.log('   Login Error:', error.message);
    }

  } catch (error) {
    console.error('❌ Error in test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuthFlow();