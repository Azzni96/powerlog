// Description: This is the admin dashboard screen for the fitness app. It provides navigation to various admin functionalities such as managing users, workouts, food diaries, and BMI records.
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';

const AdminDashboard = ({ navigation }: any) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <Button title="👥 Manage Users" onPress={() => navigation.navigate('ManageUsers')} />
      <View style={styles.spacing} />

      <Button title="🏋️‍♂️ Manage Workouts" onPress={() => navigation.navigate('ManageWorkouts')} />
      <View style={styles.spacing} />

      <Button title="🍽 Manage Food Diaries" onPress={() => navigation.navigate('ManageFood')} />
      <View style={styles.spacing} />

      <Button title="📈 Manage BMI Records" onPress={() => navigation.navigate('ManageBMI')} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  spacing: {
    marginVertical: 10,
  },
});

export default AdminDashboard;
