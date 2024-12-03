import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ref, update } from 'firebase/database'; // Firebase-tietokannan kirjoitus
import { database } from '../firebaseConfig'; // Ota tietokanta käyttöön
import styles from '../styles';
import GameRules from './GameRules'; // Tuo GameRules-komponentti

export default function GameOptionsScreen({ route, navigation }) {
  const { username } = route.params;
  const [showRules, setShowRules] = useState(false); // Popupin tila

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
      {/* "?" -ikoni popupin avaamiseen */}
      <TouchableOpacity style={styles.helpIcon} onPress={() => setShowRules(true)}>
        <MaterialIcons name="help-outline" size={32} color="black" />
      </TouchableOpacity>

      {/* Modal GameRules-komponentille */}
      <Modal
        visible={showRules}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRules(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <GameRules />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowRules(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
