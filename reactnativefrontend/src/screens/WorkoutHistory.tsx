import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const WorkoutHistory = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Live Workout</Text>
      <Text style={styles.text}>LiveWorkout</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#414141', // Match your app's dark theme
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white', // White text for dark background
  },
  button: {
    backgroundColor: '#00D0FF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white', // White text for dark background
    marginBottom: 20,
  },
});

export default WorkoutHistory;
