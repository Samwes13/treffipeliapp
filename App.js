import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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

  //Määritä linking_objekti
  const linking = {
    prefixes: ['https://treffipeli.fi', 'treffipeli://'],
    config: {
      screens: {
        EnterUsername: 'enterusername',
        GameOptionScreen: 'gameoptionscreen',
        GameLobby: 'GameLobby',
        JoinGame: 'JoinGame',
        CardTraits: 'CardTraits',
        GamePlay: 'GamePlay',
        GameEnd: 'GameEnd',
      },
    },
  };

  return (


      <NavigationContainer linking={linking}>
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
      
    
  );
}
