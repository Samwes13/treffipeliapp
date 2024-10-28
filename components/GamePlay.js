import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../firebaseConfig';
import styles from '../styles';

export default function GamePlay({ route, navigation }) {
  const { gamepin, username } = route.params;

  if (!username) {
    console.error("Username is undefined. Please check navigation params.");
    return (
      <View>
        <Text>Error: Username is undefined.</Text>
      </View>
    );
  }

  const [players, setPlayers] = useState([]);
  const [traits, setTraits] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentTrait, setCurrentTrait] = useState('');
  const [acceptedTraits, setAcceptedTraits] = useState([]);

  useEffect(() => {
    const gameRef = ref(database, `games/${gamepin}/players`);
    
    onValue(gameRef, (snapshot) => {
      const playersData = snapshot.val();
      const allTraits = [];

      Object.keys(playersData).forEach((player) => {
        allTraits.push(...playersData[player].traits);
      });

      setTraits(shuffleArray(allTraits));
      setPlayers(Object.keys(playersData));
    });
  }, [gamepin]);

  useEffect(() => {
    const gameStatusRef = ref(database, `games/${gamepin}`);
    
    onValue(gameStatusRef, (snapshot) => {
      const gameData = snapshot.val();
      if (gameData) {
        setCurrentPlayerIndex(gameData.currentPlayerIndex || 0);
        setCurrentRound(gameData.currentRound || 1);
        setCurrentTrait(gameData.currentTrait || '');
        setAcceptedTraits(gameData.acceptedTraits || []); // Hae hyväksytyt traitit
      }
    });
  }, [gamepin]);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleDecision = (decision) => {
    const gameRef = ref(database, `games/${gamepin}`);

    let newAcceptedTraits = [...acceptedTraits];

    if (decision === 'juu') {
      newAcceptedTraits.push(currentTrait); // Lisää hyväksytty trait
    } else if (decision === 'ei') {
      newAcceptedTraits = newAcceptedTraits.filter(trait => trait !== currentTrait); // Poista hyväksytty trait
    }

    update(gameRef, {
      [`players/${username}/decision`]: decision,
      currentPlayerIndex: (currentPlayerIndex + 1) % players.length,
      currentRound: (currentPlayerIndex + 1 === players.length) ? currentRound + 1 : currentRound,
      currentTrait: getNextTrait(newAcceptedTraits, (currentPlayerIndex + 1) % players.length), // Päivitä nykyinen trait
      acceptedTraits: newAcceptedTraits, // Päivitä hyväksytyt traitit
    });
  };

  const getNextTrait = (accepted, playerIndex) => {
    // Palautetaan hyväksytty trait, jos se on hyväksytty
    const nextTrait = traits[playerIndex];

    // Tarkista, onko edellinen trait hyväksytty
    if (accepted.includes(nextTrait)) {
      return nextTrait; // Palauta hyväksytty trait
    }

    return traits[playerIndex]; // Palauta seuraava trait
  };

  const refreshGame = () => {
    setCurrentRound(1);
    setCurrentPlayerIndex(0);
    setTraits(shuffleArray(traits));
    setAcceptedTraits([]); // Nollaa hyväksytyt traitit
  };

  console.log("Current Player Index:", currentPlayerIndex);
  console.log("Current Username:", username);
  console.log("Players List:", players);
  console.log("Traits List:", traits);
  console.log("Current Trait:", currentTrait);
  console.log("Accepted Traits:", acceptedTraits);

  return (
    <View style={styles.container}>
      <Text style={styles.roundText}>Round {currentRound}</Text>
      <Text style={styles.traitText}>Current Trait: {currentTrait}</Text>
      <Text style={styles.playerText}>Current Player: {players[currentPlayerIndex]}</Text>

      {players.length > 0 && (
        <>
          {players[currentPlayerIndex] === username ? (
            <>
              <TouchableOpacity style={styles.button} onPress={() => handleDecision('juu')}>
                <Text style={styles.buttonText}>Juu</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => handleDecision('ei')}>
                <Text style={styles.buttonText}>Ei</Text>
              </TouchableOpacity>

              {/* Näytä hyväksytyt traitit vain, jos pelaaja on vuorossa */}
              <Text style={styles.playerText}>Accepted Traits: {acceptedTraits.join(', ')}</Text>
            </>
          ) : (
            <Text style={styles.playerText}>Waiting for {players[currentPlayerIndex]} to decide...</Text>
          )}
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={refreshGame}>
        <Text style={styles.buttonText}>Refresh Game</Text>
      </TouchableOpacity>
    </View>
  );
}
