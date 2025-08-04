// Simple test to check API connectivity
const testAPI = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test direct fetch to backend
    const response = await fetch('http://localhost:8000/health');
    const data = await response.json();
    console.log('API Response:', data);
    
    // Test with axios through our service
    const apiService = await import('./src/services/api.js');
    const healthResult = await apiService.default.health();
    console.log('Health Check Result:', healthResult);
    
  } catch (error) {
    console.error('API Test Error:', error);
  }
};

// Run test
testAPI();
