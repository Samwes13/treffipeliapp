import React, { useState, useEffect } from 'react'; 
import { View, Text, TouchableOpacity } from 'react-native';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../firebaseConfig';
import styles from '../styles';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function GamePlay({ route, navigation }) {
  const { gamepin, username } = route.params;
  
  if (!username) {
    console.error("Username is undefined. Please check navigation params.");
    return <View><Text>Error: Username is undefined.</Text></View>;
  }
  
  if (!gamepin) {
    console.error("Gamepin is undefined. Please check navigation params.");
    return (
      <View>
        <Text>Error: Gamepin is undefined.</Text>
      </View>
    );
  }

  const [gameState, setGameState] = useState(() => {
    // Yritä ladata pelin tila localStorage:sta
    const savedState = localStorage.getItem(`gameState_${gamepin}_${username}`);
    return savedState ? JSON.parse(savedState) : {
      players: [],
      traits: [],
      usedTraits: [],
      currentTrait: '',
      currentRound: 1,
      currentPlayerIndex: 0,
      playerAcceptedTraits: [],
    };
  });

  // Tallenna pelin tila localStorageen aina kun se muuttuu
  useEffect(() => {
    localStorage.setItem(`gameState_${gamepin}_${username}`, JSON.stringify(gameState));
  }, [gameState, gamepin, username]);

  // Animaatio
  const fadeAnim = useSharedValue(1);

  useEffect(() => {
    fadeAnim.value = 1; 
    fadeAnim.value = withTiming(0, { duration: 4000 }); 
  }, [gameState.currentPlayerIndex]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  // Päivitä pelin tila, kun tietokannasta tulee muutoksia
  useEffect(() => {
    const gameRef = ref(database, `games/${gamepin}`);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const gameData = snapshot.val();
      if (gameData) {
        setGameState(prevState => ({
          ...prevState,
          traits: gameData.traits || [],
          usedTraits: gameData.usedTraits || [],
          currentTrait: gameData.currentTrait || '',
          currentPlayerIndex: gameData.currentPlayerIndex || 0,
          currentRound: gameData.currentRound || 1,
          players: Object.keys(gameData.players || {}).map((key) => ({
            username: key,
            ...gameData.players[key],
          })),
        }));

        if (gameData.currentRound > 6) {
          console.log('Game over! Navigating to GameEnd.');
          const playersRef = ref(database, `games/${gamepin}/players`);
          const playerUpdates = {};
          gameState.players.forEach(player => {
            playerUpdates[player.username] = { ...player, inGame: false };
          });

          update(playersRef, playerUpdates)
            .then(() => {
              localStorage.removeItem(`gameState_${gamepin}_${username}`);
              navigation.navigate('GameEnd', { gamepin, username });
            })
            .catch(err => console.error('Error updating player states:', err));
        }
      } else {
        console.error("Game data not found.");
      }
    }, (error) => {
      console.error("Error fetching game data:", error);
    });

    return () => unsubscribe();
  }, [gamepin, navigation, gameState.players]);

  useEffect(() => {
    if (!gameState.currentTrait && gameState.traits.length > 0) {
      console.log("Setting first trait.");
      const firstTrait = gameState.traits[0];
      const updatedTraits = gameState.traits.slice(1);  // Remove the first trait
      update(ref(database, `games/${gamepin}`), {
        currentTrait: firstTrait,
        traits: updatedTraits,  // Remove the first trait from the traits array
        usedTraits: [firstTrait],  // Add the first trait to the usedTraits array
      }).catch(err => console.error("Error setting first trait:", err));
    }
  }, [gameState.traits, gameState.currentTrait, gamepin]);
  

  const getNextTrait = () => {
    const availableTraits = gameState.traits.filter((trait) => !gameState.usedTraits.includes(trait));
    if (availableTraits.length === 0) {
      console.log("No more traits available.");
      return null;
    }
  
    const nextTrait = availableTraits[0];
    const updatedTraits = gameState.traits.filter(trait => trait !== nextTrait);
  
    update(ref(database, `games/${gamepin}`), {
      currentTrait: nextTrait,
      traits: updatedTraits,
      usedTraits: [...gameState.usedTraits, nextTrait],
    }).catch(err => console.error("Error updating traits:", err));
  
    return nextTrait;
  };
  

  const handleDecision = (decision) => {
    if (!gameState.currentTrait) {
      console.error("currentTrait is undefined.");
      return;
    }

    console.log(`${username} selected: ${decision} for trait: ${gameState.currentTrait}`);
    const playerRef = ref(database, `games/${gamepin}/players/${username}`);
    const updatedAcceptedTraits = decision === 'juu'
      ? [...gameState.playerAcceptedTraits, gameState.currentTrait]
      : [];

    update(playerRef, { acceptedTraits: updatedAcceptedTraits })
      .then(() => setGameState(prevState => ({
        ...prevState,
        playerAcceptedTraits: updatedAcceptedTraits,
      })))
      .catch(err => console.error("Error updating accepted traits:", err));

    const nextTrait = getNextTrait();
    const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    const nextRound = nextPlayerIndex === 0 ? gameState.currentRound + 1 : gameState.currentRound;

    update(ref(database, `games/${gamepin}`), {
      currentPlayerIndex: nextPlayerIndex,
      currentRound: nextRound,
    }).catch(err => console.error("Error updating game state:", err));

    if (nextRound > 6) {
      console.log("Game over! Navigating to GameEnd.");
      const playersRef = ref(database, `games/${gamepin}/players`);
      const playerUpdates = {};
      gameState.players.forEach(player => {
        playerUpdates[player.username] = { ...player, inGame: false };
      });

      update(playersRef, playerUpdates)
        .then(() => {
          localStorage.removeItem(`gameState_${gamepin}_${username}`);
          navigation.navigate('GameEnd', { gamepin, username });
        })
        .catch(err => console.error("Error updating player states:", err));
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#906AFE', 'transparent']} style={[styles.background, { zIndex: -1 }]} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }} />
      <Text style={styles.roundText}>Round {gameState.currentRound}</Text>
      <Text style={styles.playerTextPlay}>Player: {gameState.players[gameState.currentPlayerIndex]?.username}</Text>
      <Text style={styles.newtraitText}>New trait:</Text>
      <Text style={styles.traitText}>{gameState.currentTrait}</Text>
  
      {gameState.players.length > 0 && (
        <>
          {gameState.players[gameState.currentPlayerIndex]?.username === username ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => handleDecision('juu')}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleDecision('ei')}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.playerTextPlay}>Waiting for {gameState.players[gameState.currentPlayerIndex]?.username} to decide...</Text>
          )}
        </>
      )}
  
      <Text style={styles.playerAcceptedTraitset}>Accepted Traits:</Text>
      {gameState.players[gameState.currentPlayerIndex]?.username === username && (
        gameState.playerAcceptedTraits.map((trait, index) => (
          <Text key={index} style={styles.playerAcceptedTraitset}>{index + 1}. {trait}</Text>
        ))
      )}
      {gameState.players[gameState.currentPlayerIndex]?.username !== username && (
        gameState.players[gameState.currentPlayerIndex]?.acceptedTraits?.map((trait, index) => (
          <Text key={index} style={styles.playerAcceptedTraitset}>{index + 1}. {trait}</Text>
        ))
      )}
  
      {/* Pelaajan nimi animaationa */}
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        <Text style={styles.animatedText}>
          {gameState.players[gameState.currentPlayerIndex]?.username}'s Turn
        </Text>
      </Animated.View>
    </View>
  );
}