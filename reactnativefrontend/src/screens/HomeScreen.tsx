import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert, StyleSheet, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUser from '../hooks/userHooks';
import {CommonActions} from '@react-navigation/native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

const HomeScreen = ({navigation}: any) => {
  const [user, setUser] = useState<any>(null);
  const {getUser} = useUser();
  const [workouts, setWorkouts] = useState([]);

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
    // Function to fetch workouts from AsyncStorage
    const loadWorkouts = async () => {
      try {
        const workoutsJSON = await AsyncStorage.getItem('workouts');
        if (workoutsJSON) {
          const parsedWorkouts = JSON.parse(workoutsJSON);
          setWorkouts(parsedWorkouts);
        }
      } catch (error) {
        console.error('Error loading workouts:', error);
      }
    };

    loadWorkouts();

    // Function to fetch user profile
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

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 60000) % 60);
    const hours = Math.floor(ms / 3600000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to PowerLog</Text>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.leftContainer}>
          <Text style={styles.sectionTitle}>Food Stats</Text>
          <Text style={styles.text}>
            placeholder for calorie stats in future
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          <ScrollView style={styles.historyScroll}>
            {workouts.length === 0 ? (
              <Text style={styles.text}>No workouts yet</Text>
            ) : (
              workouts.slice(0, 7).map((workout) => (
                <View key={workout.id} style={styles.workoutItem}>
                  <Text style={styles.workoutDate}>
                    {formatDate(workout.date)}
                  </Text>
                  <Text style={styles.workoutDetails}>
                    {workout.exercises.length} exercises •{' '}
                    {formatTime(workout.duration)}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
      <View style={styles.motivationContainer}>
        <Text style={styles.text}>Motivation of the day: SUUTU JO!</Text>
      </View>
      <View style={styles.streakContainer}>
        <Text style={styles.sectionTitle}>Workout Streak</Text>
        <Text style={styles.text}>5 days 🔥</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  rowContainer: {
    flexDirection: 'row',
    flex: 0,
    height: 250,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  leftContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: '#414141',
    margin: 10,
    borderRadius: 10,
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: '#414141',
    margin: 10,
    borderRadius: 10,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  streakContainer: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#414141',
    borderRadius: 15,
    height: 90, // Fixed height instead of flex and maxHeight
    marginHorizontal: 10,
    marginTop: 0, // Reduced top margin
    marginBottom: 20,
  },
  motivationContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#414141',
    borderRadius: 15,
    margin: 10,
    maxHeight: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00D0FF',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  historyScroll: {
    flex: 1,
  },
  workoutItem: {
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  workoutDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  workoutDetails: {
    fontSize: 12,
    color: '#00D0FF',
  },
});

export default HomeScreen;
