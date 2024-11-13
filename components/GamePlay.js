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
  const [usedTraits, setUsedTraits] = useState([]); // Uusi tila käytetyille traiteille
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentTrait, setCurrentTrait] = useState('');
  const [playerAcceptedTraits, setPlayerAcceptedTraits] = useState([]);
  const [currentPlayerAcceptedTraits, setCurrentPlayerAcceptedTraits] = useState([]);

  useEffect(() => {
    const gameRef = ref(database, `games/${gamepin}/players`);
  
    onValue(gameRef, (snapshot) => {
      const playersData = snapshot.val();
      const allTraits = [];
  
      Object.keys(playersData).forEach((player) => {
        allTraits.push(...playersData[player].traits);
      });
  
      const shuffledTraits = shuffleArray(allTraits);
      setTraits(shuffledTraits);
      setPlayers(Object.keys(playersData));
  
      if (!currentTrait && shuffledTraits.length > 0) {
        setCurrentTrait(shuffledTraits[0]);
        
        // Päivitä Firebase:en ensimmäinen trait
        const gameRef = ref(database, `games/${gamepin}`);
        update(gameRef, { currentTrait: shuffledTraits[0] });

        // Lisää ensimmäinen trait käytettyihin traiteitten listalle
        setUsedTraits([shuffledTraits[0]]);
      }
  
      const updatedAcceptedTraits = Object.keys(playersData).reduce((acc, player) => {
        acc[player] = playersData[player].acceptedTraits || [];
        return acc;
      }, {});
  
      setPlayerAcceptedTraits(updatedAcceptedTraits[username] || []);
      setCurrentPlayerAcceptedTraits(updatedAcceptedTraits[players[currentPlayerIndex]] || []);
    });
  }, [gamepin]);
  
  useEffect(() => {
    if (players.length > 0) {
      const currentPlayerName = players[currentPlayerIndex];
      const playerRef = ref(database, `games/${gamepin}/players/${currentPlayerName}`);
      
      onValue(playerRef, (snapshot) => {
        const playerData = snapshot.val();
        setCurrentPlayerAcceptedTraits(playerData.acceptedTraits || []);
      });
    }
  }, [currentPlayerIndex, players, gamepin]);

  useEffect(() => {
    const gameStatusRef = ref(database, `games/${gamepin}`);
    
    onValue(gameStatusRef, (snapshot) => {
      const gameData = snapshot.val();
      if (gameData) {
        setCurrentPlayerIndex(gameData.currentPlayerIndex || 0);
        setCurrentRound(gameData.currentRound || 1);
        setCurrentTrait(gameData.currentTrait || '');
      }
    });
  }, [gamepin]);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleDecision = (decision) => {
    const playerRef = ref(database, `games/${gamepin}/players/${username}`);
    let updatedAcceptedTraits = [...playerAcceptedTraits];
  
    if (decision === 'juu') {
      updatedAcceptedTraits.push(currentTrait);
    } else if (decision === 'ei') {
      updatedAcceptedTraits = [];
    }
  
    update(playerRef, { acceptedTraits: updatedAcceptedTraits })
      .then(() => setPlayerAcceptedTraits(updatedAcceptedTraits))
      .catch(error => console.error("Failed to update accepted traits:", error));
  
    const gameRef = ref(database, `games/${gamepin}`);
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    const nextRound = (nextPlayerIndex === 0) ? currentRound + 1 : currentRound;
    
    // Päivitetään Firebase ja asetaan seuraava trait
    const nextTrait = getNextTrait();
    setUsedTraits([...usedTraits, nextTrait]);

    update(gameRef, {
      currentPlayerIndex: nextPlayerIndex,
      currentRound: nextRound,
      currentTrait: nextTrait,
    });
  };
  
  // Tämä funktio valitsee seuraavan traitin, jota ei ole vielä käytetty
  const getNextTrait = () => {
    return traits.find((trait) => !usedTraits.includes(trait)) || '';
  };

  const refreshGame = async () => {
    const gameRef = ref(database, `games/${gamepin}`);
    
    try {
      await update(gameRef, {
        currentRound: 1,
        currentPlayerIndex: 0,
        currentTrait: traits[0] || '',
      });
    
      for (let player of players) {
        const playerRef = ref(database, `games/${gamepin}/players/${player}`);
        await update(playerRef, {
          acceptedTraits: [],
          decision: null,
        });
      }
    
      setCurrentRound(1);
      setCurrentPlayerIndex(0);
      setTraits(shuffleArray(traits));
      setPlayerAcceptedTraits([]);
      setCurrentPlayerAcceptedTraits([]);
      setCurrentTrait(traits[0] || '');
      setUsedTraits([]); // Tyhjennä käytetyt traitit pelin päivityksen yhteydessä
  
      console.log("Game refreshed successfully.");
    } catch (error) {
      console.error("Failed to refresh game:", error);
    }
  };
  
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
            </>
          ) : (
            <Text style={styles.playerText}>Waiting for {players[currentPlayerIndex]} to decide...</Text>
          )}

          <Text style={styles.playerText}>Accepted Traits of Current Player: {currentPlayerAcceptedTraits.join(', ')}</Text>
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={refreshGame}>
        <Text style={styles.buttonText}>Refresh Game</Text>
      </TouchableOpacity>
    </View>
  );
}
