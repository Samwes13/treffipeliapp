import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, Image } from 'react-native';
import styles from '../styles'; 
import { ref, push, remove } from 'firebase/database';
import { database } from '../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

export default function EnterUsername({ navigation }) {
  console.log("EnterUsername rendered");

  const [username, setUsername] = useState('');

  const handleInputChange = (text) => {
    setUsername(text);
  };

  const saveUsername = (username) => {
    const userRef = push(ref(database, 'users/'), { username });
    userRef.then((snapshot) => {
      const userKey = snapshot.key;
      // Remove username after 1 minute
      setTimeout(() => {
        remove(ref(database, `users/${userKey}`))
          .then(() => console.log(`Username ${username} removed after 1 minute`))
          .catch((error) => console.error("Error removing username:", error));
      }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds
    }).catch((error) => console.error("Error saving username:", error));
  };

  const handleSubmit = () => {
    if (username.trim()) {
      saveUsername(username);
      navigation.navigate('GameOptionScreen', { username }); 
    } else {
      window.alert('Please enter a username');
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
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSubmit}
        accessibilityRole="button"
        accessibilityLabel="Enter"
      >
          <Text style={styles.buttonText}>Enter</Text>
      </TouchableOpacity>
    </View>
  );
}