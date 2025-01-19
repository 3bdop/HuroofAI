import { Text, View, TouchableOpacity, ScrollView, Alert, Image, Animated, Dimensions } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { ENV } from '../../backend/config/env';
import styles from '../styles/LetterStyles';

const Letter = () => {
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [audioCache, setAudioCache] = useState({});
    const confettiRef = useRef(null);
    const recFirst = useRef(null);
    const confettiRefFalse = useRef(null);
    const [activeLetter, setActiveLetter] = useState(null);
    const [sound, setSound] = useState(null);
    const [recording, setRecording] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value

    const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get('window');

    const SERVER_PORT = ENV.SERVER_PORT;
    const SERVER_IP = ENV.SERVER_IP;
    const SERVER_PATH_UPLOAD = 'uploads';
    const fileType = 'audio/m4a';

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1, // Fade in to fully visible
            duration: 500, // Duration of the fade-in animation
            useNativeDriver: true, // Use native driver for better performance
        }).start(() => {
            // After fade-in, start the Lottie animation
            if (confettiRefFalse.current) {
                confettiRefFalse.current.play();
            }

            // After the Lottie animation finishes, fade out
            setTimeout(() => {
                fadeOut();
            }, 950); // Wait 2 seconds before fading out
        });
    };

    // Function to fade out
    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0, // Fade out to fully transparent
            duration: 500, // Duration of the fade-out animation
            useNativeDriver: true, // Use native driver for better performance
        }).start();
    };

    async function answerCorrect() {
        if (confettiRef.current) {
            // await Haptics.impactAsync(Haptics.NotificationFeedbackType.Success)
            confettiRef.current.play(0);
        }
    }

    async function answerWrong() {
        fadeIn()
        // await Haptics.impactAsync(Haptics.NotificationFeedbackType.Error)
    }

    function answerAlert(isCorrect) {
        if (isCorrect) {
            answerCorrect()
        } else {
            answerWrong()
        }
    }

    const [imageList] = useState([
        {
            id: '1',
            image: require('../assets/letters/siin.png')
        },
        {
            id: '2',
            image: require('../assets/letters/shiin.png')
        },
        {
            id: '3',
            image: require('../assets/letters/ra.png')
        },
        {
            id: '4',
            image: require('../assets/letters/kaaf.png')
        }
    ]);


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
    // console.log(require('../uploads/kafOut.m4a'))

    //TODO MultiSession, should config it later
    const [recordedURIs, setRecordedURIs] = useState(null); // Store the URI of the recorded audio
    const [recordedURIsh, setRecordedURIsh] = useState(null); // Store the URI of the recorded audio
    const [recordedURIr, setRecordedURIr] = useState(null); // Store the URI of the recorded audio
    const [recordedURIk, setRecordedURIk] = useState(null); // Store the URI of the recorded audio
    const audioURIs = [
        recordedURIs,
        recordedURIsh,
        recordedURIr,
        recordedURIk
    ]
    // const letters = [
    //     {
    //         char: "س",
    //         charURI: recordedURIs,
    //         audioFiles: [
    //             require("../assets/audio/siin.mp3"),
    //             "../../backend/uploads/siinOut.m4a",
    //             "../../backend/uploads/siinOut.mp3",
    //             // { uri: "../../backend/uploads/siinOut.mp3" },
    //         ],
    //     },

    //     {
    //         char: "ش",
    //         charURI: recordedURIsh,
    //         audioFiles: [
    //             require("../assets/audio/shiin.mp3"),
    //             "../../backend/uploads/shiinOut.m4a",
    //             "../../backend/uploads/shiinOut.mp3",
    //             // { uri: "../../backend/uploads/shiinOut.mp3" },
    //         ],
    //     },

    //     {
    //         char: "ر",
    //         charURI: recordedURIr,
    //         audioFiles: [
    //             require("../assets/audio/ra.mp3"),
    //             "../../backend/uploads/raOut.m4a",
    //             "../../backend/uploads/raOut.mp3",
    //             // { uri: "../../backend/uploads/raOut.mp3" },
    //         ],
    //     },

    //     {
    //         char: "ك",
    //         charURI: recordedURIk,
    //         audioFiles: [
    //             require("../assets/audio/kaf.mp3"),
    //             "../../backend/uploads/kafOut.m4a",
    //             "../../backend/uploads/kafOut.mp3",
    //             // { uri: "../../backend/uploads/kafOut.mp3" },
    //         ],
    //     },
    // ];

    const letters = [
        {
            char: "س",
            charURI: recordedURIs,
            audioFiles: [
                "../assets/audio/siin.mp3",
                "../uploads/siinOut.wav",
            ],
        },

        {
            char: "ش",
            charURI: recordedURIsh,
            audioFiles: [
                "../assets/audio/shiin.mp3",
                "../uploads/shiinOut.wav",
            ],
        },

        {
            char: "ر",
            charURI: recordedURIr,
            audioFiles: [
                "../assets/audio/ra.mp3",
                "../uploads/raOut.wav",
            ],
        },

        {
            char: "ك",
            charURI: recordedURIk,
            audioFiles: [
                "../assets/audio/kaf.mp3",
                "../uploads/kafOut.wav",
            ],
        },
    ];
    const playSound = async (audioFile) => {
        if (!audioFile) {
            recFirst.current.play()
            return
        }

        // Pause or resume the currently playing sound
        if (sound) {
            const status = await sound.getStatusAsync();
            if (status.isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
            } else {
                await sound.playAsync();
                setIsPlaying(true);
            }
        } else {
            // Load and play a new sound
            console.log("Audio file:", audioFile);

            const soundObject =
                typeof audioFile === "string" ? { uri: audioFile } : audioFile;

            const { sound: newSound } = await Audio.Sound.createAsync(soundObject, {
                shouldPlay: true,
            });

            setSound(newSound);
            setIsPlaying(true);

            // Listen to the playback status to reset `isPlaying` when the sound finishes
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setIsPlaying(false);
                    setSound(null); // Unload the sound
                }
            });
        }

    };



    const handleLetterPress = (letter) => {
        setActiveLetter(activeLetter === letter.char ? null : letter.char);
    };


    const correct = {
        "siinOut.wav": "سين",
        "shiinOut.wav": "شين",
        "raOut.wav": "را",
        "kafOut.wav": "كاف"
    };

    const cacheFile = async (audioFile, uri) => {
        try {
            console.log("@cacheFile");
            console.log(audioFile);
            setAudioCache(prevCache => ({ ...prevCache, [audioFile]: uri }));
            console.log(`File ${audioFile} cached in memory`);
            console.log(`Check`)
            await AsyncStorage.setItem(audioFile, uri);
            console.log(`File ${audioFile} cached successfully with URI: ${uri}`);

        } catch (error) {
            console.error('Error caching file in memory:', error);
        }
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

    const validateServerConfig = () => {
        if (!SERVER_IP) {
            throw new Error('Server IP address not set');
        }

        if (!SERVER_PORT) {
            throw new Error('Server Port not set');
        }

        if (!SERVER_PATH_UPLOAD) {
            throw new Error('Server Upload Record Path not set');
        }
    }
    const uploadRecording = async (uri, audioFile) => {
        console.log("HERE");
        console.log(audioCache);
        validateServerConfig();
        const apiUrl = `http://${SERVER_IP}:${SERVER_PORT}/${SERVER_PATH_UPLOAD}`;

        console.log(`Uploading to: ${apiUrl}`);

        const formData = new FormData();
        formData.append('recording', {
            uri: uri,
            type: 'audio/wav',
            name: 'recording.wav'
        });
        formData.append('correct', correct[audioFile]);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const result = await response.json();
            console.log('Response: ', result);

            const isCorrect = result.inference_result.is_correct;
            // const alertMessage = isCorrect ? 'Your recording was correct!' : 'Your recording was incorrect. Please try again.';
            answerAlert(isCorrect);
            return result;

        } catch (error) {
            console.error('Error:', error);
        }
    };


    // Call this function after recording is stopped
    // const stopRecording = async (audioFile, char) => {
    //     try {
    //         // Stop and unload the recording
    //         await recording.stopAndUnloadAsync();
    //         const uri = recording.getURI();
    //         console.log("Recording stopped and stored at", audioFile);

    //         // Upload the recorded file to the server
    //         console.log(audioFile);
    //         await uploadRecording(uri, audioFile);
    //         console.log(uri);
    //         switch (char) {
    //             case "س":
    //                 setRecordedURIs(uri);

    //                 break;
    //             case "ش":
    //                 setRecordedURIsh(uri);

    //                 break;
    //             case "ر":
    //                 setRecordedURIr(uri);

    //                 break;

    //             default:
    //                 setRecordedURIk(uri);
    //                 break;
    //         }
    //         // Clear the recording state AFTER upload
    //         setRecording(null);
    //     } catch (error) {
    //         console.error("Error stopping recording:", error);
    //     }
    // };
    const stopRecording = async (audioFile, char) => {
        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();

            const extractBaseName = (filePath) => {
                return filePath.split('/').pop();
            };

            const baseName = extractBaseName(audioFile);
            console.log(`Caching ${audioFile}: ${audioCache[audioFile]} from stopRecording...`);
            console.log(audioFile);
            await cacheFile(audioFile, uri);
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
                <View style={{ justifyContent: 'center', alignItems: 'center', }}>

                    <Animated.View style={{
                        opacity: fadeAnim,
                        width: ScreenWidth * 0.65, // Match the LottieView width
                        height: ScreenHeight * 0.3, // Match the LottieView height
                        position: 'absolute',
                        zIndex: 999919,
                        elevation: 999919,
                        backgroundColor: 'transparent',
                        pointerEvents: 'none',
                    }}>
                        <LottieView
                            ref={confettiRefFalse}
                            source={require("../assets/animations/false.json")}
                            loop={false}
                            style={styles.lottieF}
                            resizeMode='cover'
                        />
                    </Animated.View>
                    {/* <LottieView
                        ref={confettiRefFalse}
                        source={require("../assets/animations/false.json")}
                        style={styles.lottieF}
                        loop={false}
                        resizeMode='cover'
                    /> */}
                </View>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.cardsContainer}>
                        {letters.map((letter, index) => (
                            <View key={index} style={styles.letterWrapper}>
                                <TouchableOpacity
                                    style={[
                                        styles.letterButton,
                                        activeLetter === letter.char && styles.activeLetter
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
                                                onPress={() => [playSound(letter.audioFiles[1]), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)]}
                                            >
                                                <Icon name="volume-high" size={30} color="#573499" />
                                            </TouchableOpacity>
                                            <View style={{ width: ScreenWidth * 0.1, justifyContent: 'center', alignItems: 'center' }}>

                                                <LottieView
                                                    ref={recFirst}
                                                    source={require("../assets/animations/pressRec.json")}
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
                                                            await stopRecording(letter.audioFiles[1], letter.char);
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
                                                // onPress={playRecordedAudio}  // TODO: Use PlaySound() instead

                                                // onPress={() => playSound(letter.audioFiles[2])}
                                                // onPress={() => [playSound(letter.charURI), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)]}
                                                onPress={() => [playSound(letter.audioFiles[1]), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)]}
                                            >
                                                <Icon name={isPlaying ? "pause" : "play"} size={30} color={isPlaying ? "#3D9E34FF" : "#573499"} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))}
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            {/* <Button title="True" onPress={() => setConfettiTrue(true)} /> */}
                            {/* <Button title="false" onPress={triggerConfettiFalse} /> */}
                        </View>
                    </View>
                </ScrollView>

            </LinearGradient>
            <LottieView
                ref={confettiRef}
                source={require("../assets/animations/animation.json")}
                style={styles.lottie}
                loop={false}
                resizeMode='cover'
            />

        </View>
    );
};


export default Letter;
