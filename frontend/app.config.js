export default {
    expo: {
        name: "moehe-app",
        slug: "moehe-app",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        splash: {
            image: "./assets/images/logo.png",
            resizeMode: "contain",
            backgroundColor: "#D699F2FF",
        },
        assetBundlePatterns: [
            "**/*",
        ],
        ios: {
            supportsTablet: true,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff",
            },
        },
        web: {
            favicon: "./assets/images/favicon.png",
        },
        extra: {
            serverIp: process.env.SERVER_IP,
            serverPort: process.env.SERVER_PORT,
        },
        plugins: [
            "expo-build-properties",
        ],
    },
};
