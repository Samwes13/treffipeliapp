import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ref, update, get, remove } from 'firebase/database';
import { database } from '../firebaseConfig';
import styles from '../styles';
import { LinearGradient } from 'expo-linear-gradient';

export default function GameEnd({ route, navigation }) {
  const { gamepin, username } = route.params || {};

  if (!gamepin || !username) {
    console.error('GameEnd: Missing gamepin or username!');
    return null;
  }

  // Siirretään peli tietokannasta 5 minuutin kuluttua
  const deleteGameAfterTimeout = async () => {
    setTimeout(async () => {
      const gameRef = ref(database, `games/${gamepin}`);
      try {
        await remove(gameRef); // Poistaa pelin tietokannasta
        console.log(`Peli ${gamepin} poistettu tietokannasta.`);
      } catch (error) {
        console.error('Virhe pelin poistamisessa:', error);
      }
    }, 5 * 60 * 1000); // Poistetaan peli 5 minuutin kuluttua
  };

  // Replay-napin logiikka: Siirtyy takaisin GameOptionScreen-sivulle
  const handleReplay = async () => {
    try {
      // Navigoi takaisin GameOptionScreen-sivulle
      navigation.navigate('GameOptionScreen', { username });
      
      // Poistetaan peli tietokannasta 5 minuutin kuluttua
      await deleteGameAfterTimeout();
    } catch (error) {
      console.error('Virhe Replay-napissa:', error);
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
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.title}>Thank you for playing!</Text>
      <TouchableOpacity style={styles.button} onPress={handleReplay}>
        <Text style={styles.buttonText}>Replay</Text>
      </TouchableOpacity>
    </View>
  );
}
