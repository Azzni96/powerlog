import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = ({ navigation }: any) => {
    const [nameEmail, setNameEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post<{ token: string }>("http://172.20.10.3:3000/api/user/login", {
                name_email: nameEmail,
                password,
            });

            if (response.data.token) {
                await AsyncStorage.setItem("token", response.data.token);
                Alert.alert("Success", "Login successful");
                navigation.replace("Home"); // Siirrytään Home-näkymään
            }
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.error || "Login failed");
        }
    };

    return (
        <SafeAreaView style={styles.root}>
        <View style={styles.container}>
            <Text style={styles.loginText}>WELCOME TO POWERLOG</Text>
            <TextInput style={styles.input} placeholder="Email or Username" placeholderTextColor="white" onChangeText={setNameEmail} />
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor="white" onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={styles.loginButtonStyle} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.buttonText}>Go to Signup</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#414141" },
    container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#414141" },
    input: { borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 10, backgroundColor: "black", color: "white" },
    loginText: { fontSize: 24, marginBottom: 20, color: "white" },
    loginButtonStyle: { color: "white", gap: 10, backgroundColor: "#6200EE", padding: 10, alignItems: "center", borderRadius: 10 },
    buttonStyle: { color: "white", gap: 10, backgroundColor: "#6200EE", padding: 10, alignItems: "center", borderRadius: 10, marginTop: 20 },
    buttonText: { color: "white", fontSize: 16 },
});

export default LoginScreen;
