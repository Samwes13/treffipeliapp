import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles'; // Varmista, että polku on oikein

export default function GameOptionsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.helpIcon}>
        <MaterialIcons name="help-outline" size={32} color="black" />
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GameLobby')}>
          <Text style={styles.buttonText}>Create Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('JoinGame')}>
          <Text style={styles.buttonText}>Join Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
