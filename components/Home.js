import { StyleSheet, Text, View, Dimensions, ImageBackground } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react'
import { Image, Input, Button } from "@rneui/themed";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Home = ({ navigation }) => {
    return (
        <LinearGradient
            colors={['#573499FF', "#9C85C6FF", '#2C2356']}
            start={{ x: 0, y: 0 }} // Top-left corner
            end={{ x: 1, y: 1 }}   // Bottom-right corner
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <View style={{ width: screenWidth, height: "50%", justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={require("../assets/Group.png")}
                    style={{
                        width: screenWidth, // Responsive width
                        height: screenHeight * 0.7, // Maintain aspect ratio
                        // backgroundColor: 'red'
                    }}
                />
            </View>
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
                    onPress={() => navigation.navigate("Letter")}
                />
            </View>
        </LinearGradient>
    )
}

export default Home

const styles = StyleSheet.create({
    // books: {
    //     width: screenWidth,
    //     height: screenWidth * 0.9,
    //     marginTop: "39%",
    // }
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
        // paddingHorizontal: screenWidth * 0.04,
    },
})