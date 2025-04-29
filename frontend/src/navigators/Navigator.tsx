import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import AdminDashboard from '../screens/AdminDashboard';
import ManageUsers from '../screens/ManageUsers';
import ManageWorkouts from '../screens/ManageWorkouts';
import ManageFood from '../screens/ManageFood';
import ManageBMI from '../screens/ManageBMI';

const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="ManageUsers" component={ManageUsers} />
      <Stack.Screen name="ManageWorkouts" component={ManageWorkouts} />
      <Stack.Screen name="ManageFood" component={ManageFood} />
    </Stack.Navigator>
  );
};

export default Navigator;
