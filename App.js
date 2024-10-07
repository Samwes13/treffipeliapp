import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EnterUsername from './components/EnterUsername';  
import GameOptionScreen from './components/GameOptionScreen';  
import GameLobby from './components/GameLobby';
import JoinGame from './components/JoinGame';

export default function App() {
  
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="EnterUsername">
        <Stack.Screen name="EnterUsername" component={EnterUsername} options={{ headerShown: false }} />
        <Stack.Screen name="GameOptionScreen" component={GameOptionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GameLobby" component={GameLobby} options={{ headerShown: false }} />
        <Stack.Screen name="JoinGame" component={JoinGame} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
