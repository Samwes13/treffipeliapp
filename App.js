import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles'; // Oletetaan, että style.js sijaitsee samassa hakemistossa
import EnterUsername from './components/EnterUsername';  
import CardTraits from './components/CardTraits';
import GameOptionScreen from './components/GameOptionScreen';  
import GameLobby from './components/GameLobby';
import JoinGame from './components/JoinGame';
import GamePlay from './components/GamePlay';
import GameEnd from './components/GameEnd';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <LinearGradient
    colors={['#FF7676', '#FF4081']} // Gradientin värit
    start={{ x: 0, y: 0 }} // Gradientin alku (vasemmasta yläkulmasta)
    end={{ x: 1, y: 1 }} // Gradientin loppu (oikeasta alakulmasta)
    style={styles.gradientBackground}
    >
      <NavigationContainer>
        <Stack.Navigator initialRouteName="EnterUsername">
          <Stack.Screen name="EnterUsername" component={EnterUsername} options={{ headerShown: false }} /> 
          <Stack.Screen name="GameOptionScreen" component={GameOptionScreen} options={{ headerShown: false }} />
          <Stack.Screen name="GameLobby" component={GameLobby} options={{ headerShown: false }} />
          <Stack.Screen name="JoinGame" component={JoinGame} options={{ headerShown: false }} />
          <Stack.Screen name="CardTraits" component={CardTraits} options={{ headerShown: false }} />
          <Stack.Screen name="GamePlay" component={GamePlay} options={{ headerShown: false }} />
          <Stack.Screen name="GameEnd" component={GameEnd} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </LinearGradient>
  );
}
