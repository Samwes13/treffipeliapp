import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import styles from '../styles'; // Varmista, että polku on oikein

export default function EnterUsername({ navigation }) {
  const [username, setUsername] = useState('');

  const handleInputChange = (text) => {
    setUsername(text);
  };

  const handleSubmit = () => {
    if (username.trim()) {
      navigation.navigate('GameOptionScreen');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={handleInputChange}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}
