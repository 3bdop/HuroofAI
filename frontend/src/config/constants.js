import { Audio } from "expo-av";

export const LETTERS = [
    {
        char: "س",
        audioFiles: {
            original: require("@assets/audio/siin.mp3"),
            recorded: "siinOut.wav"
        },
    },
    {
        char: "ش",
        audioFiles: {
            original: require("@assets/audio/shiin.mp3"),
            recorded: "shiinOut.wav"
        },
    },
    {
        char: "ر",
        audioFiles: {
            original: require("@assets/audio/ra.mp3"),
            recorded: "raOut.wav",
        },
    },
    {
        char: "ك",
        audioFiles: {
            original: require("@assets/audio/kaf.mp3"),
            recorded: "kafOut.wav",
        },
    },
];

export const AUDIO_CONFIG = {
    mode: {
        // playsInSilentModeIOS: true,
        // shouldDuckAndroid: true,
        // playThroughEarpieceAndroid: false,
        // staysActiveInBackground: false

        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
    }
};

export const RECORDING_CONFIG = {
    android: {
        extension: '.wav',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_WAV,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
    },
    ios: {
        extension: '.wav',
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
}