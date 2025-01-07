import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Audio } from 'expo-av';

const Letter = () => {
    const [activeLetter, setActiveLetter] = useState(null);
    const [sound, setSound] = useState();
    
    // Initialize audio on component mount
    useEffect(() => {
        const initAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                    staysActiveInBackground: false,
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
        { char: 'أ', audioFile: require('../assets/audio/alif.mp3') },
        { char: 'ب', audioFile: require('../assets/audio/alif.mp3') },
        { char: 'ت', audioFile: require('../assets/audio/alif.mp3') },
        { char: 'ث', audioFile: require('../assets/audio/alif.mp3') },
    ];

    const playSound = async (audioFile) => {
        try {
            if (sound) {
                await sound.unloadAsync();
            }

            console.log('Loading sound...');
            const { sound: newSound } = await Audio.Sound.createAsync(
                audioFile,
                { shouldPlay: true }
            );
            setSound(newSound);
            console.log('Playing sound...');
            await newSound.playAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
            Alert.alert("Error playing sound")
        }
    };

    const handleLetterPress = (letter) => {
        setActiveLetter(activeLetter === letter.char ? null : letter.char);
    };

    return (
        <LinearGradient
            colors={['#573499FF', "#9C85C6FF", '#2C2356']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}>
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
                                        <Icon name="volume-high" size={20} color="#573499" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.actionButton, styles.micButton]}>
                                        <Icon name="mic" size={20} color="#573499" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20,
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
        backgroundColor: '#7B3FEE',
        transform: [{scale: 1.02}],
    },
    letterText: {
        fontSize: 28,
        color: '#FFF',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: {width: 1, height: 1},
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
    }
});

export default Letter;
