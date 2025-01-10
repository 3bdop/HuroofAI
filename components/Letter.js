import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, FlatList, Dimensions, Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import { Button, ScreenHeight, ScreenWidth } from '@rneui/base';
import * as FileSystem from 'expo-file-system';

// import ImageItems from './ImageItems'


const Letter = () => {
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const confettiRef = useRef();
    const confettiRefFalse = useRef();
    const [activeLetter, setActiveLetter] = useState(null);
    const [sound, setSound] = useState(null);
    const [recording, setRecording] = useState(null);

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



    // const [recordings, setRecordings] = useState({});
    // const [recordingsF, setRecordingsF] = useState({});

    // Initialize audio on component mount
    useEffect(() => {
        const initAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    // allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                    staysActiveInBackground: false,
                    allowsRecordingIOS: false //this will make the sound come from the speaker
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

    const letters = [
        { char: 'س', audioFile: require('../assets/audio/siin.mp3') },
        { char: 'ش', audioFile: require('../assets/audio/shiin.mp3') },
        { char: 'ر', audioFile: require('../assets/audio/ra.mp3') },
        { char: 'ك', audioFile: require('../assets/audio/kaf.mp3') },
    ];




    const playSound = async (audioFile) => {
        try {
            if (sound) {
                await sound.unloadAsync();
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                audioFile,
                { shouldPlay: true }
            );
            setSound(newSound);
            await newSound.playAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
            Alert.alert("Error playing sound");
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

    const uploadRecording = async (uri) => {
        const apiUrl = 'http://192.168.18.13:3000/upload'; // Replace with your server URL
        const fileType = 'audio/m4a'; // Adjust the file type if necessary

        const formData = new FormData();
        formData.append('file', {
            uri,
            name: 'recording.m4a',
            type: fileType,
        });

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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
    const stopRecording = async () => {
        try {
            await recording.stopAndUnloadAsync();
            const path = recording.getURI();
            console.log('Recording stopped and stored at', path);

            // Upload the recorded file to the server
            await uploadRecording(path);
            console.log(recording)
            setRecording(null)
        } catch (error) {
            console.error('Error stopping recording:', error);
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
                                            onPress={() => playSound(letter.audioFile)}
                                        >
                                            <Icon name="volume-high" size={30} color="#573499" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.actionButton, styles.micButton]} onPress={recording ? stopRecording : startRecording}>
                                            <Icon name="mic" size={30} color={recording ? "#3D9E34FF" : "#573499"} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={playRecordedAudio}
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