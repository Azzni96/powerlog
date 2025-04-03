import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUser from '../hooks/userHooks';
import {CommonActions} from '@react-navigation/native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to PowerLog</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>Motivation of the day: SUUTU JO!</Text>
      </View>
      <View style={styles.leftContainer}>
        <Text style={styles.text}>diibadaaba</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#414141',
  },
  leftContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
});

export default HomeScreen;
