import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
  Image
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./config";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import styles from '../styles/LoginStyle';

const { width, height } = Dimensions.get('window');

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => setSignedIn(false), []);

  const handleRegister = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!email || !password) {
      setErrorMessage('Please fill all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("registered");
        setIsLogin(true);
        setErrorMessage('');
      })
      .catch((error) => {
        console.log(error.message);

        // Map Firebase error codes to user-friendly messages
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage('Email already in use. Try another email address.');
        } else if (error.code === 'auth/invalid-email') {
          setErrorMessage('Invalid email format. Please enter a valid email.');
        } else if (error.code === 'auth/weak-password') {
          setErrorMessage('Password is too weak. Use a stronger password.');
        } else if (error.code === 'auth/network-request-failed') {
          setErrorMessage('Network error. Please check your connection.');
        } else {
          setErrorMessage('Registration failed. Please try again.');
        }
      });
  };

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!email || !password) {
      setErrorMessage('Please fill all fields');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('Logged in');
        setSignedIn(true);
        navigation.replace('Letter');
      })
      .catch((error) => {
        console.log(error.message);
        setSignedIn(false);

        // Map Firebase error codes to user-friendly messages
        if (error.code === 'auth/invalid-email') {
          setErrorMessage('Invalid email format. Please enter a valid email.');
        } else if (error.code === 'auth/user-not-found') {
          setErrorMessage('No account found with this email. Please register first.');
        } else if (error.code === 'auth/wrong-password') {
          setErrorMessage('Incorrect password. Please try again.');
        } else if (error.code === 'auth/too-many-requests') {
          setErrorMessage('Too many failed attempts. Try again later.');
        } else if (error.code === 'auth/network-request-failed') {
          setErrorMessage('Network error. Please check your connection.');
        } else {
          setErrorMessage('Login failed. Please check your credentials.');
        }
      });
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setSuccessMessage('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <LinearGradient
      colors={['#573499', '#9C85C6', '#573499']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.headerText}>
              {isLogin ? 'Login' : 'Register'}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.subHeaderText}>
                {isLogin ? 'Welcome back!' : 'Create an account '}
              </Text>
              {isLogin ?
                <Image
                  source={{ uri: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f44b/512.gif' }}
                  style={{ width: 25, height: 25 }} /> :
                <Image
                  source={{ uri: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1faf6/512.gif' }}
                  style={{ width: 25, height: 25 }} />
              }
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder='Email'
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
                autoCorrect={false}
                keyboardType='email-address'
                placeholderTextColor="#666"
              />

              <TextInput
                placeholder='Password'
                value={password}
                onChangeText={text => setPassword(text)}
                style={styles.input}
                secureTextEntry
                placeholderTextColor="#666"
              />

              {!isLogin && (
                <TextInput
                  placeholder='Confirm Password'
                  value={confirmPassword}
                  onChangeText={text => setConfirmPassword(text)}
                  style={styles.input}
                  secureTextEntry
                  placeholderTextColor="#666"
                />
              )}
            </View>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={isLogin ? handleLogin : handleRegister}
            >
              <Text style={styles.primaryButtonText}>
                {isLogin ? 'Login' : 'Register'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={toggleAuthMode}
            >
              <Text style={styles.secondaryButtonText}>
                {isLogin ? 'Create Account' : 'Back to Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Login;