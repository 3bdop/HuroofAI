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
  import { LETTERS } from "@config/constants";
  import Icon from 'react-native-vector-icons/Ionicons';
  import * as Haptics from 'expo-haptics';
  
  const { width } = Dimensions.get('window');
  
  const Analytics = ({ navigation }) => {
    const [statsData, setStatsData] = useState({});
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
          LETTERS.forEach(letter => {
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
            
            {LETTERS.map((letter, index) => {
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
                    <Text style={styles.letterTitle}>{letter.char}</Text>
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
            
            <View style={styles.backButtonContainer}>
              <TouchableOpacity 
                style={styles.returnButton} 
                onPress={handleBack}
              >
                <Icon name="arrow-back-circle" size={24} color="#FFFFFF" />
                <Text style={styles.returnButtonText}>Return to Practice</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#221C3E',
    },
    loadingText: {
      fontSize: 18,
      color: '#FFFFFF',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 70,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backText: {
      fontSize: 16,
      color: '#FFFFFF',
      marginLeft: 8,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginLeft: 20,
    },
    scrollContainer: {
      paddingHorizontal: 16,
      paddingBottom: 40,
    },
    letterCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 15,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    letterHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    letterTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#573499',
    },
    progressContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#F5F5F5',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: '#573499',
    },
    progressText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statLabel: {
      fontSize: 12,
      color: '#666',
      marginBottom: 4,
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    performanceContainer: {
      borderTopWidth: 1,
      borderTopColor: '#EEEEEE',
      paddingTop: 12,
    },
    performanceText: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    backButtonContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: 30,
      marginBottom: 20,
    },
    returnButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#472C74',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 25,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 4,
      width: '80%',
    },
    returnButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
  });
  
  export default Analytics;