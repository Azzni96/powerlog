import axios from 'axios';
import {Platform} from 'react-native';
import Constants from 'expo-constants';

// Automatically determine the correct API URL based on environment
const getBaseURL = () => {
  if (Platform.OS === 'web') {
    return '/api';
  }
  if (Constants.expoConfig?.hostUri) {
    const hostAddress = Constants.expoConfig.hostUri.split(':')[0];
    return `http://${hostAddress}:3000/api`;
  }
  // Fallback for development or production
  return 'http://localhost:3000/api';
};

const BASE_URL = getBaseURL();
console.log('API Base URL:', BASE_URL);

const useUser = () => {
  const postUser = async (endpoint: string, body: any) => {
    try {
      console.log(`Sending request to: ${BASE_URL}${endpoint}`);
      const response = await axios.post(`${BASE_URL}${endpoint}`, body, {
        headers: {'Content-Type': 'application/json'},
        timeout: 15000,
      });
      return {data: response.data, ok: true};
    } catch (error: any) {
      console.log('API error details:', error);
      if (error.message === 'Network Error') {
        return {
          data: {
            error:
              'Cannot connect to server. Please check your network connection.',
          },
          ok: false,
        };
      }
      // Add default return for other errors
      return {
        data: error.response?.data || {error: 'Something went wrong'},
        ok: false,
      };
    }
  };

  const getUser = async (endpoint: string, token?: string) => {
    try {
      console.log(`Sending GET request to: ${BASE_URL}${endpoint}`);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if token is provided
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        headers,
        timeout: 15000,
      });

      return {data: response.data, ok: true};
    } catch (error: any) {
      console.log('API GET error details:', error);
      return {
        data: error.response?.data || {error: 'Something went wrong'},
        ok: false,
      };
    }
  };

  return {postUser, getUser};
};

export default useUser;
