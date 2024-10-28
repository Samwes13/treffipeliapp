import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import styles from '../styles'; 
import { ref, push } from 'firebase/database';
import { database } from '../firebaseConfig';

export default function EnterUsername({ navigation }) {
  const [username, setUsername] = useState('');

  const handleInputChange = (text) => {
    setUsername(text);
  };

  const saveUsername = (username) => {
    push(ref(database, 'users/'), { username });
  };

  const handleSubmit = () => {
    if (username.trim()) {
      saveUsername(username);
      navigation.navigate('GameOptionScreen', { username });  // Navigoi CardTraits-sivulle
    } else {
      Alert.alert('Error', 'Please enter a username');
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
