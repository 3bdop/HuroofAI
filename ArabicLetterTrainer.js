import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Voice from '@react-native-voice/voice';
import Sound from 'react-native-sound';

const ArabicLetterTrainer = () => {
  const [isListening, setIsListening] = useState(false);
  const [userPronunciation, setUserPronunciation] = useState('');
  const [score, setScore] = useState(0);
  const [currentLetter, setCurrentLetter] = useState({
    letter: 'ا',
    audioPath: 'path_to_audio/alif.mp3'
  });

  // Initialize voice recognition
  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // Handle speech recognition results
  const onSpeechResults = (e) => {
    setUserPronunciation(e.value[0]);
    analyzePronunciation(e.value[0]);
  };

  const onSpeechError = (e) => {
    console.error(e);
  };

  // Play reference pronunciation
  const playReference = () => {
    const sound = new Sound(currentLetter.audioPath, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load sound', error);
        return;
      }
      sound.play((success) => {
        if (!success) {
          console.error('Sound playback failed');
        }
      });
    });
  };

  // Start recording user's pronunciation
  const startRecording = async () => {
    try {
      setIsListening(true);
      await Voice.start('ar-SA'); // Arabic language
    } catch (e) {
      console.error(e);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    try {
      setIsListening(false);
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  // Analyze pronunciation (placeholder for actual implementation)
  const analyzePronunciation = (pronunciation) => {
    // Here you would implement actual pronunciation comparison logic
    // This could involve phoneme comparison, waveform analysis, etc.
    const mockScore = Math.random() * 100; // Replace with actual analysis
    setScore(mockScore);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.letter}>{currentLetter.letter}</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={playReference}
      >
        <Text style={styles.buttonText}>Listen to Correct Pronunciation</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isListening && styles.recordingButton]} 
        onPress={isListening ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {isListening ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>

      {score > 0 && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            Pronunciation Score: {score.toFixed(1)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  letter: {
    fontSize: 72,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  scoreText: {
    fontSize: 18,
  },
});

export default ArabicLetterTrainer;