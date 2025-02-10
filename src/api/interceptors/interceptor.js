import axios from 'axios';
import { API_URL } from '../../appconstants/constants'; 


const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`Request made to ${config.url} with method ${config.method}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`API error occurred: ${error.response.status}`, error.response.data);
      if (error.response.status === 404) {
        console.log('Resource not found');
      } else if (error.response.status === 500) {
        console.log('Server error');
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
