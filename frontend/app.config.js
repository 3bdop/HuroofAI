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
            image: "./assets/images/splash.png",
            resizeMode: "contain",
        },
        assetBundlePatterns: [
            "**/*",
        ],
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.udst.huroof",
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
                NSMicrophoneUsageDescription: "This app needs microphone access to record your pronunciation",
            },

        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#E2E2E2FF",
            },
        },
        web: {
            favicon: "./assets/images/favicon.png",
        },
        extra: {
            router: {
                origin: false
            },
            eas: {
                "projectId": "bfbec87f-58e3-41a4-805a-6d05b18d5815"
            },
        },
        plugins: [
            "expo-build-properties",
        ],
        updates: {
            url: "https://u.expo.dev/bfbec87f-58e3-41a4-805a-6d05b18d5815"
        },
        runtimeVersion: {
            policy: "appVersion"
        }
    },
};
