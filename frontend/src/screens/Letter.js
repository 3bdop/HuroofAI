import { Text, View, TouchableOpacity, ScrollView, Alert, Image, Animated, Dimensions, TouchableNativeFeedback, Platform } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import styles from '../styles/LetterStyles';
import { LETTERS } from "@config/constants"
import { useAudio } from "@hooks/useAudio"
// import { useRecording } from "@hooks/useRecording"

import { uploadAudio } from '../services/api.services';


const Letter = () => {
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
    const [flag, setFlag] = useState(null)

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

    const answerAlert = (value) => {
        console.log(value);
        if (value === "med") {
            answerMed()
        }
        else {
            value ? answerCorrect() : answerWrong();
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
            const confidence = result.inference_result.confidence
            if (confidence > 49 && confidence < 75) {
                setFlag("med")
                answerAlert("med")
            }
            else {
                isCorrect ? answerAlert(true) : answerAlert(false)
                setFlag(false)
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
            await cacheAudio
            console.log(uri);
            console.log(audioCache);
            await uploadRecording(uri, baseName);

            // Clear the recording state AFTER upload
            setRecording(null);
        } catch (error) {
            console.error("Error stopping recording:", error);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#221C3EFF', "#9C85C6FF", '#573499FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}>


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


export default Letter;