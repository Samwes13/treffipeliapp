import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';



export default function App() {
  const [username, setUsername] = useState('');

  const handleInputChanges = (text) => {
    setUsername(text);
  };

  const handleSubmit = () => {
    console.log('Username entered:' , username);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Treffipeli</Text>
      <Text style={styles.title}> Enter username</Text>
      <TextInput
        style={styles.input}
        placeholder='Enter your username'
        value={username}
        onChangeText={handleInputChanges}
      />
      <Button title="submit" onPress={handleSubmit}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
});
