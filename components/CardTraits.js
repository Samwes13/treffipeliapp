import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { ref, update } from 'firebase/database';
import { database } from '../firebaseConfig'; // Ota tietokanta käyttöön
import styles from '../styles';

export default function CardTraits({ route, navigation }) {
  const { username, gamepin } = route.params; // Varmista, että username on saatavilla
  const [traits, setTraits] = useState(Array(6).fill('')); // Alusta 6 piirrettä

  const handleInputChange = (text, index) => {
    const newTraits = [...traits];
    newTraits[index] = text;
    setTraits(newTraits);
  };

  const saveTraits = () => {
    if (traits.every((trait) => trait.trim() !== '')) {
      // Tallenna piirteet tietokantaan
      update(ref(database, `games/${gamepin}/players/${username}`), {
        traits: traits,
      });

      // Navigoi GameLobbyyn, kun piirteet on tallennettu
      navigation.navigate('GameLobby', { gamepin, username });
    } else {
      Alert.alert('Error', 'Please fill all traits');
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title="Submit" onPress={saveTraits} />
    </View>
  );
}
