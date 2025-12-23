import axios from 'axios';

async function testApi() {
  try {
    // Test the service content API that the frontend uses
    const response = await axios.get('http://localhost:3003/api/service-content');
    console.log('Service content from API:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error calling API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testApi();