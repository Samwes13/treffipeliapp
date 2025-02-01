import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ref, get, set } from 'firebase/database'; // Hae tietoa Firebase-tietokannasta
import { database } from '../firebaseConfig'; // Ota tietokanta käyttöön
import styles from '../styles';
import { LinearGradient } from 'expo-linear-gradient';

export default function JoinGame({ navigation, route }) {
  const { username } = route.params; // Ota käyttäjänimi vastaan reitiltä
  const [pincode, setPincode] = useState('');

  const handleJoinGame = async () => {
    // Hae pelin tiedot Firebase-tietokannasta pelikoodin avulla
    const gameRef = ref(database, `games/${pincode}`);
    const snapshot = await get(gameRef);

    if (!pincode.trim()) {
      // Tarkista, että pinkoodi ei ole tyhjä
      window.alert('Error! Pincode cannot be empty.');
      return;
    }

    if (snapshot.exists()) {
      // Lisää pelaaja Firebase-tietokantaan
      const playersRef = ref(database, `games/${pincode}/players/${username}`);
      await set(playersRef, {
        username: username,
        traits: [],
        isHost: false, // Tämä pelaaja ei ole isäntä
      });

      // Siirry CardTraits-sivulle, jos pinkoodi on oikein
      navigation.navigate('CardTraits', { username, gamepin: pincode }); // Välitä oikea käyttäjänimi
    } else {
      // Näytä virheilmoitus, jos pelikoodi on väärin
      window.alert('Pincode is wrong, try again.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#906AFE', 'transparent']}
        style={[styles.background, { zIndex: -1 }]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Text style={styles.title}>Join Game</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Pincode"
        value={pincode}
        onChangeText={setPincode}
      />
      <TouchableOpacity style={styles.button} onPress={handleJoinGame}>
        <Text style={styles.buttonText}>Join Game</Text>
      </TouchableOpacity>
      
    </View>
  );
}
