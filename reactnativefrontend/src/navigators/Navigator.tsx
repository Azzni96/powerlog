import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Icon} from '@rneui/themed';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import {createStackNavigator} from '@react-navigation/stack';
import CalorieTracker from '../screens/CalorieTracker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LiveWorkout from '../screens/LiveWorkout';
import WorkoutHistory from '../screens/WorkoutHistory';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Create navigators
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const RootStack = createStackNavigator();

// Tab navigator (shown after login)
const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';
          if (route.name === 'Home') {
            return <FontAwesome name="home" size={size} color={color} />;
          } else if (route.name === 'My Profile') {
            return <FontAwesome name="user" size={size} color={color} />;
          } else if (route.name === 'Calories') {
            return <FontAwesome name="fire" size={size} color={color} />;
          } else if (route.name === 'Live Workout') {
            return <FontAwesome name="plus" size={size} color={color} />;
          } else if (route.name === 'History') {
            return <FontAwesome5 name="dumbbell" size={size} color={color} />;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {backgroundColor: '#00D0FF'},
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calories" component={CalorieTracker} />
      <Tab.Screen name="Live Workout" component={LiveWorkout} />
      <Tab.Screen name="History" component={WorkoutHistory} />
      <Tab.Screen name="My Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Auth navigator (login/signup screens)
const AuthScreen = () => {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

// Root navigator with named screens
const Navigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Auth"
      >
        <RootStack.Screen name="Auth" component={AuthScreen} />
        <RootStack.Screen name="Main" component={TabScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
