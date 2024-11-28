import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#845AFE',  // Taustaväri kirkas violetti
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
  },
  playerItem: {
    backgroundColor: '#ffffff',  // Pelaajan lista tausta
    borderRadius: 12,
    marginVertical: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '90%',
    shadowColor: '#000',  // Varjoefekti
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,  // Android varjoefekti
  },
  playerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',  // Tumma teksti
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FE9091',  // Napin väri vaaleanpunainen
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',  // Varjoefekti napille
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,  // Android varjoefekti
  },
  buttonText: {
    color: '#fff',  // Valkoinen teksti napissa
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  yesButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  noButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  

});

export default styles;
