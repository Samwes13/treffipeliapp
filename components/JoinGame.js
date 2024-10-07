import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import styles from '../styles'; // Varmista, että polku on oikein

// Esimerkki lobbyn pinkoodista (tätä voidaan myöhemmin päivittää dynaamisesti)
const existingPincode = 'ABC123';

export default function JoinGame({ navigation }) {
  const [pincode, setPincode] = useState('');

  const handleJoinGame = () => {
    if (pincode === existingPincode) {
      // Siirry GameLobby-sivulle, jos pinkoodi on oikein
      navigation.navigate('GameLobby', { pincode });
    } else {
      // Näytä virheilmoitus, jos pinkoodi on väärin
      Alert.alert('Error', 'Pincode is wrong, try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Game</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Pincode"
        value={pincode}
        onChangeText={setPincode}
      />
      <Button title="Join Game" onPress={handleJoinGame} />
    </View>
  );
}
