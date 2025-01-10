import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Animated, Dimensions, Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import { Button, ScreenHeight, ScreenWidth } from '@rneui/base';
import * as FileSystem from 'expo-file-system';
import { ImageBackground } from 'react-native';

// import ImageItems from './ImageItems'


const Letter = () => {
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const confettiRef = useRef();
    const confettiRefFalse = useRef();
    const [activeLetter, setActiveLetter] = useState(null);
    const [sound, setSound] = useState(null);
    const [recording, setRecording] = useState(null);
    const bounceAnim = useRef(new Animated.Value(0)).current;

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
            image: require('../assets/letters/alif.png')
        },
        {
            id: '2',
            image: require('../assets/letters/ba.png')
        },
        {
            id: '3',
            image: require('../assets/letters/ta.png')
        },
        {
            id: '4',
            image: require('../assets/letters/tha.png')
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

    const letters = [
        {
            char: "س",
            audioFiles: [
                require("../assets/audio/siin.mp3"),
                require("../uploads/siinOut.m4a"),
                "../uploads/siinOut.m4a",
            ],
        },

        {
            char: "ش",
            audioFiles: [
                require("../assets/audio/shiin.mp3"),
                require("../uploads/shiinOut.m4a"),
                "../uploads/shiinOut.m4a",
            ],
        },

        {
            char: "ر",
            audioFiles: [
                require("../assets/audio/ra.mp3"),
                require("../uploads/raOut.m4a"),
                "../uploads/raOut.m4a",
            ],
        },

        {
            char: "ك",
            audioFiles: [
                require("../assets/audio/kaf.mp3"),
                require("../uploads/kafOut.m4a"),
                "../uploads/kafOut.m4a",
            ],
        },
    ];



    const playSound = async (audioFile) => {
        try {
            if (sound) {
                await sound.unloadAsync();
                setSound(null);
            }

            console.log("Audio file:", audioFile);

            const soundObject =
                typeof audioFile === "string" ? { uri: audioFile } : audioFile;

            const { sound: newSound } = await Audio.Sound.createAsync(soundObject, {
                shouldPlay: true,
            });

            setSound(newSound);
            await newSound.playAsync();
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
    const [recordedURI, setRecordedURI] = useState(null); // Store the URI of the recorded audio

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
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    const uploadRecording = async (uri, dest) => {
        const apiUrl = 'http://192.168.18.13:3000/upload'; // Replace with your server URL
        const fileType = 'audio/m4a'; // Adjust the file type if necessary

        const formData = new FormData();
        console.log(dest);
        formData.append('file', {
            uri,
            name: 'recording.m4a',
            type: fileType,
        });
        formData.append('filename', dest);

        try {
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

            // Clear the recording state AFTER upload
            setRecording(null);
        } catch (error) {
            console.error("Error stopping recording:", error);
        }
    };

    // async function stopRecording() {
    //     console.log('Stopping recording..');
    //     setRecording(undefined);
    //     await recording.stopAndUnloadAsync();
    //     await Audio.setAudioModeAsync({
    //         allowsRecordingIOS: false,
    //     });
    //     const uri = recording.getURI();
    //     setRecordedURI(uri); // Save the URI
    //     console.log('Recording stopped and stored at', uri);
    // }

    const playRecordedAudio = async () => {
        if (!recordedURI) {
            Alert.alert("No recording found", "Please record your voice first.");
            return;
        }

        try {
            const { sound: playbackSound } = await Audio.Sound.createAsync(
                { uri: recordedURI },
                { shouldPlay: true }
            );
            setSound(playbackSound); // Save the playback sound instance for cleanup
            await playbackSound.playAsync();
        } catch (error) {
            console.error('Error playing recorded audio:', error);
            Alert.alert("Error", "Could not play the recorded audio.");
        }
    };
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#221C3EFF', "#9C85C6FF", '#573499FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}>
                {/* <Animated.ImageBackground
                    style={{ flex: 1, resizeMode: 'cover', width: ScreenWidth, height: ScreenHeight }}
                    source={require('../assets/GroupS.png')} > */}

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
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() => playSound(letter.audioFiles[0])}
                                        >
                                            <Icon name="volume-high" size={30} color="#573499" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.actionButton, styles.micButton]}
                                            onPress={recording ? () => stopRecording(letter.audioFiles[2]) : startRecording}>
                                            {/* <Icon name="mic" size={30} color={recording ? "#3D9E34FF" : "#573499"} /> */}
                                            {recording ?
                                                <Icon name="stop" size={30} color="#DC2626FF" /> :
                                                <Icon name="mic" size={30} color="#573499" />
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            // onPress={playRecordedAudio}  // TODO: Use PlaySound() instead

                                            onPress={() => playSound(letter.audioFiles[1])}
                                        >
                                            <Icon name="play" size={30} color="#573499" />
                                        </TouchableOpacity>
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
                {/* </Animated.ImageBackground> */}

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
    scrollContainer: {
        // flexGrow: 1,
        justifyContent: 'center',
        // paddingVertical: 20,
    },
    cardsContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    letterWrapper: {
        marginBottom: 15,
        alignItems: 'center',
        width: '100%',
        maxWidth: 300,
    },
    letterButton: {
        backgroundColor: '#8A4FFF',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 15,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    activeLetter: {
        backgroundColor: '#6734C6FF',
        transform: [{ scale: 1.02 }],
    },
    letterText: {
        fontSize: 28,
        color: '#FFF',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        width: '100%',
        gap: 120,
    },
    actionButton: {
        backgroundColor: '#fff',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },
    micButton: {
        backgroundColor: '#fff',
    },
    lottie: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        elevation: 999,
        backgroundColor: 'transparent',
        pointerEvents: 'none'
    },
    lottieF: {
        width: ScreenWidth * 0.2,
        height: ScreenHeight * 0.1,
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 999,
        elevation: 999,
        backgroundColor: 'transparent',
        pointerEvents: 'none'
    },
    imageContainer: {
        padding: 10,
        paddingHorizontal: 20,
        alignItems: 'center',

    },
    imageWrapper: {
        width: ScreenWidth * 0.4,
        height: ScreenHeight * 0.2,
        marginHorizontal: 10,
        backgroundColor: '#E71D73',
        borderRadius: 15,
        padding: 5,
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});


export default Letter;