import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ref, update, get } from 'firebase/database';
import { database } from '../firebaseConfig';
import styles from '../styles';

export default function CardTraits({ route, navigation }) {
  const { username, gamepin } = route.params;
  const [traits, setTraits] = useState(Array(6).fill('')); // Alusta 6 piirrettä

  const handleInputChange = (text, index) => {
    const newTraits = [...traits];
    newTraits[index] = text;
    setTraits(newTraits);
  };

  const saveTraits = async () => {
    if (traits.every((trait) => trait.trim() !== '')) {
      try {
        const gameRef = ref(database, `games/${gamepin}`);
        const snapshot = await get(gameRef);
  
        if (snapshot.exists()) {
          const gameData = snapshot.val();
          const updatedTraits = [...(gameData.traits || []), ...traits];
  
          await update(gameRef, { traits: updatedTraits });
          navigation.navigate('GameLobby', { gamepin, username }); // Lisää username
        } else {
          Alert.alert('Error', 'Game not found');
        }
      } catch (error) {
        console.error('Error saving traits:', error);
        Alert.alert('Error', 'Failed to save traits. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please fill all traits');
    }
  };

  return (
    <View style={styles.container}>
      {/* Näytetään pelin gamepin */}
      <Text style={styles.subtitle}>Game PIN: {gamepin}</Text>
      <Text style={styles.title}>Enter 6 Traits</Text>
      {traits.map((trait, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Trait ${index + 1}`}
          value={trait}
          onChangeText={(text) => handleInputChange(text, index)}
        />
      ))}

      <TouchableOpacity style={styles.button} onPress={saveTraits}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}
