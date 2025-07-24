const { execSync } = require('child_process');

async function testAdminLogin() {
  try {
    console.log('🧪 Testing admin login flow...');
    
    // Use curl to test the login endpoint
    console.log('\n1. Testing login with admin credentials...');
    
    const loginCmd = `curl -X POST http://localhost:3001/api/auth/signin/credentials \\
      -H "Content-Type: application/json" \\
      -d '{"email": "admin@tourpad.com", "password": "password123", "redirect": false}' \\
      -v -s`;
    
    try {
      const loginResult = execSync(loginCmd, { encoding: 'utf8', timeout: 10000 });
      console.log('Login Response:', loginResult);
    } catch (error) {
      console.log('Login Error:', error.message);
      console.log('Stderr:', error.stderr?.toString());
      console.log('Stdout:', error.stdout?.toString());
    }

    // Test the /api/user/current endpoint
    console.log('\n2. Testing /api/user/current without session...');
    
    const currentUserCmd = `curl -X GET http://localhost:3001/api/user/current -v -s`;
    
    try {
      const currentUserResult = execSync(currentUserCmd, { encoding: 'utf8', timeout: 10000 });
      console.log('Current User Response:', currentUserResult);
    } catch (error) {
      console.log('Current User Error:', error.message);
    }

  } catch (error) {
    console.error('❌ Error in test:', error);
  }
}

testAdminLogin();