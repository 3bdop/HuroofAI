import { StyleSheet, Dimensions } from 'react-native';

const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get('window');

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
        width: ScreenWidth * 0.45,
        height: ScreenHeight * 0.2,
        marginHorizontal: 10,
        backgroundColor: 'snow',
        borderRadius: 15,
        // padding: 5,
        // paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20
    },
});

export default styles;