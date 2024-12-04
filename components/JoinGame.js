import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ref, get, set } from 'firebase/database'; // Hae tietoa Firebase-tietokannasta
import { database } from '../firebaseConfig'; // Ota tietokanta käyttöön
import styles from '../styles';

export default function JoinGame({ navigation, route }) {
  const { username } = route.params; // Ota käyttäjänimi vastaan reitiltä
  const [pincode, setPincode] = useState('');

  const handleJoinGame = async () => {
    // Hae pelin tiedot Firebase-tietokannasta pelikoodin avulla
    const gameRef = ref(database, `games/${pincode}`);
    const snapshot = await get(gameRef);

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
      Alert.alert('Error', 'Pincode is wrong, try again.');
    }
  };

  return (
    <View style={styles.container}>
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
