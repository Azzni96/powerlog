import axios from 'axios';
import {Platform} from 'react-native';
import Constants from 'expo-constants';

// Use different base URLs for different platforms and environments
const getBaseURL = () => {
  // Get your computer's actual IP address for use with Expo Go on physical devices
  const devServerIP = '10.81.216.194'; // Replace with your actual computer's IP

  if (Platform.OS === 'android') {
    // For Expo Go on physical device, use the actual IP
    // For Android emulator, use the special 10.0.2.2 address
    const isExpoGo = Constants.appOwnership === 'expo';
    return isExpoGo
      ? `http://${devServerIP}:3000/api`
      : 'http://10.0.2.2:3000/api';
  } else if (Platform.OS === 'ios') {
    // For iOS simulator
    return 'http://localhost:3000/api';
  } else {
    // For web
    return 'http://10.81.216.194:3000/api';
  }
};

const BASE_URL = getBaseURL();

const useApi = () => {
  const post = async (endpoint: string, body: any) => {
    try {
      console.log(`Sending request to: ${BASE_URL}${endpoint}`);
      const response = await axios.post(`${BASE_URL}${endpoint}`, body, {
        headers: {'Content-Type': 'application/json'},
        timeout: 15000, // 15 second timeout
      });
      return {data: response.data, ok: true};
    } catch (error: any) {
      console.log('API error details:', error);
      // Better error message for network errors
      if (error.message === 'Network Error') {
        return {
          data: {
            error:
              'Cannot connect to server. Please check your network connection.',
          },
          ok: false,
        };
      }
      return {
        data: error.response?.data || {error: 'Something went wrong'},
        ok: false,
      };
    }
  };

  const get = async (endpoint: string, token?: string) => {
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

  return {post, get};
};

export default useApi;
