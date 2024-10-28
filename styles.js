import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Yleiset tyylit
  usernameContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  usernameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

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
  helpIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // GameLobbyin tyylit
  pinkoodi: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  player: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default styles;
