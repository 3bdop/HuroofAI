export default {
    expo: {
        owner: "3bdop",
        name: "huroof",
        slug: "huroof",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        splash: {
            image: "./assets/images/logo.png",
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
<<<<<<< HEAD:app.config.js
                foregroundImage: "./frontend/assets/images/adaptive-icon.png",
                backgroundColor: "#7600bc",
=======
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff",
>>>>>>> refactor:frontend/app.config.js
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
