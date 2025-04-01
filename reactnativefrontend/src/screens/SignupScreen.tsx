import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import useApi from '../hooks/useApi';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = {
  navigation: NavigationProp<any>;
};

const SignupScreen = ({navigation}: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {post} = useApi();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    const {data, ok} = await post('/user/signup', {
      name,
      email,
      password,
      confirm_password: confirmPassword,
    });
    if (ok) {
      Alert.alert('Success', 'User account created successfully');
      navigation.navigate('Login');
    } else {
      Alert.alert('Error', data.error || 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.loginText}>Welcome to PowerLog!</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={setName}
          placeholderTextColor={'white'}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={'white'}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={'white'}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor={'white'}
        />
        <TouchableOpacity
          style={styles.loginButtonStyle}
          onPress={handleSignup}
        >
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
        <Text style={styles.buttonText}>Already have an account?</Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#414141'},
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#414141',
  },
  input: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: 'black',
    color: 'white',
  },
  loginText: {fontSize: 24, marginBottom: 20, color: 'white'},
  loginButtonStyle: {
    color: 'white',
    gap: 10,
    backgroundColor: '#6200EE',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonStyle: {
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

export default SignupScreen;
