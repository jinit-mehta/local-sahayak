// src/services/api.js
const api = {
    login: async (email, password) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      return await response.json(); // Assuming your API returns user data
    },
  };
  
  export default api;
  