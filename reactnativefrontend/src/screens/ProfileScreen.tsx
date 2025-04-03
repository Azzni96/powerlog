import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProfileScreen = ({navigation}: any) => {
  const [user, setUser] = useState<any>(null);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>Name: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
      <Text>User Level: {user?.user_level}</Text>
      <Button
        title="Back to Home"
        onPress={() => navigation.navigate('Home')}
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
