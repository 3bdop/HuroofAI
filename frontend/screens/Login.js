import { StyleSheet, Text, View, Dimensions, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Button } from "@rneui/themed";
import * as Haptics from 'expo-haptics';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./config";

const { width: ScreenWidth } = Dimensions.get('window');

const Login = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation.replace("Letter");
                setErrorMessage("");
            })
            .catch(() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                setErrorMessage("Invalid email or password. Please try again.");
            });
    };

    return (
        <LinearGradient
            colors={['#221C3EFF', "#9C85C6FF", '#573499FF']}
            style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Login</Text>
                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#D1CDF4FF"
                    style={styles.input}
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#D1CDF4FF"
                    secureTextEntry
                    style={styles.input}
                    onChangeText={setPassword}
                />
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                <Button
                    title="Login"
                    titleStyle={styles.buttonText}
                    buttonStyle={styles.button}
                    containerStyle={styles.buttonContainer}
                    onPress={handleLogin}
                />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        width: ScreenWidth * 0.85,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        alignItems: 'center',
    },
    title: {
        color: '#D1CDF4FF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(209, 205, 244, 0.1)',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        color: '#D1CDF4FF',
        borderWidth: 1,
        borderColor: '#D1CDF4FF',
    },
    errorText: {
        color: '#FF6B6B',
        marginVertical: 10,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#D1CDF4FF',
        borderRadius: 10,
        paddingVertical: 12,
        marginTop: 20,
    },
    buttonContainer: {
        width: '100%',
    },
    buttonText: {
        color: '#221C3EFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default Login;
