import { Text, View, TouchableOpacity, ScrollView, Alert, Image, Animated, Dimensions, TouchableNativeFeedback, Platform } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import styles from '../styles/LetterStyles';
import { LETTERS, LETTERS2 } from "@config/constants"
import { useAudio } from "@hooks/useAudio"
// import { useRecording } from "@hooks/useRecording"

import { uploadAudio } from '../services/api.services';
import { db, auth } from './config';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

const Letter = ({ navigation }) => {
    const { playSound, isPlaying, setIsPlaying, sound, setSound, cacheAudio, audioCache } = useAudio();

    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const refCorrect = useRef(null);
    const recFirst = useRef(null);
    const refWrong = useRef(null);
    const refMed = useRef(null);
    const [activeLetter, setActiveLetter] = useState(null);
    const [recording, setRecording] = useState(null);
    const fadeAnimCorrect = useRef(new Animated.Value(0)).current; // Initial opacity value
    const fadeAnimWrong = useRef(new Animated.Value(0)).current; // Initial opacity value\
    const [flag, setFlag] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [userDocId, setUserDocId] = useState(null);

    const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get('window');

    const [imageList] = useState([
        {
            id: '1',
            image: require('../../assets/letters/siin.png')
        },
        {
            id: '2',
            image: require('../../assets/letters/shiin.png')
        },
        {
            id: '3',
            image: require('../../assets/letters/ra.png')
        },
        {
            id: '4',
            image: require('../../assets/letters/kaaf.png')
        }
    ]);

    // Firebase user setup
    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setCurrentUser(user);
            setupUserInFirestore(user);
        }
    }, []);

    const setupUserInFirestore = async (user) => {
        try {
            // Check if user exists in Firestore
            const usersCollection = collection(db, "users");
            const q = query(usersCollection, where("email", "==", user.email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                // Create a new user document if it doesn't exist
                const userRef = doc(db, "users", user.uid);
                await setDoc(userRef, {
                    email: user.email,
                    uid: user.uid,
                    letterStats: initializeLetterStats(),
                    createdAt: new Date()
                });
                setUserDocId(user.uid);
            } else {
                // User exists, get the document ID
                setUserDocId(querySnapshot.docs[0].id);

                // Check if letterStats exists, if not, initialize it
                const userData = querySnapshot.docs[0].data();
                if (!userData.letterStats) {
                    const userRef = doc(db, "users", querySnapshot.docs[0].id);
                    await updateDoc(userRef, {
                        letterStats: initializeLetterStats()
                    });
                }
            }
        } catch (error) {
            console.error("Error setting up user in Firestore:", error);
        }
    };

    const initializeLetterStats = () => {
        const stats = {};
        LETTERS2.forEach(letter => {
            stats[letter.char] = {
                totalTrials: 0,
                correct: 0,
                wrong: 0,
                lastThreeTrials: []
            };
        });
        return stats;
    };

    // Update stats in Firestore after a trial
    const updateLetterStats = async (letterChar, isCorrect) => {
        if (!currentUser || !userDocId) return;

        try {
            // Get current user data
            const userRef = doc(db, "users", userDocId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                const letterStats = userData.letterStats || initializeLetterStats();

                // Update the stats for this letter
                if (!letterStats[letterChar]) {
                    letterStats[letterChar] = {
                        totalTrials: 0,
                        correct: 0,
                        wrong: 0,
                        lastThreeTrials: []
                    };
                }

                letterStats[letterChar].totalTrials += 1;

                if (isCorrect) {
                    letterStats[letterChar].correct += 1;
                } else {
                    letterStats[letterChar].wrong += 1;
                }

                // Keep track of last three trials
                letterStats[letterChar].lastThreeTrials.push(isCorrect);
                if (letterStats[letterChar].lastThreeTrials.length > 3) {
                    letterStats[letterChar].lastThreeTrials.shift(); // Remove oldest trial if more than 3
                }

                // Update Firestore
                await updateDoc(userRef, {
                    letterStats: letterStats
                });
            }
        } catch (error) {
            console.error("Error updating letter stats:", error);
        }
    };

    const fadeInCorrect = () => {
        fadeAnimWrong.setValue(0.5);
        Animated.timing(fadeAnimWrong, {
            toValue: 1, // Fade in to fully visible
            duration: 20, // Duration of the fade-in animation
            useNativeDriver: true, // Use native driver for better performance
        }).start(() => {
            // After fade-in, start the Lottie animation
            refCorrect.current.reset();
            refCorrect.current.play(0);

            // After the Lottie animation finishes, fade out
            setTimeout(() => {
                fadeOutCorrect();
            }, 950); // Wait 2 seconds before fading out
        });
    };

    const fadeInWrong = () => {
        fadeAnimCorrect.setValue(0);
        Animated.timing(fadeAnimCorrect, {
            toValue: 1, // Fade in to fully visible
            duration: 500, // Duration of the fade-in animation
            useNativeDriver: true, // Use native driver for better performance
        }).start(() => {
            // After fade-in, start the Lottie animation
            refWrong.current.reset();
            refWrong.current.play(0);

            // After the Lottie animation finishes, fade out
            setTimeout(() => {
                fadeOutWrong();
            }, 950); // Wait 2 seconds before fading out
        });
    };

    const fadeInMed = () => {
        fadeAnimCorrect.setValue(0);
        Animated.timing(fadeAnimCorrect, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            refMed.current.reset();
            refMed.current.play(0);
            setTimeout(() => {
                fadeOutMed(); // Fixed to call fadeOutMed
            }, 950);
        });
    };

    // Function to fade out
    const fadeOutCorrect = () => {
        Animated.timing(fadeAnimWrong, {
            toValue: 0, // Fade out to fully transparent
            duration: 500, // Duration of the fade-out animation
            useNativeDriver: true, // Use native driver for better performance
        }).start();
    };

    const fadeOutWrong = () => {
        Animated.timing(fadeAnimCorrect, {
            toValue: 0, // Fade out to fully transparent
            duration: 500, // Duration of the fade-out animation
            useNativeDriver: true, // Use native driver for better performance
        }).start();
    };

    const fadeOutMed = () => {
        Animated.timing(fadeAnimCorrect, {
            toValue: 0, // Fade out to fully transparent
            duration: 500, // Duration of the fade-out animation
            useNativeDriver: true, // Use native driver for better performance
        }).start();
    };

    const answerCorrect = () => {
        Haptics.impactAsync(Haptics.NotificationFeedbackType.Success);
        fadeInCorrect();
    }

    const answerWrong = () => {
        Haptics.impactAsync(Haptics.NotificationFeedbackType.Error)
        fadeInWrong();
    }

    const answerMed = () => {
        fadeInMed()
    }

    const answerAlert = (value, letterChar) => {
        console.log(value);
        if (value === "med") {
            answerMed();
            // For medium confidence, record as correct with a warning
            updateLetterStats(letterChar, true);
        }
        else {
            value ? answerCorrect() : answerWrong();
            updateLetterStats(letterChar, value);
        }
    }

    // Initialize audio on component mount
    useEffect(() => {
        const initAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                    staysActiveInBackground: false,
                    allowsRecordingIOS: false
                });
            } catch (error) {
                console.error('Error initializing audio:', error);
            }
        };

        initAudio();
    }, []);

    // Cleanup function for audio
    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const handleLetterPress = (letter) => {
        setActiveLetter(activeLetter === letter.char ? null : letter.char);
    };

    const correct = {
        "siinOut.wav": "سين",
        "shiinOut.wav": "شين",
        "raOut.wav": "را",
        "kafOut.wav": "كاف"
    };

    async function startRecording() {
        try {
            if (permissionResponse.status !== 'granted') {
                console.log('Requesting permission..');
                await requestPermission();
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync(
                {
                    android: {
                        extension: '.wav',
                        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_WAV,
                        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
                        sampleRate: 44100,
                        numberOfChannels: 2,
                        bitRate: 128000,
                    },
                    ios: {
                        extension: '.wav',
                        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
                        sampleRate: 44100,
                        numberOfChannels: 2,
                        bitRate: 128000,
                        linearPCMBitDepth: 16,
                        linearPCMIsBigEndian: false,
                        linearPCMIsFloat: false,
                    },
                }
            );
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    const uploadRecording = async (uri, audioFile) => {
        const formData = new FormData();
        formData.append('recording', {
            uri: uri,
            type: 'audio/wav',
            name: 'recording.wav'
        });
        formData.append('correct', correct[audioFile]);

        try {
            const result = await uploadAudio(formData);
            console.log('Response: ', result);

            const isCorrect = result.inference_result.is_correct;
            const confidence = result.inference_result.confidence;
            const letterChar = correct[audioFile]; // Get the current letter character

            if (confidence > 49 && confidence < 75) {
                setFlag("med");
                answerAlert("med", letterChar);
            }
            else {
                isCorrect ? answerAlert(true, letterChar) : answerAlert(false, letterChar);
                setFlag(false);
            }
            return result;

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const stopRecording = async (audioFile) => {
        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();

            const extractBaseName = (filePath) => {
                return filePath.split('/').pop();
            };

            const baseName = extractBaseName(audioFile);
            console.log(`Caching ${audioFile}: ${audioCache[audioFile]} from stopRecording...`);
            console.log(audioFile);
            await cacheAudio(audioFile, uri);
            await cacheAudio;
            console.log(uri);
            console.log(audioCache);
            await uploadRecording(uri, baseName);

            // Clear the recording state AFTER upload
            setRecording(null);
        } catch (error) {
            console.error("Error stopping recording:", error);
        }
    };

    // Navigate to Analytics
    const navigateToAnalytics = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('Analytics');
    };

    // Handle logout
    const handleLogout = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        auth.signOut()
            .then(() => navigation.replace('Home'))
            .catch(error => console.error("Error signing out: ", error));
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#221C3EFF', "#9C85C6FF", '#573499FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}>

                {/* Add logout button in top left */}
                <View style={headerStyles.container}>
                    <TouchableOpacity
                        style={headerStyles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Icon name="log-out-outline" size={24} color="#FFFFFF" />
                        <Text style={headerStyles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.imageContainer}
                >
                    {imageList.map((item, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image
                                source={item.image}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                    ))}
                </ScrollView>
                <View style={{
                    // flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'blue'
                }}>

                    <Animated.View style={{
                        opacity: fadeAnimCorrect,
                        width: ScreenWidth * 0.65, // Match the LottieView width
                        height: ScreenHeight * 0.3, // Match the LottieView height
                        position: 'absolute',
                        zIndex: 999919,
                        elevation: 999919,
                        backgroundColor: 'transparent',
                        pointerEvents: 'none',
                    }}>
                        <LottieView
                            ref={flag === "med" ? refMed : refWrong}
                            source={flag === "med" ? require("../../assets/animations/medAnim.json") : require("../../assets/animations/false.json")}
                            loop={false}
                            style={styles.lottieF}
                            resizeMode='cover'
                        />
                    </Animated.View>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.cardsContainer}>
                        {LETTERS.map((letter, index) => (
                            <View key={index} style={styles.letterWrapper}>
                                <TouchableOpacity
                                    style={[
                                        styles.letterButton,
                                        activeLetter === letter.char && styles.activeLetter,
                                    ]}
                                    onPress={() => [handleLetterPress(letter), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium
                                    )]}
                                >
                                    <Text style={styles.letterText}>{letter.char}</Text>
                                </TouchableOpacity>

                                {activeLetter === letter.char && (
                                    <View style={styles.buttonsContainer}>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>

                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                onPress={() => [playSound(letter.audioFiles.original), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)]}
                                            >
                                                <Icon name="volume-high" size={30} color="#573499" />
                                            </TouchableOpacity>
                                            <View style={{ width: ScreenWidth * 0.1, justifyContent: 'center', alignItems: 'center' }}>

                                                <LottieView
                                                    ref={recFirst}
                                                    source={require("../../assets/animations/pressRec.json")}
                                                    style={styles.lottieP}
                                                    loop={false}
                                                    resizeMode='cover'
                                                />
                                                <TouchableOpacity style={[styles.actionButton, styles.micButton]}
                                                    onPress={async () => {
                                                        // Trigger haptic feedback
                                                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);

                                                        // Handle recording logic
                                                        if (recording) {
                                                            await stopRecording(letter.audioFiles.recorded);
                                                        } else {
                                                            await startRecording();
                                                        }
                                                    }}>

                                                    {recording ?
                                                        <Icon name="stop" size={30} color="#DC2626FF" /> :
                                                        <Icon name="mic" size={30} color="#573499" />
                                                    }
                                                </TouchableOpacity>
                                            </View>

                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                onPress={() => [playSound(letter.audioFiles.recorded), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)]}
                                            >
                                                <Icon name={isPlaying ? "pause" : "play"} size={30} color={isPlaying ? "#3D9E34FF" : "#573499"} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                    <Animated.View style={{ opacity: fadeAnimCorrect, }}>
                        {flag === "med" && (
                            <Text style={styles.almostCorrectText}>صحيح تقريباً
                            </Text>
                        )}
                    </Animated.View>

                    {/* Add analytics button at bottom */}
                    <View style={footerStyles.container}>
                        <TouchableOpacity
                            style={footerStyles.analyticsButton}
                            onPress={navigateToAnalytics}
                        >
                            <Icon name="stats-chart" size={24} color="#FFFFFF" />
                            <Text style={footerStyles.buttonText}>View Analytics</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
            <LottieView
                ref={refCorrect}
                source={require("../../assets/animations/animation.json")}
                style={styles.lottie}
                loop={false}
                resizeMode='cover'
            />
        </View>
    );
};

// Additional styles for header and footer
const headerStyles = {
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: 22,
        borderRadius: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
    }
};

const footerStyles = {
    container: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    analyticsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#472C74',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        width: '80%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    }
};

export default Letter;