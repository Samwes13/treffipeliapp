import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, FlatList, Modal } from 'react-native';
import { ref, onValue, update, remove, get, set } from 'firebase/database';
import { database } from '../firebaseConfig';
import styles from '../styles';
import { LinearGradient } from 'expo-linear-gradient';

export default function GameLobby({ route, navigation }) {
  const { username, gamepin } = route.params;
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [allPlayersReady, setAllPlayersReady] = useState(false);
  const [playerToRemove, setPlayerToRemove] = useState(null); // State for tracking player to remove
  const [modalVisible, setModalVisible] = useState(false); // State for controlling modal visibility

  useEffect(() => {
    const gameRef = ref(database, `games/${gamepin}`);
  
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const gameData = snapshot.val();
  
      if (gameData) {
        const playerList = Object.values(gameData.players || {});
        setPlayers(playerList);
  
        // Tarkistetaan, onko nykyinen pelaaja poistettu
        const currentPlayer = playerList.find(player => player.username === username);
        if (!currentPlayer) {
          // Jos nykyistä pelaajaa ei löydy, ohjataan takaisin JoinGame-sivulle
          navigation.navigate('GameOptionScreen', { username });
        }
  
        if (gameData.players[username]?.isHost) {
          setIsHost(true);
        }
  
        if (gameData.isGameStarted) {
          setIsGameStarted(true);
        }
  
        const allReady = playerList.every(player => player.traitsCompleted);
        setAllPlayersReady(allReady);
      }
    });
  
    return () => unsubscribe();
  }, [gamepin, username, navigation]);

  useEffect(() => {
    if (isGameStarted) {
      navigation.navigate('GamePlay', { username, gamepin });
    }
  }, [isGameStarted, navigation, gamepin, username]);

  const startGame = async () => {
    if (isHost && allPlayersReady) {
      try {
        // Haetaan kaikki pelaajien kirjoittamat traitit
        const traitsRef = ref(database, `games/${gamepin}/traits`);
        const traitsSnapshot = await get(traitsRef);
  
        if (traitsSnapshot.exists()) {
          const traitsData = traitsSnapshot.val();
          const updatedTraits = {};
          let traitCounter = 0; // Laskuri, joka määrittää järjestysnumeron
  
          // Käydään läpi kaikki pelaajat ja lisätään heidän traitit yhteiseen olioon
          Object.keys(traitsData).forEach(playerUsername => {
            const playerTraits = traitsData[playerUsername];
  
            // Käydään läpi pelaajan traitit ja lisätään ne olioon
            Object.values(playerTraits).forEach(trait => {
              updatedTraits[traitCounter] = trait;
              traitCounter++; // Lisätään laskurin arvoa
            });
          });
  
          // Päivitetään Firebase, jossa kaikki traitit yhdistetty
          await update(traitsRef, updatedTraits);
  
          // Poistetaan pelaajien alkuperäiset traitit username-tunnisteella
          Object.keys(traitsData).forEach(playerUsername => {
            const playerRef = ref(database, `games/${gamepin}/traits/${playerUsername}`);
            remove(playerRef); // Poistetaan pelaajan traitit
          });
        }
  
        // Käynnistetään peli
        await update(ref(database, `games/${gamepin}`), {
          isGameStarted: true,
        });
      } catch (error) {
        console.error("Error starting game:", error);
      }
    }
  };
  
  
  

  const showRemoveModal = (playerUsername) => { 
    setPlayerToRemove(playerUsername); 
    setModalVisible(true); 
  };

  const removePlayer = async () => {
    if (!playerToRemove) return;
  
    const gameRef = ref(database, `games/${gamepin}`);
    const playerRef = ref(database, `games/${gamepin}/players/${playerToRemove}`);
    const traitsRef = ref(database, `games/${gamepin}/traits/${playerToRemove}`);
  
    try {
      // Hae pelin data
      const gameSnapshot = await get(gameRef);
      if (!gameSnapshot.exists()) return;
  
      const gameData = gameSnapshot.val();
  
      // Poista pelaajan kirjoittamat traitit
      await remove(traitsRef);
  
      // Poista pelaaja
      await remove(playerRef);
  
      // Päivitä tila, jotta pelaaja katoaa näkymästä
      setPlayers((prevPlayers) => prevPlayers.filter(player => player.username !== playerToRemove));
  
      // Jos poistettu pelaaja on itse käyttäjä, navigoidaan pois GameLobbysta
      if (playerToRemove === username) {
        navigation.navigate('JoinGame', { username });
      }
  
    } catch (error) {
      console.error("Error removing player and traits:", error);
    }
  
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#906AFE', 'transparent']}
        style={[styles.background, { zIndex: -1 }]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <Text style={styles.title}>Game Lobby - {gamepin}</Text>

      <FlatList
        data={players}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View style={styles.playerItem}>
            <Text style={styles.playerText}>
              {item.username} {item.traitsCompleted ? '(Ready)' : '(Not Ready)'}
            </Text>
            {isHost && item.username !== username && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => showRemoveModal(item.username)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            )}
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

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to remove {playerToRemove} from the game?
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={removePlayer}
            >
              <Text style={styles.modalButtonText}>Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
