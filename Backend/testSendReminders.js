
const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api/v1';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'your-admin-jwt-token-here';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${ADMIN_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function testSendReminders() {
  try {
    console.log('📧 Testing Send Blood Donation Reminders API...\n');

    // Test 1: Send reminders to all available donors
    console.log('Test 1: Send reminders to ALL available donors');
    console.log('Endpoint: POST /admin/send-reminders');
    console.log('Payload:', { bloodType: null, minDays: 90 });

    const response1 = await client.post('/admin/send-reminders', {
      minDays: 90
    });

    console.log('Response:', response1.data);
    console.log('✅ Test 1 passed\n');

    // Test 2: Send reminders to specific blood type (O-)
    console.log('Test 2: Send reminders to O- blood type donors only');
    console.log('Endpoint: POST /admin/send-reminders');
    console.log('Payload:', { bloodType: 'O-', minDays: 90 });

    const response2 = await client.post('/admin/send-reminders', {
      bloodType: 'O-',
      minDays: 90
    });

    console.log('Response:', response2.data);
    console.log('✅ Test 2 passed\n');

    // Test 3: Send reminders with custom min days
    console.log('Test 3: Send reminders with custom min days (60 days)');
    console.log('Endpoint: POST /admin/send-reminders');
    console.log('Payload:', { bloodType: 'O+', minDays: 60 });

    const response3 = await client.post('/admin/send-reminders', {
      bloodType: 'O+',
      minDays: 60
    });

    console.log('Response:', response3.data);
    console.log('✅ Test 3 passed\n');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

testSendReminders();
