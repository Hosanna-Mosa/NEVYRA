const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api';

// Test data
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '+1234567890',
  password: 'TestPass123!',
  address: '123 Test Street'
};

async function testAuth() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data.message);

    // Test 2: Register User (should NOT return token)
    console.log('\n2. Testing User Registration...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
    console.log('✅ Registration:', registerResponse.data.message);
    
    if (registerResponse.data.data?.token) {
      console.log('❌ Registration returned token (should not happen)');
    } else {
      console.log('✅ Registration did not return token (correct behavior)');
    }

    // Test 3: Login User (should return token)
    console.log('\n3. Testing User Login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login:', loginResponse.data.message);
    
    if (loginResponse.data.data?.token) {
      console.log('✅ Token received:', loginResponse.data.data.token.substring(0, 20) + '...');
    } else {
      console.log('❌ Login did not return token');
    }

    // Test 4: Get Profile (with token)
    console.log('\n4. Testing Profile Retrieval...');
    const token = loginResponse.data.data?.token;
    if (token) {
      const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Profile Retrieved:', profileResponse.data.message);
      console.log('   User:', profileResponse.data.data.firstName, profileResponse.data.data.lastName);
    }

    // Test 5: Forgot Password
    console.log('\n5. Testing Forgot Password...');
    const forgotResponse = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
      email: testUser.email
    });
    console.log('✅ Forgot Password:', forgotResponse.data.message);

    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📝 Note: Check your email for the OTP to test password reset functionality.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 409) {
      console.log('\n💡 User already exists. Try with a different email or test login instead.');
    }
  }
}

// Run tests
testAuth();
