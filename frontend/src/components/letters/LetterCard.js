import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { LetterControls } from './LetterControls';
import { styles } from '../../styles'

export const LetterCard = ({ letter, isActive, onPress }) => {
  return (
    <View style={styles.letterWrapper}>
      <TouchableOpacity
        style={[styles.letterButton, isActive && styles.activeLetter]}
        onPress={onPress}
      >
        <Text style={styles.letterText}>{letter.char}</Text>
      </TouchableOpacity>
      {isActive && <LetterControls letter={letter} />}
    </View>
  );
};