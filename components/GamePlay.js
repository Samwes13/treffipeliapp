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
  const [usedTraits, setUsedTraits] = useState([]);
  const [currentTrait, setCurrentTrait] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerAcceptedTraits, setPlayerAcceptedTraits] = useState([]);

  useEffect(() => {
    const gameRef = ref(database, `games/${gamepin}`);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const gameData = snapshot.val();
      if (gameData) {
        setTraits(gameData.traits || []);
        setUsedTraits(gameData.usedTraits || []);
        setCurrentTrait(gameData.currentTrait || '');
        setCurrentPlayerIndex(gameData.currentPlayerIndex || 0);
        setCurrentRound(gameData.currentRound || 1);
  
        const updatedPlayers = Object.keys(gameData.players || {}).map((key) => ({
          username: key,
          ...gameData.players[key],
        }));
        setPlayers(updatedPlayers);
  
        // Tarkista, onko peli päättynyt
        if (gameData.currentRound > 6) {
          console.log('Peli päättyi! Siirretään pelaajat GameEnd-sivulle.');
  
          // Päivitä pelaajien tila ja siirrä kaikki pelaajat GameEnd-sivulle
          const playersRef = ref(database, `games/${gamepin}/players`);
          const playerUpdates = {};
          updatedPlayers.forEach((player) => {
            playerUpdates[player.username] = { ...player, inGame: false };
          });
  
          update(playersRef, playerUpdates)
            .then(() => {
              navigation.navigate('GameEnd', { gamepin, username });
            })
            .catch((error) => console.error('Virhe pelaajien tilan päivittämisessä:', error));
        }
      }
    });
  
    return () => unsubscribe();
  }, [gamepin, navigation]);
  
  

  useEffect(() => {
    const gameRef = ref(database, `games/${gamepin}`);

    if (!currentTrait && traits.length > 0) {
      console.log("currentTrait puuttuu. Asetetaan ensimmäinen piirre.");
      const firstTrait = traits[0];

      update(gameRef, {
        currentTrait: firstTrait,
        usedTraits: [firstTrait],
      }).catch((error) => console.error("Virhe ensimmäisen piirteen asettamisessa:", error));
    }
  }, [traits, currentTrait, gamepin]);

  

  


  const getNextTrait = () => {
    const availableTraits = traits.filter((trait) => !usedTraits.includes(trait));

    if (availableTraits.length === 0) {
      console.log("Kaikki piirteet on käytetty.");
      return null;
    }

    const nextTrait = availableTraits[0];
    const gameRef = ref(database, `games/${gamepin}`);
    update(gameRef, {
      currentTrait: nextTrait,
      usedTraits: [...usedTraits, nextTrait],
    }).catch((error) => console.error("Virhe päivitettäessä piirteitä:", error));

    return nextTrait;
  };

  const handleDecision = (decision) => {
    if (!currentTrait) {
      console.error("Virhe: currentTrait on määrittelemätön.");
      return;
    }
  
    console.log(`${username} valitsi: ${decision} piirrelle: ${currentTrait}`);
  
    const playerRef = ref(database, `games/${gamepin}/players/${username}`);
    let updatedAcceptedTraits;
  
    if (decision === 'juu') {
      updatedAcceptedTraits = [...playerAcceptedTraits, currentTrait];
    } else if (decision === 'ei') {
      updatedAcceptedTraits = []; // Tyhjennetään hyväksytyt piirteet, kun pelaaja valitsee "Ei"
    }
  
    console.log("Updated Accepted Traits: ", updatedAcceptedTraits); // Add this log to check if the traits are being updated correctly
    
    update(playerRef, { acceptedTraits: updatedAcceptedTraits })
      .then(() => setPlayerAcceptedTraits(updatedAcceptedTraits))
      .catch((error) => console.error("Virhe hyväksyttyjen piirteiden päivityksessä:", error));
  
    const nextTrait = getNextTrait();
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    const nextRound = nextPlayerIndex === 0 ? currentRound + 1 : currentRound;
  
    const gameRef = ref(database, `games/${gamepin}`);
    update(gameRef, {
      currentPlayerIndex: nextPlayerIndex,
      currentRound: nextRound,
    }).catch((error) => console.error("Virhe pelitilan päivityksessä:", error));
  
    // Tarkistetaan, onko peli pelattu loppuun (6 kierrosta)
    if (nextRound > 6) {
      console.log("Peli päättyi! Siirretään kaikki pelaajat GameEnd-sivulle.");
    
      const playersRef = ref(database, `games/${gamepin}/players`);
      const playerUpdates = {};
    
      players.forEach((player) => {
        playerUpdates[player.username] = { ...player, inGame: false }; // Merkitään pelaajat pelin loppuneiksi
      });
    
      update(playersRef, playerUpdates)
        .then(() => {
          navigation.navigate('GameEnd', { gamepin, username }); // Navigointi GameEnd-sivulle
        })
        .catch((error) => console.error("Virhe pelaajien päivityksessä:", error));
    }
    
  };
  
  

  
  

  return (
    <View style={styles.container}>
      <Text style={styles.roundText}>Round {currentRound}</Text>
      <Text style={styles.traitText}>Current Trait: {currentTrait}</Text>
      <Text style={styles.playerTextPlay}>Current Player: {players[currentPlayerIndex]?.username}</Text>

      {players.length > 0 && (
        <>
          {players[currentPlayerIndex]?.username === username ? (
            <>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => handleDecision('juu')}>
                  <Text style={styles.buttonText}>Juu</Text>
              </TouchableOpacity>

<TouchableOpacity style={styles.button} onPress={() => handleDecision('ei')}>
  <Text style={styles.buttonText}>Ei</Text>
</TouchableOpacity>
</View>
            </>
          ) : (
            <Text style={styles.playerTextPlay}>
              Waiting for {players[currentPlayerIndex]?.username} to decide...
            </Text>
          )}
        </>
      )}

      {/* Näytä hyväksytyt traitit vain vuorossa olevalle pelaajalle */}
      <Text style={styles.playerTextPlay}>
        Accepted Traits: 
        {players[currentPlayerIndex]?.username === username && (
          <Text>{playerAcceptedTraits.join(', ')}</Text>
        )}
        {/* Näytä hyväksytyt traitit pelaajalle, jonka vuoro on */}
        {players[currentPlayerIndex]?.username !== username && currentPlayerIndex !== -1 && (
          <Text>{players[currentPlayerIndex]?.acceptedTraits?.join(', ')}</Text>
        )}
      </Text>
    </View>
  );
}
