import axios from 'axios';

export const axiosInstance = axios.create({
  // baseURL: `http://103.165.118.71:8080/api/`
  baseURL: `http://localhost:8085/`
});

axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Handle response errors
    if (error.response) {
      console.error('Response Error:', error.response.data);
      // You can show an error message to the user or perform any other error handling actions
    } else if (error.request) {
      console.error('Request Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
