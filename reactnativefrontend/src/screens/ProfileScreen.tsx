import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUser from '../hooks/userHooks';
import {CommonActions} from '@react-navigation/native';

const ProfileScreen = ({navigation}: any) => {
  const [user, setUser] = useState<any>(null);
  const {getUser} = useUser();

<<<<<<< HEAD
    useEffect(() => {
        const fetchProfile = async () => {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                navigation.replace("Login");
                return;
            }
            try {
                const response = await axios.get("http://10.81.220.32:3000/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (error) {
                Alert.alert("Error", "Failed to fetch profile");
                navigation.replace("Login");
            }
        };
        fetchProfile();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text>Name: {user?.name}</Text>
            <Text>Email: {user?.email}</Text>
            <Text>User Level: {user?.user_level}</Text>
            <Button title="Back to Home" onPress={() => navigation.navigate("Home")} />
        </View>
=======
  const resetToAuth = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Auth'}],
      }),
>>>>>>> 00f37922f1f2282012bdfe4f575c0b21d066fe8f
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile data');
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          console.log('No token found');
          resetToAuth();
          return;
        }

        const {data, ok} = await getUser('/user/profile', token);

        if (ok && data.user) {
          console.log('Profile data:', data.user);
          setUser(data.user);
        } else {
          console.log('Failed to load profile:', data);
          Alert.alert('Error', 'Failed to fetch profile');
          resetToAuth();
        }
      } catch (error) {
        console.error('Profile error:', error);
        Alert.alert('Error', 'Failed to fetch profile');
        resetToAuth();
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      console.log('Token removed, logging out');
      resetToAuth();
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Profile</Text>

        {user ? (
          <View style={styles.profileCard}>
            <Text style={styles.infoLabel}>Username:</Text>
            <Text style={styles.infoValue}>{user.username || 'N/A'}</Text>

            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user.email || 'N/A'}</Text>

            <Text style={styles.infoLabel}>Account Level:</Text>
            <Text style={styles.infoValue}>
              {user.user_level || 'Standard'}
            </Text>
          </View>
        ) : (
          <Text style={styles.loadingText}>Loading profile...</Text>
        )}
      </View>

      <View style={styles.footer}>
        <Button title="Logout" onPress={handleLogout} color="#FF3B30" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#414141',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    marginVertical: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 18,
    color: 'white',
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
    marginTop: 30,
  },
  footer: {
    padding: 20,
    width: '100%',
  },
});

export default ProfileScreen;
