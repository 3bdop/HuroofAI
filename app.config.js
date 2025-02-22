export default {
    expo: {
        owner: "3bdop",
        name: "huroof",
        slug: "huroof",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./frontend/assets/images/icon.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        splash: {
            image: "./frontend/assets/images/logo.png",
            resizeMode: "contain",
            backgroundColor: "#7600bc",
        },
        assetBundlePatterns: [
            "**/*",
        ],
        ios: {
            supportsTablet: true,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./frontend/assets/images/adaptive-icon.png",
                backgroundColor: "#7600bc",
            },
        },
        web: {
            favicon: "./frontend/assets/images/favicon.png",
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
