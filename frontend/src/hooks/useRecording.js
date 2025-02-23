import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { AUDIO_CONFIG, RECORDING_CONFIG } from '../config/constants';

export const useRecording = () => {
    const [recording, setRecording] = useState(null);
    const [permissionResponse, setPermissionResponse] = useState(null);

    useEffect(() => {
        // Request permission when the hook is first used
        const getPermission = async () => {
            const permission = await Audio.requestPermissionsAsync();
            setPermissionResponse(permission);
        };
        getPermission();

        // Cleanup recording on unmount
        return () => {
            if (recording) {
                recording.stopAndUnloadAsync();
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            if (!permissionResponse?.granted) {
                console.log('Requesting permission..');
                const permission = await Audio.requestPermissionsAsync();
                setPermissionResponse(permission);
                if (!permission.granted) {
                    return;
                }
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            const { recording: newRecording } = await Audio.Recording.createAsync(
                AUDIO_CONFIG.RECORDING_CONFIG
            );
            setRecording(newRecording);
            console.log('Recording started');
        } catch (error) {
            console.error('Failed to start recording:', error);
            throw error;
        }
    };

    const stopRecording = async () => {
        try {
            if (!recording) {
                return;
            }

            console.log('Stopping recording..');
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
            });

            const uri = recording.getURI();
            setRecording(null);
            console.log('Recording stopped and stored at', uri);
            return uri;
        } catch (error) {
            console.error('Failed to stop recording:', error);
            throw error;
        }
    };

    return {
        recording,
        permissionResponse,
        startRecording,
        stopRecording,
    };
};