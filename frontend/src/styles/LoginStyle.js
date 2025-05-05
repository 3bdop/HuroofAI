import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyboardView: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subHeaderText: {
        fontSize: 18,
        color: '#FFFFFF',
        opacity: 0.8,
        marginBottom: 40,
    },
    inputContainer: {
        width: '100%',
        maxWidth: 350,
        alignItems: 'center',
    },
    input: {
        height: 56,
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 16,
        color: '#333',
    },
    errorText: {
        color: '#FF3B30',
        marginTop: 8,
        marginBottom: 16,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        paddingVertical: 11,
        paddingHorizontal: 12,
        borderRadius: 6,
        overflow: 'hidden',
        width: '80%',
        maxWidth: 350,
    },
    primaryButton: {
        backgroundColor: '#472C74',
        width: '70%',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 16,
        maxWidth: 270,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: 'white',
        width: '70%',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 270,
    },
    secondaryButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
    },
});

export default styles