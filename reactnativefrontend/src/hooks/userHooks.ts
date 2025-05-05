import axios from 'axios';
import {Platform} from 'react-native';
import Constants from 'expo-constants';
<<<<<<< HEAD
=======
import AsyncStorage from '@react-native-async-storage/async-storage';
>>>>>>> 3d2a666722fb486d06ffaf598da7037305f6dd72

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

<<<<<<< HEAD
  return {postUser, getUser};
=======
  const login = async (nameEmail: string, password: string) => {
    try {
      // IMPORTANT: Use postUser wrapper and name_email (with underscore)
      const {data, ok} = await postUser('/user/login', {
        name_email: nameEmail, // This is the key - use name_email with underscore
        password,
      });

      if (!ok) {
        throw new Error(data.error || 'Login failed');
      }

      console.log('Login successful');

      // Extract data from the response
      const {token, isFirstLogin} = data;
      await AsyncStorage.setItem('token', token);

      if (isFirstLogin) {
        await AsyncStorage.setItem('isFirstLogin', 'true');
      }

      return data;
    } catch (error) {
      console.error(
        'Login error:',
        (error as any).response?.data || (error as Error).message,
      );
      throw error;
    }
  };

  // Add registration function
  const register = async (name: string, email: string, password: string) => {
    return await postUser('/user/signup', {
      name,
      email,
      password,
      confirm_password: password,
    });
  };

  // Add function to get onboarding status
  const getOnboardingStatus = async (token: string) => {
    return await getUser('/user/onboarding/status', token);
  };

  // Add function to save onboarding responses
  const saveOnboardingResponses = async (responses: any[], token: string) => {
    try {
      // Log what we're sending
      console.log('Sending to:', `${BASE_URL}/user/onboarding/responses`);
      console.log('Payload:', JSON.stringify({responses}));

      const response = await axios.post(
        `${BASE_URL}/user/onboarding/responses`,
        {responses}, // Make sure it's wrapped in an object
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return {data: response.data, ok: true};
    } catch (error: any) {
      console.log('API error details:', error);

      // Add more detailed error logging
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
      }

      return {
        data: error.response?.data || {error: 'Failed to save responses'},
        ok: false,
      };
    }
  };

  // Return all functions
  return {
    postUser,
    getUser,
    login,
    register,
    getOnboardingStatus,
    saveOnboardingResponses,
    BASE_URL,
  };
>>>>>>> 3d2a666722fb486d06ffaf598da7037305f6dd72
};

export default useUser;
