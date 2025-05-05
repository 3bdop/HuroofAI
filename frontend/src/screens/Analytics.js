import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from './config';
import { LETTERS2, LETTERS } from "@config/constants";
import Icon from 'react-native-vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import styles from '../styles/AnalyticsStyle';


const Analytics = ({ navigation }) => {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user
    const user = auth.currentUser;
    setCurrentUser(user);

    if (user) {
      fetchUserStats(user.email);
    }
  }, []);

  const fetchUserStats = async (userEmail) => {
    try {
      const usersCollection = collection(db, "users");
      const q = query(
        usersCollection,
        where("email", "==", userEmail)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const letterStats = userData.letterStats || {};
        setStatsData(letterStats);
      } else {
        // No stats found
        console.log("No stats found for this user");
        // Initialize empty stats for all letters
        const emptyStats = {};
        LETTERS2.forEach(letter => {
          emptyStats[letter.char] = {
            totalTrials: 0,
            correct: 0,
            wrong: 0,
            lastThreeTrials: []
          };
        });
        setStatsData(emptyStats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceRating = (letterData) => {
    if (!letterData || !letterData.lastThreeTrials || letterData.lastThreeTrials.length === 0) {
      return "No attempts yet";
    }

    // Only consider up to the last 3 trials
    const lastTrials = letterData.lastThreeTrials.slice(-3);

    // Calculate success ratio
    const successCount = lastTrials.filter(trial => trial === true).length;
    const successRatio = successCount / lastTrials.length;

    if (successRatio >= 0.9) {
      return "Excellent!";
    } else if (successRatio >= 0.7) {
      return "Good! Try again to improve";
    } else {
      return "Needs more practice";
    }
  };

  const getPerformanceColor = (rating) => {
    if (rating === "Excellent!") {
      return "#3D9E34"; // Green
    } else if (rating === "Good! Try again to improve") {
      return "#FFA500"; // Orange
    } else if (rating === "Needs more practice") {
      return "#DC2626"; // Red
    } else {
      return "#888888"; // Gray for "No attempts yet"
    }
  };

  const calculateProgress = (letterData) => {
    if (!letterData || letterData.totalTrials === 0) {
      return 0;
    }
    return Math.min(100, Math.round((letterData.correct / letterData.totalTrials) * 100));
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your progress...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#221C3E', '#9C85C6', '#573499']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Progress Analytics</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>

          {LETTERS2.map((letter, index) => {
            const letterData = statsData[letter.char] || {
              totalTrials: 0,
              correct: 0,
              wrong: 0,
              lastThreeTrials: []
            };

            const progress = calculateProgress(letterData);
            const performanceRating = getPerformanceRating(letterData);
            const ratingColor = getPerformanceColor(performanceRating);

            return (
              <View key={index} style={styles.letterCard}>
                <View style={styles.letterHeaderRow}>
                  <Text style={styles.letterTitle}>{letter.char[0]}</Text>
                  <View style={styles.progressContainer}>
                    <View style={[
                      styles.progressCircle,
                      { borderColor: progress > 80 ? '#3D9E34' : progress > 60 ? '#FFA500' : '#DC2626' }
                    ]}>
                      <Text style={styles.progressText}>{progress}%</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Total Attempts</Text>
                    <Text style={styles.statValue}>{letterData.totalTrials}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Correct</Text>
                    <Text style={[styles.statValue, { color: '#3D9E34' }]}>{letterData.correct}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Needs Work</Text>
                    <Text style={[styles.statValue, { color: '#DC2626' }]}>{letterData.wrong}</Text>
                  </View>
                </View>

                <View style={styles.performanceContainer}>
                  <Text style={[styles.performanceText, { color: ratingColor }]}>
                    {performanceRating}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* <View style={styles.backButtonContainer}>
              <TouchableOpacity 
                style={styles.returnButton} 
                onPress={handleBack}
              >
                <Icon name="arrow-back-circle" size={24} color="#FFFFFF" />
                <Text style={styles.returnButtonText}>Return to Practice</Text>
              </TouchableOpacity>
            </View> */}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default Analytics
