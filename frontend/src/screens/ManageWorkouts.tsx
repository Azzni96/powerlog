// src/screens/ManageWorkouts.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

const ManageWorkouts = ({ navigation }: any) => {
  const [workouts, setWorkouts] = useState<any[]>([]);

  useEffect(() => {
    // TODO: myöhemmin hae oikeat workoutit backendistä
    setWorkouts([
      { id: 1, program: 'Full Body', exercise: 'Squat' },
      { id: 2, program: 'Upper Body', exercise: 'Bench Press' },
      { id: 3, program: 'Lower Body', exercise: 'Deadlift' },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Workouts</Text>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.workoutItem}>
            <View>
              <Text style={styles.workoutProgram}>{item.program}</Text>
              <Text style={styles.workoutExercise}>{item.exercise}</Text>
            </View>
            <Button title="Edit" onPress={() => { /* Navigointi edit sivulle myöhemmin */ }} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  workoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  workoutProgram: {
    fontSize: 18,
    fontWeight: '600',
  },
  workoutExercise: {
    fontSize: 16,
    color: '#555',
  },
});

export default ManageWorkouts;
