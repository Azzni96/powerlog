import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

const ManageFood = ({ navigators }: any) => {
  const [meals, setMeals] = useState<any[]>([]);

  useEffect(() => {
    // TODO: myöhemmin haetaan oikeasti backendistä
    setMeals([
      { id: 1, mealType: 'Breakfast', description: 'Oatmeal and coffee' },
      { id: 2, mealType: 'Lunch', description: 'Chicken with rice' },
      { id: 3, mealType: 'Dinner', description: 'Salmon and salad' },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Food Diaries</Text>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.itemText}>{item.mealType}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
            <Button title="Edit" onPress={() => { /* Navigoi edit ruutuun */ }} />
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
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 16,
    color: 'gray',
  },
});

export default ManageFood;
