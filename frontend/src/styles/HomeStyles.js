import { StyleSheet, Dimensions } from 'react-native';

const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get('window');


const styles = StyleSheet.create({
    boldText: {
        color: "snow",
        fontSize: ScreenWidth * 0.09,
        fontWeight: "bold",
        margin: ScreenWidth * 0.05,
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
        fontSize: ScreenWidth * 0.05,
        padding: ScreenWidth * 0.03,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 5.84,
    },
    buttonStyle: {
        backgroundColor: "snow",
        paddingVertical: ScreenWidth * 0.045,
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 10,
    },
    imageStyle: {
        width: ScreenWidth,
        height: ScreenHeight * 0.7,
    }
})

export default styles