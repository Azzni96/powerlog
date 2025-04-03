import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUser from '../hooks/userHooks';
import {CommonActions} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const HomeScreen = ({navigation}: any) => {
  const [user, setUser] = useState<any>(null);
  const {getUser} = useUser();

  // Function to navigate to Auth stack (for logout or authentication failures)
  const resetToAuth = () => {
    // This resets the entire navigation state to show the Auth stack
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Auth'}],
      }),
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Starting profile fetch');
        const token = await AsyncStorage.getItem('token');

        console.log('Token found:', token ? 'Yes' : 'No');
        if (!token) {
          console.log('No token available, cannot fetch profile');
          resetToAuth();
          return;
        }

        console.log('Making profile request');
        const {data, ok} = (await getUser('/user/profile', token)) as {
          data: {user: {name: string; email: string; user_level: string}};
          ok: boolean;
        };
        console.log('Profile request completed:', {ok});

        if (ok && data.user) {
          console.log('Profile data received:', data.user);
          setUser(data.user);
        } else {
          console.log('Failed to get profile data:', data);
          Alert.alert('Error', 'Failed to fetch profile');
          resetToAuth();
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        Alert.alert('Error', 'Failed to fetch profile');
        resetToAuth();
      }
    };

    fetchProfile();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.topTextContainer} />
      <Text style={styles.title}>Welcome to PowerLog</Text>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  topTextContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#414141',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  text: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
});

export default HomeScreen;
