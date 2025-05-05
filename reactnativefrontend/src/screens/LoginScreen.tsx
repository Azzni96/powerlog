import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import useUser from '../hooks/userHooks';
import {CommonActions} from '@react-navigation/native'; // Add this import

const LoginScreen = ({navigation}: any) => {
  const [nameEmail, setNameEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {postUser} = useUser();

<<<<<<< HEAD
    const handleLogin = async () => {
        try {
            const response = await axios.post<{ token: string }>("http://10.81.220.32:3000/api/user/login", {
                name_email: nameEmail,
                password,
            });
=======
  const handleLogin = async () => {
    if (!nameEmail || !password) {
      Alert.alert('Error', 'Please enter all fields');
      return;
    }
>>>>>>> 00f37922f1f2282012bdfe4f575c0b21d066fe8f

    try {
      setLoading(true);
      const {data, ok} = await postUser('/user/login', {
        name_email: nameEmail,
        password,
      });

      if (ok && data.token) {
        console.log('Login successful, saving token');
        await AsyncStorage.setItem('token', data.token);

        // Update: Direct navigation to Main stack using CommonActions
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Main'}],
          }),
        );
      } else if (data.error) {
        Alert.alert('Error', data.error);
      } else {
        Alert.alert('Error', 'Login failed');
      }
    } catch (error: any) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.loginText}>WELCOME TO POWERLOG</Text>
        <TextInput
          style={styles.input}
          placeholder="Email or Username"
          placeholderTextColor="white"
          onChangeText={setNameEmail}
          value={nameEmail || ''}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="white"
          onChangeText={setPassword}
          secureTextEntry
          value={password || ''}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#00D0FF" />
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.buttonText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#414141',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: 'black',
    color: 'white',
  },
  loginText: {fontSize: 24, marginBottom: 20, color: 'white'},
  loginButton: {
    color: 'white',
    gap: 10,
    backgroundColor: '#6200EE',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  signupButton: {
    color: 'white',
    gap: 10,
    backgroundColor: '#6200EE',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {color: 'white', fontSize: 16},
});

export default LoginScreen;
