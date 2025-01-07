import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const Letter = () => {
    const [activeLetter, setActiveLetter] = useState(null); // State to track which letter is active

    const letters = ['أ', 'ب', 'ت', 'ث']; // Array of Arabic letters

    const handleLetterPress = (letter) => {
        // Toggle the active letter
        setActiveLetter(activeLetter === letter ? null : letter);
    };
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {letters.map((letter, index) => (
                <View key={index} style={styles.letterContainer}>
                    {/* Letter Button */}
                    <TouchableOpacity
                        style={styles.letterButton}
                        onPress={() => handleLetterPress(letter)}
                    >
                        <Text style={styles.letterText}>{letter}</Text>
                    </TouchableOpacity>

                    {/* Buttons Below the Letter */}
                    {activeLetter === letter && (
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.actionButtonText}>Button 1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.actionButtonText}>Button 2</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
        // <View style={styles.container}>

        // </View>
        // <LinearGradient
        //     colors={['#573499FF', "#9C85C6FF", '#2C2356']}
        //     start={{ x: 0, y: 0 }} // Top-left corner
        //     end={{ x: 1, y: 1 }}   // Bottom-right corner
        //     style={styles.container}
        // >
        //     {/* Letter Image */}
        //     <View style={styles.imageContainer}>
        //         <Image
        //             source={require('../assets/icon.png')} //..................
        //             style={styles.letterImage}
        //             resizeMode="contain"
        //         />
        //     </View>

        //     {/* Interactive Buttons */}
        //     <View style={styles.buttonsContainer}>
        //         <TouchableOpacity style={styles.circleButton}>
        //             <Icon name="volume-high" size={24} color="#FFF" />
        //         </TouchableOpacity>

        //         <TouchableOpacity style={styles.circleButton}>
        //             <Icon name="mic" size={24} color="#FFF" />
        //         </TouchableOpacity>
        //     </View>
        // </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'snow'
    },
    header: {
        height: 60,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
    },
    imageContainer: {
        height: Dimensions.get('window').height * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    letterImage: {
        width: '80%',
        height: '80%',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        gap: 100,
    },
    circleButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF6B6B',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    scrollContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        // backgroundColor: 'snow',
    },
    letterContainer: {
        marginBottom: 20,
    },
    letterButton: {
        backgroundColor: '#6C63FF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    letterText: {
        fontSize: 24,
        color: '#FFF',
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    actionButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    actionButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default Letter;