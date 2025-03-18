import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }: any) => {
    const [nameEmail, setNameEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post<{ token: string }>("http://10.81.220.32:3000/api/user/login", {
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
        <View style={styles.container}>
            <Text>Login</Text>
            <TextInput style={styles.input} placeholder="Email or Username" onChangeText={setNameEmail} />
            <TextInput style={styles.input} placeholder="Password" onChangeText={setPassword} secureTextEntry />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Go to Signup" onPress={() => navigation.navigate("Signup")} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center" },
    input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});

export default LoginScreen;
