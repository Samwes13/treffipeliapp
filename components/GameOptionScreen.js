import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ref, update } from 'firebase/database'; // Firebase-tietokannan kirjoitus
import { database } from '../firebaseConfig'; // Ota tietokanta käyttöön
import styles from '../styles';

export default function GameOptionsScreen({ route, navigation }) {
  const { username } = route.params;

  // Luo uusi peli Firebase-tietokantaan
  const createGame = () => {
    const gamepin = Math.random().toString(36).substring(2, 8).toUpperCase(); // Satunnainen pelikoodi

    // Luo peli tietokantaan uudella gamepinillä ja lisää isäntä
    update(ref(database, `games/${gamepin}`), {
      host: username,
      gamepin: gamepin,
      isGameStarted: false, // Lisää kenttä pelin tilalle
      players: {
        [username]: {
          username: username,
          traits: [], // Piirteet lisätään myöhemmin
          isHost: true, // Merkitään pelaaja isännäksi
        },
      },
    });

    // Navigoi CardTraits-sivulle, jotta isäntä voi syöttää piirteet
    navigation.navigate('CardTraits', { username, gamepin });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.helpIcon}>
        <MaterialIcons name="help-outline" size={32} color="black" />
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={createGame}>
          <Text style={styles.buttonText}>Create Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('JoinGame', { username })}>
          <Text style={styles.buttonText}>Join Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
