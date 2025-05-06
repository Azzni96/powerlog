import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native';
import axios from 'axios';

// Create the context
const AuthContext = createContext({
  isAuthenticated: false,
  logout: async () => {},
  setIsAuthenticated: (value: boolean) => {},
  user: {onboarded: false},
  updateUser: (updates: object) => {},
  updateAuthState: async (updates: object) => {},
  loading: true,
});

// Create provider component
export const AuthProvider = ({children}) => {
  // Add this loading state
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({onboarded: false});

  // Make state updates more explicit and reliable
  const updateAuthState = useCallback(async (updates) => {
    console.log('Updating auth state with:', updates);

    // Update storage and state together
    try {
      const storageUpdates = [];

      // Handle auth status
      if (updates.isAuthenticated !== undefined) {
        setIsAuthenticated(updates.isAuthenticated);
        if (updates.isAuthenticated) {
          storageUpdates.push(['isLoggedIn', 'true']);
        } else {
          storageUpdates.push(['isLoggedIn', 'false']);
        }
      }

      // Handle onboarded status
      if (updates.onboarded !== undefined) {
        setUser((prev) => ({...prev, onboarded: updates.onboarded}));
        if (updates.onboarded) {
          storageUpdates.push(['onboardingComplete', 'true']);
          storageUpdates.push(['isFirstLogin', 'false']);
        } else {
          storageUpdates.push(['onboardingComplete', 'false']);
        }
      }

      // Apply all storage updates atomically
      if (storageUpdates.length > 0) {
        await AsyncStorage.multiSet(storageUpdates);
      }

      console.log('Auth state updated successfully');
    } catch (error) {
      console.error('Error updating auth state:', error);
    }
  }, []);

  // Enhanced logout function
  const logout = useCallback(async () => {
    console.log('Logging out...');
    try {
      await AsyncStorage.multiRemove([
        'token',
        'isLoggedIn',
        'isFirstLogin',
        'onboardingComplete',
      ]);

      // Update state AFTER storage is cleared
      setIsAuthenticated(false);
      setUser({onboarded: false});

      console.log('Logout complete');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  // Load auth state on mount - CRITICAL
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const isFirstLogin = await AsyncStorage.getItem('isFirstLogin');
        const onboardingComplete =
          await AsyncStorage.getItem('onboardingComplete');

        console.log('Auth storage state:', {
          hasToken: !!token,
          isFirstLogin,
          onboardingComplete,
        });

        if (token) {
          setIsAuthenticated(true);

          // IMPROVED LOGIC: If we have a token but no onboarding flags,
          // check the user's profile to determine onboarding status
          if (isFirstLogin === null && onboardingComplete === null) {
            try {
              // Use token to fetch user profile
              const profileResponse = await axios.get(
                'http://192.168.50.134:3000/api/user/profile',
                {headers: {Authorization: `Bearer ${token}`}},
              );

              // If we get a valid profile, user is already onboarded
              if (profileResponse.data && profileResponse.data.id) {
                console.log('User profile found, marking as onboarded');
                setUser((prev) => ({...prev, onboarded: true}));

                // Save this decision to prevent future checks
                await AsyncStorage.setItem('onboardingComplete', 'true');
                await AsyncStorage.setItem('isFirstLogin', 'false');
                return;
              }
            } catch (profileError) {
              console.log('Could not fetch profile, assuming needs onboarding');
            }
          }

          // FIXED LOGIC: Only consider not onboarded if explicitly set to false or first login
          const needsOnboarding =
            isFirstLogin === 'true' || onboardingComplete === 'false';

          // Add debug logging
          console.log('Deciding onboarding status:', {
            isFirstLogin,
            onboardingComplete,
            needsOnboarding,
            decision: !needsOnboarding,
          });

          setUser((prev) => ({...prev, onboarded: !needsOnboarding}));
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        updateUser: (updates) => {
          console.log('Updating user:', updates);
          setUser((prev) => ({...prev, ...updates}));
        },
        updateAuthState,
        logout,
        loading,
      }}
    >
      {!loading ? children : <ActivityIndicator size="large" />}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
