import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

const ManageUsers = ({ navigation }: any) => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    setUsers([
      { id: 1, name: 'Test User 1' },
      { id: 2, name: 'Test User 2' },
      { id: 3, name: 'Test User 3' },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>

      <Button
        title="➕ Add User"
        onPress={() => navigation.navigate('AddUser')}
      />

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userName}>{item.name}</Text>
            <Button title="Edit" onPress={() => { /* Navigoi myöhemmin edit formiin */ }} />
          </View>
        )}
        style={{ marginTop: 20 }}
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
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontSize: 18,
  },
});

export default ManageUsers;
