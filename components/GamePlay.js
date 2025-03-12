import React, { useState, useEffect } from 'react'; 
import { View, Text, TouchableOpacity } from 'react-native';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../firebaseConfig';
import styles from '../styles';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

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





 // Animaatiot
// Animaatiot
const fadeAnim = useSharedValue(0); // Pelaajan nimi animaatio
const yesAnimation = useSharedValue(0); // Yes-animaatio
const noAnimation = useSharedValue(0); // No-animaatio

// Yes-animaatio
// Yes-animaatio
const yesAnimatedStyle = useAnimatedStyle(() => ({
  opacity: yesAnimation.value,
  transform: [
    { scale: withSpring(yesAnimation.value, { damping: 10, stiffness: 100 }) }, // BounceIn
  ],
  width: '100%', // Täyttää koko näytön leveyssuunnassa
  height: '100%', // Täyttää koko näytön korkeussuunnassa
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#4CAF50',
  zIndex: 5,
}));

// No-animaatio
const noAnimatedStyle = useAnimatedStyle(() => ({
  opacity: noAnimation.value,
  transform: [
    { scale: withSpring(noAnimation.value, { damping: 10, stiffness: 100 }) }, // BounceIn
  ],
  width: '100%', // Täyttää koko näytön leveyssuunnassa
  height: '100%', // Täyttää koko näytön korkeussuunnassa
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F44336',
  zIndex: 5,
}));

// Pelaajan nimi animaatio (fadeInLeft ja BounceOut)
const animatedStyle = useAnimatedStyle(() => ({
  opacity: fadeAnim.value,
  transform: [
    { translateX: withTiming(fadeAnim.value === 0 ? -500 : 0, { duration: 500 }) }, // fadeInLeft
    { scale: withSpring(fadeAnim.value, { damping: 10, stiffness: 100 }) }, // BounceOut
  ],
  zIndex: 10,
}));

// Käynnistä Yes-animaatio
// Käynnistä Yes-animaatio
const triggerYesAnimation = () => {
  yesAnimation.value = withSequence(
    withTiming(1, { duration: 500, easing: Easing.ease }), // BounceIn
    withDelay(3000, withTiming(0, { duration: 500 })) // FadeOut
  );

  // Käynnistä nimi-animaatio 3 sekunnin kuluttua
  setTimeout(() => {
    fadeAnim.value = withSequence(
      withTiming(1, { duration: 500 }), // fadeInLeft
      withDelay(3000, withTiming(0, { duration: 500 })) // BounceOut
    );
  }, 3000);
};

// Käynnistä No-animaatio
const triggerNoAnimation = () => {
  noAnimation.value = withSequence(
    withTiming(1, { duration: 500, easing: Easing.ease }), // BounceIn
    withDelay(3000, withTiming(0, { duration: 500 })) // FadeOut
  );

  // Käynnistä nimi-animaatio 3 sekunnin kuluttua
  setTimeout(() => {
    fadeAnim.value = withSequence(
      withTiming(1, { duration: 500 }), // fadeInLeft
      withDelay(3000, withTiming(0, { duration: 500 })) // BounceOut
    );
  }, 3000);
};

  

useEffect(() => {
  const animationRef = ref(database, `games/${gamepin}/animations`);
  const unsubscribe = onValue(animationRef, (snapshot) => {
    const animationData = snapshot.val();
    if (animationData) {
      const now = Date.now();
      const delay = Math.max(0, animationData.timestamp + 200 - now); // Varmistaa, että kaikki käynnistyvät yhtä aikaa

      setTimeout(() => {
        if (animationData.type === 'yes') {
          triggerYesAnimation();
        } else if (animationData.type === 'no') {
          triggerNoAnimation();
        }
      }, delay);
    }
  });

  return () => unsubscribe();
}, [gamepin]);



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

    const animationType = decision === 'juu' ? 'yes' : 'no';
  const timestamp = Date.now(); // Tallennetaan aikaleima animaation synkronointiin

  update(ref(database, `games/${gamepin}/animations`), { type: animationType, timestamp });


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
          <View style={styles.animatedText}>
              {/* Nimi */}
              <Text style={styles.animatedText}>
                  {gameState.players[gameState.currentPlayerIndex]?.username} VUORO!
              </Text>
              {/* Treffit */}
              <Text style={styles.animatedText}>
                  {(() => {
                      const acceptedTraitsLength = gameState.players[gameState.currentPlayerIndex]?.acceptedTraits?.length || 0;
                      const currentTraitsLength = gameState.players[gameState.currentPlayerIndex]?.currentTraits?.length || 0;

                      // Jos acceptedTraits on tyhjä, kyseessä on ensimmäiset treffit
                      if (acceptedTraitsLength === 0) {
                          return "1. treffit";
                      }

                      // Jos acceptedTraits ja currentTraits sisältävät eri piirteet, kyseessä on toiset treffit
                      if (acceptedTraitsLength === 1 && currentTraitsLength === 1) {
                          return "2. treffit";
                      }

                      // Muuten treffien määrä on acceptedTraits.length + 1
                      return `${acceptedTraitsLength + 1}. treffit`;
                  })()}
              </Text>
              {/* Drink up! */}
              {(() => {
                  const acceptedTraitsLength = gameState.players[gameState.currentPlayerIndex]?.acceptedTraits?.length || 0;
                  const currentTraitsLength = gameState.players[gameState.currentPlayerIndex]?.currentTraits?.length || 0;

                  // Määritellään, monennetko treffit ovat kyseessä
                  const treffitMäärä = acceptedTraitsLength === 0 ? 1 : 
                                      (acceptedTraitsLength === 1 && currentTraitsLength === 1) ? 2 : 
                                      acceptedTraitsLength + 1;

                  // Drink up! näytetään vain 1., 3., 5. ja 6. treffeillä
                  if ([1, 3, 5, 6].includes(treffitMäärä)) {
                      return <Text style={styles.drinkUpText}>Drink up!</Text>;
                  }
                  return null;
              })()}
          </View>
      </Animated.View>

    {/* Animaatio "Yes"-napille */}
    <Animated.View style={[styles.animationContainer, yesAnimatedStyle]}>
      <Text style={styles.animationText}>Jatkoon!</Text>
    </Animated.View>

    {/* Animaatio "No"-napille */}
    <Animated.View style={[styles.animationContainer, noAnimatedStyle]}>
      <Text style={styles.animationText}>Eroille</Text>
    </Animated.View>
  </View>
  
  );
}