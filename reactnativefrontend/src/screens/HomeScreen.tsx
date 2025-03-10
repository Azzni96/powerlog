import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const HomeScreen = ({ navigation }: any) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                navigation.replace("Login"); // Siirrytään kirjautumissivulle, jos token puuttuu
                return;
            }
            try {
                const response = await axios.get("http://10.81.219.246:3000/api/user/profile", {
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

    const handleLogout = async () => {
        await AsyncStorage.removeItem("token");
        navigation.replace("Login"); // Palautetaan käyttäjä takaisin login-sivulle
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome, {user?.name || "User"}!</Text>
            <Text>Email: {user?.email}</Text>
            <Text>Role: {user?.user_level}</Text>
            <Button title="Go to Profile" onPress={() => navigation.navigate("Profile")} />
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default HomeScreen;
