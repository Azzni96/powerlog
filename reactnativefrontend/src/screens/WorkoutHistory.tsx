import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const WorkoutHistory = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top button */}

      {/* Workout data container */}
      <View style={styles.workoutContainer}>
        <Text style={styles.header}>Workout History</Text>
        <ScrollView style={styles.workoutScrollView}>
          <Text style={styles.text}>Your workout history will appear here</Text>
          {/* Placeholder for workout history items */}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.topButton}
        onPress={() => navigation.navigate('Live Workout')}
      >
        <Text style={styles.buttonText}>Start Workout</Text>
      </TouchableOpacity>

      {/* Streak counter */}
      <View style={styles.streakContainer}>
        <Text style={styles.subHeader}>Current Streak</Text>
        <Text style={styles.streakText}>5 days 🔥</Text>
      </View>

      {/* Next training day */}
      <View style={styles.nextTrainingContainer}>
        <Text style={styles.subHeader}>Next Recommended Training</Text>
        <Text style={styles.text}>Tomorrow - Leg Day</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#414141',
    padding: 16,
  },
  topButton: {
    backgroundColor: '#00D0FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutContainer: {
    backgroundColor: '#000000',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flex: 3,
  },
  workoutScrollView: {
    flex: 1,
  },
  streakContainer: {
    backgroundColor: '#000000',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  nextTrainingContainer: {
    backgroundColor: '#000000',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  streakText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00D0FF',
  },
});

export default WorkoutHistory;
