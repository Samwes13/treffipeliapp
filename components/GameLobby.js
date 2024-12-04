import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import { ref, onValue, update } from 'firebase/database'; 
import { database } from '../firebaseConfig';
import styles from '../styles';

export default function GameLobby({ route, navigation }) {
  const { username, gamepin } = route.params;
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [allPlayersReady, setAllPlayersReady] = useState(false);

  // Shuffle function for traits
  const shuffleTraits = (traits) => {
    for (let i = traits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [traits[i], traits[j]] = [traits[j], traits[i]]; // Swap elements
    }
    return traits;
  };

  // Kuuntele pelin tietoja Firebase-tietokannassa
  useEffect(() => {
    const gameRef = ref(database, `games/${gamepin}`);

    const unsubscribe = onValue(gameRef, (snapshot) => {
      const gameData = snapshot.val();

      if (gameData) {
        // Update players list
        const playerList = Object.values(gameData.players || {});
        setPlayers(playerList);

        // Check if this user is the host
        if (gameData.players[username]?.isHost) {
          setIsHost(true);
        }

        // Check if game has already started
        if (gameData.isGameStarted) {
          setIsGameStarted(true);
        }

        // Check if all players have completed their traits
        const allReady = playerList.every(player => player.traitsCompleted);
        setAllPlayersReady(allReady);

        // If a new player joins, shuffle traits
        if (gameData.players && Object.keys(gameData.players).length > players.length) {
          const shuffledTraits = shuffleTraits(gameData.traits || []);
          update(gameRef, { traits: shuffledTraits });
        }
      }
    });

    return () => unsubscribe(); // Stop listening when component is unmounted
  }, [gamepin, username, players.length]);

  // If the game has started, navigate to GamePlay screen
  useEffect(() => {
    if (isGameStarted) {
      navigation.navigate('GamePlay', { username, gamepin });
    }
  }, [isGameStarted, navigation, gamepin, username]);

  // Start the game (if the host and all players are ready)
  const startGame = () => {
    if (isHost && allPlayersReady) {
      console.log('Starting game for gamepin:', gamepin); // Debug
      update(ref(database, `games/${gamepin}`), {
        isGameStarted: true,
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
          <View style={styles.playerItem}>
            <Text style={styles.playerText}>
              {item.username} {item.traitsCompleted ? '(Ready)' : '(Not Ready)'}
            </Text>
          </View>
        )}
      />

      {isHost && (
        <TouchableOpacity 
          style={[styles.button, !allPlayersReady && styles.disabledButton]} 
          onPress={startGame} 
          disabled={!allPlayersReady}
        >
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
