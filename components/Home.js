import { StyleSheet, Text, View, Dimensions, ImageBackground, Animated } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react'
import { Image, Input, Button } from "@rneui/themed";
import * as Haptics from 'expo-haptics';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Home = ({ navigation }) => {
    // Create animated value for vertical movement
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

    return (
        <LinearGradient
            colors={['#221C3EFF', "#9C85C6FF", '#573499FF']}
            // start={{ x: 1, y: 0 }}
            // end={{ x: 0, y: 1 }}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <Animated.View
                style={{
                    width: screenWidth,
                    height: "50%",
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [{ translateY: bounceAnim }] // Apply the animation
                }}
            >
                <Image
                    source={require("../assets/Group.png")}
                    style={{
                        width: screenWidth,
                        height: screenHeight * 0.7,
                    }}
                />
            </Animated.View>
            <View style={{ justifyContent: "center", alignItems: "center", height: "20%" }}>
                <View>
                    <Text style={styles.boldText}>تعلم معنا <Text style={[styles.boldText, { color: '#D1CDF4FF' }]}>الأحرف</Text></Text>
                    <Text style={styles.innerText}>
                        تعلّم، استمتع، واكتشف مع أختبارات ممتعة!
                    </Text>
                </View>
            </View>

            <View style={{ height: "10%", alignItems: 'center', justifyContent: 'center' }}>
                <Button
                    title="هيا فلنبدأ"
                    titleStyle={{
                        color: "black",
                        fontWeight: "bold",
                    }}
                    buttonStyle={{
                        backgroundColor: "snow",
                        paddingVertical: screenWidth * 0.045,
                        borderWidth: 2,
                        borderColor: "black",
                        borderRadius: 10,
                    }}
                    containerStyle={{
                        width: screenWidth * 0.75,
                    }}
                    onPress={() => [navigation.navigate("Letter"), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium
                    )]}
                />
            </View>
        </LinearGradient>
    );
}

export default Home

const styles = StyleSheet.create({
    boldText: {
        color: "snow",
        fontSize: screenWidth * 0.09,
        fontWeight: "bold",
        margin: screenWidth * 0.05,
        textAlign: "center",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 5.84,
    },
    innerText: {
        color: "snow",
        textAlign: "center",
        fontSize: screenWidth * 0.05,
        padding: screenWidth * 0.03,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 5.84,
    },
})
