import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUDIO_CONFIG } from '../config/constants';

export const useAudio = () => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioCache, setAudioCache] = useState({});

    useEffect(() => {
        return sound ? () => sound.unloadAsync() : undefined;
    }, [sound]);

    const playSound = async (audioFile) => {
        try {
            const cachedAudio = audioCache[audioFile] || await AsyncStorage.getItem(audioFile) || audioFile;

            if (!cachedAudio) {
                console.error('Audio file not found:', audioFile);
                return;
            }

            const soundObject = typeof cachedAudio === 'string' ? { uri: cachedAudio } : cachedAudio;

            await Audio.setAudioModeAsync(AUDIO_CONFIG.mode)
            if (sound) {
                const status = await sound.getStatusAsync();
                if (status.isPlaying) {
                    await sound.pauseAsync();
                } else {
                    await sound.playAsync();
                }
                setIsPlaying(status.isPlaying);
            } else {
                const { sound: newSound } = await Audio.Sound.createAsync(soundObject, { shouldPlay: true });
                setSound(newSound);
                setIsPlaying(true);
                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status.didJustFinish) {
                        setIsPlaying(false);
                        setSound(null);
                    }
                });
            }
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    const cacheAudio = async (audioFile, uri) => {
        try {
            setAudioCache(prevCache => ({ ...prevCache, [audioFile]: uri }));
            await AsyncStorage.setItem(audioFile, uri);
        } catch (error) {
            console.error('Error caching audio:', error);
        }
    };

    return { playSound, isPlaying, setIsPlaying, sound, setSound, cacheAudio, audioCache };
};