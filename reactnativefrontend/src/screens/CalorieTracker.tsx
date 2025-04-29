import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const CalorieTracker = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Calorie Tracker</Text>
      </View>
      <View style={styles.topCalorieContainer}>
        <Text style={styles.text}>Calories remaining: 2000</Text>
        <Text style={styles.text}>Calories consumed: 1500</Text>
      </View>
      <TouchableOpacity style={styles.mealButton}>
        <Text style={styles.text}>Add Meal +</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 15,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  topCalorieContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#414141',
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  mealButton: {
    backgroundColor: '#00D0FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default CalorieTracker;
