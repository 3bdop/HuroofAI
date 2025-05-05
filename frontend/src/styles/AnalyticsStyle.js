import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#221C3E',
    },
    loadingText: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 70,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        fontSize: 16,
        color: '#FFFFFF',
        marginLeft: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft: 20,
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    letterCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    letterHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    letterTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#573499',
    },
    progressContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#573499',
    },
    progressText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    performanceContainer: {
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        paddingTop: 12,
    },
    performanceText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    backButtonContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    returnButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#472C74',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
        width: '80%',
    },
    returnButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default styles;

