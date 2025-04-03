import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import useUser from '../hooks/userHooks';

const HomeScreen = ({navigation}: any) => {
  const [user, setUser] = useState<any>(null);
  const {getUser} = useUser();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Starting profile fetch');
        const token = await AsyncStorage.getItem('token');

        console.log('Token found:', token ? 'Yes' : 'No');
        if (!token) {
          console.log('No token available, cannot fetch profile');
          navigation.replace('Login'); // Siirrytään kirjautumissivulle, jos token puuttuu
          return;
        }

        console.log('Making profile request');
        const {data, ok} = (await getUser('/user/profile', token)) as {
          data: {user: {name: string; email: string; user_level: string}};
          ok: boolean;
        };
        console.log('Profile request completed:', {ok});

        if (ok && data.user) {
          console.log(
            'Profile data received:',
            (data as {user: {name: string; email: string; user_level: string}})
              .user,
          );
          setUser(data.user);
        } else {
          console.log('Failed to get profile data:', data);
          Alert.alert('Error', 'Failed to fetch profile');
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        Alert.alert('Error', 'Failed to fetch profile');
        navigation.replace('Login');
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login'); // Palautetaan käyttäjä takaisin login-sivulle
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.name || 'User'}!</Text>
      <Text>Email: {user?.email}</Text>
      <Text>Role: {user?.user_level}</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
});

export default HomeScreen;
