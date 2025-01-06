import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const Letter = () => {
    return (
        <LinearGradient
            colors={['#573499FF', "#9C85C6FF", '#2C2356']}
            start={{ x: 0, y: 0 }} // Top-left corner
            end={{ x: 1, y: 1 }}   // Bottom-right corner
            style={styles.container}
        >
            {/* Letter Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/icon.png')} //..................
                    style={styles.letterImage}
                    resizeMode="contain"
                />
            </View>

            {/* Interactive Buttons */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.circleButton}>
                    <Icon name="volume-high" size={24} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.circleButton}>
                    <Icon name="mic" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});

export default Letter;