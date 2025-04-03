import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import useUser from '../hooks/userHooks';
import {CommonActions} from '@react-navigation/native';

const ProfileScreen = ({navigation}: any) => {
  const [user, setUser] = useState<any>(null);
  const {getUser} = useUser();

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
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Login');
        return;
      }
      try {
        const response = await axios.get('/user/profile', {
          headers: {Authorization: `Bearer ${token}`},
        });
        setUser(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch profile');
        navigation.replace('Login');
      }
    };
    fetchProfile();
  }, []);

  // logout function here for now, TODO: place to profile screen
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      console.log('Token removed, logging out');
      resetToAuth();
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>Name: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
      <Text>User Level: {user?.user_level}</Text>
      <Button
        title="Logout"
        onPress={handleLogout}
        color="#FF0000" // Red color for logout button
        accessibilityLabel="Logout button"
      />
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

export default ProfileScreen;
