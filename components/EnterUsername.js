import React, { useState } from 'react';
import { View, Text, TextInput, Image, Alert, TouchableOpacity } from 'react-native';
import styles from '../styles'; 
import { ref, push } from 'firebase/database';
import { database } from '../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

export default function EnterUsername({ navigation }) {
  console.log("EnterUsername rendered");

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
      navigation.navigate('GameOptionScreen', { username }); 
    } else {
      Alert.alert('Error', 'Please enter a username');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#906AFE', 'transparent']}
        style={[styles.background, { zIndex: -1 }]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Image source={require('../assets/logoTreffipeli.png')} style={styles.logo} />
      <Text style={styles.title}>Enter username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={handleInputChange}
        placeholderTextColor="#aaa" // Lisää placeholderin väri
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enter</Text>
      </TouchableOpacity>
    </View>
  );
}
