import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import styles from '../styles'; // Varmista, että polku on oikein

export default function GameLobby() {
  const [players, setPlayers] = useState([]);
  const [pinkoodi, setPinkoodi] = useState('');

  useEffect(() => {
    // Generoi satunnainen pinkoodi
    const generatePinkoodi = () => {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setPinkoodi(code);
    };

    generatePinkoodi();
  }, []);

  const addPlayer = (playerName) => {
    setPlayers((prevPlayers) => [...prevPlayers, playerName]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Lobby</Text>
      <Text style={styles.pinkoodi}>Pinkoodi: {pinkoodi}</Text>

      <FlatList
        data={players}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text style={styles.player}>{item}</Text>}
      />

      <Button title="Add Dummy Player" onPress={() => addPlayer(`Player ${players.length + 1}`)} />
    </View>
  );
}
