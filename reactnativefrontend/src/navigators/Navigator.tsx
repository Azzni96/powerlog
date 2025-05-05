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
<<<<<<< HEAD
=======
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import OnboardingWelcomeScreen from '../screens/OnboardingWelcomeScreen';
import OnboardingQuestionsScreen from '../screens/OnboardingQuestionsScreen';
import OnboardingCompleteScreen from '../screens/OnboardingCompleteScreen';
>>>>>>> 3d2a666722fb486d06ffaf598da7037305f6dd72

// Create navigators
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const RootStack = createStackNavigator();
<<<<<<< HEAD

=======
const Stack = createStackNavigator();
const OnBoardingStack = createStackNavigator();
>>>>>>> 3d2a666722fb486d06ffaf598da7037305f6dd72
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

<<<<<<< HEAD
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
=======
// Simplify the OnBoardingScreen component
const OnBoardingScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="OnboardingWelcome"
        component={OnboardingWelcomeScreen}
      />
      <Stack.Screen
        name="OnboardingQuestions"
        component={OnboardingQuestionsScreen}
      />
      <Stack.Screen
        name="OnboardingComplete"
        component={OnboardingCompleteScreen}
      />
    </Stack.Navigator>
  );
};

// Root navigator with named screens
const Navigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({onboarded: false});

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const onboardingComplete =
          await AsyncStorage.getItem('onboardingComplete');
        const isFirstLogin = await AsyncStorage.getItem('isFirstLogin');

        console.log('Auth check:', {
          token: !!token,
          onboarded: onboardingComplete,
          isFirstLogin,
        });

        setIsAuthenticated(!!token);

        // Important: Check for explicit first login flag
        if (isFirstLogin === 'true') {
          console.log('First login detected, showing onboarding');
          setUser({onboarded: false});
          // Clear the flag once we've detected it
          await AsyncStorage.removeItem('isFirstLogin');
        } else {
          console.log('Not first login, onboarded status:', onboardingComplete);
          setUser({onboarded: onboardingComplete === 'true'});
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const renderScreens = () => {
    // Skip the splash screen check
    if (isAuthenticated) {
      // Check if user has completed onboarding
      if (!user.onboarded) {
        return (
          <>
            <Stack.Screen
              name="OnboardingWelcome"
              component={OnboardingWelcomeScreen}
            />
            <Stack.Screen
              name="OnboardingQuestions"
              component={OnboardingQuestionsScreen}
            />
            <Stack.Screen
              name="OnboardingComplete"
              component={OnboardingCompleteScreen}
            />
          </>
        );
      }
      // Regular authenticated user flow
      return (
        <>
          <Stack.Screen name="Main" component={TabScreen} />
        </>
      );
    }

    // Not authenticated
    return (
      <>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {renderScreens()}
      </Stack.Navigator>
>>>>>>> 3d2a666722fb486d06ffaf598da7037305f6dd72
    </NavigationContainer>
  );
};

export default Navigator;
