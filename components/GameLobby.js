import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import { ref, onValue, update } from 'firebase/database'; 
import { database } from '../firebaseConfig';
import styles from '../styles';

export default function GameLobby({ route, navigation }) {
  const { username, gamepin } = route.params; // Nämä tulevat GameOptionsScreen-komponentista
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Kuuntele pelin tietoja Firebase-tietokannassa
  useEffect(() => {
    const gameRef = ref(database, `games/${gamepin}`);

    // Kuunnellaan tietokannan muutoksia
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const gameData = snapshot.val();

      if (gameData) {
        // Päivitä pelaajien lista
        setPlayers(Object.values(gameData.players || {}));

        // Päivitä isäntätila
        if (gameData.players[username]?.isHost) {
          setIsHost(true);
        }

        // Tarkista, onko peli aloitettu
        if (gameData.isGameStarted) {
          setIsGameStarted(true);
        }
      }
    });

    return () => unsubscribe(); // Pysäytetään kuuntelu, kun komponentti poistetaan
  }, [gamepin, username]);

  // Jos peli on alkanut, siirrytään GamePlay-sivulle----
  useEffect(() => {
    if (isGameStarted) {
      navigation.navigate('GamePlay', { username, gamepin }); // Siirrä username ja gamepin
    }
  }, [isGameStarted, navigation, gamepin, username]);

  // Aloita peli (vain isännälle)
  const startGame = () => {
    if (isHost) {
      update(ref(database, `games/${gamepin}`), {
        isGameStarted: true, // Päivitä pelin tila alkaneeksi
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Lobby - {gamepin}</Text>

      <FlatList
        data={players}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <Text style={styles.playerText}>{item.username}</Text>
        )}
      />

      {isHost && (
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
