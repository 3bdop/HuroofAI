import { StyleSheet, Text, View, Dimensions, ImageBackground, Animated } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react'
import { Image, Input, Button } from "@rneui/themed";
import styles from '../styles/HomeStyles';
import * as Haptics from 'expo-haptics';

const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get('window');

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
                    width: ScreenWidth,
                    height: "50%",
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [{ translateY: bounceAnim }] // Apply the animation
                }}
            >
                <Image
                    source={require("../../assets/images/Group.png")}
                    style={styles.imageStyle}
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
                    buttonStyle={styles.buttonStyle}
                    containerStyle={{
                        width: ScreenWidth * 0.75,
                    }}
                    onPress={() => [navigation.navigate("Login"),
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium
                    )]}
                />
            </View>
        </LinearGradient>
    );
}

export default Home

