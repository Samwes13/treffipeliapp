import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ref, update, remove } from 'firebase/database';
import { database } from '../firebaseConfig';
import styles from '../styles';
import { LinearGradient } from 'expo-linear-gradient';

export default function GameEnd({ route, navigation }) {
  const { gamepin, username } = route.params || {};

  if (!gamepin || !username) {
    console.error('GameEnd: Missing gamepin or username!');
    return null;
  }

  // Peli poistetaan 5 minuutin kuluttua
  useEffect(() => {
    const deleteGameTimeout = setTimeout(async () => {
      const gameRef = ref(database, `games/${gamepin}`);
      try {
        await remove(gameRef);
        console.log(`Peli ${gamepin} poistettu tietokannasta.`);
      } catch (error) {
        console.error('Virhe pelin poistamisessa:', error);
      }
    }, 5 * 60 * 1000);

    return () => clearTimeout(deleteGameTimeout);
  }, [gamepin]);

  // Peli resetoidaan ja siirrytään GameOptionScreeniin
  const handleReplay = async () => {
    try {
      const gameRef = ref(database, `games/${gamepin}`);
      
      // Resetoi vain tarvittavat tiedot
      await update(gameRef, {
        currentRound: 1,
        currentPlayerIndex: 0,
        currentTrait: '',
        usedTraits: [],
      });

      console.log("Peli resetoitu uutta peliä varten.");

      // Navigoi takaisin alkuun
      navigation.navigate('GameOptionScreen', { username, gamepin });
    } catch (error) {
      console.error('Virhe Replay-napissa:', error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
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

      {/* AdSense-mainos */}
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7869485729301293"
        crossorigin="anonymous"></script>
      <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7869485729301293"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </View>
  );
}