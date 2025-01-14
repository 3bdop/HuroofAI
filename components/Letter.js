import { Text, View, TouchableOpacity, ScrollView, Alert, Image, Modal, Animated, Easing  } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import { Button } from '@rneui/base';
import { ENV } from '../config/env.js';
import styles from './LetterStyles';

const Letter = () => {
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const confettiRef = useRef();
    const confettiRefFalse = useRef();
    const [activeLetter, setActiveLetter] = useState(null);
    const [sound, setSound] = useState(null);
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const [isPlaying, setIsPlaying] = useState(false);
    const [showStopButton, setShowStopButton] = useState(false);
    

    const SERVER_PORT = ENV.SERVER_PORT;
    const SERVER_IP = ENV.SERVER_IP;
    const SERVER_PATH_UPLOAD = 'upload';
    const fileType = 'audio/m4a';
    const [isCountdownVisible, setIsCountdownVisible] = useState(false);
    const [countdownText, setCountdownText] = useState('3');
    const textOpacity = useRef(new Animated.Value(0)).current;
    const textScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Create the bouncing animation sequence
        const bounceAnimation = Animated.sequence([
            Animated.timing(bounceAnim, {
                toValue: -20, // Move up by 15 units
                duration: 2000, // 2 seconds up
                useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
                toValue: 0, // Move back to original position
                duration: 2000, // 2 seconds down
                useNativeDriver: true,
            })
        ]);

        // Create an infinite loop of the animation
        Animated.loop(bounceAnimation).start();
    }, []);
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

    const letters = [
        {
            char: "س",
            audioFiles: [
                require("../assets/audio/siin.mp3"),
                require("../uploads/siinOut.mp3"),
                "../uploads/siinOut.m4a",
            ],
        },

        {
            char: "ش",
            audioFiles: [
                require("../assets/audio/shiin.mp3"),
                require("../uploads/shiinOut.mp3"),
                "../uploads/shiinOut.m4a",
            ],
        },

        {
            char: "ر",
            audioFiles: [
                require("../assets/audio/ra.mp3"),
                require("../uploads/raOut.mp3"),
                "../uploads/raOut.m4a",
            ],
        },

        {
            char: "ك",
            audioFiles: [
                require("../assets/audio/kaf.mp3"),
                require("../uploads/kafOut.mp3"),
                "../uploads/kafOut.m4a",
            ],
        },
    ];



    const playSound = async (audioFile) => {
        try {
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
        } catch (error) {
            console.error("Error playing sound:", error.message, error);
            Alert.alert(
                "Error playing sound",
                "Could not play the sound. Please check the file or server configuration."
            );
        }
    };



    const handleLetterPress = (letter) => {
        setActiveLetter(activeLetter === letter.char ? null : letter.char);
    };

    const triggerConfetti = () => {
        if (confettiRef.current) {
            confettiRef.current.play(0)
        }
    }
    const triggerConfettiFalse = () => {
        if (confettiRefFalse.current) {
            confettiRefFalse.current.play(0)
        }
    }
    const [recordedURI, setRecordedURI] = useState(null);

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
            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }
    
    const runCountdownAnimation = () => {
        const countdown = ['3', '2', '1', 'Recording...'];
        let index = 0;
    
        const animateNumber = () => {
            if (index < countdown.length) {
                setCountdownText(countdown[index]);
                
                textOpacity.setValue(0);
                textScale.setValue(1);
    
                Animated.parallel([
                    Animated.timing(textOpacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(textScale, {
                        toValue: 1.2,
                        duration: 500,
                        useNativeDriver: true,
                    })
                ]).start(() => {
                    if (index === countdown.length - 1) {
                        setShowStopButton(true);
                        startRecording(); 
                    } else {
                        Animated.parallel([
                            Animated.timing(textOpacity, {
                                toValue: 0,
                                duration: 500,
                                useNativeDriver: true,
                            }),
                            Animated.timing(textScale, {
                                toValue: 0.8,
                                duration: 500,
                                useNativeDriver: true,
                            })
                        ]).start(() => {
                            index++;
                            animateNumber();
                        });
                    }
                });
            }
        };
    
        animateNumber();
    };

    const startRecordingWithCountdown = () => {
        setCountdownText('3'); // Reset the text when starting a new recording
        setIsCountdownVisible(true);
        runCountdownAnimation();
    };

    const handleStopRecording = async (audioFile) => {
        await stopRecording(audioFile);
        setShowStopButton(false);
        setIsCountdownVisible(false);
    };

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
    const uploadRecording = async (uri, dest) => {
        try {
            validateServerConfig();
            const apiUrl = `http://${SERVER_IP}:${SERVER_PORT}/${SERVER_PATH_UPLOAD}`;

            console.log(apiUrl);

            const formData = new FormData();
            console.log(dest);
            formData.append('file', {
                uri,
                name: 'recording.m4a',
                type: fileType,
            });
            formData.append('filename', dest);

            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData, // Let the browser handle the Content-Type
            });

            if (response.ok) {
                console.log('File uploaded successfully');
            } else {
                console.error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };


    // Call this function after recording is stopped
    const stopRecording = async (audioFile) => {
        try {
            // Stop and unload the recording
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            console.log("Recording stopped and stored at", audioFile);

            // Upload the recorded file to the server
            console.log(audioFile);
            await uploadRecording(uri, audioFile);
            console.log(uri);

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

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.cardsContainer}>
                        {letters.map((letter, index) => (
                            <View key={index} style={styles.letterWrapper}>
                                <TouchableOpacity
                                    style={[
                                        styles.letterButton,
                                        activeLetter === letter.char && styles.activeLetter
                                    ]}
                                    onPress={() => handleLetterPress(letter)}
                                >
                                    <Text style={styles.letterText}>{letter.char}</Text>
                                </TouchableOpacity>

                                {activeLetter === letter.char && (
                                    <View style={styles.buttonsContainer}>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>

                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                onPress={() => playSound(letter.audioFiles[0])}
                                            >
                                                <Icon name="volume-high" size={30} color="#573499" />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.actionButton, styles.micButton]}
                                                onPress={startRecordingWithCountdown}>
                                                {/* <Icon name="mic" size={30} color={recording ? "#3D9E34FF" : "#573499"} /> */}
                                                <Icon name="mic" size={30} color="#573499" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                // onPress={playRecordedAudio}  // TODO: Use PlaySound() instead

                                                onPress={() => playSound(letter.audioFiles[1])}
                                            >
                                                <Icon name={isPlaying ? "pause" : "play"} size={30} color={isPlaying ? "#3D9E34FF" : "#573499"} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))}
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Button title="True" onPress={triggerConfetti} />
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
            {/* <LottieView
                ref={confettiRefFalse}
                source={require("../assets/animations/false.json")}
                style={styles.lottieF}
                loop={false}
                resizeMode='cover'
            /> */}
            <Modal
                transparent={true}
                visible={isCountdownVisible}
                animationType="fade"
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Animated.Text 
                        style={[
                            {
                                fontSize: 60,
                                fontWeight: 'bold',
                                color: 'white',
                                opacity: textOpacity,
                                transform: [{ scale: textScale }]
                            }
                        ]}
                    >
                        {countdownText}
                    </Animated.Text>
                    {showStopButton && (
                        <TouchableOpacity
                            style={{
                                marginTop: 40,
                                backgroundColor: '#DC2626FF',
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderRadius: 25,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                            onPress={() => handleStopRecording(letters.find(l => l.char === activeLetter)?.audioFiles[2])}
                        >
                            <Icon name="stop" size={30} color="white" style={{ marginRight: 8 }} />
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                                Stop Recording
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Modal>
        </View>
    );
};


export default Letter;
